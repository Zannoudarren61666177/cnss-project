export type BadgeVariant = 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'violet';

const badgeClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-500',
  violet: 'bg-violet-100 text-violet-700',
};

export function Badge({ label, variant = 'gray' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClasses[variant]}`}>
      {label}
    </span>
  );
}