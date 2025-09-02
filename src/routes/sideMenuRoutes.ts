import * as React from 'react';
import createIcon from '@assets/images/create.png';
import searchIcon from '@assets/images/search.png';
import { 
  Flight as FlightIcon, 
  History as HistoryIcon 
} from '@mui/icons-material';

export interface SideMenuRoute {
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
}

export const sideMenuRoutes: SideMenuRoute[] = [
  {
    label: 'Flights',
    icon: React.createElement(FlightIcon, { style: { width: 20, height: 20 } }),
    path: '/flights',
    description: 'Manage flights and work orders',
  },
  {
    label: 'Work Order History',
    icon: React.createElement(HistoryIcon, { style: { width: 20, height: 20 } }),
    path: '/work-orders',
    description: 'View work order submissions',
  }
];