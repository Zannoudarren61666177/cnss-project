import { useEffect } from 'react';
import { X } from 'lucide-react';
import { CNSSLogo } from './CNSSLogo';

type Props = {
  open: boolean;
  message: string;
  variant?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
};

export default function CnssToast({ open, message, variant = 'success', onClose, duration = 4000 }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const bg = variant === 'success' ? 'bg-white' : variant === 'error' ? 'bg-red-50' : 'bg-white';
  const border = variant === 'success' ? 'border-green-200' : variant === 'error' ? 'border-red-200' : 'border-gray-200';

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className={`flex items-center gap-3 p-3 rounded-lg shadow-lg border ${bg} ${border} max-w-sm w-full`} role="status">
        <div className="w-10 h-10 flex items-center justify-center">
          <CNSSLogo className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900 font-semibold">{message}</p>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
