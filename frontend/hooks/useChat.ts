'use client';

import { useState } from "react";
import { proxyPost, proxyGet, streamAgent } from "@/lib/api";

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
      // Optimistically add user message
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      // Stream agent response
      let assistantMsg = "";
      setLoading(true);
      await new Promise<void>((resolve, reject) => {
        const closeStream = streamAgent(tid!, {
          onChunk: (content) => {
            assistantMsg += content;
            setMessages((prev) => {
              // If last message is assistant, append; else, add new
              if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: prev[prev.length - 1].content + content },
                ];
              } else {
                return [...prev, { role: "assistant", content }];
              }
            });
          },
          onComplete: () => {
            setLoading(false);
            resolve();
          },
          onError: (err) => {
            setLoading(false);
            reject(err);
          },
        });
      });
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