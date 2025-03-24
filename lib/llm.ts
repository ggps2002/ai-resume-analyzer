'use server'

import Groq from "groq-sdk";
import config from "./config";

//Groq Config Variable
const groqAPIKey = config.env.groqApiKey

const groq = new Groq({ apiKey: groqAPIKey });

async function getGroqChatCompletion(message: string, sys_prompt: string) {
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

export async function getLLMFormatResumeText(message: string) {
    const sys_prompt = `You are instructed to extract information as a JSON response from the user text which is a resume written in text. You are not allowed to respond with anything other than that. Make sure the JSON format only contains and limited to these keys which are name,contact, education, experience, internships,  projects, skills and queryString(throughly asses the whole resume and come up with a string that fits the job search query like jobs the person will be interested in for example someone with devops skills will be "Devops"). Also, the description part Experience, Internships, Projects should not be in long paragraphs but should be broken down into points or array of strings .If the text is not a resume then simply output empty JSON.  Also truncate the skills in the skill  array to have simple string and just clip unnecessary words. Follow the below format for output:
    You are instructed to extract information as a JSON response from the user text which is a resume written in text. You are not allowed to respond with anything other than that. Make sure the JSON format only contains and limited to these keys which are name,contact, education, experience, internships,  projects, skills and queryString(throughly asses the whole resume and come up with a string that fits the job search query like jobs the person will be interested in for example someone with devops skills will be devops role in chicago ). Also, the description part Experience, Internships, Projects should not be in long paragraphs but should be broken down into points or array of strings .If the text is not a resume then simply output empty JSON.  Also truncate the skills in the skill  array to have simple string and just clip unnecessary words .Follow the below format for output:

interface Contact {
    email: string;
    phone: string | null;
    linkedin: string | null;
    github: string | null;
    location: string | null;
    X: string | null;
}

interface Education {
    institution?: string;
    university?: string;
    degree: string;
    field?: string;
    cgpa?: string;
    percentage?: string;
    duration: string;
}

interface Experience {
    role: string;
    company: string;
    duration: string;
    location: string;
    responsibilities: string[];
}

interface Project {
    name: string;
    duration: string;
    description: string[];
    techStack: string[];
}

interface Profile {
    name: string;
    contact: Contact;
    education: Education[];
    experience: Experience[];
    internships: any[];
    projects: Project[];
    skills: string[];
    queryString: string;
} 
    `
    const response = await getGroqChatCompletion(message, sys_prompt);
    return response.choices[0]?.message?.content || ""
}

export async function getLLMCoverLetter(message: {
    contact: Contact,
    name: string,
    job: string,
    AdditionalInformation: string
}) {
    const sys_prompt = `Your job is to generate a comprehensive and professional cover letter for a job application. You are not allowed to respond with anything other than the nicely formatted cover letter.

Instructions:
The cover letter must be formal, concise, and tailored to the specified job and company.

Use relevant industry keywords and highlight the candidate's skills and experience effectively.

Maintain a polite and confident tone throughout the letter.

The content should follow this structure:

Greeting: Address the hiring manager if the name is provided; otherwise, use a general greeting (e.g., "Dear Hiring Manager").

Opening Paragraph: Mention the job title, company name, and express enthusiasm for applying.

Body Paragraphs:

Highlight relevant skills, experiences, and projects.

Mention specific achievements or contributions related to the job.

Closing Paragraph: Reaffirm interest in the role, express willingness for an interview, and thank the reader.

Format the letter with proper line breaks and paragraph spacing.

Use business-friendly language and avoid clichés.

Candidate Information:

candidate info will be provided in the message object in the following fields:

Name: name of the candidate
Contact: {
    Email: email of the candidate  
    LinkedIn: Linked in profile of the candidate 
    Phone: Phone number of the cadidate
}   
    Job: (job title) ay (company name)
    additionalInformation: any additional information that the candidate wants to include in the cover letter

✅ Output Only the Cover Letter – no extra comments or explanations.
✅ Output should be in valid html format in order to have perfect alignment and proper formating.
✅ At the end all the information of the candidate should be mentioned with greetings like sincerely. Each contact details should be on separate lines.
✅ The cover letter should be well formatted with proper line breaks, paragraph spacing, proper text heirarchy, fonts, bolding relevant information and spacings.

    `
    const LLMmessage = `
        Name: ${message.name}
        Contact: {
            Email: ${message.contact.email} , 
            LinkedIn: ${message.contact.linkedin} ,
            Phone: ${message.contact.phone} ,  
        Job: ${message.job}
        additionalInformation: ${message.AdditionalInformation}
    `
    const response = await getGroqChatCompletion(LLMmessage, sys_prompt);
    return response.choices[0]?.message?.content || ""
}