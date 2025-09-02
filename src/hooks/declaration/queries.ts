import { useQuery } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi.js';
import { data } from 'react-router-dom';

// Example types - replace with your actual types
type FetchDeclarationsParams = Record<string, any>;
type DeclarationListResponse = any;
type DeclarationDetailResponse = any;

export const declarationQueryKeys = {
  all: ['documents'] as const,list: (params?: FetchDeclarationsParams) =>
    [...declarationQueryKeys.all, 'list', params ?? {}] as const,
  analysis: (id: string | number) => [...declarationQueryKeys.all, 'analysis', id] as const,
  detail: (id: string | number) => [...declarationQueryKeys.all, 'detail', id] as const,
  // Add more keys as needed for your document features
};
export const useFetchDeclarations = (params?: FetchDeclarationsParams) => {
  const clientApi = useClientApi();
  return useQuery({
    queryKey: declarationQueryKeys.list(params),
    queryFn: () => clientApi.get<DeclarationListResponse>('/declarations', params),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFetchDeclarationDetail = (id: number) => {
  const clientApi = useClientApi();
  return useQuery({
    queryKey: declarationQueryKeys.detail(id),
    queryFn: () => clientApi.get<DeclarationDetailResponse>(`/declarations/${id}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
