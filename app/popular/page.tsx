'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularNames } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { Gender } from '@/lib/types';

export default function PopularPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [gender, setGender] = useState<Gender>('all');
  const [limit, setLimit] = useState<number>(20);

  const { data: popularNames = [], isLoading, isError } = useQuery({
    queryKey: ['popular', year, gender, limit],
    queryFn: () =>
      getPopularNames(
        year,
        gender === 'all' ? undefined : gender,
        limit
      ),
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100';
    if (rank === 2) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    if (rank === 3) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100';
    return 'bg-muted text-muted-foreground';
  };

  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Najpopularniejsze Imiona</h1>
        <p className="text-muted-foreground">
          Najbardziej popularne imiona dla dzieci według roku
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
              <SelectItem value="50">Top 50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={gender} onValueChange={(v) => setGender(v as Gender)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="F">Damskie</TabsTrigger>
            <TabsTrigger value="M">Męskie</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-full" />
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<Award className="w-16 h-16" />}
          title="Coś poszło nie tak"
          description="Nie udało się załadować popularnych imion. Spróbuj ponownie później."
        />
      )}

      {!isLoading && !isError && popularNames.length === 0 && (
        <EmptyState
          icon={<Trophy className="w-16 h-16" />}
          title="Brak dostępnych danych"
          description="Brak danych o popularnych imionach dla wybranych filtrów."
        />
      )}

      {!isLoading && !isError && popularNames.length > 0 && (
        <div className="space-y-3">
          {popularNames.map((name, index) => {
            const rank = index + 1;
            return (
              <Link key={index} href={`/name/${name.nameId}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Badge className={`${getRankColor(rank)} text-lg font-bold min-w-[60px] justify-center`}>
                      {getRankBadge(rank)}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{name.name}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            name.gender === 'F'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                          }
                        >
                          {name.gender === 'F' ? 'F' : 'M'}
                        </Badge>
                      </div>
                      {name.count && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                name.gender === 'F' ? 'bg-rose-500' : 'bg-blue-500'
                              }`}
                              style={{
                                width: `${name.percentage || (rank <= 3 ? 100 - rank * 20 : 40)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                            {name.count.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
