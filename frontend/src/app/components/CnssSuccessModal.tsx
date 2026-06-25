import { CheckCircle } from 'lucide-react';
import { CNSSLogo } from './CNSSLogo';

interface CnssSuccessModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
}

export function CnssSuccessModal({
  open,
  title,
  message,
  onClose,
  actionLabel = 'Continuer',
}: CnssSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-center mb-5">
          <CNSSLogo size="medium" />
        </div>

        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
