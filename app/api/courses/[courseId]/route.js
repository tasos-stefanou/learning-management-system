import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        title: title.trim(),
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
