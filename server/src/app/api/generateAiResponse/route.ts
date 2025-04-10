import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!HF_TOKEN) {
      throw new Error("Missing Hugging Face API token");
    }

    // Check if the user is online
    // if (!navigator.onLine) {
    //   return NextResponse.json({ aiResponse: "You are currently offline. Please check your internet connection." }, { status: 200 });
    // }

    // Adjust the prompt to limit the response
    const prompt = `Refine the following activity description to make it more detailed and clearer, but keep the answer concise (maximum 500 characters): "${userInput}"`;

    // Fetch the response from Hugging Face API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Failed to fetch response from AI service.");
    }

    const data = await response.json();

    // Check if the response is valid and return the refined description
    if (!data || !data[0]?.generated_text) {
      throw new Error("Invalid AI response");
    }

    // Extract the refined description from the model's response
    let refinedDescription = data[0].generated_text.trim();

    // Ensure that the generated text doesn't include the prompt or input part
    const promptIndex = refinedDescription.indexOf(userInput);
    if (promptIndex !== -1) {
      refinedDescription = refinedDescription.slice(promptIndex + userInput.length).trim();
    }

    // Return only the refined activity description
    return NextResponse.json({ aiResponse: refinedDescription });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message); // Log error
      return NextResponse.json({ aiResponse: "Unable to process your request at the moment. Please try again later." }, { status: 200 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json({ aiResponse: "An unexpected error occurred. Please try again later." }, { status: 200 });
    }
    //return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
