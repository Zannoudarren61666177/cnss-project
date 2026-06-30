export type RoleId =
  | 'immatriculation'
  | 'cotisation'
  | 'prestations'
  | 'support'
  | 'admin';

export interface Role {
  id: RoleId;
  label: string;
  color: string;
  badge: string;
}

export const ROLES: Role[] = [
  { id: 'immatriculation', label: "Agent d'immatriculation",  color: 'bg-violet-100 text-violet-700', badge: 'Immatriculation' },
  { id: 'cotisation',      label: 'Agent de cotisation',      color: 'bg-teal-100 text-teal-700',     badge: 'Cotisation'      },
  { id: 'prestations',     label: 'Agent de prestations',     color: 'bg-pink-100 text-pink-700',     badge: 'Prestations'     },
  { id: 'support',         label: 'Agent contenu / support',  color: 'bg-orange-100 text-orange-700', badge: 'Support'         },
  { id: 'admin',           label: 'Administrateur',           color: 'bg-red-100 text-red-700',       badge: 'Admin'           },
];
