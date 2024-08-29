import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

import IconBadge from '@/components/IconBadge';
import { LayoutDashboard } from 'lucide-react';

import CategoryNameForm from './_components/CategoryNameForm';
import CategoryActions from './_components/CategoryActions';

const CategoryPage = async ({ params }) => {
  const { categoryId } = params;
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const coursesOfCategoryCount = await db.course.count({
    where: {
      categoryId,
    },
  });

  if (!category) {
    return redirect('/teacher/categories');
  }

  const isDeleteDisabled = coursesOfCategoryCount > 0;

  return (
    <>
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>Category edit</h1>
          </div>
          <CategoryActions
            categoryId={categoryId}
            disabled={isDeleteDisabled}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Edit your category</h2>
            </div>
            <CategoryNameForm initialData={category} categoryId={categoryId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
