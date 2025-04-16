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