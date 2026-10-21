import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-on-accent shadow-[0_10px_30px_-10px_var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_var(--accent)]',
        outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/5',
        ink: 'bg-ink text-bg hover:-translate-y-0.5'
      },
      size: {
        default: 'h-12 px-7 text-base',
        sm: 'h-10 px-5 text-sm',
        lg: 'h-14 px-9 text-lg'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = 'Button';
