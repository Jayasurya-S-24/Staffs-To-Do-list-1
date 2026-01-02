import React, { createContext, useContext, useEffect } from 'react';
import { useTasks } from './TaskContext';

interface NotificationContextType {
  requestPermission: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { tasks } = useTasks();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      checkForUpcomingTasks();
    }
  }, [tasks]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        checkForUpcomingTasks();
      }
    }
  };

  const checkForUpcomingTasks = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    tasks.forEach(task => {
      if (!task.completed) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const notificationKey = `notified_${task.id}_${dueDate.toDateString()}`;
        const hasNotified = localStorage.getItem(notificationKey);
        
        if (daysDiff === 1 && !hasNotified) {
          new Notification(`Task Due Tomorrow: ${task.title}`, {
            body: `${task.description} - Priority: ${task.priority}`,
            icon: '/favicon.ico'
          });
          localStorage.setItem(notificationKey, 'true');
        }
      }
    });
  };

  return (
    <NotificationContext.Provider value={{ requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}