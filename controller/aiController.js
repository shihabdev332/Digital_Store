import Groq from "groq-sdk";
import productModel from "../model/productModel.js";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple in-memory session store (Production হলে Redis ব্যবহার করবে)
const conversationMemory = new Map();

export const getAiResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Unique session
    const userSession = sessionId || "default-session";

    // Initialize memory if not exists
    if (!conversationMemory.has(userSession)) {
      conversationMemory.set(userSession, []);
    }

    const memory = conversationMemory.get(userSession);

    // -----------------------------
    // 1️⃣ Intent Detection
    // -----------------------------
    const intentPrompt = `
Classify the user intent into one of these:
- price
- availability
- recommendation
- general

Return ONLY valid JSON:
{ "intent": "intent_name", "product": "product_or_null" }

User message: "${message}"
`;

    const intentResult = await groq.chat.completions.create({
      messages: [{ role: "user", content: intentPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 50,
    });

    let detectedIntent = "general";
    let detectedProduct = null;

    try {
      const parsed = JSON.parse(
        intentResult.choices[0].message.content.trim()
      );
      detectedIntent = parsed.intent;
      detectedProduct = parsed.product;
    } catch {
      detectedIntent = "general";
    }

    // -----------------------------
    // 2️⃣ Smart Product Query
    // -----------------------------
    let query = {};

    if (detectedProduct) {
      query = {
        $or: [
          { name: { $regex: detectedProduct, $options: "i" } },
          { category: { $regex: detectedProduct, $options: "i" } },
        ],
      };
    } else {
      query = {
        $or: [
          { name: { $regex: message, $options: "i" } },
          { category: { $regex: message, $options: "i" } },
        ],
      };
    }

    let matchedProducts = await productModel
      .find(query)
      .select("name price category bestseller")
      .limit(5);

    // Bestseller fallback
    if (matchedProducts.length === 0) {
      matchedProducts = await productModel
        .find({ bestseller: true })
        .select("name price category bestseller")
        .limit(3);
    }

    const productContext = matchedProducts
      .map(
        (p) =>
          `${p.name} - $${p.price} (${p.category})${
            p.bestseller ? " [Popular]" : ""
          }`
      )
      .join(" | ");

    // -----------------------------
    // 3️⃣ Conversational Memory (last 6 messages)
    // -----------------------------
    const previousMessages = memory.slice(-6);

    const systemInstruction = `
You are a smart AI sales assistant for "Digital Shop".

AVAILABLE PRODUCTS:
${productContext}

INTENT DETECTED: ${detectedIntent}

RULES:
- Maximum 2 short sentences.
- Be natural, friendly and precise.
- Use USD ($) only.
- If product not available say "Not in stock" and suggest alternative.
- Match user language (Bangla or English).
`;

    const messages = [
      { role: "system", content: systemInstruction },
      ...previousMessages,
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 100,
      top_p: 0.9,
    });

    const aiReply =
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "Not available right now.";

    // -----------------------------
    // 4️⃣ Save Memory
    // -----------------------------
    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: aiReply });

    // Limit memory size
    if (memory.length > 12) {
      memory.splice(0, memory.length - 12);
    }

    conversationMemory.set(userSession, memory);

    return res.status(200).json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error("❌ AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Assistant is temporarily unavailable.",
    });
  }
};
