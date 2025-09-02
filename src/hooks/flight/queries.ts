// src/hooks/flight/queries.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { mockApi } from '@util/mockApi';
import type { 
  FlightListResponse, 
  WorkOrderHistoryResponse, 
  WorkOrderSubmission 
} from '@type/flight.types';

export const useFlightList = (options?: UseQueryOptions<FlightListResponse>) => {
  return useQuery<FlightListResponse>({
    queryKey: ['flights'],
    queryFn: async () => {
      const response = await mockApi.getFlights();
      return response;
    },
    ...options,
  });
};

export const useWorkOrderHistory = (options?: UseQueryOptions<WorkOrderHistoryResponse>) => {
  return useQuery<WorkOrderHistoryResponse>({
    queryKey: ['workOrderHistory'],
    queryFn: async () => {
      const response = await mockApi.getWorkOrderHistory();
      return response;
    },
    ...options,
  });
};

export const useWorkOrdersByFlight = (
  flightId: string,
  options?: UseQueryOptions<WorkOrderHistoryResponse>
) => {
  return useQuery<WorkOrderHistoryResponse>({
    queryKey: ['workOrdersByFlight', flightId],
    queryFn: async () => {
      const response = await mockApi.getWorkOrdersByFlight(flightId);
      return response;
    },
    enabled: !!flightId,
    ...options,
  });
};