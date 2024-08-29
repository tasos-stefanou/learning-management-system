import { DataTable } from './_components/DataTable';
import { columns } from './_components/columns';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const CategoriesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  // TODO: courses dont get updated after deleting a course
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={categories} />
    </div>
  );
};

export default CategoriesPage;
