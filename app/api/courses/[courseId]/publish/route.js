import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Incidents } from '@mux/mux-node/resources/data/incidents';

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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const atLeastOneChapterIsPublished = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    const courseHasAllRequiredFields =
      course.title &&
      course.description &&
      course.categoryId &&
      course.imageUrl &&
      atLeastOneChapterIsPublished;

    if (!courseHasAllRequiredFields) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error('[COURSE_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
