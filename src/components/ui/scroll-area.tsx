interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollArea({ children, className = '' }: ScrollAreaProps) {
  return (
    <div className={`overflow-auto bg-white/80 dark:bg-gray-900 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {children}
    </div>
  );
} 