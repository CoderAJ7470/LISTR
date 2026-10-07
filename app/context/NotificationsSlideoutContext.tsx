'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type NotificationType = 'success';

interface Notification {
  type: NotificationType;
  message: string;
}

interface NotificationsSlideoutContextType {
  notification: Notification | null;
  showNotification: (type: NotificationType, message: string) => void;
  hideNotification: () => void;
}

const NotificationsSlideoutContext = createContext<
  NotificationsSlideoutContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsSlideoutContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within the NotificationsSlideoutProvider',
    );
  }

  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const NotificationsSlideoutProvider = ({ children }: ProviderProps) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      type,
      message,
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationsSlideoutContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </NotificationsSlideoutContext.Provider>
  );
};
