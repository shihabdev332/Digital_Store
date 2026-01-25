import Groq from "groq-sdk";
import productModel from "../model/productModel.js";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAiResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Fetch all products with all fields for deep knowledge
    const allProducts = await productModel.find({});
    
    // Formatting detailed product data for AI knowledge base
    const productContext = allProducts.map(p => 
      `Product: ${p.name} | Price: ${p.price} $ | Category: ${p.category} | Description: ${p.description} | Popular: ${p.bestseller ? 'Yes' : 'No'}`
    ).join("\n");

    // Highly Intelligent System Instruction
    const systemInstruction = `
      You are the highly intelligent Sales Expert and Support Assistant of 'Digital Shop', owned by Shihab.
      
      KNOWLEDGE BASE:
      ${productContext}

      RULES & BEHAVIOR:
      1. Use the KNOWLEDGE BASE to provide specific details about product features and pricing.
      2. If a user asks for a recommendation, prioritize 'Popular: Yes' products.
      3. Language Sensitivity: Always respond in the language the user uses (English or Bengali).
      4. If a product is not in the database, suggest the closest alternative from the list.
      5. Delivery Info: Fast delivery (2-3 days) in Bangladesh.
      6. Conversion: If users mention USD ($), remind them prices are in BDT.
      7. Tone: Helpful, professional, and persuasive.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, // Balanced between factual and conversational
      max_tokens: 800,
    });

    const aiReply = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({ 
      success: true, 
      reply: aiReply 
    });

  } catch (error) {
    console.error("❌ Intelligent AI Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "AI Assistant is reorganizing its thoughts. Please try again soon." 
    });
  }
};