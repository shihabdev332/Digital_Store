import Groq from "groq-sdk";

// Groq Initialize
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * ✅ Fixed & Accurate AI Controller for Live Admin Panel
 * Generates technical data with improved currency and accuracy logic.
 */
export const generatePremiumProductData = async (req, res) => {
  try {
    const { productName, brand, category } = req.body;

    if (!productName) {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    // High Precision System Instruction
    const systemInstruction = `
      You are a precise Product Data Specialist for 'Digital Shop'. 
      Your task is to provide real-world technical specifications.

      ACCURACY RULES:
      1. Use actual market data for ${productName}. If the exact model is unknown, use the closest specs for its series.
      2. PRICING: Provide the global market price in USD ONLY. Do not use BDT.
      3. Do not invent fake features. If a spec is unknown, leave it as "Standard".
      
      OUTPUT FORMAT:
      - Description: Concise, professional, features-driven (3 sentences).
      - Specifications: Accurate Processor, Display, RAM, etc.
      - Response: Valid JSON object only.
    `;

    const userPrompt = `
      Product: ${productName}
      Brand: ${brand || "Standard"}
      Category: ${category || "Electronics"}
      
      Generate data in this exact JSON structure:
      {
        "description": "Professional description here",
        "specifications": {
          "Model": "Exact model name",
          "KeyFeatures": "3 main highlights",
          "Technical_Specs": {
             "Processor": "",
             "Display": "",
             "Memory": "",
             "Battery": ""
          }
        },
        "tags": ["SEO keywords"],
        "suggestedPrice": 0, 
        "warranty": "Standard Warranty terms",
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
      temperature: 0.1, // ✅ Set to 0.1 for maximum factual accuracy
    });

    let aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    // English Comment: Standardizing price to USD. 
    // If AI hallucinates and gives a BDT value (over 1000), we force convert it.
    let finalPrice = Number(aiResponse.suggestedPrice);
    if (finalPrice > 1000) {
      finalPrice = parseFloat((finalPrice / 120).toFixed(2));
    }
    aiResponse.suggestedPrice = finalPrice;

    res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server busy. AI could not verify data.",
    });
  }
};
