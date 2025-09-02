import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  message: string;
  type: AlertType;
}

interface AlertContextProps {
  alert: Alert | null;
  showAlert: (alert: { type: AlertType; message: string }) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = ({ type, message }: { type: AlertType; message: string }) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 8000); // auto-hide after 3s
  };

  const hideAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
