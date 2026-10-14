import Groq from "groq-sdk";
import productModel from "../model/productModel.js";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple in-memory session store (Production হলে Redis ব্যবহার করবে)
const conversationMemory = new Map();

const stopWords = new Set([
  "a", "an", "and", "any", "are", "available", "buy", "can", "cost", "do", "for", "have",
  "here", "how", "i", "in", "is", "it", "me", "of", "phone", "phones", "price", "product", "show",
  "spec", "specs", "specification", "specifications", "tell", "the", "there", "this", "to", "what", "which", "with", "you", "your",
  "দাম", "আছে", "কোন", "কি", "কী", "দেখান", "দেখাও", "কেমন", "কত", "পণ্য", "প্রোডাক্ট", "মোবাইল", "ফোন",
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
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
    const searchableFields = ["name", "brand", "category", "modelNumber", "tags"];
    const getSearchTerms = (text) => [...new Set(
      (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    )].filter((term) => term.length > 1 && !stopWords.has(term));
    const searchText = typeof detectedProduct === "string" && detectedProduct.trim()
      ? detectedProduct
      : message;
    const searchTerms = getSearchTerms(searchText);
    const findProducts = async (terms) => {
      if (!terms.length) return [];
      const termConditions = terms.map((term) => ({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: escapeRegex(term), $options: "i" },
        })),
      }));
      return productModel
        .find({ $and: termConditions })
        .select("name brand price discountedPercentage category description specifications stock isAvailable modelNumber tags")
        .limit(5);
    };

    let matchedProducts = await findProducts(searchTerms);
    // If the classifier returned an incomplete product name, retry using the user's words.
    if (!matchedProducts.length && searchText !== message) {
      matchedProducts = await findProducts(getSearchTerms(message));
    }

    // For broad recommendation questions, include featured items or recent products.
    if (matchedProducts.length === 0 && detectedIntent === "recommendation") {
      matchedProducts = await productModel
        .find({ isAvailable: true, stock: { $gt: 0 } })
        .sort({ isFeatured: -1, createdAt: -1 })
        .select("name brand price discountedPercentage category description specifications stock isAvailable modelNumber tags")
        .limit(5);
    }

    const productContext = matchedProducts.length
      ? matchedProducts.map((product) => JSON.stringify({
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          discountedPercentage: product.discountedPercentage,
          stock: product.stock,
          inStock: product.isAvailable && product.stock > 0,
          description: product.description,
          modelNumber: product.modelNumber,
          specifications: product.specifications,
          tags: product.tags,
        })).join("\n")
      : "No matching products were found in the store catalog.";

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
- Answer product questions only using the AVAILABLE PRODUCTS data above; never invent product names, prices, specs, or stock.
- If no matching product data is provided, say you could not find that item in the catalog and ask what product they mean.
- Treat a product as in stock only when its inStock field is true.
- Match user language (Bangla or English).
`;

    const messages = [
      { role: "system", content: systemInstruction },
      ...previousMessages,
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.3,
      max_tokens: 220,
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
