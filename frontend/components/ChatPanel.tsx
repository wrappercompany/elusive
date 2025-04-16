'use client';

import { ChatBoxInput } from "@/components/ChatBoxInput";
import { type Message } from "@/hooks/useChat";

interface ChatPanelProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, loading, onSendMessage }: ChatPanelProps) {
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className="inline-block px-3 py-2 rounded bg-muted text-base mb-1">
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-muted-foreground">Sending...</div>}
      </div>
      <ChatBoxInput
        onSubmit={onSendMessage}
        placeholder="Type a message..."
        className="w-full"
      />
    </div>
  );
} 