'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNameById } from '@/lib/api';
import { getFavorites, removeFavorite } from '@/lib/favorites';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Name } from '@/lib/types';

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'recent'>('recent');

  useEffect(() => {
    setFavoriteIds(getFavorites());
  }, []);

  const favoriteQueries = useQuery({
    queryKey: ['favorites', favoriteIds],
    queryFn: async () => {
      const names = await Promise.all(
        favoriteIds.map((id) => getNameById(id).catch(() => null))
      );
      return names.filter((name): name is Name => name !== null);
    },
    enabled: favoriteIds.length > 0,
  });

  const handleRemove = (id: number) => {
    removeFavorite(id);
    setFavoriteIds(getFavorites());
    toast.success('Usunięto z ulubionych');
  };

  const sortedNames = favoriteQueries.data
    ? [...favoriteQueries.data].sort((a, b) => {
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        return favoriteIds.indexOf(b.id) - favoriteIds.indexOf(a.id);
      })
    : [];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ulubione</h1>
        <p className="text-muted-foreground">
          Twoje zapisane imiona
        </p>
      </div>

      {favoriteIds.length > 0 && (
        <div className="mb-6">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'alphabetical' | 'recent')}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Ostatnio dodane</SelectItem>
              <SelectItem value="alphabetical">Alfabetycznie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {favoriteIds.length === 0 && (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="Brak ulubionych"
          description="Zacznij przeglądać imiona i dodaj ulubione, klikając ikonę serca."
          action={
            <Link href="/">
              <Button>Odkryj Imiona</Button>
            </Link>
          }
        />
      )}

      {favoriteQueries.isLoading && favoriteIds.length > 0 && (
        <div className="space-y-3">
          {Array.from({ length: favoriteIds.length }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-full" />
            </Card>
          ))}
        </div>
      )}

      {favoriteQueries.isError && (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="Błąd ładowania ulubionych"
          description="Nie udało się załadować ulubionych imion. Spróbuj ponownie później."
        />
      )}

      {!favoriteQueries.isLoading && sortedNames.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {sortedNames.map((name) => (
            <Card key={name.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Link href={`/name/${name.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{name.name}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        name.gender === 'F'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                      }
                    >
                      {name.gender === 'F' ? 'Damskie' : 'Męskie'}
                    </Badge>
                  </div>
                  {name.meaning && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {name.meaning}
                    </p>
                  )}
                  {name.origin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Pochodzenie: {name.origin}
                    </p>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(name.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
