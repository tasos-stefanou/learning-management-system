import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';
const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu className='w-6 h-6' />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white'>
        <SheetDescription />
        <SheetTitle />
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
