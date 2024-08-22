'use client';

import axios from 'axios';
import MuxPlayer from '@mux/mux-player-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/useConfettiStore';

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}) => {
  const [isReady, setIsReady] = useState(true);

  return (
    <div className='relative aspect-video'>
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-secondary' />
        </div>
      )}
      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8 text-secondary' />
          <p className='text-sm'>This chapter is locked</p>
        </div>
      )}
      {isReady && !isLocked && (
        <MuxPlayer
          className={cn(!isReady && 'hidden')}
          title={title}
          playbackId={playbackId}
          //   TODO: check why this is not working
          //   onCanPlay={() => setIsReady(true)}
          onEnded={completeOnEnd}
          autoPlay
        />
      )}
    </div>
  );
};
export default VideoPlayer;
