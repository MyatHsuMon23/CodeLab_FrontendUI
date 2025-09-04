import { WorkOrderPriority, WorkOrderPriorityMap, WorkOrderStatus, WorkOrderStatusMap } from "@type/flight.types";

// Helper functions
  export const getStatusColor = (status: WorkOrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (WorkOrderStatusMap[status]) {
      case 'Open': return 'info';
      case 'InProgress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'OnHold': return 'secondary';
      default: return 'default';
    }
  };

  export const getPriorityColor = (priority: WorkOrderPriority): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (WorkOrderPriorityMap[priority]) {
      case 'Low': return 'default';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };