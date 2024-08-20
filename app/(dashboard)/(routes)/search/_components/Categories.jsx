'use client';

import {
  FcEngineering,
  FcMusic,
  FcOldTimeCamera,
  FcSportsMode,
} from 'react-icons/fc';

import CategoryItem from './CategoryItem';

const iconMap = {
  'Computer Science': FcEngineering,
  Fitness: FcSportsMode,
  Music: FcMusic,
  Photography: FcOldTimeCamera,
};

const Categories = ({ items }) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((category) => {
        return (
          <CategoryItem
            key={category.id}
            label={category.name}
            icon={iconMap[category.name]}
            value={category.id}
          />
        );
      })}
    </div>
  );
};
export default Categories;
