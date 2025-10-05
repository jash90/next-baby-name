'use client';

import { Baby, Heart, Search, Star, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="min-h-full px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
              <Image
                src="/icons/icon-192x192.png"
                alt="Brajanusz Logo"
                width={192}
                height={192}
                className='rounded-md'
              />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-foreground">
              Witaj w Brajanusz!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Twój osobisty przewodnik po świecie pięknych imion dla dzieci
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Tysiące imion"
              description="Przeglądaj obszerną kolekcję imion z całego świata"
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="Zapisz ulubione"
              description="Twórz własną listę ulubionych imion"
              variant="rose"
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Znaczenia i pochodzenie"
              description="Poznaj historię i znaczenie każdego imienia"
              variant="purple"
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Trendy popularności"
              description="Zobacz, które imiona są obecnie popularne"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Udostępniaj z rodziną"
              description="Dziel się swoimi wyborami z bliskimi"
              variant="blue"
            />
            <FeatureCard
              icon={<Baby className="h-6 w-6" />}
              title="Filtry płci"
              description="Łatwo znajdź imiona dla chłopców lub dziewczynek"
              variant="purple"
            />
          </div>

          {/* Description */}
          <Card className="mt-12 p-6">
            <h2 className="text-xl font-semibold text-foreground">
              Dlaczego Brajanusz?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Wybór imienia dla dziecka to jedna z najważniejszych decyzji w życiu
              rodzica. Brajanusz pomaga Ci w tej wyjątkowej podróży, oferując
              intuicyjne narzędzia do odkrywania, zapisywania i porównywania imion.
            </p>
            <p className="mt-3 text-muted-foreground">
              Nasza aplikacja została zaprojektowana z myślą o prostocie i elegancji,
              abyś mógł skupić się na tym, co najważniejsze - znalezieniu idealnego
              imienia dla Twojego dziecka.
            </p>
          </Card>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Button
              onClick={onComplete}
              size="lg"
              className="h-14 px-8 text-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Rozpocznij odkrywanie
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Naciśnij, aby rozpocząć przeglądanie imion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'blue' | 'rose' | 'purple';
}) {
  const getIconColors = () => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100';
      case 'rose':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100';
      case 'purple':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="flex items-start space-x-4 p-4 transition-shadow hover:shadow-lg">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getIconColors()}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}