import Image from 'next/image';
import Link from 'next/link';
import IconBadge from './IconBadge';
import { BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/format';

const CourseCard = ({ course }) => {
  const { title, category, chapters, progress, price, imageUrl } = course;
  const chaptersLength = chapters.length;
  const categoryName = category.name;

  return (
    <Link href={`/courses/${course.id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video overflow-hidden rounded-md'>
          <Image
            src={imageUrl}
            fill
            className='object-cover'
            alt={course.title}
          />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-sm text-muted-foreground'>{categoryName}</p>
          <div className='my-3 flex items-center gap-x-2 text-sm md:text-sm'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge size={'sm'} icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? 'chapter' : 'chapters'}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <>{/* TODO: add progress component */}</>
          ) : (
            <p className='text-md md:text-sm font-medium text-slate-700'>
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
export default CourseCard;
