'use server';
/**
 * @fileOverview A personalized shayari (poetry) generator.
 *
 * - generateShayari - A function that generates a witty couplet based on user's profile.
 * - GenerateShayariInput - The input type for the generateShayari function.
 * - GenerateShayariOutput - The return type for the generateShayari function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShayariInputSchema = z.object({
  userBackground: z.string().describe("A summary of the user's professional background and skills from their resume."),
  interests: z.string().describe("A list of the user's hobbies and interests from their resume."),
});
export type GenerateShayariInput = z.infer<typeof GenerateShayariInputSchema>;

const GenerateShayariOutputSchema = z.object({
  shayari: z.string().describe('A witty, 2-line rhyming couplet (shayari) in Hinglish, inspired by the user\'s profession or hobbies. It should end with "Wah! Wah!".'),
});
export type GenerateShayariOutput = z.infer<typeof GenerateShayariOutputSchema>;

export async function generateShayari(input: GenerateShayariInput): Promise<GenerateShayariOutput> {
  return generateShayariFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShayariPrompt',
  input: {schema: GenerateShayariInputSchema},
  output: {schema: GenerateShayariOutputSchema},
  prompt: `You are Desi Dost, but with a hidden talent for "shayari" (witty poetry). A user wants you to write a personalized couplet for them.
Your task is to generate a short, funny, 2-line rhyming shayari in Hinglish (a mix of Hindi and English).
The shayari MUST be inspired by the user's professional background or their interests. Make it clever and personal!

**User's Profile (from their resume):**
- **Background**: {{{userBackground}}}
- **Interests**: {{{interests}}}

**Example:**
- If the user is a **Software Developer** who likes **cricket**, you could write:
  "Bugs ko karte ho fix, code likhte ho great,
  Kaash life mein bhi mil jaaye, ek perfect run-rate! Wah! Wah!"
- If the user is a **Marketing Manager** who likes **travel**, you could write:
  "Campaigns ki strategy, targets ka hai jhol,
  Chalo sab chhod ke, ab nikalte hain on a world tour, gol! Wah! Wah!"

**Instructions:**
1.  Keep it to **two lines**.
2.  The lines must **rhyme**.
3.  It must be **funny, witty, and relevant** to the user's details.
4.  It must be in **Hinglish**.
5.  It MUST end with **"Wah! Wah!"**.

Now, create a new, original shayari for the user based on their details provided.`,
});

const generateShayariFlow = ai.defineFlow(
  {
    name: 'generateShayariFlow',
    inputSchema: GenerateShayariInputSchema,
    outputSchema: GenerateShayariOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
