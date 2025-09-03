// src/pages/WorkOrderHistory.tsx

import React, { useState, useMemo } from 'react';
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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as ValidIcon,
  Error as ErrorIcon,
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { useWorkOrderHistory } from '@hook/flight/queries';
import { WORK_ORDER_TYPES } from '@type/flight.types';
import type { WorkOrderSubmission } from '@type/flight.types';

const WorkOrderHistory: React.FC = () => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const { 
    data: historyData, 
    isLoading, 
    error, 
    refetch 
  } = useWorkOrderHistory();

  const workOrderHistory = historyData?.data || [];

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent, 
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return {
        full: format(date, 'PPp'),
        relative: formatDistanceToNow(date, { addSuffix: true })
      };
    } catch {
      return {
        full: dateTimeString,
        relative: dateTimeString
      };
    }
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'success' : 'error';
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? <ValidIcon /> : <ErrorIcon />;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load work order history. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h1" fontWeight={700}>
            Work Order History
          </Typography>
          <Tooltip title="Refresh History">
            <IconButton onClick={() => refetch()} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {workOrderHistory.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Work Orders Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit your first work order from the Flight List page.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {workOrderHistory.length} work order{workOrderHistory.length !== 1 ? 's' : ''} submitted
            </Typography>

            {workOrderHistory.map((submission) => {
              const dateTime = formatDateTime(submission.submittedAt);
              const panelId = `panel-${submission.id}`;

              return (
                <Accordion
                  key={submission.id}
                  expanded={expandedAccordion === panelId}
                  onChange={handleAccordionChange(panelId)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', alignItems: { sm: 'center' } }}>
                      <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: '150px' }}>
                        <FlightIcon color="primary" />
                        <Typography variant="body1" fontWeight={600}>
                          {submission.flightNumber}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {submission.originalCommand}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: '150px' }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {dateTime.relative}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(submission.isValid)}
                        label={submission.isValid ? 'Valid' : 'Invalid'}
                        color={getStatusColor(submission.isValid)}
                        size="small"
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                      <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom color="primary">
                            Submission Details
                          </Typography>
                          <Box mb={2}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Flight:</strong> {submission.flightNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Submitted:</strong> {dateTime.full}
                            </Typography>
                            {submission.submittedBy && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Submitted by:</strong> {submission.submittedBy}
                              </Typography>
                            )}
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Original Command:</strong>
                          </Typography>
                          <Box 
                            sx={{ 
                              p: 1, 
                              bgcolor: 'grey.100', 
                              borderRadius: 1, 
                              mt: 1,
                              fontFamily: 'monospace'
                            }}
                          >
                            {submission.originalCommand}
                          </Box>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom color="primary">
                            Parsed Commands
                          </Typography>
                          {submission.parsedCommands?.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              No valid commands parsed
                            </Typography>
                          ) : (
                            <Stack spacing={2}>
                              {submission.parsedCommands?.map((command, index) => (
                                <Box key={index}>
                                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Chip
                                      label={command.type}
                                      color={command.isValid ? 'primary' : 'error'}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Typography variant="body2" fontWeight={600}>
                                      {WORK_ORDER_TYPES[command.type]}
                                    </Typography>
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    color={command.isValid ? 'text.primary' : 'error'}
                                  >
                                    {command.description}
                                  </Typography>
                                  {!command.isValid && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                      Invalid command
                                    </Alert>
                                  )}
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WorkOrderHistory;