'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchNames } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { NameCard } from '@/components/name-card';
import { FilterPills } from '@/components/filter-pills';
import { NameListSkeleton } from '@/components/loading-skeleton';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import type { Gender } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [gender, setGender] = useState<Gender>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim() && !recentSearches.includes(query.trim())) {
        const updated = [query.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, gender],
    queryFn: () =>
      searchNames(
        debouncedQuery,
        50,
        gender === 'all' ? undefined : gender
      ),
    enabled: debouncedQuery.length > 0,
  });

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Wyszukaj Imiona</h1>
        <p className="text-muted-foreground">
          Znajdź idealne imię dla dziecka
        </p>
      </div>

      <div className="sticky top-0 bg-background pb-4 z-10 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Wyszukaj imiona..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <FilterPills selected={gender} onChange={setGender} />
      </div>

      {!query && recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Ostatnie wyszukiwania
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentSearches}
            >
              Wyczyść
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setQuery(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isLoading && <NameListSkeleton count={3} />}

      {!isLoading && debouncedQuery && results.length === 0 && (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="Nie znaleziono wyników"
          description={`Brak imion pasujących do "${debouncedQuery}". Spróbuj innego hasła.`}
        />
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((name) => (
            <NameCard key={name.id} name={name} />
          ))}
        </div>
      )}

      {!query && recentSearches.length === 0 && (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="Rozpocznij wyszukiwanie"
          description="Wpisz imię w polu wyszukiwania powyżej, aby rozpocząć."
        />
      )}
    </div>
  );
}
