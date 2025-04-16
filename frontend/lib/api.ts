// Helper functions to call the proxy API

// POST request through proxy
export async function proxyPost(url: string, body: any) {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, body })
  });
  return res.json();
}

// GET request through proxy
export async function proxyGet(url: string) {
  const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
  return res.json();
}

// Stream agent response via SSE
export function streamAgent(
  threadId: string,
  callbacks: {
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError?: (err: any) => void
  }
): () => void {
  const apiUrl = `/api/thread/${threadId}/agent/stream`;
  const proxyUrl = `/api/proxy/stream?url=${encodeURIComponent(apiUrl)}`;
  const eventSource = new EventSource(proxyUrl);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chunk') {
        callbacks.onChunk(data.content);
      } else if (data.type === 'status' && data.status === 'completed') {
        callbacks.onComplete();
        eventSource.close();
      } else if (data.type === 'error') {
        callbacks.onError?.(data.error);
        eventSource.close();
      }
    } catch (e) {
      callbacks.onError?.(`Error parsing response: ${e}`);
      eventSource.close();
    }
  };
  eventSource.onerror = (event) => {
    callbacks.onError?.("A connection error occurred while streaming from the server.");
    eventSource.close();
  };
  return () => eventSource.close();
} 