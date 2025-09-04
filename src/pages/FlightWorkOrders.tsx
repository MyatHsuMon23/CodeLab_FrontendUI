// src/pages/FlightWorkOrders.tsx

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useFlightList } from '@hook/flight/queries';
import { WorkOrderStatusMap, WorkOrderPriorityMap } from '@type/flight.types';

const FlightWorkOrders: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { 
    data: flightData, 
    isLoading, 
    error, 
    refetch 
  } = useFlightList({}, { page: page + 1, perPage: rowsPerPage });

  const flights = flightData?.data || [];
  const totalFlights = flightData?.pagination?.total || 0;

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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : flights.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Flight No</TableCell>
                    <TableCell>Origin → Destination</TableCell>
                    <TableCell>Scheduled Arrival</TableCell>
                    <TableCell>Work Orders</TableCell>
                    <TableCell>Status Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <FlightIcon color="primary" fontSize="small" />
                          <Typography variant="body1" fontWeight={600}>
                            {flight.flightNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {flight.originAirport} → {flight.destinationAirport}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDateTime(flight.scheduledArrivalTimeUtc)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {flight.workOrderSubmissions && flight.workOrderSubmissions.length > 0 ? (
                          <Typography variant="body2" color="primary">
                            {flight.workOrderSubmissions.length} work order{flight.workOrderSubmissions.length !== 1 ? 's' : ''}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No work orders
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {flight.workOrderSubmissions && flight.workOrderSubmissions.length > 0 ? (
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {flight.workOrderSubmissions.slice(0, 3).map((submission, index) => (
                              <Chip
                                key={index}
                                label={submission.isValid ? 'Valid' : 'Invalid'}
                                color={submission.isValid ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {flight.workOrderSubmissions.length > 3 && (
                              <Chip
                                label={`+${flight.workOrderSubmissions.length - 3} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalFlights}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
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