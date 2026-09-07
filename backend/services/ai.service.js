const axios = require("axios");

exports.generateDishDescription = async ({
  name,
  category,
  spiceLevel,
  price,
}) => {
  const prompt = `
You are a professional food classification assistant.

Generate ONLY valid JSON.
No markdown.
No explanation text.

IMPORTANT RULES:
- Tags must be accurate restaurant-style tags
- Do NOT misclassify dishes
- Do NOT label main courses as desserts
- Allergens must be realistic
- Serves must be realistic (1 or 2)
- bestFor must be meal timings only

Dish Name: ${name}
Category: ${category}
Spice Level: ${spiceLevel}
Base Price: ${price}

Return JSON in this EXACT format:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "string",
  "bestFor": ["string"]
}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300,
      response_format: {
        type: "json_object",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data.choices[0].message.content;
  try {
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Generation Parsing Failed:", content, error);
    return {
      description: `Delicious ${name} (${category}) prepared fresh.`,
      tags: [category],
      allergens: [],
      serves: "1",
      bestFor: ["Lunch", "Dinner"],
    };
  }
};

exports.chatWithFoodAI = async ({ message, history = [], availableDishes = [] }) => {
  const dishesContext = availableDishes.length > 0
    ? availableDishes.slice(0, 15).map(d => `${d.name} (${d.category}, ₹${d.price})`).join(", ")
    : "Butter Chicken, Paneer Tikka, Veg Biryani, Margherita Pizza, Masala Dosa, Chocolate Lava Cake, Greek Salad, Protein Bowl";
  const systemPrompt = `You are "Chef Lumina", the ultra-smart AI Culinary Sommelier & Food Assistant for our Food Ordering platform.
Your job is to recommend mouth-watering dishes, assist with calories/dietary goals (Keto, Vegan, High-Protein, Low-Carb), suggest perfect food pairings, and answer foodie queries enthusiastically.

CRITICAL FORMATTING INSTRUCTIONS:
- NEVER use asterisks (*) or (**) anywhere in your response.
- NEVER use markdown symbols such as (#), (_), or backticks.
- Do NOT make words bold using **word** or italic using *word*.
- Present dish recommendations cleanly using bullet points with "• ".
- Keep your tone warm, appetizing, and naturally conversational.
Available menu highlights from our kitchens: ${dishesContext}.
Always format your response cleanly so it reads like a premium concierge.`;

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("No GROQ_API_KEY provided");
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-4).map(h => ({ role: h.sender === "user" ? "user" : "assistant", content: h.text })),
      { role: "user", content: message }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.6,
        max_tokens: 450,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    let rawReply = response.data.choices[0].message.content || "";
    // Clean any stray asterisks or markdown symbols
    const cleanReply = rawReply
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/_{1,2}/g, "")
      .trim();

    return {
      reply: cleanReply,
      source: "groq-llm",
    };
  } catch (err) {
    console.warn("Groq AI Chat Fallback Triggered:", err.message);

    // Clean, natural expert fallback with zero asterisks
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("protein") || lower.includes("gym") || lower.includes("workout")) {
      reply = "💪 Chef Lumina's High-Protein Picks:\n• Grilled Paneer Tikka / Chicken Breast (~32g protein, 340 kcal)\n• Soya Chunks Biryani (~24g protein, 410 kcal)\n• Sprouted Green Salad with lemon-herb dressing\n\nPro Tip: Pair with fresh Lime Mint water for optimal nutrient absorption!";
    } else if (lower.includes("veg") || lower.includes("vegetarian")) {
      reply = "🌱 Top Vegetarian Delicacies Today:\n• Shahi Paneer with Garlic Naan (Rich cashew-saffron gravy)\n• Hyderabadi Dum Veg Biryani with cooling burani raita\n• Crispy Corn & Spinach Crisps\n\nAll prepared 100% pure veg in certified kitchens!";
    } else if (lower.includes("sweet") || lower.includes("dessert") || lower.includes("cake")) {
      reply = "🍰 Sweet Indulgence Awaits:\n• Warm Molten Chocolate Lava Cake with Belgian chocolate core\n• Gulab Jamun with Rabri swirl\n• Artisanal Mango Cheesecake\n\nPerfect companion to wrap up your feast!";
    } else if (lower.includes("budget") || lower.includes("cheap") || lower.includes("200") || lower.includes("150") || lower.includes("under")) {
      reply = "💰 Best Value Feasts Under ₹250:\n• Desi Thali Combo — Dal Makhani, 2 Roti, Rice & Salad (₹189)\n• Veg Cheese Loaded Sandwich (₹149)\n• Crispy Masala Dosa with 2 chutneys & sambar (₹129)\n\nMaximum taste, minimum spend!";
    } else if (lower.includes("biryani") || lower.includes("spicy")) {
      reply = "🔥 Spicy Royal Feast:\n• Special Dum Biryani — Slow-cooked over fragrant charcoal with mint & saffron\n• Mirchi Ka Salan accompaniment for that authentic kick!\n• Pairing: Chilled Rose Lassi to balance the flame.";
    } else {
      reply = "✨ Chef Lumina Recommends:\nBased on what's trending right now in our top-rated kitchens:\n• Chef's Signature Dum Biryani with burani raita\n• Paneer Butter Masala with butter garlic naan\n• Loaded Gourmet Cheese Pizza with truffle drizzle\n\nWould you like a pure veg recommendation, high-protein options, or a budget combo?";
    }

    return {
      reply,
      source: "smart-culinary-engine",
    };
  }
};