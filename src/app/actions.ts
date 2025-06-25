
'use server';

import type { UserProfile } from '@/types';
import { personalizedChitChat } from '@/ai/flows/personalized-chit-chat';
import { generateSlangResponse } from '@/ai/flows/slang-response-generation';
import { extractResumeInfo } from '@/ai/flows/extract-resume-info-flow';
import { generateShayari } from '@/ai/flows/shayari-generator-flow';

export async function handleResumeUpload(resumeDataUri: string, fileName: string, userState: string): Promise<UserProfile> {
  try {
    const extractedInfo = await extractResumeInfo({ resumeDataUri, fileName });
    return {
      userBackground: extractedInfo.userBackground,
      interests: extractedInfo.interests,
      personalDetails: extractedInfo.personalDetails,
      originalResumeContent: resumeDataUri,
      state: userState,
    };
  } catch (error) {
    console.error("Error processing resume with GenAI:", error);
    throw new Error("Aiyo! Resume samajh nahi aaya. Kuch aur format try karo ya phir se upload karo.");
  }
}

export async function handleUserMessage(userInput: string, userProfile: UserProfile): Promise<{ text: string }> {
  try {
    const devCreatorKeywords = [
      'developer', 
      'creator', 
      'who made you', 
      'who created you', 
      'kaun banaya', 
      'tere creator', 
      'your maker', 
      'your developer',
      'about your developer',
      'tell me about your creator'
    ];
    
    const shayariKeywords = [
        'shayari', 
        'poem', 
        'kavita', 
        'write for me', 
        'sher', 
        'gazal',
        'write a poem',
        'write a shayari'
    ];

    const usePersonalizedChat = devCreatorKeywords.some(keyword => userInput.toLowerCase().includes(keyword.toLowerCase()));
    const useShayariGenerator = shayariKeywords.some(keyword => userInput.toLowerCase().includes(keyword.toLowerCase()));

    let botResponseText: string;

    if (usePersonalizedChat) {
      const result = await personalizedChitChat({ userInput }); 
      botResponseText = result.chatbotResponse;
    } else if (useShayariGenerator) {
      const result = await generateShayari({
        userBackground: userProfile.userBackground,
        interests: userProfile.interests,
      });
      botResponseText = result.shayari;
    } else {
      const result = await generateSlangResponse({
        question: userInput,
        userBackground: userProfile.userBackground,
        interests: userProfile.interests,
        personalDetails: userProfile.personalDetails,
        userState: userProfile.state || '',
      });
      botResponseText = result.response;
    }

    return {
      text: botResponseText,
    };

  } catch (error) {
    console.error("Error processing message with GenAI:", error);
    return { text: "Aiyo! Kuch toh gadbad hai, boss. My server is doing full drama. Try again thoda later?" };
  }
}
