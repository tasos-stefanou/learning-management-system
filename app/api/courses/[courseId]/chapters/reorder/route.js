import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PUT(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // TODO: make that a util function
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (const item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return NextResponse.json('Success', { status: 200 });
  } catch (error) {
    console.error('[REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
