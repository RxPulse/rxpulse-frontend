import { Pill } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, size = 'md', text }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Track */}
        <div className="absolute inset-0 rounded-full border-2 border-dark-700"></div>
        {/* Spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin"></div>
        {/* Center Icon */}
        <Pill size={iconSizes[size]} className="text-brand-400 opacity-60 absolute" />
      </div>
      {text && <span className="text-sm text-dark-400 font-medium">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16 w-full">
      {spinnerContent}
    </div>
  );
}
