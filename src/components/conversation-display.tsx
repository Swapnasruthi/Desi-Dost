'use client';

import type { Message } from '@/types';
import { ChatMessage } from '@/components/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useRef } from 'react';

interface ConversationDisplayProps {
  messages: Message[];
}

export function ConversationDisplay({ messages }: ConversationDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A small timeout helps ensure the DOM is fully updated before scrolling.
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-3 md:p-4 space-y-1">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {/* This empty div is the target for our auto-scroll */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
