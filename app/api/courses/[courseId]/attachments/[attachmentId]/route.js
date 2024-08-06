import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId, attachmentId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSE_ID_ATTACHMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
