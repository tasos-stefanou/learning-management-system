import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trimStringValuesOfObject } from '@/lib/trimStringValuesOfObject';
import { auth } from '@clerk/nextjs/server';
//TODO: make this a utility function and replace all instances of it
import { Mux } from '@mux/mux-node';

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const { video } = mux;

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    const trimmedData = trimStringValuesOfObject(values);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...trimmedData,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
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
      return new NextResponse('Not found', { status: 404 });
    }

    const { chapters } = course;

    for (const chapter of chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    await db.course.delete({
      where: {
        id: courseId,
        userId,
      },
    });

    return new NextResponse('Course deleted successfully');
  } catch (error) {
    console.error('[COURSE_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
