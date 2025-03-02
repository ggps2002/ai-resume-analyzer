'use server'

import Groq from "groq-sdk";
import config from "./config";

//Groq Config Variable
const groqAPIKey = config.env.groqApiKey

const groq = new Groq({ apiKey: groqAPIKey });

async function getGroqChatCompletion(message : string) {
    const sys_prompt = "You are instructed to extract information as a JSON response from the user text which is a resume written in text. You are not allowed to respond with anything other than that. Make sure the JSON format only contains and limited to these keys which are name,contact, education, experience, internships,  projects and skills. Also, the description part Experience, Internships, Projects should not be in long paragraphs but should be broken down into points or array of strings .If the text is not a resume then simply output empty JSON.  Also truncate the skills in the skill  array to have simple string and just clip unnecessary words ."
    
    return groq.chat.completions.create({
      messages: [
        {
            role: "system",
            content: sys_prompt
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
  }

export async function getLLMResponse(message : string) {
    const response = await getGroqChatCompletion(message);
    return response.choices[0]?.message?.content || ""
}