// src/pages/FlightDetail.tsx

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FlightTakeoff as FlightIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useFlightDetail } from '@hook/flight/queries';
import { useAlert } from '@provider/AlertProvider';
import { formatDistanceToNow, parseISO } from 'date-fns';

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState(0);

  // API hook
  const {
    data: flight,
    isLoading,
    error,
    refetch
  } = useFlightDetail(id!);

  const formatDateTime = useCallback((dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return date.toLocaleString();
    } catch {
      return dateTimeString;
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGoBack = () => {
    navigate('/flights');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !flight) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'Flight not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Back to Flights
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Flight {flight.flightNumber}
        </Typography>
      </Box>

      {/* Flight Header Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <FlightIcon color="primary" />
              <Typography variant="h5" component="h2">
                {flight.flightNumber}
              </Typography>
            </Box>
          }
          subheader="Flight Information"
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationIcon color="action" />
              <Typography variant="body1">
                <strong>Route:</strong> {flight.originAirport} → {flight.destinationAirport}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon color="action" />
              <Typography variant="body1">
                <strong>Scheduled Arrival:</strong> {formatDateTime(flight.scheduledArrivalTimeUtc)}
              </Typography>
            </Box>
            {flight.createdAt && (
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formatDateTime(flight.createdAt)}
              </Typography>
            )}
            {flight.updatedAt && (
              <Typography variant="body2" color="text.secondary">
                <strong>Last Updated:</strong> {formatDateTime(flight.updatedAt)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Paper>

      {/* Work Order Submissions Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Work Order Submissions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {flight.workOrderSubmissions && flight.workOrderSubmissions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Command String</TableCell>
                  <TableCell>Parsed Commands</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flight.workOrderSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {submission.originalCommand}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {submission.parsedCommands.map((cmd, index) => (
                          <Chip
                            key={index}
                            label={cmd.description}
                            size="small"
                            color={cmd.isValid ? 'success' : 'error'}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(submission.submittedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {submission.submittedBy || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.isValid ? 'Valid' : 'Invalid'}
                        color={submission.isValid ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No work order submissions found for this flight.
          </Typography>
        )}
      </Paper>

      {/* Actions Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Create Work Order Command" />
          <Tab label="Assign Work Order" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {/* TODO: Move work order command dialog content here */}
            <Typography variant="body2" color="text.secondary">
              Work Order Command creation will be implemented here.
            </Typography>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {/* TODO: Implement Assign Work Order form */}
            <Typography variant="body2" color="text.secondary">
              Work Order assignment form will be implemented here.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FlightDetail;