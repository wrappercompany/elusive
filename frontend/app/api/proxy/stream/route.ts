import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }
  
  try {
    const backendRes = await fetch(`${BACKEND_URL}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      }
    });
    
    // If response is not OK, throw error
    if (!backendRes.ok) {
      return NextResponse.json({ 
        error: `Backend responded with ${backendRes.status}: ${backendRes.statusText}` 
      }, { status: backendRes.status });
    }
    
    // Create a TransformStream to proxy the response
    const { readable, writable } = new TransformStream();
    
    // Forward the stream
    backendRes.body?.pipeTo(writable).catch(error => {
      console.error('Stream error:', error);
    });
    
    // Return a streaming response
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (err) {
    console.error('Stream proxy error:', err);
    return NextResponse.json({ error: 'Failed to stream from backend' }, { status: 500 });
  }
} 