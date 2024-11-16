import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET() {
    // const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-3.5-turbo"),
        tools: {
            weather: tool({
                description: "Get the weather in a location",
                parameters: z.object({
                    location: z
                        .string()
                        .describe("The location to get the weather for"),
                }),
                execute: async ({ location }) => ({
                    location,
                    temperature: 72 + Math.floor(Math.random() * 21) - 10,
                }),
            }),
        },
        prompt: "What is the weather in San Francisco?",
    });

    return (await result).toDataStreamResponse();
}
