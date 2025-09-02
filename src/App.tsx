import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '@page/Create.js';
import Login from '@page/Login.js';
import Layout from '@layout/Layout.js';
import './App.css';
import { AlertProvider } from '@provider/AlertProvider.js';
import Alert from '@component/Alert.js';
import FTACheckDetail from '@page/FTACheckDetail.js';
import DashboardLayout from '@layout/DashboardLayout.js';
import Search from '@page/Search.js';
import FlightList from '@page/FlightList.js';
import WorkOrderHistory from '@page/WorkOrderHistory.js';
import BackdropLoading from '@component/BackdropLoading';
const App: React.FC = () => {
  const { isLoading, loadingDescription } = useSelector((state: any) => state.ui);
  const isAuthenticated = useSelector((state: any) => !!state.auth?.user?.accessToken);
  return (
    <AlertProvider>
      <Alert />
      <BackdropLoading open={isLoading} description={loadingDescription} />
      <Router>
        <Routes>
          {/* Redirect root "/" based on auth */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/flights" /> : <Navigate to="/login" />}
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
            path="/work-orders"
            element={isAuthenticated ? (
              <DashboardLayout>
                <WorkOrderHistory />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )}
          />
        </Routes>
      </Router>
    </AlertProvider>
  );
};


export default App;
