'use client';

import axios from 'axios';

import { ImageIcon, PencilIcon, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

const ImageForm = ({ initialData, courseId }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course image updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while updating the course image');
      console.error(error);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course image
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {initialData?.image ? (
                <>
                  <PencilIcon className='h-4 w-4 mr-2' />
                  Edit image
                </>
              ) : (
                <>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Add image
                </>
              )}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image alt='Course image' src={initialData.imageUrl} fill className='object-cover rounded-md' />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={'courseImage'}
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>16:9 aspect ratio recommended. Max size: 2MB. Supported formats: JPG, PNG, GIF.</div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
