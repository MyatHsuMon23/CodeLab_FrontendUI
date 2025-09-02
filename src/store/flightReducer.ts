// src/store/flightReducer.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Flight, WorkOrderSubmission, FlightFilters, FlightSortOptions } from '@type/flight.types';

interface FlightState {
  flights: Flight[];
  selectedFlight: Flight | null;
  workOrderHistory: WorkOrderSubmission[];
  filters: FlightFilters;
  sortOptions: FlightSortOptions;
  isLoading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  flights: [],
  selectedFlight: null,
  workOrderHistory: [],
  filters: {},
  sortOptions: {
    field: 'scheduledArrivalTimeUtc',
    direction: 'asc'
  },
  isLoading: false,
  error: null,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.flights = action.payload;
      state.error = null;
    },
    addFlight: (state, action: PayloadAction<Flight>) => {
      state.flights.push(action.payload);
    },
    updateFlight: (state, action: PayloadAction<Flight>) => {
      const index = state.flights.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.flights[index] = action.payload;
      }
    },
    deleteFlight: (state, action: PayloadAction<string>) => {
      state.flights = state.flights.filter(f => f.id !== action.payload);
      if (state.selectedFlight?.id === action.payload) {
        state.selectedFlight = null;
      }
    },
    setSelectedFlight: (state, action: PayloadAction<Flight | null>) => {
      state.selectedFlight = action.payload;
    },
    setWorkOrderHistory: (state, action: PayloadAction<WorkOrderSubmission[]>) => {
      state.workOrderHistory = action.payload;
    },
    addWorkOrderSubmission: (state, action: PayloadAction<WorkOrderSubmission>) => {
      state.workOrderHistory.unshift(action.payload); // Add to beginning for latest first
    },
    setFilters: (state, action: PayloadAction<FlightFilters>) => {
      state.filters = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<FlightFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSortOptions: (state, action: PayloadAction<FlightSortOptions>) => {
      state.sortOptions = action.payload;
    },
    clearFlightData: (state) => {
      state.flights = [];
      state.selectedFlight = null;
      state.workOrderHistory = [];
      state.filters = {};
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setFlights,
  addFlight,
  updateFlight,
  deleteFlight,
  setSelectedFlight,
  setWorkOrderHistory,
  addWorkOrderSubmission,
  setFilters,
  updateFilters,
  clearFilters,
  setSortOptions,
  clearFlightData,
} = flightSlice.actions;

export default flightSlice.reducer;