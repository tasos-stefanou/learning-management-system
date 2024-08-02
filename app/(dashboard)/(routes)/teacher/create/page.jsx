'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../../../components/ui/form';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(255, {
    message: 'Title must be at most 255 characters long',
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { title: '' } });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${data.id}`);
      toast.success('Course created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };
  return (
    <div className='max-w-5xl mx-auto md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>Name your course</h1>
        <p className='text-sm text-slate-600'>What would you like to name your course. Don&apos;t worry, you can change this later!</p>
        <Form {...form}>
          <form className='space-y-8 mt-8' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder='e.g. Introduction to JavaScript' {...field} />
                  </FormControl>
                  <FormDescription>Give your course a name that describes what it&apos;s about.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href='/'>
                <Button type='button' variant='ghost'>
                  Cancel
                </Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
