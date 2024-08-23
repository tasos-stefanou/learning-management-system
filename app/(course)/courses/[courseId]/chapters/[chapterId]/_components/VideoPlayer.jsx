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
          className={cn(!isReady && 'hidden')}
          metadataVideoTitle={title}
          // primaryColor='#FFFFFF'
          // secondaryColor='#000000'
          onEnded={() => console.log('Video ended')}
          autoPlay
        />
      )}
    </div>
  );
};
export default VideoPlayer;
