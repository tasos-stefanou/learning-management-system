import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trimStringValuesOfObject } from '@/lib/trimStringValuesOfObject';
import { auth } from '@clerk/nextjs/server';
import { Mux } from '@mux/mux-node';

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const { video } = mux;

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

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: 'public',
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id,
          chapterId,
        },
      });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// TODO: write that in a cleaner way
export async function DELETE(req, { params }) {
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

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 });
    }

    const muxData = await db.muxData.findFirst({
      where: {
        chapterId,
      },
      select: {
        assetId: true,
      },
    });

    if (muxData) {
      await video.assets.delete(muxData.assetId);
      await db.muxData.delete({
        where: {
          chapterId,
        },
      });
    }

    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    //TODO: maybe make that a separate function to check if there are any published chapters in the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedChaptersInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
