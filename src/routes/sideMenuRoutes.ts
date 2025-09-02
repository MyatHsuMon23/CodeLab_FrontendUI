import * as React from 'react';
import createIcon from '@assets/images/create.png';
import searchIcon from '@assets/images/search.png';

export interface SideMenuRoute {
  label: string;
  icon?: React.ReactNode;
  path: string;
  description?: string;
}

export const sideMenuRoutes: SideMenuRoute[] = [
  {
    label: 'Create',
    icon: React.createElement('img', { src: createIcon, alt: 'Create', style: { width: 20, height: 16 } }),
    path: '/create',
    description: 'Create a new FTA check',
  },
  // {
  //   label: 'FTA Check Detail',
  //   icon: React.createElement('img', { src: createIcon, alt: 'FTA Check List', style: { width: 20, height: 16 } }),
  //   path: '/fta-check-detail',
  //   description: 'FTA check List',
  // },
  {
    label: 'Search',
    icon: React.createElement('img', { src: searchIcon, alt: 'Search', style: { width: 20, height: 13 } }),
    path: '/search',
    description: 'Search for existing FTA’s',
  },
];
