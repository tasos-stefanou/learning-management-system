'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/formatPrice';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseEnrollButton = ({ courseId, price }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createSession = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(data.url);
    } catch (error) {
      console.log(error);
      toast.error('Failed to create checkout session');
    }
    setIsLoading(false);
  };
  return (
    <Button
      size='sm'
      className='w-full md:w-auto'
      onClick={createSession}
      disabled={isLoading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
export default CourseEnrollButton;
