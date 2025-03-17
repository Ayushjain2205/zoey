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

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const sendMessage = async (
  messages: Message[],
  mode: string
): Promise<string> => {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

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
