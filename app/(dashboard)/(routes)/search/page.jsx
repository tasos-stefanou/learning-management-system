import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getAllPublishedCourses } from '@/actions/getAllPublishedCourses';

import SearchInput from '@/components/SearchInput';
import CoursesList from '@/components/CoursesList';

import Categories from './_components/Categories';

const SearchPage = async ({ searchParams }) => {
  const { title, categoryId } = searchParams;

  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getAllPublishedCourses(userId, title, categoryId);

  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb0 block'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesList courses={courses} />
      </div>
    </>
  );
};

export default SearchPage;
