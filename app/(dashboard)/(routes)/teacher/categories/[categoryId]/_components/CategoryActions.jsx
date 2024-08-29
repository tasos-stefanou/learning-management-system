'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import ConfirmCategoryDeletionModal from '@/components/modals/ConfirmCategoryDeletionModal';

import { TrashIcon } from 'lucide-react';

const CategoryActions = ({ disabled, categoryId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      toast.success('Course deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while deleting the category');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center'>
      {disabled ? (
        <span className='text-sm text-muted-foreground'>
          You cannot delete a category that has been assigned to courses
        </span>
      ) : (
        <ConfirmCategoryDeletionModal onConfirm={onDelete}>
          <Button size='sm' disabled={isLoading}>
            <TrashIcon className='h-4 w-4' />
          </Button>
        </ConfirmCategoryDeletionModal>
      )}
    </div>
  );
};

export default CategoryActions;
