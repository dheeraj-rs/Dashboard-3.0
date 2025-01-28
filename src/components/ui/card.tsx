interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-900 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
} 