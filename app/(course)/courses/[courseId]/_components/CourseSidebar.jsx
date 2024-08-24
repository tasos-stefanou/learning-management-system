import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import CourseSidebarItem from './CourseSidebarItem';
import CourseProgress from '@/components/CourseProgress';

const CourseSidebar = async ({ course, progressCount }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b'>
        <h1 className='font-semibold'>{course.title}</h1>
        {purchase && (
          <div className='mt-10'>
            <CourseProgress
              size={'sm'}
              value={progressCount}
              variant='success'
            />
          </div>
        )}
      </div>
      <div className='flex flex-col w-full'>
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            chapterId={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!purchase && !chapter.isFree}
          />
        ))}
      </div>
    </div>
  );
};
export default CourseSidebar;
