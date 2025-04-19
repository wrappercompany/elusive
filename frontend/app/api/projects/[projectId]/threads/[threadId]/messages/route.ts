import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[projectId]/threads/[threadId]/messages - Get all messages for a thread
export async function GET(
  request: Request,
  { params }: { params: { projectId: string; threadId: string } }
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        threadId: params.threadId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/projects/[projectId]/threads/[threadId]/messages - Create a new message
export async function POST(
  request: Request,
  { params }: { params: { projectId: string; threadId: string } }
) {
  try {
    const body = await request.json();
    const { content, role = 'user' } = body;

    const message = await prisma.message.create({
      data: {
        content,
        role,
        threadId: params.threadId
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
} 