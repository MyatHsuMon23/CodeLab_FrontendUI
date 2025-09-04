// src/pages/FlightList.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTable from '../components/CustomTable';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
  Collapse,
  Stack,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  FlightTakeoff as FlightIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/reduxStore';
import { 
  setFilters, 
  setSortOptions
} from '@store/flightReducer';
import { useFlightList } from '@hook/flight/queries';
import { useAlert } from '@provider/AlertProvider';
import FlightImport from '@component/FlightImport';
import type { Flight, FlightSortOptions } from '@type/flight.types';
import { formatDistanceToNow, parseISO } from 'date-fns';

const FlightList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  // Redux state
  const { 
    flights, 
    filters, 
    sortOptions 
  } = useSelector((state: RootState) => state.flight);

  // Local state
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
    navigate(`/flights/${flight.id}`);
  }, [navigate]);

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
                <Tooltip title="View Flight Details">
                  <IconButton color="primary" onClick={() => handleSelectFlight(row)}>
                    <VisibilityIcon />
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
    </Box>
  );
};

export default FlightList;