import { cn } from '@/lib/cn';

/**
 * Marks a recreated product screen as sample data (data/demo.ts), so no
 * figure on the page can be read as a real customer or business result.
 */
export function SampleDataTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-white px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-text-muted uppercase ring-1 ring-border',
        className,
      )}
    >
      Sample data
    </span>
  );
}
