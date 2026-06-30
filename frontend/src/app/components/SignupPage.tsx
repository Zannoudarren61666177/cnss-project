import {
  Send, Mail, ArrowLeft, User, Phone, MapPin, FileText, Upload,
  Building2, CheckCircle, ChevronRight, ChevronLeft, X, AlertCircle
} from 'lucide-react';
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { submitDemandeAdhesion } from '../api';
import { CNSSLogo } from './CNSSLogo';
import { SubmissionModal } from './SubmissionModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Piece {
  id: string;
  label: string;
  note?: string;
  required: boolean;
}

interface TypeEmployeur {
  id: string;
  label: string;
  description: string;
  pieces: Piece[];
  champSpecifique?: { id: string; label: string; placeholder: string };
}

// ─── Pièces par type d'employeur ─────────────────────────────────────────────

const PIECES_COMMUNES: Piece[] = [
  { id: 'demande_immat', label: "Demande d'immatriculation", note: "à retirer à la CNSS", required: true },
  { id: 'etat_recensement', label: "État de recensement", note: "à retirer à la CNSS", required: true },
];

const TYPES_EMPLOYEUR: TypeEmployeur[] = [
  {
    id: 'societe',
    label: 'Société',
    description: 'SA, SARL, SNC, SCS, etc.',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'registre_commerce', label: 'Registre de commerce', required: true },
      { id: 'statuts', label: 'Statuts', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du promoteur/gérant', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
      { id: 'rib', label: 'Photocopie RIB', required: true },
    ],
  },
  {
    id: 'etablissement',
    label: 'Établissement',
    description: 'Commerce, atelier, entreprise individuelle',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'registre_commerce', label: 'Registre de commerce', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: "Copie carte NPI/CIP ou CI biométrique de l'employeur", required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
  {
    id: 'gens_maison',
    label: 'Gens de maison',
    description: 'Employeur de personnel domestique',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'carte_identite', label: "Copie carte NPI/CIP ou CI biométrique de l'employeur", required: true },
    ],
  },
  {
    id: 'assurance_volontaire',
    label: 'Assurance volontaire',
    description: 'Travailleur indépendant, auto-entrepreneur',
    pieces: [
      { id: 'demande_immat', label: "Demande d'immatriculation", note: "à retirer à la CNSS", required: true },
      { id: 'certificat_cessation', label: "Certificat de cessation d'activité ou de travail", required: true },
      { id: 'bulletins_paie', label: 'Trois derniers bulletins de paie', required: true },
      { id: 'carte_assurance', label: "Livret ou copie de la carte d'assurance", required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du demandeur', required: true },
    ],
  },
  {
    id: 'ecole',
    label: 'École',
    description: 'Établissement scolaire privé ou public',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'arrete_creation', label: 'Arrêté de création', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du promoteur/directeur', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
  {
    id: 'cabinet',
    label: 'Cabinet / Étude',
    description: "Avocat, huissier, notaire, commissaire-priseur",
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'attestation_inscription', label: "Attestation d'inscription", required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du chef de cabinet', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
  {
    id: 'eglise',
    label: 'Église / Confession religieuse',
    description: 'Organisation religieuse reconnue',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'document_creation', label: 'Document de création', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du responsable', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
  {
    id: 'structure_etatique',
    label: 'Structure étatique',
    description: 'Créée par décret ou texte règlementaire',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'decret_creation', label: 'Décret de création de la structure', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du signataire', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
  {
    id: 'ong',
    label: 'ONG / Association / Coopérative',
    description: 'Organisation à but non lucratif',
    pieces: [
      ...PIECES_COMMUNES,
      { id: 'recepisse', label: 'Récépissé', required: true },
      { id: 'statuts', label: 'Statuts', required: true },
      { id: 'ifu', label: 'IFU (Identifiant Fiscal Unique)', required: true },
      { id: 'carte_identite', label: 'Copie carte NPI/CIP ou CI biométrique du président', required: true },
      { id: 'facture_soneb', label: 'Copie facture SONEB ou SBEE du siège social', required: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i + 1 < current ? 'bg-[#4A90E2] text-white' :
            i + 1 === current ? 'bg-[#4A90E2] text-white ring-4 ring-blue-100' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i + 1 < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && <div className={`w-10 h-0.5 ${i + 1 < current ? 'bg-[#4A90E2]' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

function FileUploadField({
  piece, file, onChange, onRemove
}: {
  piece: Piece;
  file: File | null;
  onChange: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#4A90E2] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{piece.label}</p>
          {piece.note && (
            <p className="text-xs text-[#4A90E2] mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {piece.note}
            </p>
          )}
        </div>
        {piece.required && (
          <span className="text-xs text-red-500 font-medium flex-shrink-0">Obligatoire</span>
        )}
      </div>

      {file ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-800 font-medium flex-1 min-w-0 truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(piece.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) onChange(piece.id, e.target.files[0]); }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4A90E2] hover:bg-blue-50 cursor-pointer transition-colors text-sm text-gray-500 hover:text-[#4A90E2]"
          >
            <Upload className="w-4 h-4" />
            Cliquer pour téléverser
          </button>
          <p className="text-xs text-gray-400 mt-1.5 text-center">JPG, PNG, PDF — max 5 Mo</p>
        </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<TypeEmployeur | null>(null);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    ifu: '',
    adresseEntreprise: '',
    telephoneEntreprise: '',
    email: '',
    nom: '',
    prenom: '',
    npi: '',
    telephoneRepresentant: '',
    adresse: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileAdd = (id: string, file: File) => setFiles(prev => ({ ...prev, [id]: file }));
  const handleFileRemove = (id: string) => setFiles(prev => { const n = { ...prev }; delete n[id]; return n; });

  const requiredPieces = selectedType?.pieces.filter(p => p.required) ?? [];
  const allRequiredUploaded = requiredPieces.every(p => files[p.id]);
  const uploadProgress = requiredPieces.length > 0
    ? Math.round((Object.keys(files).length / requiredPieces.length) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build FormData to match backend expectations
    const fd = new FormData();
    fd.append('type_employeur', selectedType?.id || '');
    fd.append('company_name', formData.nomEntreprise);
    fd.append('ifu', formData.ifu || '');
    fd.append('address', formData.adresseEntreprise);
    fd.append('phone', formData.telephoneEntreprise);
    fd.append('email', formData.email);
    fd.append('nom_representant', formData.nom);
    fd.append('prenom_representant', formData.prenom);
    fd.append('npi_representant', formData.npi);
    fd.append('telephone_representant', formData.telephoneRepresentant);

    // Attach files using their piece ids as keys
    Object.entries(files).forEach(([key, file]) => {
      if (file) fd.append(key, file as File);
    });

    try {
      setSubmitting(true);
      await submitDemandeAdhesion(fd);
      setShowModal(true);
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la soumission de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const onModalClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4A90E2] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-[#4A90E2] to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-2">
                <CNSSLogo size="small" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Formulaire d'adhésion employeur</h1>
                <p className="text-blue-100 text-sm mt-0.5">Immatriculation à la Caisse Nationale de Sécurité Sociale</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <StepIndicator current={step} total={3} />

            {/* ── ÉTAPE 1 : Type d'employeur ── */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Type d'employeur</h2>
                  <p className="text-gray-500 text-sm">Sélectionnez la catégorie qui correspond à votre structure</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TYPES_EMPLOYEUR.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        selectedType?.id === type.id
                          ? 'border-[#4A90E2] bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                        selectedType?.id === type.id ? 'bg-[#4A90E2] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{type.label}</p>
                      <p className="text-xs text-gray-500 leading-snug">{type.description}</p>
                      {selectedType?.id === type.id && (
                        <div className="mt-2 flex items-center gap-1 text-[#4A90E2] text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Sélectionné
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedType && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm font-semibold text-blue-800 mb-2">
                      Pièces requises pour : {selectedType.label}
                    </p>
                    <ul className="space-y-1">
                      {selectedType.pieces.map(p => (
                        <li key={p.id} className="flex items-start gap-2 text-sm text-blue-700">
                          <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{p.label}{p.note ? <span className="text-blue-500 italic"> ({p.note})</span> : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedType}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 2 : Informations ── */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations générales</h2>
                  <p className="text-gray-500 text-sm">Renseignez les informations de votre structure et de votre représentant légal</p>
                </div>

                {/* Structure */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Building2 className="w-4 h-4 text-[#4A90E2]" />
                    Informations de la structure
                    <span className="ml-auto text-xs text-[#4A90E2] font-medium bg-blue-50 px-2 py-0.5 rounded-full">{selectedType?.label}</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Raison sociale / Nom <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="nomEntreprise" value={formData.nomEntreprise} onChange={handleChange}
                            placeholder="Nom de la structure" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">IFU <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="ifu" value={formData.ifu} onChange={handleChange}
                            placeholder="Numéro IFU"
                            required={selectedType?.id !== 'gens_maison' && selectedType?.id !== 'assurance_volontaire'}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse du siège social <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="adresseEntreprise" value={formData.adresseEntreprise} onChange={handleChange}
                            placeholder="Adresse complète" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" name="telephoneEntreprise" value={formData.telephoneEntreprise} onChange={handleChange}
                            placeholder="+229 XX XX XX XX" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email de contact <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="contact@structure.bj" required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Représentant */}
                <div className="mb-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <User className="w-4 h-4 text-[#4A90E2]" />
                    Représentant légal / Responsable
                  </h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="nom" value={formData.nom} onChange={handleChange}
                            placeholder="Nom" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom(s) <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                            placeholder="Prénom(s)" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">NPI <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="npi" value={formData.npi} onChange={handleChange}
                            placeholder="Numéro NPI" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone personnel <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" name="telephoneRepresentant" value={formData.telephoneRepresentant} onChange={handleChange}
                            placeholder="+229 XX XX XX XX" required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </button>
                  <button type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#4A90E2] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Continuer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ── ÉTAPE 3 : Pièces justificatives ── */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pièces justificatives</h2>
                  <p className="text-gray-500 text-sm">
                    Téléversez les pièces requises pour votre dossier
                    <span className="font-semibold text-gray-700"> ({selectedType?.label})</span>
                  </p>
                </div>

                {/* Barre de progression */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Avancement du dossier</span>
                    <span className="text-sm font-bold text-[#4A90E2]">
                      {Object.keys(files).length}/{requiredPieces.length} pièces
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4A90E2] rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  {allRequiredUploaded && (
                    <p className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Dossier complet — prêt à soumettre
                    </p>
                  )}
                </div>

                {/* Note CNSS */}
                <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Les documents mentionnés <span className="font-semibold">"à retirer à la CNSS"</span> doivent être obtenus au guichet CNSS avant de les scanner et téléverser ici.
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {selectedType?.pieces.map((piece) => (
                    <FileUploadField
                      key={piece.id}
                      piece={piece}
                      file={files[piece.id] ?? null}
                      onChange={handleFileAdd}
                      onRemove={handleFileRemove}
                    />
                  ))}
                </div>

                {/* Acceptation */}
                <div className="flex items-start gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input type="checkbox" required id="cgu"
                    className="w-4 h-4 text-[#4A90E2] border-gray-300 rounded focus:ring-[#4A90E2] mt-0.5" />
                  <label htmlFor="cgu" className="text-sm text-gray-600">
                    Je certifie que les informations fournies sont exactes et que les documents téléversés sont authentiques.
                    J'accepte les{' '}
                    <a href="#" className="text-[#4A90E2] hover:underline">conditions d'utilisation</a> et la{' '}
                    <a href="#" className="text-[#4A90E2] hover:underline">politique de confidentialité</a>.
                  </label>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </button>
                  <button
                    type="submit"
                    disabled={!allRequiredUploaded}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                  >
                    <Send className="w-4 h-4" />
                    Soumettre ma demande
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Lien compte existant */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Vous avez déjà un numéro d'immatriculation ?</p>
          <Link to="/creer-compte"
            className="inline-block px-6 py-2.5 border-2 border-[#4A90E2] text-[#4A90E2] rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Activer mon compte en ligne
          </Link>
        </div>
      </div>
      <SubmissionModal
        open={showModal}
        message={"Votre demande d'adhésion a été soumise avec succès ! Vous recevrez votre numéro d'immatriculation par email après validation par un agent CNSS."}
        onClose={onModalClose}
      />
    </div>
  );
}
