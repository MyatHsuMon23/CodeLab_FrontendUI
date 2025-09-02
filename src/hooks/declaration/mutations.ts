import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi.js';
import { declarationQueryKeys } from './queries.js';
import { ApiEndpoints } from '@api/endpoints.js';

// Example types - replace with your actual types
type DeclarationCreatePayload = any;
type DeclarationUpdatePayload = any;

export const useCreateDeclaration = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  return useMutation({
    mutationFn: (payload: DeclarationCreatePayload) =>
      clientApi.post('/declarations', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: declarationQueryKeys.list() });
    },
  });
};

export const useUpdateDeclaration = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DeclarationUpdatePayload }) =>
      clientApi.put(ApiEndpoints.FTACheck.postUploadFiles(id), payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: declarationQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: declarationQueryKeys.list() });
    },
  });
};

export const useDeleteDeclaration = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  return useMutation({
    mutationFn: (id: number) => clientApi.delete(`/declarations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: declarationQueryKeys.list() });
    },
  });
};
