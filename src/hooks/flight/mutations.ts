// src/hooks/flight/mutations.ts

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAlert } from '@provider/AlertProvider';
import { useClientApi } from '@api/resourceApi';
import { ApiEndpoints } from '@api/endpoints';
import { 
  addFlight, 
  updateFlight, 
  deleteFlight, 
  addWorkOrderSubmission,
  setFlights 
} from '@store/flightReducer';
import type { 
  Flight, 
  FlightFormData,
  WorkOrderParseResponse,
  WorkOrderSubmissionResponse,
  FlightListResponse 
} from '@type/flight.types';

export const useCreateFlight = (options?: UseMutationOptions<Flight, Error, FlightFormData>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<Flight, Error, FlightFormData>({
    mutationFn: async (flightData: FlightFormData) => {
      const response = await api.post<{ data: Flight }>(ApiEndpoints.flights.createFlight(), flightData);
      return response.data;
    },
    onSuccess: (newFlight) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      dispatch(addFlight(newFlight));
      showAlert({ type: 'success', message: 'Flight created successfully!' });
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to create flight' });
    },
    ...options,
  });
};

export const useUpdateFlight = (options?: UseMutationOptions<Flight, Error, { id: string; data: Partial<FlightFormData> }>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<Flight, Error, { id: string; data: Partial<FlightFormData> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<{ data: Flight }>(ApiEndpoints.flights.updateFlight(id), data);
      return response.data;
    },
    onSuccess: (updatedFlight) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      dispatch(updateFlight(updatedFlight));
      showAlert({ type: 'success', message: 'Flight updated successfully!' });
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to update flight' });
    },
    ...options,
  });
};

export const useDeleteFlight = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(ApiEndpoints.flights.deleteFlight(id));
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      dispatch(deleteFlight(deletedId));
      showAlert({ type: 'success', message: 'Flight deleted successfully!' });
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to delete flight' });
    },
    ...options,
  });
};

export const useParseWorkOrder = (options?: UseMutationOptions<WorkOrderParseResponse, Error, string>) => {
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<WorkOrderParseResponse, Error, string>({
    mutationFn: async (command: string) => {
      const response = await api.post<WorkOrderParseResponse>(ApiEndpoints.workOrders.parseCommand(), { command });
      return response;
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to parse command' });
    },
    ...options,
  });
};

export const useSubmitWorkOrder = (options?: UseMutationOptions<WorkOrderSubmissionResponse, Error, { flightId: string; command: string }>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<WorkOrderSubmissionResponse, Error, { flightId: string; command: string }>({
    mutationFn: async ({ flightId, command }) => {
      const response = await api.post<WorkOrderSubmissionResponse>(ApiEndpoints.workOrders.submitWorkOrder(), { flightId, command });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['workOrderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['workOrdersByFlight'] });
      if (response.data) {
        dispatch(addWorkOrderSubmission(response.data));
      }
      showAlert({ type: 'success', message: 'Work order submitted successfully!' });
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to submit work order' });
    },
    ...options,
  });
};

export const useImportFlights = (options?: UseMutationOptions<FlightListResponse, Error, File>) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const api = useClientApi();

  return useMutation<FlightListResponse, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<FlightListResponse>(ApiEndpoints.flights.importFlights(), formData);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      if (response.data) {
        dispatch(setFlights(response.data));
      }
      showAlert({ type: 'success', message: 'Flights imported successfully!' });
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error.message || 'Failed to import flights' });
    },
    ...options,
  });
};