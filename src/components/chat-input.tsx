
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string; 
}

export function ChatInput({ onSubmit, isLoading, placeholder }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    await onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <div className="sticky bottom-0 w-full bg-transparent py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4"
      >
        <Input
          type="text"
          placeholder={placeholder || "Ask me anything..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          className="flex-grow rounded-lg px-4 py-3 text-base bg-card border-border shadow-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 h-12"
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
          className="rounded-lg bg-foreground hover:bg-foreground/90 text-background shrink-0 h-12 w-12"
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
