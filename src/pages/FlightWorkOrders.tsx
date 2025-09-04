// src/pages/FlightWorkOrders.tsx

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Alert,
  IconButton,
  Tooltip} from '@mui/material';
import {
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useFlightsWithWorkOrders } from '@hook/flight/useFlightsWithWorkOrders';
import CustomTable from '@component/CustomTable';
import { FlightWithWorkOrders } from '@type/flightWorkOrders.types';

const FlightWorkOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { 
    data: flightData, 
    isLoading, 
    error, 
    refetch 
  } = useFlightsWithWorkOrders({ page: page, perPage: rowsPerPage });

  const flights: FlightWithWorkOrders[] = flightData?.data || [];
  const totalFlights = flightData?.pagination?.total || 0;
  // Table columns definition
  const columns = [
    {
      label: 'Flight No',
      field: 'flightNumber',
      render: (flight: FlightWithWorkOrders) => (
        <Box display="flex" alignItems="center" gap={1}>
          <FlightIcon color="primary" fontSize="small" />
          <Typography variant="body1" fontWeight={600}>{flight.flightNumber}</Typography>
        </Box>
      )
    },
    {
      label: 'Origin → Destination',
      field: 'route',
      render: (flight: FlightWithWorkOrders) => (
        <Typography variant="body2">{flight.originAirport} → {flight.destinationAirport}</Typography>
      )
    },
    {
      label: 'Scheduled Arrival',
      field: 'scheduledArrivalTimeUtc',
      render: (flight: FlightWithWorkOrders) => (
        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{formatDateTime(flight.scheduledArrivalTimeUtc)}</Typography>
        </Box>
      )
    },
    {
      label: 'Work Orders',
      field: 'workOrders',
      render: (flight: FlightWithWorkOrders) => (
        flight.workOrders && flight.workOrders.length > 0 ? (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {flight.workOrders.map((wo) => (
              <Chip
                key={wo.id}
                label={wo.workOrderNumber}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No work orders</Typography>
        )
      )
    },
    {
      label: 'Work Order Command',
      field: 'commandSubmissions',
      render: (flight: FlightWithWorkOrders) => (
        flight.commandSubmissions && flight.commandSubmissions.length > 0 ? (
          <Box>
            {flight.commandSubmissions.map((cmd, idx) => (
              <Typography key={cmd.id || idx} variant="body2" color="secondary">
                {cmd.humanReadableCommands}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">-</Typography>
        )
      )
    },
  ];
  console.log(flights)

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return format(date, 'PPp');
    } catch {
      return dateTimeString;
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // CustomTable expects onRowsPerPageChange: (rows: number) => void
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load flight work orders. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Flight Work Orders
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          View all flights with their assigned work orders and associations.
        </Typography>

        {totalFlights != 0 ? (
          <CustomTable
            columns={columns}
            data={flights}
            page={page - 1}
            rowsPerPage={rowsPerPage}
            totalRows={totalFlights}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onRowsPerPageChange={handleRowsPerPageChange}
            showPagination={true}
            loading={isLoading}
          />
        ) : (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Flights Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No flights available to show work order associations.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FlightWorkOrders;