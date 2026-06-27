import { AlertCircle, CheckCircle, Clock, Eye, FileText, Send, TrendingUp } from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';

// Données statiques (à remplacer par des appels API)
const declarations: {
  ref: string; employeur: string; periode: string; montant: string;
  statut: 'En attente' | 'En retard' | 'Vérifiée' | 'Rejetée'; echeance: string;
}[] = [];

export function AgentCotisation() {
  const statusBadge = (s: typeof declarations[0]['statut']) => {
    const map: Record<typeof declarations[0]['statut'], BadgeVariant> = {
      'En attente': 'orange', 'En retard': 'red', 'Vérifiée': 'green', 'Rejetée': 'red',
    };
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Cotisations" sub="Vérification des déclarations et paiements employeurs" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Déclarations reçues" value={declarations.length} sub="Ce mois" icon={<FileText className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="En attente" value={declarations.filter(d => d.statut === 'En attente').length} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="En retard" value={declarations.filter(d => d.statut === 'En retard').length} icon={<AlertCircle className="w-5 h-5" />} color="bg-red-100 text-red-600" />
        <StatCard label="Total encaissé" value="— FCFA" sub="Ce mois" icon={<TrendingUp className="w-5 h-5" />} color="bg-teal-100 text-teal-600" />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par référence ou employeur..." />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Employeur', 'Période', 'Montant', 'Échéance', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {declarations.map(d => (
                <tr key={d.ref} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.ref}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{d.employeur}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{d.periode}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium text-xs">{d.montant} FCFA</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.echeance}</td>
                  <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      {d.statut === 'En attente' && (
                        <button className="p-1 text-gray-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Employeurs en retard</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <Send className="w-4 h-4" />Relancer tous
          </button>
        </div>
        <div className="space-y-3">
          {([] as { nom: string; retard: string; montant: string; dernierContact: string }[]).map((e, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-red-100 rounded-lg bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{e.nom}</p>
                <p className="text-xs text-gray-600">Retard: <span className="text-red-600 font-semibold">{e.retard}</span> · {e.montant}</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Relancer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}