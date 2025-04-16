'use client';

import Image from "next/image";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { ChatBoxInput } from "@/components/ChatBoxInput";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to call the proxy API
  async function proxyPost(url: string, body: any) {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, body })
    });
    return res.json();
  }

  async function proxyGet(url: string) {
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    return res.json();
  }

  // Handle message submission
  async function handleSubmit(message: string) {
    setLoading(true);
    try {
      let pid = projectId;
      let tid = threadId;
      // Create project if needed
      if (!pid) {
        const project = await proxyPost("/api/project", { name: "UI Project" });
        pid = project.project_id;
        setProjectId(pid);
      }
      // Create thread if needed
      if (!tid) {
        const thread = await proxyPost("/api/thread", { project_id: pid });
        tid = thread.thread_id;
        setThreadId(tid);
      }
      // Send message
      await proxyPost(`/api/thread/${tid}/message`, { content: message });
      // Run agent to get LLM response
      await proxyPost(`/api/thread/${tid}/agent/run`, {});
      // Fetch all messages for the thread
      const msgs = await proxyGet(`/api/thread/${tid}/messages`);
      setMessages(
        msgs.map((m: any) => ({
          role: m.is_llm_message ? "assistant" : "user",
          content: m.content,
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
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
              onSubmit={handleSubmit}
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
