import Groq from "groq-sdk";

// Groq Initialize
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * ✅ Updated AI Controller for Admin Panel
 * Focuses strictly on USD ($) and high-accuracy technical data.
 */
export const generatePremiumProductData = async (req, res) => {
  try {
    const { productName, brand, category } = req.body;

    if (!productName) {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    // Direct USD Instruction
    const systemInstruction = `
      You are a precise Product Data Specialist for 'Digital Shop'. 
      Your task is to provide real-world technical specifications.

      STRICT RULES:
      1. PRICING: Provide the current global market price in USD ($) ONLY. 
      2. DATA SOURCE: Use actual manufacturer data for ${productName}.
      3. LANGUAGE: Always respond in English.
      4. RELIABILITY: If exact specs are unknown, provide accurate series-level data. Never invent fake technical numbers.
      
      OUTPUT FORMAT:
      - Description: Professional, feature-rich sentences.
      - Specifications: Include real-world Processor, Display, RAM, and Battery details.
      - Response: Must be a valid JSON object.
    `;

    const userPrompt = `
      Product: ${productName}
      Brand: ${brand || "Standard"}
      Category: ${category || "Electronics"}
      
      Generate data in this exact JSON structure:
      {
        "description": "Professional marketing description",
        "specifications": {
          "Model": "Full model name",
          "KeyFeatures": "Top 3 highlights",
          "Technical_Specs": {
             "Processor": "",
             "Display": "",
             "Memory": "",
             "Battery": "",
             "Storage": ""
          }
        },
        "tags": ["SEO keywords"],
        "suggestedPrice": 0, 
        "warranty": "Standard manufacturer warranty",
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
      temperature: 0.1, // ✅ Keeps the AI factual and prevents random pricing
    });

    let aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    // English Comment: Ensure price is a clean number and interpreted as USD
    aiResponse.suggestedPrice = Number(aiResponse.suggestedPrice);

    res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI failed to fetch accurate data.",
    });
  }
};
