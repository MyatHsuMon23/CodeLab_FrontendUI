// src/hooks/flight/queries.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import type { 
  FlightListResponse, 
  WorkOrderHistoryResponse, 
  WorkOrderSubmission 
} from '@type/flight.types';

export const useFlightList = (options?: UseQueryOptions<FlightListResponse>) => {
  const api = useClientApi();
  
  return useQuery<FlightListResponse>({
    queryKey: ['flights'],
    queryFn: async () => {
      const response = await api.get<FlightListResponse>(ApiEndpoints.flights.getFlights());
      return response;
    },
    ...options,
  });
};

export const useWorkOrderHistory = (options?: UseQueryOptions<WorkOrderHistoryResponse>) => {
  const api = useClientApi();
  
  return useQuery<WorkOrderHistoryResponse>({
    queryKey: ['workOrderHistory'],
    queryFn: async () => {
      const response = await api.get<WorkOrderHistoryResponse>(ApiEndpoints.workOrders.getWorkOrderHistory());
      return response;
    },
    ...options,
  });
};

export const useWorkOrdersByFlight = (
  flightId: string,
  options?: UseQueryOptions<WorkOrderHistoryResponse>
) => {
  const api = useClientApi();
  
  return useQuery<WorkOrderHistoryResponse>({
    queryKey: ['workOrdersByFlight', flightId],
    queryFn: async () => {
      const response = await api.get<WorkOrderHistoryResponse>(ApiEndpoints.workOrders.getWorkOrdersByFlight(flightId));
      return response;
    },
    enabled: !!flightId,
    ...options,
  });
};