
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Message, UserProfile } from '@/types';
import { handleUserMessage, handleResumeUpload } from '@/app/actions';
import { ChatInput } from '@/components/chat-input';
import { ConversationDisplay } from '@/components/conversation-display';
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/animated-logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statePlaceholders: Record<string, string> = {
  "maharashtra": "Bol bindass, bhau! Kay vichar?",
  "tamil nadu": "Sollu, machi! Enna vishayam?",
  "punjab": "Chak de, praa! Ki sawaal hai?",
  "west bengal": "Dada/Didi, shunechi! Kichu jiggesh koro?",
  "uttar pradesh": "Bhaukal machao! Kya poochna hai?",
  "karnataka": "Yen samachara, guru? Kelappa!",
  "delhi": "Scene kya hai, bro? Sawaal feko!",
  "andhra pradesh": "Cheppu mawa! Em aduguthunnav?",
  "telangana": "Matter cheppu, bhai! Question veyyi?",
  "gujarat": "Kai pooncho athva kaho, mitra!",
  "kerala": "Enthina chodikuka allengkil parayuka, suhruthu!",
  "rajasthan": "Kai pucho ya batao, bhai sa!",
  "default": "Timepass shuru? Poocho kuch, yaar!",
};

const indianStatesAndUTs = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
].sort();


function getPlaceholderForState(state?: string): string {
  if (!state) return statePlaceholders.default;
  const normalizedState = state.toLowerCase().trim();

  const stateMapping: Record<string, string> = {
    "andhra pradesh": "andhra pradesh",
    "maharashtra": "maharashtra",
    "tamil nadu": "tamil nadu",
    "punjab": "punjab",
    "west bengal": "west bengal",
    "uttar pradesh": "uttar pradesh",
    "karnataka": "karnataka",
    "delhi": "delhi",
    "telangana": "telangana",
    "gujarat": "gujarat",
    "kerala": "kerala",
    "rajasthan": "rajasthan"
  };

  const key = stateMapping[normalizedState] || 'default';
  return statePlaceholders[key] || statePlaceholders.default;
}

export default function BroChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResumeProcessing, setIsResumeProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [userState, setUserState] = useState<string>('');
  const [chatPlaceholder, setChatPlaceholder] = useState<string>(statePlaceholders.default);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: `Alright, profile's set with state: ${userProfile.state || 'India'}. Let's chat!`,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      setChatPlaceholder(getPlaceholderForState(userProfile.state));
    }
  }, [userProfile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  const processResumeAndState = async () => {
    if (!resumeFile) {
      toast({ title: "Error", description: "Please select a resume file first!", variant: "destructive" });
      return;
    }
    if (!userState.trim()) {
      toast({ title: "Error", description: "Please select your state!", variant: "destructive" });
      return;
    }

    setIsResumeProcessing(true);

    try {
      const resumeDataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(resumeFile);
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error("Could not read file data."));
          }
        };
        reader.onerror = (error) => {
          reject(new Error("Error reading resume file."));
        };
      });

      const profile = await handleResumeUpload(resumeDataUri, resumeFile.name, userState);
      setUserProfile(profile);
      toast({ title: "Profile Updated!", description: "Your resume and state have been processed." });

    } catch (error) {
      console.error('Failed to process resume:', error);
      toast({
        title: "Processing Failed!",
        description: (error instanceof Error && error.message) ? error.message : "There was a problem processing your resume. Please try again.",
        variant: "destructive",
      });
      setUserProfile(null);
    } finally {
      setIsResumeProcessing(false);
    }
  };


  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim() || !userProfile) return;

    const userMessage: Message = { id: crypto.randomUUID(), text: userInput, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponse = await handleUserMessage(userInput, userProfile);
      const botMessage: Message = { 
        id: crypto.randomUUID(), 
        text: botResponse.text,
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessageText = (error instanceof Error && error.message) ? error.message : "Something went wrong. Please try again later.";
      const errorMessage: Message = { id: crypto.randomUUID(), text: errorMessageText, sender: 'bot', timestamp: new Date() };
      setMessages((prev) => [...prev, errorMessage]);
      toast({ title: "Error", description: "Couldn't connect with the bot. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 text-center font-body">
        <div className="mb-6">
          <AnimatedLogo />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Hi there, I'm <span className="text-primary">Desi Dost</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          To get started, please upload your resume and tell me which state you're from. It'll help me get to know you better!
        </p>
        <div className="w-full max-w-md mt-8 p-6 space-y-6">
            <div className="relative">
              <label htmlFor="resume-upload" className="flex items-center justify-center w-full h-32 px-4 transition bg-card border-2 border-border border-dashed rounded-2xl appearance-none cursor-pointer hover:border-primary">
                  <span className="flex items-center space-x-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">
                          {resumeFile ? `Selected: ${resumeFile.name}` : 'Drop file or click to upload resume'}
                      </span>
                  </span>
                  <input id="resume-upload" type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden" />
              </label>
            </div>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                <Select onValueChange={setUserState} value={userState}>
                    <SelectTrigger className="pl-10 bg-input border-input-border placeholder:text-muted-foreground/70 focus:ring-primary h-12 rounded-full w-full">
                        <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                        {indianStatesAndUTs.map((state) => (
                            <SelectItem key={state} value={state}>
                                {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button
              onClick={processResumeAndState}
              disabled={isResumeProcessing || !resumeFile || !userState.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-md rounded-full h-12 text-base"
            >
              {isResumeProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Process kar raha hoon...
                </>
              ) : (
                'Submit Details'
              )}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-body">
      <header className="flex items-center p-4 border-b border-border shrink-0">
        <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => setUserProfile(null)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Desi Dost</h1>
      </header>
      <main className="flex-grow overflow-y-auto">
        <ConversationDisplay messages={messages} />
      </main>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} placeholder={chatPlaceholder} />
    </div>
  );
}
