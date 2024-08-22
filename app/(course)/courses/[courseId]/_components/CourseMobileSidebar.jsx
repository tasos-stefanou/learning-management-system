import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import CourseSidebar from './CourseSidebar';

const CourseMobileSidebar = ({ course, progressCount }) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu className='w-6 h-6' />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <SheetDescription />
        <SheetTitle />
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};
export default CourseMobileSidebar;
