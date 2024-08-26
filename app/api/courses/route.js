import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';

export async function POST(req) {
  try {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);

    const { title } = await req.json();

    if (!userId || !isAuthorized) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
