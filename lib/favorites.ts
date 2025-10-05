'use client';

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
}

export function addFavorite(id: number): void {
  const favorites = getFavorites();
  if (!favorites.includes(id)) {
    localStorage.setItem('favorites', JSON.stringify([...favorites, id]));
  }
}

export function removeFavorite(id: number): void {
  const favorites = getFavorites();
  localStorage.setItem(
    'favorites',
    JSON.stringify(favorites.filter((fav) => fav !== id))
  );
}

export function isFavorite(id: number): boolean {
  return getFavorites().includes(id);
}
