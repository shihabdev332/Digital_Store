import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generatePremiumProductData = async (req, res) => {
  try {
    const { productName, brand, category, price } = req.body;

    if (!productName || productName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const numericPrice = price ? Number(price) : null;

    // 🔥 Price Tier Classification (Prevents AI randomness)
    let priceTier = "mid-range";
    if (numericPrice) {
      if (numericPrice < 200) priceTier = "budget";
      else if (numericPrice < 600) priceTier = "mid-range";
      else if (numericPrice < 1000) priceTier = "premium";
      else priceTier = "ultra-flagship";
    }

    const systemInstruction = `
You are a senior Product Catalog Architect for "Digital Shop".

Your job is to generate realistic, market-aligned technical specifications.

CRITICAL RULES:
1. The product price is $${numericPrice || "market-based"}.
2. Price Tier: ${priceTier}.
3. Specs MUST logically match this price tier.
4. Never invent impossible specs (no 64GB RAM in budget phones).
5. Use realistic chipset generations (if future model, use "Next-gen flagship processor").
6. Use USD ($) only.
7. Output ONLY valid JSON. No explanation text.
8. Keep description exactly 3 sentences.
9. Technical specs must be believable for ${priceTier} level.
`;

    const userPrompt = `
Product Name: ${productName}
Brand: ${brand || "Generic"}
Category: ${category || "Electronics"}
Price: $${numericPrice || "Market Standard"}

Return EXACTLY in this JSON structure:

{
  "description": "3-sentence premium catalog description aligned with $${numericPrice || "market"} price.",
  "specifications": {
    "Model": "${productName}",
    "Brand": "${brand || "Generic"}",
    "Category": "${category || "Electronics"}",
    "PriceTier": "${priceTier}",
    "KeyFeatures": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    "Technical_Specs": {
      "Processor": "",
      "Display": "",
      "Memory": "",
      "Storage": "",
      "Battery": "",
      "Build": ""
    }
  },
  "seoMeta": {
    "title": "SEO optimized title under 60 characters",
    "description": "SEO meta description under 155 characters"
  },
  "tags": ["5-8 SEO tags"],
  "suggestedPrice": ${numericPrice || 0},
  "warranty": "Standard 1 Year Manufacturer Warranty",
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
      temperature: 0.15, // Slight creativity but controlled
      max_tokens: 800,
    });

    let aiRaw = chatCompletion?.choices?.[0]?.message?.content || "{}";

    let aiResponse;

    try {
      aiResponse = JSON.parse(aiRaw);
    } catch (parseError) {
      console.error("⚠ JSON Parse Error:", parseError.message);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON structure.",
      });
    }

    // 🔒 Final Safeguard: Ensure price consistency
    if (numericPrice) {
      aiResponse.suggestedPrice = numericPrice;
    }

    // Optional: Auto badge logic
    if (priceTier === "ultra-flagship") {
      aiResponse.badge = "Flagship";
    } else if (priceTier === "premium") {
      aiResponse.badge = "Premium Choice";
    }

    return res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "AI failed to generate accurate product data.",
    });
  }
};
