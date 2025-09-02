// src/hooks/flight/mutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '@provider/AlertProvider';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import { flightQueryKeys } from './queries';
import { ApiError } from '@type/api.types';
import type { 
  Flight, 
  FlightFormData,
  WorkOrderParseResponse,
  WorkOrderSubmissionResponse,
  FlightListResponse,
  FlightDeleteResponse
} from '@type/flight.types';

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    FlightListResponse,
    ApiError,
    FlightFormData
  >({
    mutationFn: (flightData: FlightFormData) =>
      clientApi.post(ApiEndpoints.flights.createFlight(), flightData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      showAlert({ type: 'success', message: data?.message || 'Flight created successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to create flight' });
    },
  });
};

export const useUpdateFlight = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    FlightListResponse,
    ApiError,
    { id: string; data: Partial<FlightFormData> }
  >({
    mutationFn: ({ id, data }) =>
      clientApi.put(ApiEndpoints.flights.updateFlight(id), data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.all });
      showAlert({ type: 'success', message: data?.message || 'Flight updated successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to update flight' });
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    FlightDeleteResponse,
    ApiError,
    string
  >({
    mutationFn: (id: string) =>
      clientApi.delete(ApiEndpoints.flights.deleteFlight(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.all });
      showAlert({ type: 'success', message: data?.message || 'Flight deleted successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to delete flight' });
    },
  });
};

export const useParseWorkOrder = () => {
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    WorkOrderParseResponse,
    ApiError,
    string
  >({
    mutationFn: (command: string) =>
      clientApi.post(ApiEndpoints.workOrders.parseCommand(), { command }),
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to parse command' });
    },
  });
};

export const useSubmitWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    WorkOrderSubmissionResponse,
    ApiError,
    { flightId: string; command: string }
  >({
    mutationFn: ({ flightId, command }) =>
      clientApi.post(ApiEndpoints.workOrders.submitWorkOrder(), { flightId, command }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.history() });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message || 'Work order submitted successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to submit work order' });
    },
  });
};

export const useImportFlightsCSV = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    FlightListResponse,
    ApiError,
    File
  >({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return clientApi.post(ApiEndpoints.flights.importFlightsCSV(), formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      showAlert({ type: 'success', message: data?.message || 'Flights imported successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to import flights' });
    },
  });
};

export const useImportFlights = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    FlightListResponse,
    ApiError,
    any // Accepts parsed JSON data
  >({
    mutationFn: (jsonData: any) => {
      // Send JSON data directly
      return clientApi.post(ApiEndpoints.flights.importFlights(), jsonData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      showAlert({ type: 'success', message: data?.message || 'Flights imported successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to import flights' });
    },
  });
};