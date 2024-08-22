import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({ params }) => {
  const { courseId } = params;

  const course = await db.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
};
export default CourseIdPage;
