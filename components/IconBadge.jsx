import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { LayoutDashboard, LucideAirplay } from 'lucide-react';

const backgroundVariants = cva('rounded-full flex items-center justify-cennter', {
  variants: {
    variant: {
      default: 'bg-sky-100',
      success: 'bg-emerald-100',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    iconVariant: 'default',
    size: 'default',
  },
});

const iconVariants = cva('w-6 h-6', {
  variants: {
    variant: {
      default: 'text-sky-700',
      success: 'text-emerald-700',
    },
  },
  sizes: {
    default: 'w-8 h-8',
    sm: 'w-4 h-4',
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const IconBadge = ({ icon: Icon, variant, size }) => {
  return (
    <div
      className={cn(
        backgroundVariants({
          variant,
          size,
        })
      )}
    >
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};

export default IconBadge;
