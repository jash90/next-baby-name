export interface Name {
  id: number;
  name: string;
  gender: 'F' | 'M' | null;
  briefSummary?: string | null;
  origin?: string | null;
  originalForm?: string | null;
  meaning?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  etymology?: any;
  evolution?: any[];
  cultural?: any;
  patronSaints?: any[];
  linguistic?: any;
  diminutives?: any;
  translations?: Record<string, string>;
  statistics?: any;
  yearlyStatistics?: any[];
  psychology?: any;
  numerology?: any;
  historical?: any;
  famousBearers?: any[];
  popCulture?: any;
  social?: any;
  practical?: any;
  sound?: any;
  emotional?: any;
  summary?: any;
}

export interface NameListResponse {
  list: Name[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export interface PopularName {
  nameId: number;
  name: string;
  gender: 'F' | 'M' | null;
  count: number;
  year: number;
  rank?: number;
  percentage?: number;
}

export interface TrendingName {
  id: number;
  name: string;
  gender: 'F' | 'M' | null;
  recent_count: number;
  older_count: number;
  growth: number;
}

export interface StatisticsSummary {
  totalNames: number;
  breakdown: {
    female: number;
    male: number;
    unisex: number;
  };
  yearlyStatistics: {
    totalRecords: number;
    yearRange: {
      from: number;
      to: number;
    } | null;
  };
}

export type Gender = 'F' | 'M' | 'all';

export interface SearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  gender?: 'F' | 'M';
}
