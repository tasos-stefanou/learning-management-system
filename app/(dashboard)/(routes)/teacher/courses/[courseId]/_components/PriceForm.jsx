'use client';

import { useEffect, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PencilIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
});

const PriceForm = ({ initialData, courseId }) => {
  const router = useRouter();

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { ...initialData } });
  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course price updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while updating the course price');
      console.error(error);
    }
  };

  const watchedPrice = useWatch({
    control: form.control,
    name: 'price',
  });

  useEffect(() => {
    setIsChanged(watchedPrice !== initialData?.price);
  }, [watchedPrice, initialData.price]);

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course price
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className='h-4 w-4 mr-2' />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn('text-sm mt-2', !initialData.price && 'text-slate-500 italic')}>
          {initialData.price ? formatPrice(initialData.price) : 'No price'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='number' step='0.01' disabled={isSubmitting} placeholder='120' {...field} />
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

export default PriceForm;
