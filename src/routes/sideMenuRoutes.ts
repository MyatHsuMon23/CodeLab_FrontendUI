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
    icon: React.createElement(FlightIcon, { style: { width: 20, height: 16 } }),
    path: '/flights',
    description: 'Manage flights and work orders',
  },
  {
    label: 'Work Order History',
    icon: React.createElement(HistoryIcon, { style: { width: 20, height: 16 } }),
    path: '/work-orders',
    description: 'View work order submissions',
  },
  {
    label: 'Create FTA Check',
    icon: React.createElement('img', { src: createIcon, alt: 'Create', style: { width: 20, height: 16 } }),
    path: '/create',
    description: 'Create a new FTA check',
  },
  {
    label: 'Search',
    icon: React.createElement('img', { src: searchIcon, alt: 'Search', style: { width: 20, height: 13 } }),
    path: '/search',
    description: 'Search for existing FTAs',
  },
];