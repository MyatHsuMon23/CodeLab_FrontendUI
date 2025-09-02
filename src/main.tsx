import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import App from './App.jsx';
import { store, persistor } from '@store/reduxStore.js';
import theme from './theme.js';
import { ReactQueryProvider } from '@provider/ReactQueryProvider.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ReactQueryProvider>
            <App />
          </ReactQueryProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);