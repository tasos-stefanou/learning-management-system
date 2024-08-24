import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { FileIcon } from 'lucide-react';

import { getChapter } from '@/actions/getChapter';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/Preview';
import { Banner } from '@/components/Banner';

import VideoPlayer from './_components/VideoPlayer';
import CourseEnrollButton from './_components/CourseEnrollButton';
import CourseProgressButton from './_components/CourseProgressButton';

const ChapterIdPage = async ({ params }) => {
  const { userId } = auth();
  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect('/');
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter(userId, courseId, chapterId);

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label='You have already completed this chapter'
          variant='success'
        />
      )}
      {isLocked && (
        <Banner
          label='You need to purchase this course to access this chapter'
          variant='warning'
        />
      )}

      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                courseId={courseId}
                chapterId={chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className='p-4 space-y-1'>
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target='_blank'
                    className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'
                  >
                    <FileIcon className='h-6 w-6 mr-2' />
                    <p className='line-clamp-1'>{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChapterIdPage;
