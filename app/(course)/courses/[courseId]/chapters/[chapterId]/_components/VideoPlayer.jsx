'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import MuxPlayer from '@mux/mux-player-react';
import { Lock } from 'lucide-react';

import { useConfettiStore } from '@/hooks/useConfettiStore';

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  isCompleted,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const markChapterAsCompleted = async () => {
    if (isCompleted) return;

    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: true,
        }
      );
      if (!nextChapterId) {
        confetti.onOpen();
        toast.success('Course completed');
      }

      router.refresh();

      // TODO: This is a hacky way to navigate to the next chapter and refresh the data of the current page
      if (nextChapterId) {
        toast.success('Course progress updated');
        setTimeout(() => {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }, 500); // Adjust the delay as needed
      }
    } catch (error) {
      toast.error(
        'An error occurred while trying to mark this chapter as completed'
      );
    }
  };
  return (
    <div className='relative aspect-video'>
      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8 text-secondary' />
          <p className='text-sm'>This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          streamType='on-demand'
          playbackId={playbackId}
          metadataVideoTitle={title}
          // primaryColor='#FFFFFF'
          // secondaryColor='#000000'
          onEnded={markChapterAsCompleted}
          // autoPlay
        />
      )}
    </div>
  );
};
export default VideoPlayer;
