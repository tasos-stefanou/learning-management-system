'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import ConfirmChapterDeletionModal from '@/components/modals/ConfirmChapterDeletionModal';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPublishOrUnpublish = async () => {
    setIsLoading(true);
    try {
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success('Chapter unpublished successfully');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success('Chapter published successfully');
      }
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while publishing the chapter');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully');
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error('An error occurred while deleting the chapter');
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
      <ConfirmChapterDeletionModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <TrashIcon className='h-4 w-4' />
        </Button>
      </ConfirmChapterDeletionModal>
    </div>
  );
};

export default ChapterActions;
