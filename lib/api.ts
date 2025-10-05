import type {
  Name,
  NameListResponse,
  PopularName,
  TrendingName,
  StatisticsSummary,
  SearchParams,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getNames(params: SearchParams = {}): Promise<NameListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.gender) searchParams.append('gender', params.gender);

  const query = searchParams.toString();
  return fetchApi<NameListResponse>(`/api/names${query ? `?${query}` : ''}`);
}

export async function getNameById(id: number): Promise<Name> {
  return fetchApi<Name>(`/api/names/${id}`);
}

export async function searchNames(
  query: string,
  limit?: number,
  gender?: 'F' | 'M'
): Promise<Name[]> {
  const searchParams = new URLSearchParams();

  if (limit) searchParams.append('limit', limit.toString());
  if (gender) searchParams.append('gender', gender);

  const queryString = searchParams.toString();
  return fetchApi<Name[]>(`/api/names/search/${encodeURIComponent(query)}${queryString ? `?${queryString}` : ''}`);
}

export async function getPopularNames(
  year?: number,
  gender?: 'F' | 'M',
  limit?: number
): Promise<PopularName[]> {
  const searchParams = new URLSearchParams();

  if (year) searchParams.append('year', year.toString());
  if (gender) searchParams.append('gender', gender);
  if (limit) searchParams.append('limit', limit.toString());

  const query = searchParams.toString();
  const response = await fetchApi<{ year: number; gender: string; names: PopularName[] }>(
    `/api/names/statistics/popular${query ? `?${query}` : ''}`
  );
  return response.names;
}

export async function getTrendingNames(
  compareYears?: number,
  gender?: 'F' | 'M',
  limit?: number
): Promise<TrendingName[]> {
  const searchParams = new URLSearchParams();

  if (compareYears) searchParams.append('compareYears', compareYears.toString());
  if (gender) searchParams.append('gender', gender);
  if (limit) searchParams.append('limit', limit.toString());

  const query = searchParams.toString();
  const response = await fetchApi<{
    period: { from: number; to: number; compareYears: number };
    gender: string;
    names: TrendingName[]
  }>(`/api/names/statistics/trending${query ? `?${query}` : ''}`);
  return response.names;
}

export async function getStatisticsSummary(): Promise<StatisticsSummary> {
  return fetchApi<StatisticsSummary>('/api/names/statistics/summary');
}
