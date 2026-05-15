import { SearchIcon } from './Icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex items-center gap-3 rounded-[22px] border border-line bg-surface px-4 py-3 shadow-soft">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accentSoft text-accentDeep">
        <SearchIcon className="h-4 w-4" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по блюдам, напиткам и ингредиентам"
        className="w-full border-none bg-transparent text-sm text-ink outline-none placeholder:text-brand-500"
      />
    </label>
  );
}
