import { cn } from '@/lib/utils';
import { BedDouble } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-semibold tracking-tighter text-primary',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <BedDouble className="h-5 w-5" />
      </div>
      Consultoria do Sono
    </div>
  );
}
