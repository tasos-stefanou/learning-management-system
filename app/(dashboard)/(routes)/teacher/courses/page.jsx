import { DataTable } from './_components/DataTable';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  // TODO: courses dont get updated after deleting a course
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
