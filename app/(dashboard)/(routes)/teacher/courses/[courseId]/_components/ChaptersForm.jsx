'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, PencilIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ChaptersList from './ChaptersList';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Chapter title must be at least 1 character long' }).max(255, {
    message: 'Chapter title must be at most 255 characters long',
  }),
});

const ChapterForm = ({ initialData, courseId }) => {
  const router = useRouter();

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { title: '' } });
  const { isSubmitting, isValid } = form.formState;

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const onSubmit = async (values) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Coursechapter created successfully');
      toggleCreating();
      // clear the form
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while creating the course chapter');
      console.error(error);
    }
  };

  const onReorder = async (updatedData) => {
    setIsUpdating(true);
    try {
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: updatedData });
      toast.success('Chapters reordered successfully');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while reordering the chapters');
      console.error(error);
    }
    setIsUpdating(false);
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button variant='ghost' onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder='e.g. Introduction to the course' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type='submit'>
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
          {!initialData.chapters.length && 'No chapters'}
          <ChaptersList items={initialData.chapters} onEdit={() => {}} onReorder={onReorder} />
        </div>
      )}
      {!isCreating && <p className='text-xs text-muted-foreground mt-4'>Drag and drop to reorder the chapters</p>}
    </div>
  );
};

export default ChapterForm;