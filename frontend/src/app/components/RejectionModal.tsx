import React, { useState } from 'react';

export default function RejectionModal({ open, onClose, onConfirm, employerName }: {
  open: boolean;
  onClose: () => void;
  onConfirm: (raison: string) => Promise<void>;
  employerName?: string;
}) {
  const [raison, setRaison] = useState('');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-2">Rejeter la demande</h3>
        <p className="text-sm text-gray-600 mb-4">Indiquez la raison du rejet pour <span className="font-semibold">{employerName}</span>.</p>
        <textarea value={raison} onChange={e => setRaison(e.target.value)} rows={4} className="w-full p-3 border rounded-md text-sm" placeholder="Raison du rejet..." />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Annuler</button>
          <button onClick={async () => { if (!raison.trim()) return; await onConfirm(raison.trim()); setRaison(''); }} className="px-4 py-2 bg-red-600 text-white rounded">Rejeter</button>
        </div>
      </div>
    </div>
  );
}
