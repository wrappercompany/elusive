'use client';

import React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { ChatPanel } from "@/components/ChatPanel";
import { Previews } from "@/components/Previews";
import { useChat } from "@/hooks/useChat";

interface PageParams {
  projectId: string;
}

interface ProjectPageProps {
  params: Promise<PageParams>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = React.use(params);
  const { messages, loading, sendMessage } = useChat(projectId);

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
          <Previews projectId={projectId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
} 