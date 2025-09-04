// src/pages/FlightDetail.tsx

import React, { useState, useCallback, useMemo } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FlightTakeoff as FlightIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useFlightDetail, useFlightWorkOrders, useWorkOrderList } from '@hook/flight/queries';
import { useSubmitWorkOrder, useParseWorkOrder, useAssignExistingWorkOrderToFlight } from '@hook/flight/mutations';
import { useAlert } from '@provider/AlertProvider';
import { WorkOrderParser } from '@util/workOrderParser';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { WorkOrderPriority, WorkOrderPriorityMap, WorkOrderStatusMap } from '@type/flight.types';

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Work Order Command state
  const [workOrderCommand, setWorkOrderCommand] = useState('');
  const [workOrderNotes, setWorkOrderNotes] = useState('');

  // Assign Work Order state  
  const [assignWorkOrderDialogOpen, setAssignWorkOrderDialogOpen] = useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(null);

  // API hooks
  const {
    data: flight,
    isLoading,
    error,
    refetch
  } = useFlightDetail(id!);

  // Get work orders assigned to this flight
  const {
    data: flightWorkOrdersData,
    isLoading: flightWorkOrdersLoading,
    refetch: refetchFlightWorkOrders
  } = useFlightWorkOrders(id!);

  // Get all available work orders for assignment
  const {
    data: availableWorkOrdersData,
    isLoading: availableWorkOrdersLoading
  } = useWorkOrderList({}, { page: 1, perPage: 100 });

  const submitWorkOrderMutation = useSubmitWorkOrder();
  const parseWorkOrderMutation = useParseWorkOrder();
  const assignWorkOrderMutation = useAssignExistingWorkOrderToFlight();

  // Computed values
  const parsedWorkOrder = useMemo(() => {
    if (!workOrderCommand.trim()) return null;
    return WorkOrderParser.parseCommand(workOrderCommand);
  }, [workOrderCommand]);

  const flightWorkOrders = flightWorkOrdersData?.data || [];
  const availableWorkOrders = availableWorkOrdersData?.data || [];
  const hasAssignedWorkOrders = flightWorkOrders.length > 0;

  const formatDateTime = useCallback((dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return date.toLocaleString();
    } catch {
      return dateTimeString;
    }
  }, []);

  // Event handlers
  const handleGoBack = () => {
    navigate('/flights');
  };

  const handleSubmitWorkOrder = useCallback(async () => {
    if (!flight || !workOrderCommand.trim()) return;

    try {
          await submitWorkOrderMutation.mutateAsync({
            flightId: String(flight.id),
        command: workOrderCommand,
        notes: workOrderNotes
      });
      
      setWorkOrderCommand('');
      setWorkOrderNotes('');
      refetch();
    } catch (error: any) {
      // Error is handled by the mutation
    }
  }, [flight, workOrderCommand, workOrderNotes, submitWorkOrderMutation, refetch]);

  const handleAssignWorkOrder = useCallback(async () => {
    if (!flight || !selectedWorkOrderId) return;

    const selectedWorkOrder = availableWorkOrders.find(wo => wo.id === selectedWorkOrderId);
    if (!selectedWorkOrder) return;

    try {
      await assignWorkOrderMutation.mutateAsync({
        flightId: String(flight.id),
        workOrderData: {
          aircraftRegistration: selectedWorkOrder.aircraftRegistration,
          taskDescription: selectedWorkOrder.taskDescription,
          priority: selectedWorkOrder.priority,
          assignedTechnician: selectedWorkOrder.assignedTechnician,
          scheduledDate: selectedWorkOrder.scheduledDate,
          notes: selectedWorkOrder.notes || ''
        }
      });
      
      setSelectedWorkOrderId(null);
      setAssignWorkOrderDialogOpen(false);
      refetch();
      refetchFlightWorkOrders();
    } catch (error: any) {
      // Error is handled by the mutation
    }
  }, [flight, selectedWorkOrderId, availableWorkOrders, assignWorkOrderMutation, refetch, refetchFlightWorkOrders]);

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
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flight.workOrderSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {submission.commandString}
                        </Typography>
                      </TableCell>
                      <TableCell>
                           <Box display="flex" flexWrap="wrap" gap={0.5}>
                             {submission.parsedCommands.map((cmd, index) => (
                               <Chip
                                 key={index}
                                 label={cmd.displayText}
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
                        <Typography variant="body2">
                          {submission.notes || '-'}
                        </Typography>
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

      {/* Assigned Work Orders Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h3">
            Assigned Work Orders
          </Typography>
          {!hasAssignedWorkOrders && (
            <Button
              variant="contained"
              onClick={() => setAssignWorkOrderDialogOpen(true)}
              disabled={availableWorkOrders.length === 0}
            >
              Assign Work Order
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {flightWorkOrdersLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : hasAssignedWorkOrders ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Work Order Number</TableCell>
                  <TableCell>Task Description</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flightWorkOrders.map((workOrder) => (
                  <TableRow key={workOrder.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {workOrder.workOrderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {workOrder.taskDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {workOrder.assignedTechnician}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={WorkOrderStatusMap[workOrder.status]}
                        color={workOrder.status === 2 ? 'success' : workOrder.status === 1 ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={WorkOrderPriorityMap[workOrder.priority]}
                        color={workOrder.priority >= 2 ? 'error' : workOrder.priority === 1 ? 'warning' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(workOrder.scheduledDate)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Work Orders Assigned
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This flight doesn't have any work orders assigned yet.
            </Typography>
            {availableWorkOrders.length > 0 ? (
              <Button
                variant="contained"
                onClick={() => setAssignWorkOrderDialogOpen(true)}
              >
                Assign Work Order
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No work orders available for assignment. Create work orders in the Work Orders Management page first.
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Actions Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Work Order Commands
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create and submit work order commands for this flight.
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={1}
          label="Work Order Command"
          placeholder="CHK15|BAG25|CLEAN10|PBB90"
          value={workOrderCommand}
          onChange={(e) => setWorkOrderCommand(e.target.value)}
          margin="normal"
          helperText="Enter commands separated by | (e.g., CHK15|BAG25|CLEAN10|PBB90)"
          sx={{ mb: 2 }}
        />
        
        {/* Parse Preview */}
        {parsedWorkOrder && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>
                Command Preview
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {parsedWorkOrder.commands.map((cmd, index) => (
                  <Chip
                    key={index}
                    label={cmd.description}
                    color={cmd.isValid ? 'success' : 'error'}
                    variant={cmd.isValid ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
              {!parsedWorkOrder.isValid && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {parsedWorkOrder.errors.join(', ')}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Notes (Optional)"
          placeholder="Additional notes or instructions..."
          value={workOrderNotes}
          onChange={(e) => setWorkOrderNotes(e.target.value)}
          margin="normal"
          helperText="Optional notes for the work order command"
          sx={{ mb: 3 }}
        />

        {/* Command Help */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Command Types:
          </Typography>
          {Object.entries(WorkOrderParser.getCommandHelp()).map(([key, help]) => (
            <Typography key={key} variant="body2" color="text.secondary" gutterBottom>
              <strong>{key}:</strong> {help}
            </Typography>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmitWorkOrder}
          disabled={
            !workOrderCommand.trim() || 
            !parsedWorkOrder?.isValid ||
            submitWorkOrderMutation.isPending
          }
          startIcon={submitWorkOrderMutation.isPending ? <CircularProgress size={16} /> : <SendIcon />}
        >
          Submit Work Order Command
        </Button>
      </Paper>

      {/* Assign Work Order Dialog */}
      <Dialog 
        open={assignWorkOrderDialogOpen} 
        onClose={() => setAssignWorkOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assign Work Order to Flight {flight?.flightNumber}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
            {availableWorkOrdersLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : availableWorkOrders.length > 0 ? (
              <FormControl fullWidth>
                <InputLabel>Select Work Order</InputLabel>
                <Select
                  value={selectedWorkOrderId || ''}
                  onChange={(e) => setSelectedWorkOrderId(Number(e.target.value))}
                  label="Select Work Order"
                >
                  {availableWorkOrders.map((workOrder) => (
                    <MenuItem key={workOrder.id} value={workOrder.id}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {workOrder.workOrderNumber} - {workOrder.taskDescription}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Technician: {workOrder.assignedTechnician} | Status: {WorkOrderStatusMap[workOrder.status]} | Priority: {WorkOrderPriorityMap[workOrder.priority]}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Alert severity="info">
                No work orders available for assignment. Please create work orders in the Work Orders Management page first.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignWorkOrderDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignWorkOrder}
            disabled={
              !selectedWorkOrderId ||
              assignWorkOrderMutation.isPending
            }
          >
            {assignWorkOrderMutation.isPending ? 'Assigning...' : 'Assign Work Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightDetail;