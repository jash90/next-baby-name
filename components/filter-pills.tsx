'use client';

import { Button } from '@/components/ui/button';
import type { Gender } from '@/lib/types';

interface FilterPillsProps {
  selected: Gender;
  onChange: (gender: Gender) => void;
}

export function FilterPills({ selected, onChange }: FilterPillsProps) {
  const options: { value: Gender; label: string; color: string }[] = [
    { value: 'all', label: 'Wszystkie', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100' },
    { value: 'F', label: 'Damskie', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100' },
    { value: 'M', label: 'Męskie', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(option.value)}
          className={selected === option.value ? option.color : ''}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
