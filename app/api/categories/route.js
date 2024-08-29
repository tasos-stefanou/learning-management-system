import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';

export async function POST(req) {
  try {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);

    const { name } = await req.json();

    if (!userId || !isAuthorized) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // Check if the category already exists
    const existingCategory = await db.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return new NextResponse('Category already exists', { status: 409 });
    }

    const category = await db.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
