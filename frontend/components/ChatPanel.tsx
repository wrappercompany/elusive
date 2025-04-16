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
        <TabsList className="flex w-full mb-4">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="document" className="flex-1">Document</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex flex-col flex-grow h-[calc(100%-48px)] relative">
          {/* Messages Container - Scrollable with no padding */}
          <div className="absolute inset-0 overflow-y-auto">
            <div className="pb-16"> {/* Extra padding at bottom for input overlap */}
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 px-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <span className="inline-block px-3 py-2 rounded bg-muted">
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input - Translucent and on top of messages */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="bg-background/60 backdrop-blur-md rounded-lg p-2 border border-muted/60 shadow-md">
              <ChatBoxInput
                onSubmit={onSendMessage}
                placeholder="Type a message..."
                className="w-full bg-transparent border-transparent focus-visible:border-transparent"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="document" className="flex-grow h-[calc(100%-48px)]">
          <div className="h-full flex items-center justify-center text-muted-foreground border border-muted rounded-md">
            Document view coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 