import Groq from "groq-sdk";
import productModel from "../model/productModel.js";

// Groq Initialize
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * ✅ Ultra-Perfect AI Sales Assistant
 * Optimized for: Short replies, Strict USD ($), and Accuracy.
 */
export const getAiResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // English Comment: Fetch minimal data to keep the context tight and response fast
    const allProducts = await productModel.find({}).select("name price category bestseller");
    
    // Formatting context without long descriptions to prevent AI from being wordy
    const productContext = allProducts.map(p => 
      `${p.name}: ${p.price}$ [Popular: ${p.bestseller}]`
    ).join(", ");

    const systemInstruction = `
      You are the Sales Expert for 'Digital Shop'. 
      KNOWLEDGE: ${productContext}

      STRICT COMMANDS:
      1. RESPONSE LENGTH: Max 2 sentences. Be extremely concise.
      2. CURRENCY: Use USD ($) only. Never mention BDT.
      3. LANGUAGE: Always reply in the user's language (Bangla or English).
      4. ACCURACY: If a product isn't in KNOWLEDGE, say "Not in stock" and briefly suggest a similar one.
      5. NO FLUFF: Don't use "Hello", "How can I help", etc., unless necessary. Get straight to the point.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // ✅ Lower temperature = More factual & less talkative
      max_tokens: 150,  // ✅ Strict token limit to prevent long essays
    });

    const aiReply = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({ 
      success: true, 
      reply: aiReply 
    });

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Assistant is busy. Try again later." 
    });
  }
};
