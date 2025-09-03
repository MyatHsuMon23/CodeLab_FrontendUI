// src/pages/FlightList.tsx

import React, { useState, useMemo, useCallback } from 'react';
import CustomTable from '../components/CustomTable';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
  InputAdornment,
  Collapse,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  FlightTakeoff as FlightIcon,
  History as HistoryIcon,
  Send as SendIcon,
  CloudUpload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/reduxStore';
import { 
  setSelectedFlight, 
  setFilters, 
  setSortOptions,
  updateFilters 
} from '@store/flightReducer';
import { useFlightList, useWorkOrdersByFlight } from '@hook/flight/queries';
import { useSubmitWorkOrder, useParseWorkOrder } from '@hook/flight/mutations';
import { useAlert } from '@provider/AlertProvider';
import { WorkOrderParser } from '@util/workOrderParser';
import FlightImport from '@component/FlightImport';
import type { Flight, FlightSortOptions } from '@type/flight.types';
import { formatDistanceToNow, parseISO } from 'date-fns';

const FlightList: React.FC = () => {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  
  // Redux state
  const { 
    flights, 
    selectedFlight, 
    filters, 
    sortOptions 
  } = useSelector((state: RootState) => state.flight);

  // Local state
  const [workOrderCommand, setWorkOrderCommand] = useState('');
  const [workOrderNotes, setWorkOrderNotes] = useState('');
  const [workOrderDialogOpen, setWorkOrderDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [importSectionOpen, setImportSectionOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    flightNumber: filters.flightNumber || '',
    originAirport: filters.originAirport || '',
    destinationAirport: filters.destinationAirport || ''
  });

  // Queries and mutations
  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  // API hooks
  const {
    data: flightListData,
    isLoading: flightsLoading,
    error: flightsError,
    refetch: refetchFlights
  } = useFlightList(filters, pagination);

  const flightData = flightListData?.data || [];

  const submitWorkOrderMutation = useSubmitWorkOrder();
  const parseWorkOrderMutation = useParseWorkOrder();

  // Computed values
  const filteredAndSortedFlights = useMemo(() => {
    let result = flightData || [];

    // Apply filters
    if (filters.flightNumber) {
      result = result.filter(flight => 
        flight.flightNumber.toLowerCase().includes(filters.flightNumber!.toLowerCase())
      );
    }
    if (filters.originAirport) {
      result = result.filter(flight => 
        flight.originAirport.toLowerCase().includes(filters.originAirport!.toLowerCase())
      );
    }
    if (filters.destinationAirport) {
      result = result.filter(flight => 
        flight.destinationAirport.toLowerCase().includes(filters.destinationAirport!.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortOptions.field];
      const bValue = b[sortOptions.field];
      
      if (sortOptions.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return result;
  }, [flightData, filters, sortOptions]);

  const parsedWorkOrder = useMemo(() => {
    if (!workOrderCommand.trim()) return null;
    return WorkOrderParser.parseCommand(workOrderCommand);
  }, [workOrderCommand]);

  // Event handlers
  const handleFilterChange = useCallback((key: keyof typeof localFilters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    dispatch(setFilters(localFilters));
  }, [dispatch, localFilters]);

  const handleClearFilters = useCallback(() => {
    const emptyFilters = { flightNumber: '', originAirport: '', destinationAirport: '' };
    setLocalFilters(emptyFilters);
    dispatch(setFilters({}));
  }, [dispatch]);

  const handleSort = useCallback((field: keyof Flight) => {
    const newDirection = sortOptions.field === field && sortOptions.direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOptions({ field, direction: newDirection }));
  }, [dispatch, sortOptions]);

  const handleSelectFlight = useCallback((flight: Flight) => {
    dispatch(setSelectedFlight(flight));
    setWorkOrderDialogOpen(true);
  }, [dispatch]);

  const handleSubmitWorkOrder = useCallback(async () => {
    if (!selectedFlight || !workOrderCommand.trim()) return;

    try {
      await submitWorkOrderMutation.mutateAsync({
        flightId: selectedFlight.id,
        command: workOrderCommand,
        notes: workOrderNotes
      });
      
      showAlert({
        type: 'success',
        message: 'Work order command submitted successfully!'
      });
      
      setWorkOrderCommand('');
      setWorkOrderNotes('');
      setWorkOrderDialogOpen(false);
    } catch (error: any) {
      showAlert({
        type: 'error',
        message: error.message || 'Failed to submit work order command'
      });
    }
  }, [selectedFlight, workOrderCommand, workOrderNotes, submitWorkOrderMutation, showAlert]);

  const handleParseCommand = useCallback(async () => {
    if (!workOrderCommand.trim()) return;

    try {
      await parseWorkOrderMutation.mutateAsync(workOrderCommand);
    } catch (error: any) {
      showAlert({
        type: 'error',
        message: error.message || 'Failed to parse command'
      });
    }
  }, [workOrderCommand, parseWorkOrderMutation, showAlert]);

  const formatDateTime = useCallback((dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return date.toLocaleString();
    } catch {
      return dateTimeString;
    }
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" component="h1" fontWeight={700}>
            Flight Management
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={importSectionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setImportSectionOpen(!importSectionOpen)}
            >
              Import Flights
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchFlights()}
              disabled={flightsLoading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Import Section */}
        <Collapse in={importSectionOpen}>
          <Box mb={3}>
            <FlightImport onImportComplete={() => refetchFlights()} />
          </Box>
        </Collapse>

        {/* Filters */}
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ mb: 3 }}>
          <TextField
            label="Flight Number"
            value={localFilters.flightNumber}
            onChange={(e) => handleFilterChange('flightNumber', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Origin Airport"
            value={localFilters.originAirport}
            onChange={(e) => handleFilterChange('originAirport', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Destination Airport"
            value={localFilters.destinationAirport}
            onChange={(e) => handleFilterChange('destinationAirport', e.target.value)}
            sx={{ flex: 1 }}
          />
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ minWidth: '100px' }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ minWidth: '56px', px: 1 }}
            >
              <ClearIcon />
            </Button>
          </Box>
        </Stack>

        {/* Flight Table */}
        <CustomTable
          columns={[
            { label: 'Flight Number', field: 'flightNumber', render: row => <Chip icon={<FlightIcon />} label={row.flightNumber} variant="outlined" color="primary" /> },
            { label: 'Scheduled Arrival', field: 'scheduledArrivalTimeUtc', render: row => formatDateTime(row.scheduledArrivalTimeUtc) },
            { label: 'Origin', field: 'originAirport' },
            { label: 'Destination', field: 'destinationAirport' },
            { label: 'Actions', field: 'actions', align: 'center', render: row => (
                <Tooltip title="Create Work Order">
                  <IconButton color="primary" onClick={() => handleSelectFlight(row)}>
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )
            }
          ]}
          data={filteredAndSortedFlights}
          page={flightListData?.pagination ? (flightListData.pagination.currentPage - 1) : (pagination.page - 1)}
          rowsPerPage={flightListData?.pagination ? flightListData.pagination.perPage : pagination.perPage}
          totalRows={flightListData?.pagination ? flightListData.pagination.total : 0}
          onPageChange={newPage => setPagination(prev => ({ ...prev, page: newPage + 1 }))}
          onRowsPerPageChange={newPerPage => setPagination({ page: 1, perPage: newPerPage })}
          showPagination={true}
          loading={flightsLoading}
        />
      </Paper>

      {/* Work Order Dialog */}
      <Dialog
        open={workOrderDialogOpen}
        onClose={() => setWorkOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Create Work Order Command - {selectedFlight?.flightNumber}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {selectedFlight?.originAirport} → {selectedFlight?.destinationAirport} | 
              Arrival: {selectedFlight && formatDateTime(selectedFlight.scheduledArrivalTimeUtc)}
            </Typography>
          </Box>

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
          />
          
          {/* Parse Preview */}
          {parsedWorkOrder && (
            <Card variant="outlined" sx={{ mt: 0 }}>
              <CardContent>
                {/* <Typography variant="body2" gutterBottom>
                  Command Preview
                </Typography> */}
                
                {/* {!parsedWorkOrder.isValid && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {parsedWorkOrder.errors.join(', ')}
                  </Alert>
                )} */}

                {parsedWorkOrder.commands.map((cmd, index) => (
                  <Box key={index} mb={1}>
                    <Chip
                      label={cmd.description}
                      color={cmd.isValid ? 'success' : 'error'}
                      variant={cmd.isValid ? 'filled' : 'outlined'}
                      size="small"
                    />
                  </Box>
                ))}
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
          />

          {/* Command Examples */}
          {/* <Box mt={2} mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Example Commands:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {WorkOrderParser.getCommandExamples().map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  variant="outlined"
                  size="small"
                  onClick={() => setWorkOrderCommand(example)}
                  clickable
                />
              ))}
            </Box>
          </Box> */}

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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkOrderDialogOpen(false)}>
            Cancel
          </Button>
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightList;