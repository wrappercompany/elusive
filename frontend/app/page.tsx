'use client';

import Image from "next/image";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { ChatBoxInput } from "@/components/ChatBoxInput";

export default function Home() {
  return (
    <div className="h-screen p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex-1"></div>
            <ChatBoxInput
              onSubmit={(message: string) => console.log(message)}
              placeholder="Type a message..."
              className="w-full"
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold"></span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
