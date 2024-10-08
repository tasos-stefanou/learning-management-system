'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import ConfirmCourseDeletionModal from '@/components/modals/ConfirmCourseDeletionModal';
import { useConfettiStore } from '@/hooks/useConfettiStore';

import { TrashIcon } from 'lucide-react';

const CourseActions = ({ disabled, courseId, isPublished }) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onPublishOrUnpublish = async () => {
    setIsLoading(true);
    try {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published successfully');
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while publishing the course');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while deleting the course');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        size='sm'
        onClick={onPublishOrUnpublish}
        disabled={disabled || isLoading}
        variant='outline'
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmCourseDeletionModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <TrashIcon className='h-4 w-4' />
        </Button>
      </ConfirmCourseDeletionModal>
    </div>
  );
};

export default CourseActions;
