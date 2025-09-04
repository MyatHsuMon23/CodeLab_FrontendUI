// Types for Flights with Work Orders API
export interface FlightWithWorkOrders {
  id: number;
  flightNumber: string;
  scheduledArrivalTimeUtc: string;
  originAirport: string;
  destinationAirport: string;
  workOrders: Array<{
    id: number;
    workOrderNumber: string;
    taskDescription: string;
    status: number;
    priority: number;
    assignedTechnician: string;
  }>;
  commandSubmissions: Array<{
    id: number;
    commandString: string;
    humanReadableCommands: string;
    submittedAt: string;
  }>;
}

export interface FlightsWithWorkOrdersResponse {
  success: boolean;
  message: string;
  data: FlightWithWorkOrders[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}
