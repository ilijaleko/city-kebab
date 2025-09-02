import { useEffect, useState } from "react";
import {
  cleanupDismissedNotifications,
  dismissNotification,
  getActiveNotifications,
} from "../utils/notifications";
import { NotificationContext } from "./NotificationContext";

/**
 * Notification Provider Component
 * Manages the state and logic for feature notifications
 */
export const NotificationProvider = ({ children, notifications = [] }) => {
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Initialize notifications on mount and when notifications prop changes
  useEffect(() => {
    const active = getActiveNotifications(notifications);
    setActiveNotifications(active);

    if (active.length > 0 && !currentNotification) {
      setCurrentNotification(active[0]);
      setNotificationQueue(active.slice(1));
    }

    // Clean up old dismissed notifications
    cleanupDismissedNotifications(notifications);
  }, [notifications, currentNotification]);

  /**
   * Handle dismissing a notification (user clicked "Got it!")
   * This saves the dismissal to localStorage
   */
  const handleDismissNotification = (notificationId) => {
    dismissNotification(notificationId);

    // Remove from active notifications
    setActiveNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );

    // Show next notification if available
    showNextNotification();
  };

  /**
   * Show the next notification in queue
   */
  const showNextNotification = () => {
    if (notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue((prev) => prev.slice(1));
    } else {
      setCurrentNotification(null);
    }
  };

  /**
   * Manually trigger checking for new notifications
   * Useful when you want to refresh the notification state
   */
  const checkForNotifications = () => {
    const active = getActiveNotifications(notifications);
    setActiveNotifications(active);

    if (active.length > 0 && !currentNotification) {
      setCurrentNotification(active[0]);
      setNotificationQueue(active.slice(1));
    }
  };

  /**
   * Get count of pending notifications
   */
  const getPendingCount = () => {
    return notificationQueue.length + (currentNotification ? 1 : 0);
  };

  const value = {
    // Current notification being displayed
    currentNotification,

    // All active notifications
    activeNotifications,

    // Queue of notifications waiting to be shown
    notificationQueue,

    // Actions
    dismissNotification: handleDismissNotification,
    checkForNotifications,

    // Utilities
    getPendingCount,
    hasNotifications: activeNotifications.length > 0,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
