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

// Constants
export const WORK_ORDER_TYPES = {
  CHK: 'Check-in',
  BAG: 'Baggage',
  CLEAN: 'Cleaning', 
  PBB: 'Jet-bridge'
} as const;

export const VALID_PBB_ANGLES = [0, 90, 180, 270] as const;

export type PBBAngle = typeof VALID_PBB_ANGLES[number];