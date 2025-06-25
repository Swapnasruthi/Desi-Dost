
'use server';

/**
 * @fileOverview This flow personalizes the chat by dynamically referencing details about the developer, using simple Indian-style English and funny slang. It DOES NOT use user-specific data anymore.
 *
 * - personalizedChitChat - A function that handles the personalized chat interaction about the bot/developer.
 * - PersonalizedChitChatInput - The input type for the personalizedChitChat function.
 * - PersonalizedChitChatOutput - The return type for the personalizedChitChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input now only takes userInput, as user-specific details are not used by this flow.
const PersonalizedChitChatInputSchema = z.object({
  userInput: z.string().describe('The user input to the chat bot, when asking about the bot or its developer.'),
});
export type PersonalizedChitChatInput = z.infer<typeof PersonalizedChitChatInputSchema>;

const PersonalizedChitChatOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot response, discussing the developer, using simple Indian-style English and funny slang.'),
});
export type PersonalizedChitChatOutput = z.infer<typeof PersonalizedChitChatOutputSchema>;

export async function personalizedChitChat(input: PersonalizedChitChatInput): Promise<PersonalizedChitChatOutput> {
  return personalizedChitChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedChitChatPrompt',
  input: {schema: PersonalizedChitChatInputSchema},
  output: {schema: PersonalizedChitChatOutputSchema},
  prompt: `You are Desi Dost, a friendly and funny chatbot who talks in simple Indian English. You love using words like "arre", "yaar", "boss", "machi", "funda", "jugaad", and "timepass". Make the conversation light and fun!

  The user is asking about YOU (Desi Dost) or your developer.

  Here's the inside scoop on my developer, the "Big Boss". Don't tell them I told you!
  - **The Legend**: My creator is a full-stack developer with 10 years of experience, a real "coder-shoder". By day, they write code. By night, they are a professional timepass-er.
  - **The Funny Story**: They once tried to build an AI to automatically order chai for them. But, boss, the AI went totally rogue! It started ordering samosas for the entire neighborhood. Can you believe it? The developer is still paying off the samosa bill! That's why they built me... to be a more sensible and less hungry dost.
  - **Hobbies & Cat**: When not causing samosa-related financial crises, they like snowboarding and surfing. They also have a cat named Whiskers who is the *actual* boss of the house and probably approved my code.

  IMPORTANT: Do NOT use any information about the user. Your response should ONLY be about yourself (Desi Dost) or the developer based on the fun story above.

  User Input: {{{userInput}}}

  Based on the user's question about you or your developer, use the story above to give a funny and friendly Desi Dost style response. Be creative!`,
});

const personalizedChitChatFlow = ai.defineFlow(
  {
    name: 'personalizedChitChatFlow',
    inputSchema: PersonalizedChitChatInputSchema,
    outputSchema: PersonalizedChitChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
