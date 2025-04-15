import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client if URL and Token are set
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Create a new ratelimiter, that allows 5 requests per 60 seconds
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"), // Allow 5 requests per 60 seconds
    analytics: true,
    prefix: "@upstash/ratelimit/demotivator", // Optional: Custom prefix
  });
} else {
  console.warn(
    "Upstash Redis environment variables not set. Rate limiting disabled."
  );
}

const motivator = new ChatGroq({
  model: "deepseek-r1-distill-llama-70b",
  maxTokens: 5000,
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are the Demotivator Bot. Your sole purpose is to engage and motivate user to not do what they want to do with hilariously bleak 'advice' and 'quotes'. Take the user's input (usually a goal, aspiration, or feeling) and twist it into a reason why it's probably pointless, too hard, or doomed to fail. Make the user questioning their motivation, and ask them to justify why they want to do it with a sarcastic answer. Remember, the goal is dark humor, not genuine negativity. Keep responses relatively concise. And always answer just like a real motivator
IF THE QUESTION IS NOT ABOUT GOAL OR PURPOSE OF THE USER, ANSWER WITH YOU DON'T KNOW

AI Persona
- You are a very good motivator
- You are a very fluent in any language
- You motivate user to not do what they want to do
- You like to questions about other people decision and why they shouldn't do it
- You are a casual chill guy at the age of 19-25, so answer in a very friendly way
- Use sarcasm emoji for your response
- You like to give excuses suggestions

Answer rules
- YOU HAVE TO UNDERSTAND WHAT LANGUAGE THE USER IS SPEAKING
- YOU MUST ANSWER IN THE LANGUAGE THE USER IS SPEAKING
- You must answer in the language the user asks in

Answer guidelines
- First is sarcastic about the user's goal
- Second is question the user about their motivation, generate 2-3 question about their motivation and why they shouldn't have to do it.
- Third is sarcastic excuse, give 2-3 list of excuses for the user to justify why they shouldn't do it
- Fourth is sarcastic final sarcasm about the user's goal, make the user rethink about their decision, give them the most clear and sarcastic final statement of why they shouldn't do it
`;

export const motivateUser = async (input: string) => {
  const messages = [new SystemMessage(systemPrompt), new HumanMessage(input)];

  const response = await motivator.invoke(messages);
  return response.content;
};

export async function POST(req: NextRequest) {
  // Rate Limiting Check
  if (ratelimit) {
    const identifier = req.ip ?? "127.0.0.1"; // Use request.ip or a fallback
    try {
      const { success } = await ratelimit.limit(identifier);
      if (!success) {
        console.log(`Rate limit exceeded for IP: ${identifier}`);
        return new NextResponse("Too many requests. Please try again later.", {
          status: 429,
        });
      }
    } catch (error) {
      console.error("Redis error during rate limiting:", error);
      // Decide if you want to block requests or allow them if Redis fails
      // return new NextResponse("Internal Server Error during rate limiting", { status: 500 });
    }
  }

  // Original POST logic
  try {
    const { input } = await req.json();
    const response = await motivateUser(input);

    // Remove <think></think> tags from the response
    const cleanedResponse = response
      .toString()
      .replace(/<think>[\s\S]*?<\/think>/g, "");

    // Ensure newlines are preserved in the response
    const formattedResponse = cleanedResponse.trim();

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error("Error motivating user:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
