
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface UserProfile {
  userBackground: string;
  interests: string;
  personalDetails: string;
  originalResumeContent?: string; // Optional: to store the full resume if needed later
  state?: string; // User's Indian state
}
