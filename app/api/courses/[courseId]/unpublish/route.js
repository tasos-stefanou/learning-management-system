import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error('[COURSE_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
