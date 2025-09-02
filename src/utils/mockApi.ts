// src/utils/mockApi.ts

import type { 
  Flight, 
  FlightListResponse, 
  WorkOrderParseResponse, 
  WorkOrderSubmissionResponse, 
  WorkOrderHistoryResponse, 
  ParsedWorkOrder,
  WorkOrderSubmission
} from '@type/flight.types';
import { WorkOrderParser } from '@util/workOrderParser';

// Mock flight data
let mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'AA1001',
    scheduledArrivalTimeUtc: '2024-12-29T14:30:00Z',
    originAirport: 'JFK',
    destinationAirport: 'LAX',
    createdAt: '2024-12-28T10:00:00Z',
    updatedAt: '2024-12-28T10:00:00Z'
  },
  {
    id: '2',
    flightNumber: 'DL2002',
    scheduledArrivalTimeUtc: '2024-12-29T16:45:00Z',
    originAirport: 'ATL',
    destinationAirport: 'ORD',
    createdAt: '2024-12-28T10:00:00Z',
    updatedAt: '2024-12-28T10:00:00Z'
  },
  {
    id: '3',
    flightNumber: 'UA3003',
    scheduledArrivalTimeUtc: '2024-12-29T18:20:00Z',
    originAirport: 'SFO',
    destinationAirport: 'DEN',
    createdAt: '2024-12-28T10:00:00Z',
    updatedAt: '2024-12-28T10:00:00Z'
  },
  {
    id: '4',
    flightNumber: 'WN4004',
    scheduledArrivalTimeUtc: '2024-12-29T20:15:00Z',
    originAirport: 'LAS',
    destinationAirport: 'PHX',
    createdAt: '2024-12-28T10:00:00Z',
    updatedAt: '2024-12-28T10:00:00Z'
  },
  {
    id: '5',
    flightNumber: 'B65005',
    scheduledArrivalTimeUtc: '2024-12-29T22:30:00Z',
    originAirport: 'BOS',
    destinationAirport: 'MCO',
    createdAt: '2024-12-28T10:00:00Z',
    updatedAt: '2024-12-28T10:00:00Z'
  }
];

// Mock work order submissions
let mockWorkOrders: WorkOrderSubmission[] = [
  {
    id: '1',
    flightId: '1',
    flightNumber: 'AA1001',
    originalCommand: 'CHK15|BAG25|CLEAN10|PBB90',
    parsedCommands: [
      { type: 'CHK', value: 15, description: 'Check-in: 15 minutes', isValid: true },
      { type: 'BAG', value: 25, description: 'Baggage handling: 25 minutes', isValid: true },
      { type: 'CLEAN', value: 10, description: 'Cleaning: 10 minutes', isValid: true },
      { type: 'PBB', value: 90, description: 'Jet-bridge angle: 90°', isValid: true }
    ],
    isValid: true,
    submittedAt: '2024-12-28T12:30:00Z',
    submittedBy: 'demo-user'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Flight endpoints
  async getFlights(): Promise<FlightListResponse> {
    await delay(500);
    return {
      success: true,
      data: mockFlights
    };
  },

  async createFlight(data: Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Flight }> {
    await delay(300);
    const newFlight: Flight = {
      ...data,
      id: (mockFlights.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFlights.push(newFlight);
    return { data: newFlight };
  },

  async updateFlight(id: string, data: Partial<Flight>): Promise<{ data: Flight }> {
    await delay(300);
    const index = mockFlights.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Flight not found');
    
    mockFlights[index] = {
      ...mockFlights[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return { data: mockFlights[index] };
  },

  async deleteFlight(id: string): Promise<void> {
    await delay(300);
    const index = mockFlights.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Flight not found');
    mockFlights.splice(index, 1);
  },

  async importFlights(file: File): Promise<FlightListResponse> {
    await delay(1000);
    // In a real implementation, this would parse the file
    // For demo purposes, we'll just add some sample flights
    const sampleFlights: Flight[] = [
      {
        id: (mockFlights.length + 1).toString(),
        flightNumber: 'AI101',
        scheduledArrivalTimeUtc: '2024-12-30T08:00:00Z',
        originAirport: 'DEL',
        destinationAirport: 'BOM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: (mockFlights.length + 2).toString(),
        flightNumber: 'EK202',
        scheduledArrivalTimeUtc: '2024-12-30T12:30:00Z',
        originAirport: 'DXB',
        destinationAirport: 'LHR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    mockFlights.push(...sampleFlights);
    
    return {
      success: true,
      data: mockFlights
    };
  },

  // Work order endpoints
  async parseWorkOrder(command: string): Promise<WorkOrderParseResponse> {
    await delay(200);
    const parsed = WorkOrderParser.parseCommand(command);
    return {
      success: true,
      data: parsed
    };
  },

  async submitWorkOrder(data: { flightId: string; command: string }): Promise<WorkOrderSubmissionResponse> {
    await delay(500);
    const flight = mockFlights.find(f => f.id === data.flightId);
    if (!flight) throw new Error('Flight not found');

    const parsed = WorkOrderParser.parseCommand(data.command);
    const submission: WorkOrderSubmission = {
      id: (mockWorkOrders.length + 1).toString(),
      flightId: data.flightId,
      flightNumber: flight.flightNumber,
      originalCommand: data.command,
      parsedCommands: parsed.commands,
      isValid: parsed.isValid,
      submittedAt: new Date().toISOString(),
      submittedBy: 'demo-user'
    };

    mockWorkOrders.unshift(submission); // Add to beginning

    return {
      success: true,
      data: submission
    };
  },

  async getWorkOrderHistory(): Promise<WorkOrderHistoryResponse> {
    await delay(300);
    return {
      success: true,
      data: mockWorkOrders
    };
  },

  async getWorkOrdersByFlight(flightId: string): Promise<WorkOrderHistoryResponse> {
    await delay(300);
    const flightOrders = mockWorkOrders.filter(order => order.flightId === flightId);
    return {
      success: true,
      data: flightOrders
    };
  }
};

export default mockApi;