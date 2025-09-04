import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '@page/Login.js';
import Layout from '@layout/Layout.js';
import './App.css';
import { AlertProvider } from '@provider/AlertProvider.js';
import Alert from '@component/Alert.js';
import DashboardLayout from '@layout/DashboardLayout.js';
import FlightList from '@page/FlightList.js';
import FlightDetail from '@page/FlightDetail.js';
import WorkOrderHistory from '@page/WorkOrderHistory.js';
import WorkOrders from '@page/WorkOrders.js';
import BackdropLoading from '@component/BackdropLoading';
const App: React.FC = () => {
  const isAuthenticated = useSelector((state: any) => !!state.auth?.user?.accessToken);
  return (
    <AlertProvider>
      <Alert />
      {/* <BackdropLoading open={isLoading} description={loadingDescription} /> */}
      <Router>
        <Suspense fallback={<BackdropLoading open={true} description="Loading page..." />}>
          <Routes>
            {/* Redirect root "/" based on auth */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/work-orders-management" /> : <Navigate to="/login" />}
            />
            {/* Public Routes */}
            <Route path="/login" element={<Layout><Login /></Layout>} />
            {/* Protected Dashboard Route */}
            <Route
              path="/flights"
              element={isAuthenticated ? (
                <DashboardLayout>
                  <FlightList />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )}
            />
            <Route
              path="/flights/:id"
              element={isAuthenticated ? (
                <DashboardLayout>
                  <FlightDetail />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )}
            />
            <Route
              path="/work-orders"
              element={isAuthenticated ? (
                <DashboardLayout>
                  <WorkOrderHistory />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )}
            />
            <Route
              path="/work-orders-management"
              element={isAuthenticated ? (
                <DashboardLayout>
                  <WorkOrders />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )}
            />
          </Routes>
        </Suspense>
      </Router>
    </AlertProvider>
  );
};


export default App;
