import Groq from "groq-sdk";

// Groq Initialize
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * ✅ Premium AI Controller for Admin
 * This controller generates professional product data and converts BDT to USD.
 */
export const generatePremiumProductData = async (req, res) => {
  try {
    const { productName, brand, category } = req.body;

    if (!productName) {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    // Advanced System Instruction
    const systemInstruction = `
      You are an AI Product Catalog Specialist for 'Digital Shop'. 
      Your goal is to generate professional, technical product information.
      
      IMPORTANT PRICING RULE:
      1. First, determine a realistic market price in BDT (Bangladeshi Taka).
      2. Then, CONVERT that BDT price into USD ($) by dividing it by 120.
      3. ONLY return the final USD price in the "suggestedPrice" field.
      4. Do not include currency symbols in the JSON number field.

      INSTRUCTIONS:
      - Description: 3-4 professional sentences.
      - Specifications: Include Processor, Display, RAM, Battery, etc.
      - Tags: 5-8 SEO keywords.
      - Warranty: Standard electronic warranty.
      - Response Format: Pure JSON only.
    `;

    const userPrompt = `
      Product: ${productName}
      Brand: ${brand || "Recognized brand"}
      Category: ${category || "Electronics"}
      
      Provide data in this JSON structure:
      {
        "description": "",
        "specifications": {
          "Model": "",
          "KeyFeatures": "",
          "Technical_Specs": {}
        },
        "tags": [],
        "suggestedPrice": 0, 
        "warranty": "",
        "badge": "New Arrival"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // Parse the AI response
    let aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    // English Comment: Double-checking the conversion logic in backend for maximum accuracy
    // If AI provides a huge BDT-like number, we divide it by 120 manually.
    if (aiResponse.suggestedPrice > 5000) { 
        aiResponse.suggestedPrice = parseFloat((aiResponse.suggestedPrice / 120).toFixed(2));
    }

    res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("❌ Premium AI Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI failed to generate data.",
    });
  }
};