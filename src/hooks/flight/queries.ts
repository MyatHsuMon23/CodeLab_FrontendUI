// src/hooks/flight/queries.ts

import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import { ApiError } from '@type/api.types';
import { useQueryErrorHandler } from '../useQueryErrorHandler';
import type { 
  FlightListResponse, 
  WorkOrderHistoryResponse,
  Flight,
  WorkOrderListResponse,
  WorkOrderStatisticsResponse,
  WorkOrderFilters,
  WorkOrderPaginationParams,
  FlightDetailWithWorkOrders,
  FlightWorkOrdersResponse
} from '@type/flight.types';
import type { ApiResponse } from '@type/api.types';

// Query key factory similar to fta-check-analysis pattern
export const flightQueryKeys = {
  all: ['flights'] as const,
  list: () => [...flightQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...flightQueryKeys.all, 'detail', id] as const,
  workOrders: {
    all: ['workOrders'] as const,
    history: () => [...flightQueryKeys.workOrders.all, 'history'] as const,
    byFlight: (flightId: string) => [...flightQueryKeys.workOrders.all, 'byFlight', flightId] as const,
    list: (filters: WorkOrderFilters, pagination: WorkOrderPaginationParams) => [
      ...flightQueryKeys.workOrders.all, 
      'list', 
      filters, 
      pagination
    ] as const,
    statistics: () => [...flightQueryKeys.workOrders.all, 'statistics'] as const,
  },
};

export const useFlightList = (
  filters: any = {},
  pagination: { page: number; perPage: number } = { page: 1, perPage: 10 },
  options?: UseQueryOptions<FlightListResponse, ApiError>
) => {
  const clientApi = useClientApi();
  const queryKey = [
    ...flightQueryKeys.list(),
    filters,
    pagination
  ];
  const query = useQuery<FlightListResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        perPage: pagination.perPage.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });
      return clientApi.get<FlightListResponse>(`${ApiEndpoints.flights.getFlights()}?${params}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    placeholderData: keepPreviousData,
    ...options,
  });
  useQueryErrorHandler(query.isError, query.error, [...queryKey]);
  return query;
};

export const useFlightDetail = (
  flightId: string,
  options?: UseQueryOptions<ApiResponse<FlightDetailWithWorkOrders>, ApiError, FlightDetailWithWorkOrders>
) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.detail(flightId);

  const query = useQuery<ApiResponse<FlightDetailWithWorkOrders>, ApiError, FlightDetailWithWorkOrders>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<ApiResponse<FlightDetailWithWorkOrders>>(ApiEndpoints.flights.getFlight(flightId)),
    select: (response) => response.data,
    enabled: !!flightId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

export const useWorkOrderHistory = (options?: UseQueryOptions<WorkOrderHistoryResponse, ApiError>) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.workOrders.history();
  
  const query = useQuery<WorkOrderHistoryResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<WorkOrderHistoryResponse>(ApiEndpoints.workOrders.getWorkOrderHistory()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    placeholderData: keepPreviousData,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

export const useFlightWorkOrders = (
  flightId: string,
  options?: UseQueryOptions<FlightWorkOrdersResponse, ApiError>
) => {
  const clientApi = useClientApi();
  const queryKey = [...flightQueryKeys.detail(flightId), 'workOrders'];
  
  const query = useQuery<FlightWorkOrdersResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<FlightWorkOrdersResponse>(ApiEndpoints.flights.getFlightWorkOrders(flightId)),
    enabled: !!flightId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

export const useWorkOrdersByFlight = (
  flightId: string,
  options?: UseQueryOptions<WorkOrderHistoryResponse, ApiError>
) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.workOrders.byFlight(flightId);
  
  const query = useQuery<WorkOrderHistoryResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<WorkOrderHistoryResponse>(ApiEndpoints.workOrders.getWorkOrdersByFlight(flightId)),
    enabled: !!flightId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

// New Work Orders queries
export const useWorkOrderList = (
  filters: WorkOrderFilters = {},
  pagination: WorkOrderPaginationParams = { page: 1, perPage: 10 },
  options?: UseQueryOptions<WorkOrderListResponse, ApiError>
) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.workOrders.list(filters, pagination);
  
  const query = useQuery<WorkOrderListResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        perPage: pagination.perPage.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });
      return clientApi.get<WorkOrderListResponse>(`${ApiEndpoints.workOrders.getWorkOrders()}?${params}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    placeholderData: keepPreviousData,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

export const useWorkOrderStatistics = (options?: UseQueryOptions<WorkOrderStatisticsResponse, ApiError>) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.workOrders.statistics();
  
  const query = useQuery<WorkOrderStatisticsResponse, ApiError>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<WorkOrderStatisticsResponse>(ApiEndpoints.workOrders.getWorkOrderStatistics()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });

  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};