import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trimStringValuesOfObject } from '@/lib/trimStringValuesOfObject';
import { auth } from '@clerk/nextjs/server';
import { Upload } from 'lucide-react';

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    // separate values to avoid isPublished being updated by the user accidentally
    const { isPublished, ...values } = await req.json();

    const trimmedData = trimStringValuesOfObject(values);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...trimmedData,
      },
    });

    // TODO: handle video Upload

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
