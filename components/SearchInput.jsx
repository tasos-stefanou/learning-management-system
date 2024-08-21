'use client';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

const SearchInput = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...searchParams,
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [debouncedValue]);

  return (
    <div className='relative'>
      <SearchIcon className='absolute h-4 w-4 top-3 left-3 text-slate-600' />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search for a course'
      />
    </div>
  );
};
export default SearchInput;
