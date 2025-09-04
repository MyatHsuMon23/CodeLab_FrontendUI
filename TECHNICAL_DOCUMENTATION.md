# Technical Development Documentation

## Architecture Overview

The Flight Work Orders Management System is built using a modern React architecture with a focus on maintainability, type safety, and performance.

## Core Technologies Deep Dive

### 1. React 19.1.0 with TypeScript
- **Modern React**: Utilizes the latest React features including hooks, context, and concurrent features
- **TypeScript Integration**: Full type safety throughout the application
- **Component Architecture**: Functional components with hooks-based state management

### 2. State Management Architecture

#### Redux Store Structure
```typescript
// Store Configuration (src/store/reduxStore.ts)
const rootReducer = combineReducers({
  auth: authReducer,      // Authentication state
  menu: menuReducer,      // Navigation state  
  ui: uiReducer,         // UI state (loading, dialogs)
  flight: flightReducer, // Flight-specific state
});
```

#### Redux Persist Configuration
```typescript
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['menu'], // Menu state is not persisted
};
```

#### State Reducers

1. **Auth Reducer** (`src/store/authReducer.ts`)
   - Manages authentication state
   - Handles JWT tokens (access & refresh)
   - User session management

2. **Menu Reducer** (`src/store/menuReducer.ts`)
   - Navigation state
   - Selected menu tracking
   - Subtitle management

3. **Flight Reducer** (`src/store/flightReducer.ts`)
   - Flight-specific state
   - Work order history
   - Flight data caching

### 3. Data Fetching with React Query

#### Query Configuration
```typescript
// Custom hooks for data fetching (src/hooks/flight/queries.ts)
export const useFlightList = (filters, pagination) => {
  return useQuery({
    queryKey: flightQueryKeys.list(filters, pagination),
    queryFn: () => clientApi.get(ApiEndpoints.flights.getFlights(), {
      ...filters,
      ...pagination
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### Mutation Hooks
```typescript
// Mutation hooks for data modification (src/hooks/flight/mutations.ts)
export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation({
    mutationFn: (workOrderData) =>
      clientApi.post(ApiEndpoints.workOrders.createWorkOrder(), workOrderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      showAlert({ type: 'success', message: data?.message });
    },
    onError: (error) => {
      showAlert({ type: 'error', message: error?.message });
    },
  });
};
```

### 4. API Layer Architecture

#### HTTP Client with Authentication
```typescript
// Authenticated HTTP client (src/api/resourceApi.ts)
export function useClientApi() {
  const baseFetch = useBaseFetch();
  return {
    get: <T>(endpoint: string, params?: QueryParams) => 
      baseFetch<T>(endpoint, { method: 'GET', params }),
    post: <T>(endpoint: string, body?: unknown) => 
      baseFetch<T>(endpoint, { method: 'POST', body }),
    put: <T>(endpoint: string, body?: unknown) => 
      baseFetch<T>(endpoint, { method: 'PUT', body }),
    delete: <T>(endpoint: string, params?: QueryParams) => 
      baseFetch<T>(endpoint, { method: 'DELETE', params }),
  };
}
```

#### API Endpoints Organization
```typescript
// Centralized API endpoints (src/api/endpoints.ts)
export const ApiEndpoints = {
  auth: {
    authToken: () => '/Auth/login',
    refreshToken: () => '/auth/refresh-token',
  },
  flights: {
    getFlights: () => '/Flights',
    createFlight: () => '/Flights',
    getFlight: (id: string) => `/Flights/${id}`,
    importFlights: () => '/Flights/import',
  },
  workOrders: {
    getWorkOrders: () => '/WorkOrders',
    createWorkOrder: () => '/WorkOrders',
    updateWorkOrder: (id: number) => `/WorkOrders/${id}`,
    getWorkOrderStatistics: () => '/WorkOrders/statistics',
  },
};
```

### 5. Authentication System

#### JWT Token Management
```typescript
// Authentication hook (src/hooks/auth/useBackendLogin.ts)
export const useBackendLogin = () => {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const loginToBackend = async (payload: { userName: string; password: string }) => {
    const response = await fetch(authURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (result.success && result.data.accessToken) {
      dispatch(setTokens({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }));
      return { success: true, data: result.data };
    }
  };
};
```

#### Token Refresh Strategy
```typescript
// Automatic token refresh (src/hooks/auth/useRefreshToken.ts)
export const useRefreshToken = () => {
  const refreshTokenFlow = async () => {
    // Automatic token refresh logic
    // Handles expired tokens seamlessly
  };
};
```

### 6. Form Management with React Hook Form

#### Form Configuration
```typescript
// Work Orders form (src/pages/WorkOrders.tsx)
const createForm = useForm<WorkOrderCreateData>({
  defaultValues: {
    aircraftRegistration: '',
    taskDescription: '',
    priority: 1,
    assignedTechnician: '',
    scheduledDate: '',
    notes: ''
  }
});

const handleCreate = async (data: WorkOrderCreateData) => {
  try {
    await createMutation.mutateAsync(data);
    createForm.reset();
    refetchWorkOrders();
  } catch (error) {
    // Error handled by mutation
  }
};
```

#### Validation with Yup
```typescript
// Form validation schema (src/pages/Login.tsx)
const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

### 7. UI Component Architecture

#### Layout System
```typescript
// Dashboard Layout (src/layouts/DashboardLayout.tsx)
const DashboardLayout = ({ children }) => {
  const { selectedMenu, subTitle } = useSelector((state) => state.menu);
  const { accessToken } = useSelector((state) => state.auth.user);
  
  // Protected route logic
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Navigation */}
      <Drawer variant="permanent">
        {/* Navigation Menu */}
      </Drawer>
      {/* Main Content */}
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};
```

#### Material-UI Theming
```typescript
// Custom theme configuration (src/theme.ts)
const theme = createTheme({
  palette: {
    primary: { main: '#2f70d2' },
    secondary: { main: '#00263D' },
    background: {
      default: '#f4f6f8',
      paper: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#2f70d2',
          '&:hover': {
            backgroundColor: '#00263D',
          },
        },
      },
    },
  },
});
```

### 8. Routing Strategy

#### Protected Routes
```typescript
// Route protection (src/App.tsx)
const App = () => {
  const isAuthenticated = useSelector((state) => 
    !!state.auth?.user?.accessToken
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/flights"
          element={isAuthenticated ? (
            <DashboardLayout><FlightList /></DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
};
```

#### Navigation Configuration
```typescript
// Side menu routes (src/routes/sideMenuRoutes.ts)
export const sideMenuRoutes: SideMenuRoute[] = [
  {
    label: 'Flights',
    icon: React.createElement(FlightIcon),
    path: '/flights',
    description: 'Manage flights and work orders',
  },
  {
    label: 'Work Orders',
    icon: React.createElement(WorkOrderIcon),
    path: '/work-orders-management',
    description: 'Manage work orders',
  },
];
```

### 9. Custom Hooks Deep Dive

#### Authentication Hooks
```typescript
// useBackendLogin.ts - JWT Authentication
export const useBackendLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const loginToBackend = async (payload: { userName: string; password: string }) => {
    // Encrypt password and send to backend
    const encryptedPayload = {
      userName: payload.userName,
      password: encrypt(payload.password), // Custom encryption utility
    };
    
    // JWT token handling and Redux store update
    const result = await fetch(authURL, { /* ... */ });
    if (result.success) {
      dispatch(setTokens({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }));
    }
  };
};

// useRefreshToken.ts - Automatic Token Refresh
export const useRefreshToken = () => {
  const refreshTokenFlow = async () => {
    // Handles token expiration seamlessly
    // Automatic re-authentication without user intervention
  };
};
```

#### Flight Management Hooks
```typescript
// Custom query hooks for flight data
export const useFlightList = (filters, pagination) => {
  return useQuery({
    queryKey: flightQueryKeys.list(filters, pagination),
    queryFn: () => clientApi.get(ApiEndpoints.flights.getFlights(), {
      page: pagination.page,
      limit: pagination.limit,
      status: filters.status,
      search: filters.search
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 10 * 60 * 1000, // 10 minutes in cache
  });
};

export const useFlightDetail = (flightId: string) => {
  return useQuery({
    queryKey: flightQueryKeys.detail(flightId),
    queryFn: () => clientApi.get(ApiEndpoints.flights.getFlight(flightId)),
    enabled: !!flightId, // Only run when flightId exists
  });
};
```

#### Work Order Management Hooks
```typescript
// Mutation hooks for CRUD operations
export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const clientApi = useClientApi();

  return useMutation({
    mutationFn: (workOrderData: WorkOrderCreateData) =>
      clientApi.post(ApiEndpoints.workOrders.createWorkOrder(), workOrderData),
    onMutate: async (newWorkOrder) => {
      // Optimistic update - immediately update UI
      await queryClient.cancelQueries({ queryKey: flightQueryKeys.workOrders.all });
      const previousWorkOrders = queryClient.getQueryData(flightQueryKeys.workOrders.all);
      queryClient.setQueryData(flightQueryKeys.workOrders.all, old => [...old, newWorkOrder]);
      return { previousWorkOrders };
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.all });
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.workOrders.statistics });
      showAlert({ type: 'success', message: data?.message || 'Work order created successfully!' });
    },
    onError: (error, newWorkOrder, context) => {
      // Rollback optimistic update on error
      if (context?.previousWorkOrders) {
        queryClient.setQueryData(flightQueryKeys.workOrders.all, context.previousWorkOrders);
      }
      showAlert({ type: 'error', message: error?.message || 'Failed to create work order' });
    },
  });
};

export const useWorkOrderStatistics = () => {
  return useQuery({
    queryKey: flightQueryKeys.workOrders.statistics,
    queryFn: () => clientApi.get(ApiEndpoints.workOrders.getWorkOrderStatistics()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
```

#### File Import Hooks
```typescript
// useImportFlights.ts - Bulk data import with progress tracking
export const useImportFlightsCSV = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload with progress tracking
      return clientApi.post(ApiEndpoints.flights.importFlightsCSV(), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Update progress state
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: flightQueryKeys.list() });
      showAlert({ type: 'success', message: data?.message || 'Flights imported successfully!' });
    }
  });
};
```

### 10. Redux Store Implementation Details

#### Store Configuration with Persistence
```typescript
// reduxStore.ts - Complete store setup
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

const rootReducer = combineReducers({
  auth: authReducer,      // Authentication state
  menu: menuReducer,      // Navigation state
  ui: uiReducer,         // UI state (modals, loading)
  flight: flightReducer, // Flight-specific state
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['menu'], // Don't persist menu state (resets on reload)
  whitelist: ['auth', 'ui', 'flight'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // Redux Persist actions
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});
```

#### Auth Reducer with JWT Management
```typescript
// authReducer.ts - Authentication state management
interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.user = {
        ...state.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    logout: (state) => {
      // Clear all authentication data
      state.isAuthenticated = false;
      state.user = {
        name: '',
        email: '',
        accessToken: '',
        refreshToken: '',
      };
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});
```

#### Flight Reducer with Work Order Integration
```typescript
// flightReducer.ts - Flight and work order state
interface FlightState {
  selectedFlight: Flight | null;
  flightFilters: FlightFilters;
  workOrderHistory: WorkOrder[];
  importProgress: number;
}

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    updateFlightFilters: (state, action) => {
      state.flightFilters = { ...state.flightFilters, ...action.payload };
    },
    addWorkOrderToHistory: (state, action) => {
      // Add new work order to beginning of history (latest first)
      state.workOrderHistory.unshift(action.payload);
    },
    updateImportProgress: (state, action) => {
      state.importProgress = action.payload;
    },
    clearFlightData: (state) => {
      state.selectedFlight = null;
      state.workOrderHistory = [];
    },
  },
});
```

#### Menu Reducer for Navigation State
```typescript
// menuReducer.ts - Navigation state management
interface MenuState {
  selectedMenu: string;
  subTitle: string;
  sidebarCollapsed: boolean;
}

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    selectedMenu: 'Flights',
    subTitle: 'Manage flights and work orders',
    sidebarCollapsed: false,
  },
  reducers: {
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload.selectedMenu;
      state.subTitle = action.payload.subTitle;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});
```

#### UI Reducer for Application UI State
```typescript
// uiReducer.ts - Global UI state management
interface UIState {
  loading: boolean;
  loadingMessage: string;
  modals: {
    createWorkOrder: boolean;
    editWorkOrder: boolean;
    deleteConfirm: boolean;
    flightDetail: boolean;
  };
  notifications: Notification[];
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
  },
});
```

### 11. React Query Integration Patterns

#### Query Key Management
```typescript
// Query keys for consistent caching
export const flightQueryKeys = {
  all: ['flights'] as const,
  lists: () => [...flightQueryKeys.all, 'list'] as const,
  list: (filters?: any, pagination?: any) => 
    [...flightQueryKeys.lists(), { filters, pagination }] as const,
  details: () => [...flightQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...flightQueryKeys.details(), id] as const,
  workOrders: {
    all: [...flightQueryKeys.all, 'workOrders'] as const,
    lists: () => [...flightQueryKeys.workOrders.all, 'list'] as const,
    list: (filters?: any) => [...flightQueryKeys.workOrders.lists(), filters] as const,
    statistics: [...flightQueryKeys.workOrders.all, 'statistics'] as const,
  },
};
```

### 12. Error Handling Strategy
```typescript
// Global error handling for queries
const queryErrorHandler = (error: ApiError) => {
  if (error.status === 401) {
    // Handle unauthorized - redirect to login
    store.dispatch(logout());
    window.location.href = '/login';
  } else if (error.status >= 500) {
    // Server errors
    showAlert({ type: 'error', message: 'Server error. Please try again later.' });
  } else {
    // Client errors
    showAlert({ type: 'error', message: error.message });
  }
};

// Apply to QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      retry: (failureCount, error) => {
        // Don't retry on 401/403
        if (error.status === 401 || error.status === 403) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
```

#### Global Error Boundary

#### Global Error Boundary
```typescript
// Alert Provider (src/provider/AlertProvider.tsx)
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = ({ type, message }) => {
    setAlert({ type, message });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
    </AlertContext.Provider>
  );
};
```

#### API Error Handling
```typescript
// Error handling in API layer (src/api/resourceApi.ts)
const baseFetch = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  try {
    const response = await fetchWithAuth(requestUrl, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || 'Request failed', response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred', 500);
  }
};
```

### 10. Performance Optimizations

#### React Query Caching
- **Stale Time**: 5-minute cache for flight data
- **Cache Invalidation**: Smart invalidation on mutations
- **Background Refetching**: Automatic data synchronization

#### Code Splitting
- **Lazy Loading**: Components loaded on demand
- **Route-based Splitting**: Pages split by routes
- **Bundle Optimization**: Vite's automatic optimizations

#### Memoization
```typescript
// Computed values optimization
const workOrders = useMemo(() => 
  workOrdersData?.data || [], [workOrdersData]
);

const filteredWorkOrders = useMemo(() => 
  workOrders.filter(order => order.status === selectedStatus),
  [workOrders, selectedStatus]
);
```

### 11. Development Workflow

#### Build Process
```json
// Package.json scripts
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "tsc -b && vite build", // Production build
    "lint": "eslint .",               // Code linting
    "preview": "vite preview"         // Preview production build
  }
}
```

#### TypeScript Configuration
```json
// tsconfig.json - Type checking configuration
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx"
  }
}
```

#### Vite Configuration
```typescript
// vite.config.ts - Build tool configuration
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'ES2020',
    outDir: 'dist',
    sourcemap: true
  }
});
```

### 12. Testing Strategy

#### Unit Testing Setup
- **Testing Framework**: Not currently implemented
- **Recommended**: Jest + React Testing Library
- **Coverage**: Component testing, hook testing, utility testing

#### Integration Testing
- **API Integration**: Test API layer with mock responses
- **Form Testing**: Test form validation and submission
- **Navigation Testing**: Test route protection and navigation

### 13. Deployment Considerations

#### Environment Variables
```env
VITE_API_URL=https://api.example.com
# Add other environment-specific variables
```

#### Build Optimization
- **Tree Shaking**: Automatic with Vite
- **Code Splitting**: Route-based and component-based
- **Asset Optimization**: Image and bundle optimization

#### Static Hosting
- **Azure Static Web Apps**: Configured with `staticwebapp.config.json`
- **Netlify/Vercel**: Compatible with standard SPA configuration

## Development Best Practices

### 1. Code Organization
- **Feature-based Structure**: Group related files together
- **Absolute Imports**: Use path aliases for clean imports
- **Type Safety**: Comprehensive TypeScript coverage

### 2. State Management
- **Single Source of Truth**: Redux for global state
- **Local State**: React hooks for component-specific state
- **Server State**: React Query for API data

### 3. Performance
- **Lazy Loading**: Components and routes
- **Memoization**: Expensive computations
- **Efficient Rendering**: Proper dependency arrays

### 4. Security
- **JWT Management**: Secure token storage and refresh
- **API Security**: Authenticated requests
- **Route Protection**: Client-side route guards

### 5. Accessibility
- **Material-UI**: Built-in accessibility features
- **Semantic HTML**: Proper element usage
- **Keyboard Navigation**: Full keyboard support

This technical documentation provides a comprehensive overview of the application's architecture, key patterns, and development practices used in the Flight Work Orders Management System.