// src/api/endpoints.ts

import { ref } from "process";

export const ApiEndpoints = {
  auth: {
    authToken: () => '/Auth/login',
    refreshToken: () => '/auth/refresh-token',
  },
  FTACheck: {
    getFTACheckList: () => '/fta-check',
    getAnalysisResult: (id: string | number) => `/fta-check/${id}/results`,
    postCreateFTACheck: () => '/fta-check',
    postUploadFiles: (id: string | number) => `/fta-check/${id}/files`,
    postFTAAnalyze: (id: string | number) => `/fta-check/${id}/analyze`,
  },
  flights: {
    getFlights: () => '/flights',
    createFlight: () => '/flights',
    getFlight: (id: string) => `/flights/${id}`,
    updateFlight: (id: string) => `/flights/${id}`,
    deleteFlight: (id: string) => `/flights/${id}`,
    importFlights: () => '/flights/import',
  },
  workOrders: {
    parseCommand: () => '/work-orders/parse',
    submitWorkOrder: () => '/work-orders',
    getWorkOrderHistory: () => '/work-orders',
    getWorkOrdersByFlight: (flightId: string) => `/work-orders/flight/${flightId}`,
  },
};
