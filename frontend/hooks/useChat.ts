'use client';

import { useState } from "react";
import { proxyPost, proxyGet, streamAgent } from "@/lib/api";

export type Message = {
  role: string;
  content: string;
};

export function useChat(projectId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle message submission
  const sendMessage = async (content: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          projectId // Include projectId in the request
        })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
} 