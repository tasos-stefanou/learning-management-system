import { db } from '@/lib/db';

const getProgress = async (userId, courseId) => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        published: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapterIds = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    return (progressPercentage = Math.round(
      (validCompletedChapterIds / publishedChapterIds.length) * 100
    ));
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }
};
export { getProgress };
