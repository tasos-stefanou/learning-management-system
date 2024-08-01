import { cn } from '../../../lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const SidebarItem = ({ item }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === '/' && item.href === '/') || (item.href !== '/' && (pathname === item.href || (pathname && pathname.startsWith(item.href))));

  const onClick = () => {
    router.push(item.href);
  };

  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        ' w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive && 'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700'
      )}
    >
      <div className='flex items-center gap-x-2 py-4 w-full'>
        <div>{item.icon}</div>
        <div>{item.label}</div>
      </div>
      <div className={cn('ml-auto h-full border-2 border-sky-700 transition-all opacity-0', isActive && 'opacity-100')}></div>
    </button>
  );
};

export default SidebarItem;
