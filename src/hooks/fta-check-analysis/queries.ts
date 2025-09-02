import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi.js';
import { FTACheckListResponse, FTACheckListResponseData, FTACheckParams } from '@type/fta.types.js';
import { ApiEndpoints } from '@api/endpoints.js';
import { ApiError } from '@type/api.types.js';
import { useQueryErrorHandler } from '../useQueryErrorHandler.js';

export const ftaCheckQueryKeys = {
    all: ['ftaCheck'] as const,
    list: (params?: FTACheckParams) =>
        [...ftaCheckQueryKeys.all, 'list', params ?? {}] as const,
    analyze: (id: string | number) => [...ftaCheckQueryKeys.all, 'analyze', id] as const,
    uploadFiles: (id: string | number) => [...ftaCheckQueryKeys.all, 'uploadFiles', id] as const,
    create: (data: any) => [...ftaCheckQueryKeys.all, 'create', data] as const,
    detail: (id: string | number) => [...ftaCheckQueryKeys.all, 'detail', id] as const,
    delete: (id: string | number) => [...ftaCheckQueryKeys.all, 'delete', id] as const,
    results: (id: string | number) => [...ftaCheckQueryKeys.all, 'results', id] as const,
    status: (id: string | number) => [...ftaCheckQueryKeys.all, 'status', id] as const
};

export const useFetchFTACheckLists = (params?: FTACheckParams) => {
    const clientApi = useClientApi();
    const queryKey = ftaCheckQueryKeys.list(params);

    const query = useQuery<
        FTACheckListResponse,
        ApiError,
        FTACheckListResponseData
    >({
        queryKey: queryKey,
        queryFn: () => clientApi.get<FTACheckListResponse>(ApiEndpoints.FTACheck.getFTACheckList(), params),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        placeholderData: keepPreviousData,
    });

    // Error handling (similar to useFetchDeclarations)
    useQueryErrorHandler(query.isError, query.error, [...queryKey]);

    return query;
};