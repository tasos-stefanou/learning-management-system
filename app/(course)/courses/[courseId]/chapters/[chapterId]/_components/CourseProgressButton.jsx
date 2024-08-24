'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useConfettiStore } from '@/hooks/useConfettiStore';
import { Button } from '@/components/ui/button';

const CourseProgressButton = ({
  courseId,
  chapterId,
  nextChapterId,
  isCompleted,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const Icon = isCompleted ? XCircle : CheckCircle;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success('Course progress updated');
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update course progress');
    }
    setIsLoading(false);
  };

  return (
    <Button
      type='button'
      variant={isCompleted ? 'outline' : 'success'}
      className='w-full md:w-auto'
      onClick={onClick}
      disabled={isLoading}
    >
      {isCompleted ? 'Completed' : 'Mark as completed'}
      <Icon className='w-4 h-4 ml-2' />
    </Button>
  );
};
export default CourseProgressButton;
