import { auth } from '@clerk/nextjs/server';
import { getChapter } from '@/actions/getChapter';
import { redirect } from 'next/navigation';
import { Banner } from '@/components/Banner';
import VideoPlayer from './_components/VideoPlayer';

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
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

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
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
};
export default ChapterIdPage;
