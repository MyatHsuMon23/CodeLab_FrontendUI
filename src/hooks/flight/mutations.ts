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
  FlightCommandResponse,
  FlightCommandPayload,
  FlightListResponse,
  FlightDeleteResponse,
  WorkOrderCreateData,
  WorkOrderUpdateData,
  WorkOrderResponse
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
    FlightCommandResponse,
    ApiError,
    { flightId: string; command: string; notes?: string }
  >({
    mutationFn: ({ flightId, command, notes }) => {
      const payload: FlightCommandPayload = {
        flightId: parseInt(flightId),
        commandString: command,
        notes: notes || ''
      };
      return clientApi.post(ApiEndpoints.flights.createCommand(flightId), payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.history() });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message || 'Work order command submitted successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to submit work order command' });
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

// New Work Order mutations
export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    WorkOrderResponse,
    ApiError,
    WorkOrderCreateData
  >({
    mutationFn: (workOrderData: WorkOrderCreateData) =>
      clientApi.post(ApiEndpoints.workOrders.createWorkOrder(), workOrderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message || 'Work order created successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to create work order' });
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    WorkOrderResponse,
    ApiError,
    WorkOrderUpdateData
  >({
    mutationFn: (workOrderData: WorkOrderUpdateData) =>
      clientApi.put(ApiEndpoints.workOrders.updateWorkOrder(workOrderData.id), workOrderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message || 'Work order updated successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to update work order' });
    },
  });
};

export const useDeleteWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    { success: boolean; message?: string },
    ApiError,
    number
  >({
    mutationFn: (id: number) =>
      clientApi.delete(ApiEndpoints.workOrders.deleteWorkOrder(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message || 'Work order deleted successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to delete work order' });
    },
  });
};

// Flight-specific work order assignment
export const useAssignWorkOrderToFlight = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation<
    WorkOrderResponse,
    ApiError,
    { flightId: string; workOrderData: WorkOrderCreateData }
  >({
    mutationFn: ({ flightId, workOrderData }) =>
      clientApi.post(ApiEndpoints.flights.createWorkOrder(flightId), workOrderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.detail(data.data.id.toString()) });
      showAlert({ type: 'success', message: data?.message || 'Work order assigned to flight successfully!' });
    },
    onError: (error: ApiError) => {
      showAlert({ type: 'error', message: error?.message || 'Failed to assign work order to flight' });
    },
  });
};