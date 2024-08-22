import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getProgress } from '@/actions/getProgress';
import CourseSidebar from './_components/CourseSidebar';
import CourseNavbar from './_components/CourseNavbar';

// TODO: maybe move functionality of fetching course outside of layout
const CourseLayout = async ({ children, params }) => {
  const { userId } = auth();
  const { courseId } = params;

  if (!userId) {
    redirect('/');
  }

  const course = await db.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  const progressCount = await getProgress(userId, courseId);

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className='md:pl-80 pt-[80px] h-full'>{children}</main>
    </div>
  );
};

export default CourseLayout;
