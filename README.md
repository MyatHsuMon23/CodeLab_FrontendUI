# Flight Work Orders Management System

A comprehensive flight and work orders management application built with React, TypeScript, and modern web technologies.

![Login Page](https://github.com/user-attachments/assets/a54a4c1c-d712-4133-bd68-3076168eb2a0)

## Overview

This application provides a complete solution for managing flights and their associated work orders. It features a modern, responsive UI built with Material-UI and offers comprehensive functionality for aviation maintenance management.

## Features

### 🛩️ Flight Management
- **Flight List**: View and manage all flights with filtering and pagination
- **Flight Details**: Detailed view of individual flights with associated work orders
- **Flight Import**: Bulk import flights from CSV or JSON files
- **Real-time Updates**: Live data synchronization with React Query

### 🔧 Work Orders Management
- **Work Orders Dashboard**: Comprehensive management of maintenance work orders
- **Create & Edit**: Form-based creation and editing of work orders
- **Status Tracking**: Track work order progress and priorities
- **Statistics**: Visual statistics and reporting on work order metrics
- **Flight Integration**: Link work orders to specific flights

### 🔐 Authentication & Security
- **Secure Login**: JWT-based authentication system
- **Session Management**: Automatic token refresh and secure session handling
- **Protected Routes**: Role-based access control

### 📱 User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Customizable Material-UI theming
- **Loading States**: Smooth loading indicators and error handling
- **Notifications**: Toast notifications for user feedback

## Technology Stack

### Frontend Framework
- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI & Styling
- **Material-UI (MUI) 7.3.2** - Comprehensive React component library
- **Material Icons** - Icon library
- **Custom Theme** - Branded color scheme and typography

### State Management
- **Redux Toolkit 2.8.2** - Predictable state container
- **Redux Persist** - Persist and rehydrate Redux store
- **React Query (TanStack) 5.79.0** - Server state management

### Form Management
- **React Hook Form 7.62.0** - Performant forms with easy validation
- **Yup** - Schema validation

### Routing & Navigation
- **React Router DOM 7.6.0** - Declarative routing

### Data & API
- **Axios 1.9.0** - HTTP client for API calls
- **JWT Decode** - JWT token handling
- **Date-fns** - Date manipulation utilities

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Application Workflow

### 1. Authentication Flow
```
Login Page → JWT Token → Redux Store → Protected Routes
```

### 2. Flight Management Workflow
```
Flight List → Filter/Search → Flight Details → Work Orders → Actions
```

### 3. Work Order Workflow
```
Work Orders Dashboard → Create/Edit → Status Updates → Statistics
```

### 4. Data Flow
```
UI Components → React Query → API Calls → Backend → State Updates
```

## Project Structure

```
src/
├── api/                 # API configuration and endpoints
│   ├── endpoints.ts     # API endpoint definitions
│   ├── fetchWithAuth.ts # Authenticated HTTP client
│   └── resourceApi.ts   # HTTP client with auth handling
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── Alert.tsx        # Notification system
│   ├── BackdropLoading.tsx
│   ├── CustomTable.tsx  # Data table component
│   └── FlightImport.tsx # File import component
├── hooks/               # Custom React hooks
│   ├── auth/           # Authentication hooks
│   ├── flight/         # Flight-related hooks
│   └── queries/        # React Query hooks
├── layouts/             # Page layout components
│   ├── DashboardLayout.tsx
│   └── Layout.tsx
├── pages/               # Page components
│   ├── FlightDetail.tsx
│   ├── FlightList.tsx
│   ├── FlightWorkOrders.tsx
│   ├── Login.tsx
│   └── WorkOrders.tsx
├── provider/            # React context providers
│   └── AlertProvider.tsx
├── routes/              # Routing configuration
│   └── sideMenuRoutes.ts
├── store/               # Redux store and reducers
│   ├── authReducer.ts
│   ├── flightReducer.ts
│   ├── menuReducer.ts
│   ├── reduxStore.ts
│   └── uiReducer.ts
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── theme.ts            # Material-UI theme configuration
```

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MyatHsuMon23/CodeLab_FrontendUI.git
   cd CodeLab_FrontendUI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_backend_api_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to `http://localhost:5173` in your browser

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

```bash
npm run lint
```

## Key Features Implementation

### Authentication System
- JWT-based authentication with automatic token refresh
- Secure route protection
- Login form with validation
- Session persistence with Redux Persist

### Flight Management
- CRUD operations for flights
- File import functionality (CSV/JSON)
- Advanced filtering and search
- Pagination support

### Work Orders System
- Comprehensive work order management
- Status tracking and priority management
- Statistics dashboard
- Flight integration

### UI/UX Features
- Responsive Material-UI design
- Custom theme implementation
- Loading states and error handling
- Toast notifications
- Collapsible sidebar navigation

## API Integration

The application integrates with a backend API through:
- RESTful API endpoints
- JWT authentication
- React Query for caching and synchronization
- Error handling and retry logic

## Documentation

This project includes comprehensive documentation:

- **[README.md](README.md)** - Project overview, features, and setup instructions
- **[TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)** - Detailed technical architecture and development guide
- **[WORKFLOW_DOCUMENTATION.md](WORKFLOW_DOCUMENTATION.md)** - UI workflow and user experience documentation with screenshots

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
