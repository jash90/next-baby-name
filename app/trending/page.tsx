'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingNames } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import Link from 'next/link';
import type { Gender } from '@/lib/types';

export default function TrendingPage() {
  const [compareYears, setCompareYears] = useState<number>(5);
  const [gender, setGender] = useState<Gender>('all');

  const { data: trendingNames = [], isLoading, isError } = useQuery({
    queryKey: ['trending', compareYears, gender],
    queryFn: () =>
      getTrendingNames(
        compareYears,
        gender === 'all' ? undefined : gender,
        50
      ),
  });

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Popularne Imiona</h1>
        <p className="text-muted-foreground">
          Imiona zyskujące na popularności
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <Select
          value={compareYears.toString()}
          onValueChange={(v) => setCompareYears(parseInt(v))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Ostatnie 3 lata</SelectItem>
            <SelectItem value="5">Ostatnie 5 lat</SelectItem>
            <SelectItem value="10">Ostatnie 10 lat</SelectItem>
          </SelectContent>
        </Select>

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
          icon={<TrendingUp className="w-16 h-16" />}
          title="Coś poszło nie tak"
          description="Nie udało się załadować popularnych imion. Spróbuj ponownie później."
        />
      )}

      {!isLoading && !isError && trendingNames.length === 0 && (
        <EmptyState
          icon={<TrendingUp className="w-16 h-16" />}
          title="Brak danych o popularności"
          description="Brak danych o popularnych imionach dla wybranych filtrów."
        />
      )}

      {!isLoading && !isError && trendingNames.length > 0 && (
        <div className="space-y-3">
          {trendingNames.map((name, index) => {
            const growth = typeof name.growth === 'number' ? name.growth : Number(name.growth) || 0;
            const isHighGrowth = growth > 50;
            const isUp = growth > 0;
            return (
              <Link key={index} href={`/name/${name.id}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isUp ? (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900">
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900">
                          <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{name.name}</h3>
                        {name.gender && (
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
                        )}
                        {isHighGrowth && (
                          <Badge variant="destructive" className="gap-1">
                            <Flame className="w-3 h-3" />
                            Gorące
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Wzrost</span>
                          <span
                            className={`font-semibold ${
                              isUp
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {isUp ? '+' : ''}
                            {growth.toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {compareYears} {compareYears === 1 ? 'rok' : compareYears < 5 ? 'lata' : 'lat'} temu
                          </span>
                          <span className="text-muted-foreground">
                            {name.older_count.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Obecnie</span>
                          <span className="font-semibold">
                            {name.recent_count.toLocaleString()}
                          </span>
                        </div>
                      </div>
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
