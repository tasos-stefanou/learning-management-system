import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trimStringValuesOfObject } from '@/lib/trimStringValuesOfObject';
import { auth } from '@clerk/nextjs/server';

// TODO: re examine category schema: should a category have a userId?

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { categoryId } = params;
    const values = await req.json();

    const trimmedData = trimStringValuesOfObject(values);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...trimmedData,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORY_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = auth();
    const { categoryId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse('Not found', { status: 404 });
    }

    const coursesOfCategoryCount = await db.course.count({
      where: {
        categoryId,
      },
    });

    if (coursesOfCategoryCount > 0) {
      return new NextResponse('Cannot delete a category that has courses', {
        status: 400,
      });
    }

    await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return new NextResponse('category deleted successfully');
  } catch (error) {
    console.error('[CATEGORY_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
