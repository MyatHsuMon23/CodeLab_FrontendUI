// src/pages/WorkOrders.tsx

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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Pagination,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Assignment as WorkOrderIcon,
  TrendingUp as StatsIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { 
  useWorkOrderList, 
  useWorkOrderStatistics 
} from '@hook/flight/queries';
import { 
  useCreateWorkOrder, 
  useUpdateWorkOrder, 
  useDeleteWorkOrder 
} from '@hook/flight/mutations';
import {
  WorkOrderStatusMap,
  WorkOrderPriorityMap,
  WorkOrderStatusReverseMap,
  WorkOrderPriorityReverseMap
} from '@type/flight.types';
import type { 
  WorkOrder, 
  WorkOrderFilters, 
  WorkOrderPaginationParams,
  WorkOrderCreateData,
  WorkOrderUpdateData,
  WorkOrderStatus,
  WorkOrderPriority
} from '@type/flight.types';

const WorkOrders: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<WorkOrderFilters>({});
  const [pagination, setPagination] = useState<WorkOrderPaginationParams>({ page: 1, perPage: 10 });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // API hooks
  const { 
    data: workOrdersData, 
    isLoading: workOrdersLoading, 
    error: workOrdersError,
    refetch: refetchWorkOrders 
  } = useWorkOrderList(filters, pagination);

  const { 
    data: statisticsData, 
    isLoading: statisticsLoading,
    refetch: refetchStatistics
  } = useWorkOrderStatistics();

  const createMutation = useCreateWorkOrder();
  const updateMutation = useUpdateWorkOrder();
  const deleteMutation = useDeleteWorkOrder();

  // Form management
  const createForm = useForm<WorkOrderCreateData>({
    defaultValues: {
      aircraftRegistration: '',
      taskDescription: '',
      priority: 1, // Medium
      assignedTechnician: '',
      scheduledDate: '',
      notes: ''
    }
  });

  const editForm = useForm<WorkOrderUpdateData>();

  // Computed values
  const workOrders = workOrdersData?.data || [];
  const statistics = statisticsData?.data;

  // Status and priority options
  const statusOptions: WorkOrderStatus[] = [0, 1, 2, 3, 4];
  const priorityOptions: WorkOrderPriority[] = [0, 1, 2, 3];

  // Helper functions
  const getStatusColor = (status: WorkOrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (WorkOrderStatusMap[status]) {
      case 'Open': return 'info';
      case 'InProgress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'OnHold': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: WorkOrderPriority): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (WorkOrderPriorityMap[priority]) {
      case 'Low': return 'default';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  // Event handlers
  const handleFilterChange = (key: keyof WorkOrderFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: typeof value === 'number' ? WorkOrderStatusMap[value] : value || undefined
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPagination({ page: 1, perPage: newPerPage });
  };

  const handleCreate = async (data: WorkOrderCreateData) => {
    try {
      await createMutation.mutateAsync(data);
      setCreateDialogOpen(false);
      createForm.reset();
      refetchWorkOrders();
      refetchStatistics();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEdit = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    // Ensure status and priority are numeric values
    const statusValue = typeof workOrder.status === 'string'
      ? WorkOrderStatusReverseMap[workOrder.status] ?? 0
      : (workOrder.status ?? 0);
    const priorityValue = typeof workOrder.priority === 'string'
      ? WorkOrderPriorityReverseMap[workOrder.priority] ?? 1
      : (workOrder.priority ?? 1);
    editForm.reset({
      id: workOrder.id,
      workOrderNumber: workOrder.workOrderNumber,
      aircraftRegistration: workOrder.aircraftRegistration,
      taskDescription: workOrder.taskDescription,
      status: statusValue as WorkOrderStatus,
      priority: priorityValue as WorkOrderPriority,
      assignedTechnician: workOrder.assignedTechnician,
      scheduledDate: workOrder.scheduledDate,
      notes: workOrder.notes || ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: WorkOrderUpdateData) => {
    try {
      // Ensure status and priority are numeric values
      const statusValue = typeof data.status === 'string'
        ? WorkOrderStatusReverseMap[data.status] ?? 0
        : (data.status ?? 0);
      const priorityValue = typeof data.priority === 'string'
        ? WorkOrderPriorityReverseMap[data.priority] ?? 1
        : (data.priority ?? 1);
      const payload: WorkOrderUpdateData = {
        ...data,
        status: statusValue as WorkOrderStatus,
        priority: priorityValue as WorkOrderPriority
      };
      await updateMutation.mutateAsync(payload);
      setEditDialogOpen(false);
      setSelectedWorkOrder(null);
      editForm.reset();
      refetchWorkOrders();
      refetchStatistics();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (selectedWorkOrder) {
      try {
        await deleteMutation.mutateAsync(selectedWorkOrder.id);
        setDeleteConfirmOpen(false);
        setSelectedWorkOrder(null);
        refetchWorkOrders();
        refetchStatistics();
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleRefresh = () => {
    refetchWorkOrders();
    refetchStatistics();
  };

  if (workOrdersError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load work orders. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Work Orders Management
          </Typography>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={workOrdersLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              New Work Order
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        {statistics && !statisticsLoading && (
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <StatsIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4">{statistics.totalWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">Total</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">{statistics.openWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">Open</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">{statistics.inProgressWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">In Progress</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">{statistics.completedWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">{statistics.criticalPriorityWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">Critical</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 120, flex: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">{statistics.highPriorityWorkOrders}</Typography>
                <Typography variant="body2" color="text.secondary">High Priority</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Filters */}
        <Box mb={3}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={String(filters.status ?? '')}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                renderValue={selected => selected === '' ? 'All' : WorkOrderStatusMap[Number(selected)]}
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(WorkOrderStatusMap).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={String(filters.priority ?? '')}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                renderValue={selected => selected === '' ? 'All' : WorkOrderPriorityMap[Number(selected)]}
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(WorkOrderPriorityMap).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Aircraft Registration"
              value={filters.aircraftRegistration || ''}
              onChange={(e) => handleFilterChange('aircraftRegistration', e.target.value)}
              placeholder="e.g., N123AB"
              sx={{ minWidth: 150 }}
            />
            <TextField
              size="small"
              label="Assigned Technician"
              value={filters.assignedTechnician || ''}
              onChange={(e) => handleFilterChange('assignedTechnician', e.target.value)}
              placeholder="e.g., John Doe"
              sx={{ minWidth: 150 }}
            />
          </Box>
        </Box>

        {/* Work Orders Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Work Order</TableCell>
                <TableCell>Aircraft</TableCell>
                <TableCell>Task Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workOrdersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : workOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No work orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                workOrders.map((workOrder) => (
                  <TableRow key={workOrder.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {workOrder.workOrderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{workOrder.aircraftRegistration}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {workOrder.taskDescription.length > 50 
                          ? `${workOrder.taskDescription.substring(0, 50)}...`
                          : workOrder.taskDescription
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={workOrder.status} 
                        color={getStatusColor(workOrder.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={workOrder.priority} 
                        color={getPriorityColor(workOrder.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{workOrder.assignedTechnician}</TableCell>
                    <TableCell>{formatDate(workOrder.scheduledDate)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEdit(workOrder)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setSelectedWorkOrder(workOrder);
                              setDeleteConfirmOpen(true);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {workOrdersData && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(workOrdersData.totalCount / pagination.perPage)}
              page={pagination.page}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Create Work Order Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={createForm.handleSubmit(handleCreate)}>
          <DialogTitle>Create New Work Order</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
              <Box display="flex" gap={2}>
                <Controller
                  name="aircraftRegistration"
                  control={createForm.control}
                  rules={{ required: 'Aircraft registration is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Aircraft Registration"
                      placeholder="e.g., N123AB"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="assignedTechnician"
                  control={createForm.control}
                  rules={{ required: 'Assigned technician is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Assigned Technician"
                      placeholder="e.g., Jane Smith"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Controller
                name="taskDescription"
                control={createForm.control}
                rules={{ required: 'Task description is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Task Description"
                    placeholder="Describe the maintenance task..."
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name="priority"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select {...field} label="Priority">
                        {priorityOptions.map(priority => (
                          <MenuItem key={priority} value={priority}>{WorkOrderPriorityMap[priority]}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="scheduledDate"
                  control={createForm.control}
                  rules={{ required: 'Scheduled date is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Scheduled Date"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Controller
                name="notes"
                control={createForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={2}
                    label="Notes (Optional)"
                    placeholder="Additional notes..."
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Work Order'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Work Order Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={editForm.handleSubmit(handleUpdate)}>
          <DialogTitle>Edit Work Order</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 1 }}>
              <Box display="flex" gap={2}>
                <Controller
                  name="workOrderNumber"
                  control={editForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Work Order Number"
                      disabled
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        {statusOptions.map(status => (
                          <MenuItem key={status} value={status}>{WorkOrderStatusMap[status]}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box display="flex" gap={2}>
                <Controller
                  name="aircraftRegistration"
                  control={editForm.control}
                  rules={{ required: 'Aircraft registration is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Aircraft Registration"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="assignedTechnician"
                  control={editForm.control}
                  rules={{ required: 'Assigned technician is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Assigned Technician"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Controller
                name="taskDescription"
                control={editForm.control}
                rules={{ required: 'Task description is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Task Description"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name="priority"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select {...field} label="Priority">
                        {priorityOptions.map(priority => (
                          <MenuItem key={priority} value={priority}>{WorkOrderPriorityMap[priority]}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="scheduledDate"
                  control={editForm.control}
                  rules={{ required: 'Scheduled date is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Scheduled Date"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Controller
                name="notes"
                control={editForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={2}
                    label="Notes"
                    placeholder="Additional notes..."
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Work Order'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete work order "{selectedWorkOrder?.workOrderNumber}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkOrders;