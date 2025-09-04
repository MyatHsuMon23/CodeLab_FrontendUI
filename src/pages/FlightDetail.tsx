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
import { useFlightDetail } from '@hook/flight/queries';
import { useSubmitWorkOrder, useParseWorkOrder, useAssignWorkOrderToFlight } from '@hook/flight/mutations';
import { useAlert } from '@provider/AlertProvider';
import { WorkOrderParser } from '@util/workOrderParser';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { WorkOrderPriority, WorkOrderPriorityMap } from '@type/flight.types';

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState(0);

  // Work Order Command state
  const [workOrderCommand, setWorkOrderCommand] = useState('');
  const [workOrderNotes, setWorkOrderNotes] = useState('');

  // Assign Work Order state
  const [assignWorkOrderDialogOpen, setAssignWorkOrderDialogOpen] = useState(false);
  const [workOrderForm, setWorkOrderForm] = useState({
    aircraftRegistration: '',
    taskDescription: '',
    priority: 1 as WorkOrderPriority,
    assignedTechnician: '',
    scheduledDate: '',
    notes: ''
  });

  // API hooks
  const {
    data: flight,
    isLoading,
    error,
    refetch
  } = useFlightDetail(id!);

  const submitWorkOrderMutation = useSubmitWorkOrder();
  const parseWorkOrderMutation = useParseWorkOrder();
  const assignWorkOrderMutation = useAssignWorkOrderToFlight();

  // Computed values
  const parsedWorkOrder = useMemo(() => {
    if (!workOrderCommand.trim()) return null;
    return WorkOrderParser.parseCommand(workOrderCommand);
  }, [workOrderCommand]);

  const formatDateTime = useCallback((dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return date.toLocaleString();
    } catch {
      return dateTimeString;
    }
  }, []);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
    if (!flight) return;

    try {
          await assignWorkOrderMutation.mutateAsync({
            flightId: String(flight.id),
        workOrderData: workOrderForm
      });
      
      setWorkOrderForm({
        aircraftRegistration: '',
        taskDescription: '',
        priority: 1,
        assignedTechnician: '',
        scheduledDate: '',
        notes: ''
      });
      setAssignWorkOrderDialogOpen(false);
      refetch();
    } catch (error: any) {
      // Error is handled by the mutation
    }
  }, [flight, workOrderForm, assignWorkOrderMutation, refetch]);

  const handleFormChange = (field: string, value: any) => {
    setWorkOrderForm(prev => ({ ...prev, [field]: value }));
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
            <Typography variant="h6" gutterBottom>
              Create Work Order Command
            </Typography>
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
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Assign Work Order
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a new work order and assign it to this flight.
            </Typography>
            
            <Button
              variant="contained"
              onClick={() => setAssignWorkOrderDialogOpen(true)}
            >
              Create New Work Order Assignment
            </Button>
          </Box>
        )}
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
            <TextField
              fullWidth
              label="Aircraft Registration"
              placeholder="e.g., N123AB"
              value={workOrderForm.aircraftRegistration}
              onChange={(e) => handleFormChange('aircraftRegistration', e.target.value)}
              required
            />
            
            <TextField
              fullWidth
              label="Task Description"
              placeholder="Describe the maintenance task..."
              value={workOrderForm.taskDescription}
              onChange={(e) => handleFormChange('taskDescription', e.target.value)}
              multiline
              rows={2}
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={workOrderForm.priority}
                onChange={(e) => handleFormChange('priority', e.target.value as WorkOrderPriority)}
                label="Priority"
              >
                <MenuItem value={0}>Low</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>High</MenuItem>
                <MenuItem value={3}>Critical</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Assigned Technician"
              placeholder="Technician name"
              value={workOrderForm.assignedTechnician}
              onChange={(e) => handleFormChange('assignedTechnician', e.target.value)}
              required
            />
            
            <TextField
              fullWidth
              label="Scheduled Date"
              type="datetime-local"
              value={workOrderForm.scheduledDate}
              onChange={(e) => handleFormChange('scheduledDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <TextField
              fullWidth
              label="Notes (Optional)"
              placeholder="Additional notes..."
              value={workOrderForm.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              multiline
              rows={2}
            />
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
              !workOrderForm.aircraftRegistration.trim() ||
              !workOrderForm.taskDescription.trim() ||
              !workOrderForm.assignedTechnician.trim() ||
              !workOrderForm.scheduledDate ||
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