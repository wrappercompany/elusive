import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[projectId]/threads - Get all threads for a project
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const threads = await prisma.thread.findMany({
      where: {
        projectId: params.projectId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}

// POST /api/projects/[projectId]/threads - Create a new thread
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { title, initialMessage } = body;

    const thread = await prisma.thread.create({
      data: {
        title,
        projectId: params.projectId,
        messages: initialMessage ? {
          create: {
            content: initialMessage,
            role: 'user'
          }
        } : undefined
      },
      include: {
        messages: true
      }
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
} 