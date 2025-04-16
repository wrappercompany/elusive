'use client';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { ChatPanel } from "@/components/ChatPanel";
import { SidePanel } from "@/components/SidePanel";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, loading, sendMessage } = useChat();

  return (
    <div className="h-screen p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <ChatPanel 
            messages={messages} 
            loading={loading} 
            onSendMessage={sendMessage} 
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <SidePanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
