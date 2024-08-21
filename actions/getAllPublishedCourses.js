import { db } from '@/lib/db';
import { getProgress } from '@/actions/getProgress';

const getAllPublishedCourses = async (userId, title, categoryId) => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (!course.purchases.length) {
          return {
            ...course,
            progress: null,
          };
        }

        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
        };
      })
    );
    return coursesWithProgress;
  } catch (error) {
    console.log('[GET_COURSES]', error);
    return [];
  }
};

export { getAllPublishedCourses };
