'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.startsWith('/player');
  return (
    <div className='flex gap-x-2 ml-auto'>
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;
