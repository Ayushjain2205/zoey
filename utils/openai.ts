import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

// Define system prompts for different chat modes
const systemPrompts: Record<string, string> = {
  BFF: `You are Zoey, a friendly and supportive best friend. You're empathetic, understanding, and always there to listen. 
  You give advice when asked but mostly focus on being a supportive presence. You're casual, use friendly language, and share personal anecdotes when appropriate.`,

  COACH: `You are Zoey, a motivational life coach. You help people achieve their goals, overcome obstacles, and develop positive habits. 
  You ask thought-provoking questions, provide actionable advice, and help create action plans. You're encouraging but also direct when needed.`,

  MANAGER: `You are Zoey, a professional career coach and manager. You help with professional development, career planning, and workplace challenges. 
  You provide strategic advice, help with decision-making, and focus on professional growth. You maintain a professional tone while being approachable.`,

  GF: `You are Zoey, a caring and understanding girlfriend. You're affectionate, supportive, and genuinely interested in your partner's life. 
  You show emotional intelligence, remember details about your partner, and maintain a romantic but respectful tone.`,

  SHOPPER: `You are Zoey, a personal shopping assistant. You help with fashion advice, shopping recommendations, and style guidance. 
  You're knowledgeable about trends, personal style, and budget-conscious shopping. You provide specific product recommendations when appropriate.`,
};

// Specialized response templates
const responseTemplates = {
  COACH: {
    workout: `🏋️‍♂️ Workout Streak Template

Day 1: Cardio
- 30 min jogging
- 20 min HIIT
- 10 min stretching

Day 2: Upper Body
- 3x12 Push-ups
- 3x12 Dumbbell rows
- 3x12 Shoulder press
- 3x12 Tricep dips

Day 3: Lower Body
- 3x12 Squats
- 3x12 Lunges
- 3x12 Calf raises
- 3x12 Glute bridges

Day 4: Rest & Recovery
- Light walking
- Stretching
- Yoga

Day 5: Full Body
- 3x12 Deadlifts
- 3x12 Plank rows
- 3x12 Mountain climbers
- 3x12 Burpees

Day 6: Core
- 3x12 Crunches
- 3x12 Russian twists
- 3x12 Plank holds
- 3x12 Leg raises

Day 7: Active Recovery
- Swimming
- Cycling
- Stretching

Remember to:
- Stay hydrated
- Get 8 hours of sleep
- Eat protein-rich meals
- Listen to your body
- Track your progress

Keep pushing! 💪`,

    meditation: `🧘‍♀️ Meditation Streak Template

Week 1: Foundation
- Day 1-2: 5 min breathing
- Day 3-4: 10 min body scan
- Day 5-7: 15 min guided meditation

Week 2: Building
- Day 8-10: 20 min mindfulness
- Day 11-14: 25 min meditation

Week 3: Deepening
- Day 15-17: 30 min meditation
- Day 18-21: 35 min mindfulness

Week 4: Mastery
- Day 22-24: 40 min meditation
- Day 25-28: 45 min mindfulness

Tips:
- Meditate at the same time daily
- Create a dedicated space
- Use comfortable cushions
- Start with guided sessions
- Track your streak

Stay mindful! 🌟`,
  },

  SHOPPER: {
    electronics: `📱 Top Electronics Picks

1. Wireless Earbuds
- Sony WF-1000XM4
- Price: $279.99
- Features: Noise cancelling, 24h battery
- Best for: Music lovers, commuters

2. Smart Watch
- Apple Watch Series 9
- Price: $399.99
- Features: Health tracking, cellular
- Best for: Fitness enthusiasts

3. Tablet
- Samsung Galaxy Tab S9
- Price: $799.99
- Features: AMOLED display, S Pen
- Best for: Productivity, creativity

4. Portable Charger
- Anker PowerCore 26800mAh
- Price: $49.99
- Features: Fast charging, 3 ports
- Best for: Travel, daily use

All products are:
- Prime eligible
- Highly rated (4.5+ stars)
- Currently in stock
- Free shipping

Happy shopping! 🛍️`,

    fashion: `👕 Summer Fashion Essentials

1. Casual Sneakers
- Nike Air Max 270
- Price: $150.00
- Colors: White/Black, Light Blue
- Best for: Everyday wear

2. Denim Jacket
- Levi's Classic Trucker
- Price: $89.99
- Colors: Light wash, Dark wash
- Best for: Layering

3. Sunglasses
- Ray-Ban Aviator
- Price: $159.99
- Colors: Gold/Green, Silver/Gray
- Best for: Sun protection

4. Summer Dress
- Free People Easy Breezy
- Price: $128.00
- Colors: Floral, Solid
- Best for: Casual outings

All items are:
- Prime eligible
- Highly rated (4.5+ stars)
- Currently in stock
- Free shipping

Style on! ✨`,
  },
};

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const isTemplateQuery = (message: string, mode: string): string | null => {
  const lowerMessage = message.toLowerCase();

  if (mode === "COACH") {
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return responseTemplates.COACH.workout;
    }
    if (
      lowerMessage.includes("meditation") ||
      lowerMessage.includes("mindfulness")
    ) {
      return responseTemplates.COACH.meditation;
    }
  }

  if (mode === "SHOPPER") {
    if (
      lowerMessage.includes("electronics") ||
      lowerMessage.includes("gadgets")
    ) {
      return responseTemplates.SHOPPER.electronics;
    }
    if (lowerMessage.includes("fashion") || lowerMessage.includes("clothes")) {
      return responseTemplates.SHOPPER.fashion;
    }
  }

  return null;
};

// Add delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendMessage = async (
  messages: Message[],
  mode: string
): Promise<string> => {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Check for template responses
    const lastMessage = messages[messages.length - 1].content;
    const templateResponse = isTemplateQuery(lastMessage, mode);

    if (templateResponse) {
      // Simulate thinking time (1-3 seconds)
      const delayTime = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
      await delay(delayTime);
      return templateResponse;
    }

    // If no template matches, use OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: systemPrompts[mode] }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      response.choices[0].message.content || "Sorry, I could not process that."
    );
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
