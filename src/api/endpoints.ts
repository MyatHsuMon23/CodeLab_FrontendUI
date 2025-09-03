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
    getFlights: () => '/Flights',
    createFlight: () => '/Flights',
    getFlight: (id: string) => `/Flights/${id}`,
    updateFlight: (id: string) => `/Flights/${id}`,
    deleteFlight: (id: string) => `/Flights/${id}`,
    importFlights: () => '/Flights/import',
    importFlightsCSV: () => '/Flights/import/csv',
  },
  workOrders: {
    parseCommand: () => '/work-orders/parse',
    submitWorkOrder: () => '/WorkOrders',
    getWorkOrderHistory: () => '/WorkOrders',
    getWorkOrdersByFlight: (flightId: string) => `/WorkOrders/flight/${flightId}`,
    // New endpoints for comprehensive work order management
    getWorkOrders: () => '/WorkOrders',
    createWorkOrder: () => '/WorkOrders',
    updateWorkOrder: (id: number) => `/WorkOrders/${id}`,
    deleteWorkOrder: (id: number) => `/WorkOrders/${id}`,
    getWorkOrderStatistics: () => '/WorkOrders/statistics',
  },
};
