// src/hooks/flight/queries.ts

import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import { ApiError } from '@type/api.types';
import { useQueryErrorHandler } from '../useQueryErrorHandler';
import type { 
  FlightListResponse, 
  WorkOrderHistoryResponse,
  Flight
} from '@type/flight.types';

// Query key factory similar to fta-check-analysis pattern
export const flightQueryKeys = {
  all: ['flights'] as const,
  list: () => [...flightQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...flightQueryKeys.all, 'detail', id] as const,
  workOrders: {
    all: ['workOrders'] as const,
    history: () => [...flightQueryKeys.workOrders.all, 'history'] as const,
    byFlight: (flightId: string) => [...flightQueryKeys.workOrders.all, 'byFlight', flightId] as const,
  },
};

export const useFlightList = (options?: UseQueryOptions<FlightListResponse, ApiError, Flight[]>) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.list();
  
  const query = useQuery<FlightListResponse, ApiError, Flight[]>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<FlightListResponse>(ApiEndpoints.flights.getFlights()),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    placeholderData: keepPreviousData,
    ...options,
  });

  // Error handling similar to fta-check-analysis
  useQueryErrorHandler(query.isError, query.error, [...queryKey]);

  return query;
};

export const useFlightDetail = (
  flightId: string,
  options?: UseQueryOptions<{ data: Flight }, ApiError, Flight>
) => {
  const clientApi = useClientApi();
  const queryKey = flightQueryKeys.detail(flightId);
  
  const query = useQuery<{ data: Flight }, ApiError, Flight>({
    queryKey: queryKey,
    queryFn: () => clientApi.get<{ data: Flight }>(ApiEndpoints.flights.getFlight(flightId)),
    select: (data) => data.data,
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