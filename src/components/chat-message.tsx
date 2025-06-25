
'use client';

import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-4 animate-fadeInSlideUp mb-4 md:mb-6 max-w-3xl mx-auto', 
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            'bg-muted text-muted-foreground'
          )}
        >
          <Bot size={16} />
        </div>
      )}
      <div
        className={cn(
          'max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-xl shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border rounded-bl-none'
        )}
      >
        <p className="text-sm md:text-[0.95rem] whitespace-pre-wrap leading-relaxed">{message.text}</p>
        
        <p className={cn(
            "text-xs mt-2 opacity-70", 
            isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
          )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground'
          )}
        >
          <User size={16} />
        </div>
      )}
    </div>
  );
}
