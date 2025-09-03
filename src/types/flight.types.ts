// src/types/flight.types.ts

export interface Flight {
  id: string;
  flightNumber: string;
  scheduledArrivalTimeUtc: string;
  originAirport: string;
  destinationAirport: string;
  createdAt?: string;
  updatedAt?: string;
}

// New Work Order types based on API requirements
export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  aircraftRegistration: string;
  taskDescription: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTechnician: string;
  scheduledDate: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export type WorkOrderStatus = 0 | 1 | 2 | 3 | 4;
export const WorkOrderStatusMap: { [key: number]: string } = {
  0: 'Open',
  1: 'InProgress',
  2: 'Completed',
  3: 'Cancelled',
  4: 'OnHold'
};

export const WorkOrderStatusReverseMap: { [key: string]: number } = {
  'Open': 0,
  'InProgress': 1,
  'Completed': 2,
  'Cancelled': 3,
  'OnHold': 4
};

export type WorkOrderPriority = 0 | 1 | 2 | 3;
export const WorkOrderPriorityMap: { [key: number]: string } = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical'
};

export const WorkOrderPriorityReverseMap: { [key: string]: number } = {
  'Low': 0,
  'Medium': 1,
  'High': 2,
  'Critical': 3
};

export interface WorkOrderCommand {
  type: 'CHK' | 'BAG' | 'CLEAN' | 'PBB';
  value: number;
  description: string;
  isValid: boolean;
}

export interface ParsedWorkOrder {
  originalCommand: string;
  commands: WorkOrderCommand[];
  isValid: boolean;
  errors: string[];
}

export interface WorkOrderSubmission {
  id: string;
  flightId: string;
  flightNumber: string;
  originalCommand: string;
  parsedCommands: WorkOrderCommand[];
  isValid: boolean;
  submittedAt: string;
  submittedBy?: string;
}

export interface FlightListResponse {
  success: boolean;
  data: Flight[];
  message?: string;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface WorkOrderParseResponse {
  success: boolean;
  data: ParsedWorkOrder;
  message?: string;
}

export interface WorkOrderSubmissionResponse {
  success: boolean;
  data: WorkOrderSubmission;
  message?: string;
}

export interface WorkOrderHistoryResponse {
  success: boolean;
  data: WorkOrderSubmission[];
  message?: string;
}

// New Work Order API responses
export interface WorkOrderListResponse {
  success: boolean;
  data: WorkOrder[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  message?: string;
}

export interface WorkOrderResponse {
  success: boolean;
  data: WorkOrder;
  message?: string;
}

export interface WorkOrderStatistics {
  totalWorkOrders: number;
  openWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  highPriorityWorkOrders: number;
}

export interface WorkOrderStatisticsResponse {
  success: boolean;
  data: WorkOrderStatistics;
  message?: string;
}

export interface FlightDeleteResponse {
  success: boolean;
  message?: string;
}

// Form interfaces
export interface FlightFormData {
  flightNumber: string;
  scheduledArrivalTimeUtc: string;
  originAirport: string;
  destinationAirport: string;
}

export interface WorkOrderFormData {
  command: string;
}

// New Work Order form data
export interface WorkOrderCreateData {
  aircraftRegistration: string;
  taskDescription: string;
  priority: WorkOrderPriority;
  assignedTechnician: string;
  scheduledDate: string;
  notes?: string;
}

export interface WorkOrderUpdateData extends WorkOrderCreateData {
  id: number;
  workOrderNumber: string;
  status: WorkOrderStatus;
  request: string;
}

// Filter and sort interfaces
export interface FlightFilters {
  flightNumber?: string;
  originAirport?: string;
  destinationAirport?: string;
}

export interface FlightSortOptions {
  field: keyof Flight;
  direction: 'asc' | 'desc';
}

// Work Order filters and pagination
export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  aircraftRegistration?: string;
  priority?: WorkOrderPriority;
  assignedTechnician?: string;
}

export interface WorkOrderPaginationParams {
  page: number;
  perPage: number;
}

// Constants
export const WORK_ORDER_TYPES = {
  CHK: 'Check-in',
  BAG: 'Baggage',
  CLEAN: 'Cleaning', 
  PBB: 'Jet-bridge'
} as const;

export const VALID_PBB_ANGLES = [0, 90, 180, 270] as const;

export type PBBAngle = typeof VALID_PBB_ANGLES[number];