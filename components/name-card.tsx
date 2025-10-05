import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Name } from '@/lib/types';

interface NameCardProps {
  name: Name;
}

export function NameCard({ name }: NameCardProps) {
  const displayText = name.briefSummary || name.meaning || name.origin;

  return (
    <Link href={`/name/${name.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{name.name}</h3>
            {displayText && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {displayText}
              </p>
            )}
            {name.origin && (
              <p className="text-xs text-muted-foreground mt-1">
                Pochodzenie: {name.origin}
              </p>
            )}
          </div>
          {name.gender && (
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
          )}
        </div>
      </Card>
    </Link>
  );
}
