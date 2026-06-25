import { CNSSLogo } from './CNSSLogo';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function SubmissionModal({ open, message, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md bg-white rounded-xl shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-full">
            <CNSSLogo size="medium" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Demande reçue</h3>
          <p className="text-sm text-gray-600">{message}</p>

          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-[#4A90E2] text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
