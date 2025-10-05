'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getNameById } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareButton } from '@/components/share-button';
import { ArrowLeft, Heart } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/favorites';
import { toast } from 'sonner';

export default function NameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [nameId, setNameId] = useState<number | null>(null);
  const [favorite, setFavorite] = useState(false);

  // Unwrap async params
  useState(() => {
    params.then((p) => setNameId(parseInt(p.id)));
  });

  const { data: name, isLoading, isError } = useQuery({
    queryKey: ['name', nameId],
    queryFn: () => getNameById(nameId!),
    enabled: nameId !== null,
  });

  useEffect(() => {
    if (nameId !== null) {
      setFavorite(isFavorite(nameId));
    }
  }, [nameId]);

  const toggleFavorite = () => {
    if (nameId === null) return;

    if (favorite) {
      removeFavorite(nameId);
      setFavorite(false);
      toast.success('Usunięto z ulubionych');
    } else {
      addFavorite(nameId);
      setFavorite(true);
      toast.success('Dodano do ulubionych');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-12 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !name) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wstecz
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nie znaleziono imienia</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayText = name.briefSummary || name.meaning;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wstecz
        </Button>
        <div className="flex gap-2">
          <ShareButton
            title={name.name}
            text={`Sprawdź imię ${name.name}`}
            url={typeof window !== 'undefined' ? window.location.href : ''}
          />
          <Button
            variant={favorite ? 'default' : 'outline'}
            size="icon"
            onClick={toggleFavorite}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">{name.name}</h1>
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
        {displayText && (
          <p className="text-lg text-muted-foreground">{displayText}</p>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Przegląd</TabsTrigger>
          <TabsTrigger value="culture" className="text-xs sm:text-sm px-2 py-2">Kultura</TabsTrigger>
          <TabsTrigger value="personality" className="text-xs sm:text-sm px-2 py-2">Osobowość</TabsTrigger>
          <TabsTrigger value="famous" className="text-xs sm:text-sm px-2 py-2">Sławni</TabsTrigger>
          <TabsTrigger value="practical" className="text-xs sm:text-sm px-2 py-2">Praktyczne</TabsTrigger>
          <TabsTrigger value="social" className="text-xs sm:text-sm px-2 py-2">Społeczne</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {name.etymology && (
            <Card>
              <CardHeader>
                <CardTitle>Etymologia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.etymology.meaning && (
                  <p className="text-sm leading-relaxed">{name.etymology.meaning}</p>
                )}
                {name.etymology.origin && (
                  <div>
                    <p className="text-sm font-medium">Pochodzenie</p>
                    <p className="text-sm text-muted-foreground">{name.etymology.origin}</p>
                  </div>
                )}
                {name.etymology.language && (
                  <div>
                    <p className="text-sm font-medium">Język</p>
                    <p className="text-sm text-muted-foreground">{name.etymology.language}</p>
                  </div>
                )}
                {name.etymology.originalForm && (
                  <div>
                    <p className="text-sm font-medium">Oryginalna forma</p>
                    <p className="text-sm text-muted-foreground">{name.etymology.originalForm}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.linguistic && (
            <Card>
              <CardHeader>
                <CardTitle>Językowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {name.linguistic.syllables && (
                  <div>
                    <p className="text-sm font-medium">Sylaby</p>
                    <p className="text-sm text-muted-foreground">{name.linguistic.syllables}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.diminutives && (name.diminutives.polish?.length > 0 || name.diminutives.international?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Zdrobnienia i warianty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.diminutives.polish?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Polskie</p>
                    <p className="text-sm text-muted-foreground">{name.diminutives.polish.join(', ')}</p>
                  </div>
                )}
                {name.diminutives.international?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Międzynarodowe</p>
                    <p className="text-sm text-muted-foreground">{name.diminutives.international.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="culture" className="space-y-4 mt-4">
          {name.cultural && (name.cultural.nameDayMonth || name.cultural.nameDayDay || name.cultural.traditions || name.cultural.religiousSymbolism) && (
            <Card>
              <CardHeader>
                <CardTitle>Informacje kulturowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.cultural.nameDayMonth && name.cultural.nameDayDay && (
                  <div>
                    <p className="text-sm font-medium">Imieniny</p>
                    <p className="text-sm text-muted-foreground">
                      {name.cultural.nameDayMonth}/{name.cultural.nameDayDay}
                    </p>
                  </div>
                )}
                {name.cultural.traditions && (
                  <div>
                    <p className="text-sm font-medium mb-1">Tradycje</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{name.cultural.traditions}</p>
                  </div>
                )}
                {name.cultural.religiousSymbolism && (
                  <div>
                    <p className="text-sm font-medium mb-1">Symbolika religijna</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{name.cultural.religiousSymbolism}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.patronSaints && name.patronSaints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Święci Patroni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.patronSaints.map((saint: any, idx: number) => (
                  <div key={saint.id || idx} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-medium">
                      {typeof saint === 'string' ? saint : saint.patron || saint.saintName || 'Nieznany patron'}
                    </p>
                    {saint.saintDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Święto: {saint.saintDate}
                      </p>
                    )}
                    {saint.celebrationMonth && saint.celebrationDay && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Święto: {saint.celebrationMonth}/{saint.celebrationDay}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {name.historical && name.historical.medievalPopularity && (
            <Card>
              <CardHeader>
                <CardTitle>Kontekst historyczny</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{name.historical.medievalPopularity}</p>
              </CardContent>
            </Card>
          )}

          {!name.cultural && !name.patronSaints?.length && !name.historical?.medievalPopularity && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Brak dostępnych informacji kulturowych</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="personality" className="space-y-4 mt-4">
          {name.psychology && (
            <Card>
              <CardHeader>
                <CardTitle>Cechy psychologiczne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.psychology.professionalScore && (
                  <div>
                    <p className="text-sm font-medium">Ocena profesjonalizmu</p>
                    <p className="text-sm text-muted-foreground">{name.psychology.professionalScore}/10</p>
                  </div>
                )}
                {name.psychology.intelligentScore && (
                  <div>
                    <p className="text-sm font-medium">Ocena inteligencji</p>
                    <p className="text-sm text-muted-foreground">{name.psychology.intelligentScore}/10</p>
                  </div>
                )}
                {name.psychology.traits?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Cechy</p>
                    <p className="text-sm text-muted-foreground">{name.psychology.traits.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.numerology && (
            <Card>
              <CardHeader>
                <CardTitle>Numerologia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.numerology.numerologicalValue && (
                  <div>
                    <p className="text-sm font-medium">Wartość numerologiczna</p>
                    <p className="text-sm text-muted-foreground">{name.numerology.numerologicalValue}</p>
                  </div>
                )}
                {name.numerology.interpretations?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Interpretacje</p>
                    <p className="text-sm text-muted-foreground">{name.numerology.interpretations.join(', ')}</p>
                  </div>
                )}
                {name.numerology.stones?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Kamienie</p>
                    <p className="text-sm text-muted-foreground">{name.numerology.stones.join(', ')}</p>
                  </div>
                )}
                {name.numerology.colors?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Kolory</p>
                    <p className="text-sm text-muted-foreground">{name.numerology.colors.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.emotional && (
            <Card>
              <CardHeader>
                <CardTitle>Cechy emocjonalne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.emotional.nostalgia && (
                  <div>
                    <p className="text-sm font-medium">Nostalgia</p>
                    <p className="text-sm text-muted-foreground">{name.emotional.nostalgia}/10</p>
                  </div>
                )}
                {name.emotional.modernity && (
                  <div>
                    <p className="text-sm font-medium">Nowoczesność</p>
                    <p className="text-sm text-muted-foreground">{name.emotional.modernity}/10</p>
                  </div>
                )}
                {name.emotional.elegance && (
                  <div>
                    <p className="text-sm font-medium">Elegancja</p>
                    <p className="text-sm text-muted-foreground">{name.emotional.elegance}/10</p>
                  </div>
                )}
                {name.emotional.positiveTraits?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Pozytywne cechy</p>
                    <p className="text-sm text-muted-foreground">{name.emotional.positiveTraits.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="famous" className="space-y-4 mt-4">
          {name.famousBearers && name.famousBearers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Znani nosiciele</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.famousBearers.map((bearer: any, idx: number) => (
                  <div key={idx} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-medium">{bearer.bearerName}</p>
                    {bearer.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{bearer.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {name.popCulture && (name.popCulture.literature?.length > 0 || name.popCulture.filmTv?.length > 0 || name.popCulture.music?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Popkultura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.popCulture.literature?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Literatura</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {name.popCulture.literature.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.popCulture.filmTv?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Film i TV</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {name.popCulture.filmTv.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.popCulture.music?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Muzyka</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {name.popCulture.music.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="practical" className="space-y-4 mt-4">
          {name.practical && (
            <Card>
              <CardHeader>
                <CardTitle>Praktyczne uwagi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.practical.writingEase && (
                  <div>
                    <p className="text-sm font-medium">Łatwość pisania</p>
                    <p className="text-sm text-muted-foreground">{name.practical.writingEase}/10</p>
                  </div>
                )}
                {name.practical.pronunciationEase && (
                  <div>
                    <p className="text-sm font-medium">Łatwość wymowy</p>
                    <p className="text-sm text-muted-foreground">{name.practical.pronunciationEase}/10</p>
                  </div>
                )}
                {name.practical.domainAvailability !== undefined && (
                  <div>
                    <p className="text-sm font-medium">Domena dostępna</p>
                    <p className="text-sm text-muted-foreground">
                      {name.practical.domainAvailability ? 'Tak' : 'Nie'}
                    </p>
                  </div>
                )}
                {name.practical.issues?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Problemy</p>
                    <p className="text-sm text-muted-foreground">{name.practical.issues.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.sound && (
            <Card>
              <CardHeader>
                <CardTitle>Charakterystyka dźwiękowa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.sound.melodiousness && (
                  <div>
                    <p className="text-sm font-medium">Melodyjność</p>
                    <p className="text-sm text-muted-foreground">{name.sound.melodiousness}/10</p>
                  </div>
                )}
                {name.sound.euphonyPolish && (
                  <div>
                    <p className="text-sm font-medium">Polska eufonia</p>
                    <p className="text-sm text-muted-foreground">{name.sound.euphonyPolish}/10</p>
                  </div>
                )}
                {name.sound.euphonyEnglish && (
                  <div>
                    <p className="text-sm font-medium">Angielska eufonia</p>
                    <p className="text-sm text-muted-foreground">{name.sound.euphonyEnglish}/10</p>
                  </div>
                )}
                {name.sound.characteristics?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Charakterystyka</p>
                    <p className="text-sm text-muted-foreground">{name.sound.characteristics.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-4">
          {name.social && (
            <Card>
              <CardHeader>
                <CardTitle>Kontekst społeczny</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {name.social.socialClass && (
                  <div>
                    <p className="text-sm font-medium">Klasa społeczna</p>
                    <p className="text-sm text-muted-foreground">{name.social.socialClass}</p>
                  </div>
                )}
                {name.social.genZPerception && (
                  <div>
                    <p className="text-sm font-medium">Postrzeganie przez Gen Z</p>
                    <p className="text-sm text-muted-foreground">{name.social.genZPerception}</p>
                  </div>
                )}
                {name.social.regionality && (
                  <div>
                    <p className="text-sm font-medium">Regionalność</p>
                    <p className="text-sm text-muted-foreground">{name.social.regionality}</p>
                  </div>
                )}
                {name.social.typicalProfessions?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Typowe zawody</p>
                    <p className="text-sm text-muted-foreground">{name.social.typicalProfessions.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {name.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Podsumowanie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {name.summary.overall && (
                  <p className="text-sm leading-relaxed">{name.summary.overall}</p>
                )}
                {name.summary.recommendation && (
                  <div>
                    <p className="text-sm font-medium mb-2">Rekomendacja</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{name.summary.recommendation}</p>
                  </div>
                )}
                {name.summary.advantages?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-success mb-2">Zalety</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {name.summary.advantages.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {name.summary.challenges?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-warning mb-2">Wyzwania</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {name.summary.challenges.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
