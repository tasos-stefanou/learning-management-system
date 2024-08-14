import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IconBadge from '@/components/IconBadge';
import { LayoutDashboard } from 'lucide-react';
import ChapterTitleForm from './_components/ChapterTitleForm';

const ChapterIdPage = async ({ params }) => {
  const { userId } = auth();
  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect('/');
  }

  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center'>
        <div className='w-full'>
          <Link
            href={`/teacher/courses/${courseId}`}
            className='flex items-center text-sm hover:opacity-75 transition mb-6'
          >
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to course setup
          </Link>
          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>Chapter creation</h1>
              <span className='text-sm text-slate-700'>
                Complete all fields ({completionText})
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl'>Customize your chapter</h2>
          </div>
          <ChapterTitleForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
          {/* <DescriptionForm initialData={course} courseId={courseId} /> */}
          {/* <ImageForm initialData={course} courseId={courseId} /> */}
          {/* <CategoryForm initialData={course} courseId={courseId} options={categoriesAsOptions} /> */}
        </div>
        <div className='space-y-6'>
          <div>
            <div className='flex items-center gap-x-2'>
              {/* <IconBadge icon={ListChecks} />
              <h2 className='text-xl'>Course chapters</h2> */}
            </div>
            {/* <ChaptersForm initialData={course} courseId={courseId} /> */}
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              {/* <IconBadge icon={CircleDollarSign} /> */}
              {/* <h2 className='text-xl'>Sell your course</h2> */}
            </div>
            {/* <PriceForm initialData={course} courseId={courseId} /> */}
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              {/* <IconBadge icon={File} /> */}
              {/* <h2 className='text-xl'>Resources & Attachments</h2> */}
            </div>
            <div>
              {/* <AttachmentForm initialData={course} courseId={courseId} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
