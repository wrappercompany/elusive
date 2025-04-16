'use client';

import { useState } from "react";
import { proxyPost, proxyGet } from "@/lib/api";

export type Message = {
  role: string;
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle message submission
  async function sendMessage(message: string) {
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

  return {
    messages,
    loading,
    sendMessage
  };
} 