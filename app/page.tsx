'use client';

import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getNames } from '@/lib/api';
import { NameCard } from '@/components/name-card';
import { FilterPills } from '@/components/filter-pills';
import { NameListSkeleton } from '@/components/loading-skeleton';
import { EmptyState } from '@/components/empty-state';
import { Baby } from 'lucide-react';
import type { Gender } from '@/lib/types';

export default function HomePage() {
  const [gender, setGender] = useState<Gender>('all');
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['names', gender],
    queryFn: ({ pageParam = 1 }) =>
      getNames({
        page: pageParam,
        pageSize: 20,
        gender: gender === 'all' ? undefined : gender,
      }),
    getNextPageParam: (lastPage) => {
      const { page, isLastPage } = lastPage.pageInfo;
      return !isLastPage ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allNames = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Odkryj Imiona</h1>
        <p className="text-muted-foreground">
          Przeglądaj piękne imiona dla dzieci i ich znaczenia
        </p>
      </div>

      <div className="mb-6">
        <FilterPills selected={gender} onChange={setGender} />
      </div>

      {isLoading && <NameListSkeleton />}

      {isError && (
        <EmptyState
          icon={<Baby className="w-16 h-16" />}
          title="Coś poszło nie tak"
          description="Nie udało się załadować imion. Spróbuj ponownie później."
        />
      )}

      {!isLoading && !isError && allNames.length === 0 && (
        <EmptyState
          icon={<Baby className="w-16 h-16" />}
          title="Nie znaleziono imion"
          description="Spróbuj dostosować filtry, aby zobaczyć więcej wyników."
        />
      )}

      {!isLoading && !isError && allNames.length > 0 && (
        <div className="space-y-4">
          {allNames.map((name) => (
            <NameCard key={name.id} name={name} />
          ))}
        </div>
      )}

      <div ref={observerTarget} className="h-4 mt-4">
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
