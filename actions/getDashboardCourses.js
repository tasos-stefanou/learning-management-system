import { db } from '@/lib/db';
import { getProgress } from './getProgress';

const getDashboardCourses = async (userId) => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        courseId: true,
      },
    });

    const courses = await db.course.findMany({
      where: {
        id: {
          in: purchasedCourses.map((course) => course.courseId),
        },
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
        chapters: {
          select: {
            id: true,
          },
        },
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await getProgress(userId, course.id);
        return {
          ...course,
          progress,
        };
      })
    );

    // separate courses : completed and in-progress
    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    );
    const inProgressCourses = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      inProgressCourses,
    };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return [];
  }
};

export { getDashboardCourses };
