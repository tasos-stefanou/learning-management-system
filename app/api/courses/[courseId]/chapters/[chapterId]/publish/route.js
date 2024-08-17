import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findFirst({
      where: {
        chapterId,
      },
    });

    const chapterHasAllRequiredFields =
      chapter &&
      chapter.title &&
      chapter.description &&
      chapter.videoUrl &&
      muxData;

    if (!chapterHasAllRequiredFields) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('[CHAPTER_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
