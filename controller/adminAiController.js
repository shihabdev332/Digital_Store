import Groq from "groq-sdk";

// Groq Initialize
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * ✅ Premium AI Controller
 * Generates highly accurate descriptions by analyzing both Name and Price.
 */
export const generatePremiumProductData = async (req, res) => {
  try {
    // English Comment: Destructuring price from request to guide AI logic
    const { productName, brand, category, price } = req.body;

    if (!productName) {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    const systemInstruction = `
      You are a precise Product Catalog Specialist for 'Digital Shop'. 
      Your task is to generate technical data based on the product name and its price point.

      STRICT RULES:
      1. PRICE CONTEXT: The product price is $${price || "unknown"}. Adjust the description tone and specs to match this price. 
      2. ACCURACY: If ${productName} is a premium flagship (e.g., iPhone Pro Max), use high-end terminology. 
      3. LOGIC: For future models, use "Expected" or "Next-gen" instead of outdated 2024 chip names.
      4. NO BDT: Use USD ($) only. Return pure JSON.
    `;

    const userPrompt = `
      Product: ${productName}
      Price: $${price || "Market Standard"}
      Brand: ${brand || "Standard"}
      Category: ${category || "Electronics"}
      
      Generate data in this exact JSON structure:
      {
        "description": "Write a 3-sentence professional description that justifies the $${price} price point.",
        "specifications": {
          "Model": "${productName}",
          "KeyFeatures": "3 high-end highlights",
          "Technical_Specs": {
             "Processor": "Most likely chip for this price",
             "Display": "",
             "Memory": "",
             "Battery": ""
          }
        },
        "tags": ["SEO keywords"],
        "suggestedPrice": ${price || 0}, 
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
      temperature: 0.1, // Keeps responses factual
    });

    let aiResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    // English Comment: If user didn't provide price, we keep AI's suggested price.
    // Otherwise, we prioritize the user's input price.
    if (price) {
      aiResponse.suggestedPrice = Number(price);
    }

    res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI failed to generate contextual data.",
    });
  }
};
