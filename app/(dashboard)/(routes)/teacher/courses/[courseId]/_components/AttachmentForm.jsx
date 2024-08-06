'use client';

import axios from 'axios';

import { File, ImageIcon, Loader2, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';

const AttatchmentForm = ({ initialData, courseId }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course image updated successfully');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while updating the course image');
      console.error(error);
    }
  };

  const onDeleteAttachment = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while deleting the attachment');
      console.error(error);
    }
    setDeletingId(null);
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && <>{initialData.attachments.length === 0 && <p className='text-sm mt-2 text-slate-500 italic'>No attachments yet</p>}</>}
      {initialData.attachments.length !== 0 && (
        <div className='space-y-2'>
          {initialData.attachments.map((attachment) => (
            <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
              <File className='h-4 w-4 mr-2 flex-shrink-0' />
              <p className='text-xs line-clamp-1'>{attachment.name}</p>
              {deletingId === attachment.id && (
                <div className='ml-auto'>
                  <Loader2 className='h-4 w-4 animate-spin ' />
                </div>
              )}
              {deletingId !== attachment.id && (
                <button onClick={() => onDeleteAttachment(attachment.id)} className='ml-auto hover:opacity-75 transition'>
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={'courseAttachment'}
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>Add anything your students might need to complete this course</div>
        </div>
      )}
    </div>
  );
};

export default AttatchmentForm;
