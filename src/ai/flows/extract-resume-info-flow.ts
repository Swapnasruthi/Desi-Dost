'use server';
/**
 * @fileOverview Extracts user background, interests, and personal details from a resume.
 *
 * - extractResumeInfo - A function that handles the resume information extraction.
 * - ExtractResumeInfoInput - The input type for the extractResumeInfo function.
 * - ExtractResumeInfoOutput - The return type for the extractResumeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeInfoInputSchema = z.object({
  resumeDataUri: z.string().describe("The user's resume content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  fileName: z.string().describe("The original file name of the resume, for context if needed."),
});
export type ExtractResumeInfoInput = z.infer<typeof ExtractResumeInfoInputSchema>;

const ExtractResumeInfoOutputSchema = z.object({
  userBackground: z.string().describe("A brief summary of the user's professional background, education, and key skills. Keep it concise, like 1-2 sentences. If not found, say 'Pata nahi, resume mein likha nahi'.") ,
  interests: z.string().describe("A list of the user's hobbies and interests mentioned in the resume. If not found, say 'Resume mein hobbies ka section nahi mila'.") ,
  personalDetails: z.string().describe("Any other relevant personal details mentioned, like location (city/country if specified), or other notable achievements not covered in background/interests. Be very brief. If not found, say 'Extra details resume mein nahi diye'.") ,
});
export type ExtractResumeInfoOutput = z.infer<typeof ExtractResumeInfoOutputSchema>;

export async function extractResumeInfo(input: ExtractResumeInfoInput): Promise<ExtractResumeInfoOutput> {
  return extractResumeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeInfoPrompt',
  input: {schema: ExtractResumeInfoInputSchema},
  output: {schema: ExtractResumeInfoOutputSchema},
  prompt: `You are an expert HR assistant. Your task is to analyze the provided resume content and extract specific information about the user.
VERY IMPORTANT: Focus ONLY on the information EXPLICITLY STATED in the resume. Do NOT infer, assume, or add ANY information not present in the document.
If specific information (like interests or detailed personal info) is not found, you MUST use the placeholder phrases defined in the output schema descriptions. For instance, if hobbies are not mentioned, the 'interests' field must be "Resume mein hobbies ka section nahi mila".

Resume (File: {{{fileName}}}):
{{{media url=resumeDataUri}}}

Extract the following based STRICTLY on the resume content:
1.  User Background: Briefly summarize professional background, key skills, and education. Aim for 1-2 concise sentences.
2.  Interests: List hobbies or interests if mentioned.
3.  Personal Details: Note any other relevant details like location (city/country ONLY IF MENTIONED) or brief notable achievements. Keep this very short.

Strictly follow the output schema. DO NOT invent details. If a field's information is not clearly found, use the specified fallback phrases.
`,
});

const extractResumeInfoFlow = ai.defineFlow(
  {
    name: 'extractResumeInfoFlow',
    inputSchema: ExtractResumeInfoInputSchema,
    outputSchema: ExtractResumeInfoOutputSchema,
  },
  async (input: ExtractResumeInfoInput) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to extract resume information according to schema.");
    }
    return output;
  }
);
