import { AlertProps } from "../../types/common";

export function Alert({ children, className = '', variant = 'default' }: AlertProps) {
  return (
    <div className={`rounded-lg border p-4 ${variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h5 className="mb-1 font-medium">{children}</h5>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-600">{children}</div>;
} 