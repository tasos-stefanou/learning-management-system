import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trimStringValuesOfObject } from '@/lib/trimStringValuesOfObject';
import { auth } from '@clerk/nextjs/server';

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
    console.error('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
