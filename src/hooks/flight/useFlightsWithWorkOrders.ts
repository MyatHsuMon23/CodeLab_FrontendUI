import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import { FlightsWithWorkOrdersResponse } from '@type/flightWorkOrders.types';
import { ApiError } from '@type/api.types';

export const useFlightsWithWorkOrders = (
  params: { page?: number; perPage?: number; flightNumber?: string; sortBy?: string } = {},
  options?: UseQueryOptions<FlightsWithWorkOrdersResponse, ApiError>
) => {
  const clientApi = useClientApi();
  const queryKey = ['flights-with-work-orders', params];

  const query = useQuery<FlightsWithWorkOrdersResponse, ApiError>({
    queryKey,
    queryFn: () => clientApi.get<FlightsWithWorkOrdersResponse>(
      ApiEndpoints.flights.getFlightWithWorkOrders(),
      params
    ),
    retry: 1,
    ...options,
  });

  return query;
};
