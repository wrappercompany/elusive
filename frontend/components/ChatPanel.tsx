'use client';

import { ChatBoxInput } from "@/components/ChatBoxInput";
import { type Message } from "@/hooks/useChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatPanelProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, loading, onSendMessage }: ChatPanelProps) {
  return (
    <div className="h-full flex flex-col p-6">
      <Tabs defaultValue="chat" className="flex flex-col h-full">

        
        <TabsContent value="chat" className="flex flex-col flex-grow h-[calc(100%-48px)]">
          {/* Messages Container - Scrollable */}
          <div className="flex-grow overflow-y-auto mb-4 border border-muted rounded-md p-4">
            {messages.map((msg, i) => (
              <div key={i} className="mb-4 flex justify-start">
                {msg.role === "user" ? (
                  <div className="font-bold">
                    {msg.content}
                  </div>
                ) : (
                  <div className="w-full">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input - Fixed at bottom */}
          <ChatBoxInput
            onSubmit={onSendMessage}
            placeholder="Type a message..."
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 