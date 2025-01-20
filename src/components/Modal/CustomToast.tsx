import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { ToastProps } from '../../types/scheduler';

export const CustomToast = ({ t, message, type = 'info' }: ToastProps) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/90',
    error: 'bg-gradient-to-br from-rose-50 via-white to-rose-50/90',
    info: 'bg-gradient-to-br from-blue-50 via-white to-blue-50/90'
  };

  const shadows = {
    success: 'shadow-[0_8px_30px_rgb(16_185_129_/_0.2)] hover:shadow-[0_15px_35px_rgb(16_185_129_/_0.25)]',
    error: 'shadow-[0_8px_30px_rgb(225_29_72_/_0.2)] hover:shadow-[0_15px_35px_rgb(225_29_72_/_0.25)]',
    info: 'shadow-[0_8px_30px_rgb(59_130_246_/_0.2)] hover:shadow-[0_15px_35px_rgb(59_130_246_/_0.25)]'
  };

  return (
    <div className="perspective-1000">
      <div
        className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'}
          max-w-sm w-full ${backgrounds[type]} ${shadows[type]}
          rounded-lg pointer-events-auto flex items-center
          transform-gpu transition-all duration-300 ease-out
          relative overflow-hidden group
          border border-white/80 backdrop-blur-md
          hover:translate-z-12 hover:-translate-y-1 hover:rotate-x-2
          ring-1 ring-black/5
        `}
      >
        <div className="relative flex w-full items-center gap-3 p-3">
          {/* Icon container with enhanced 3D effect */}
          <div className={`flex-shrink-0 p-2 rounded-md bg-white 
            shadow-lg transform transition-transform duration-300
            group-hover:translate-z-8 group-hover:scale-110
            ${type === 'success' ? 'shadow-emerald-200/50' : 
              type === 'error' ? 'shadow-rose-200/50' : 'shadow-blue-200/50'}`}>
            {icons[type]}
          </div>

          {/* Message with enhanced 3D transform */}
          <p className="flex-1 text-sm font-medium text-gray-700 
            transform transition-transform duration-300 
            group-hover:translate-z-4">
            {message}
          </p>

          {/* Close button with enhanced 3D effect */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-2 rounded-md text-gray-400
              hover:text-gray-600 hover:bg-white/80 
              transition-all duration-200 transform
              hover:translate-z-4 hover:scale-110 active:scale-95
              shadow-sm hover:shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar with enhanced visibility */}
        <div
          className={`absolute bottom-0 left-0 h-1 rounded-full
            ${type === 'success' ? 'bg-emerald-500/30' : 
              type === 'error' ? 'bg-rose-500/30' : 'bg-blue-500/30'}
            animate-progress-reverse`}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

// Custom toast functions with modern animations
export const showToast = {
  success: (message: string) => 
    toast.custom((t) => <CustomToast t={t} message={message} type="success" />, {
      duration: 4000,
      position: 'bottom-left',
    }),
  error: (message: string) => 
    toast.custom((t) => <CustomToast t={t} message={message} type="error" />, {
      duration: 4000,
      position: 'bottom-left',
    }),
  info: (message: string) => 
    toast.custom((t) => <CustomToast t={t} message={message} type="info" />, {
      duration: 4000,
      position: 'bottom-left',
    })
}; 