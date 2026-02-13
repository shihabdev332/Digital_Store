import Groq from "groq-sdk";
import productModel from "../model/productModel.js";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAiResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // 🔎 Smart product search based on user message
    let matchedProducts = await productModel
      .find({
        name: { $regex: message, $options: "i" },
      })
      .select("name price category bestseller")
      .limit(5);

    // 🟡 If nothing matches, show top 3 bestsellers as fallback
    if (matchedProducts.length === 0) {
      matchedProducts = await productModel
        .find({ bestseller: true })
        .select("name price category bestseller")
        .limit(3);
    }

    // 🧠 Compact product context (token optimized)
    const productContext = matchedProducts
      .map(
        (p) =>
          `${p.name} - $${p.price} (${p.category})${
            p.bestseller ? " [Popular]" : ""
          }`
      )
      .join(" | ");

    // 🎯 Optimized AI Instruction (Balanced + Natural)
    const systemInstruction = `
You are a professional sales assistant for "Digital Shop".

AVAILABLE PRODUCTS:
${productContext}

RULES:
- Reply in maximum 2 short sentences.
- Be natural and helpful, not robotic.
- Use USD ($) only.
- If product not found, say "Not in stock" and suggest closest alternative.
- Give direct and accurate answers.
- Match the user's language (Bangla or English).
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Slightly natural but still factual
      max_tokens: 100,  // Enough for 2 short sentences
      top_p: 0.9,
    });

    const aiReply =
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "Not available right now.";

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
