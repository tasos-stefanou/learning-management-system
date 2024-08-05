'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  categoryId: z.string().min(1, { message: 'Category is required' }),
});

const CategoryForm = ({ initialData, courseId, options }) => {
  const router = useRouter();

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { ...initialData } });
  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course category updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while updating the course category');
      console.error(error);
    }
  };

  const watchedCategory = useWatch({
    control: form.control,
    name: 'categoryId',
  });

  useEffect(() => {
    setIsChanged(watchedCategory?.trim() !== initialData?.categoryId);
  }, [watchedCategory, initialData.categoryId]);

  const selectedOption = options?.find((option) => option.value === initialData.categoryId);

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course category
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className='h-4 w-4 mr-2' />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn('text-sm mt-2', !initialData.categoryId && 'text-slate-500 italic')}>{selectedOption?.label || 'No category'}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox {...field} options={options} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting || !isChanged} type='submit'>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
