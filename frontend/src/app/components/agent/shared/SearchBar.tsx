import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}