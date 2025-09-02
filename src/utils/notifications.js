/**
 * Feature Notification System
 * Manages feature notifications with localStorage persistence
 */

const STORAGE_KEY = "city-kebab-dismissed-notifications";

/**
 * Get all dismissed notifications from localStorage
 * @returns {Object} Object with notification IDs as keys and dismiss timestamps as values
 */
export const getDismissedNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading dismissed notifications:", error);
    return {};
  }
};

/**
 * Save a dismissed notification to localStorage
 * @param {string} notificationId - Unique identifier for the notification
 */
export const dismissNotification = (notificationId) => {
  try {
    const dismissed = getDismissedNotifications();
    dismissed[notificationId] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
  } catch (error) {
    console.error("Error saving dismissed notification:", error);
  }
};

/**
 * Check if a notification should be shown based on date range and dismiss status
 * @param {Object} notification - The notification object
 * @param {string} notification.id - Unique identifier
 * @param {string} notification.message - Notification message
 * @param {string} notification.releaseDate - Release date (YYYY-MM-DD)
 * @param {number} notification.durationFromRelease - Duration in days from release
 * @returns {boolean} Whether the notification should be shown
 */
export const shouldShowNotification = (notification) => {
  const now = Date.now();
  const dismissed = getDismissedNotifications();

  // Check if user has dismissed this notification
  if (dismissed[notification.id]) {
    return false; // Already dismissed, don't show again
  }

  // Duration from release date
  const releaseTime = new Date(notification.releaseDate).getTime();
  const expiryTime =
    releaseTime + notification.durationFromRelease * 24 * 60 * 60 * 1000;

  if (now < releaseTime) {
    return false; // Not yet released
  }

  if (now > expiryTime) {
    return false; // Expired
  }

  return true;
};

/**
 * Get all notifications that should be displayed
 * @param {Array} allNotifications - Array of all notification objects
 * @returns {Array} Array of notifications to display
 */
export const getActiveNotifications = (allNotifications) => {
  return allNotifications.filter(shouldShowNotification);
};

/**
 * Clean up old dismissed notifications (optional optimization)
 * Removes dismissed notifications that are past their end date
 */
export const cleanupDismissedNotifications = (allNotifications) => {
  try {
    const dismissed = getDismissedNotifications();
    const now = Date.now();
    const validNotificationIds = new Set(
      allNotifications
        .filter((n) => {
          // Calculate end date from releaseDate + durationFromRelease
          const releaseTime = new Date(n.releaseDate).getTime();
          const expiryTime =
            releaseTime + n.durationFromRelease * 24 * 60 * 60 * 1000;
          return expiryTime >= now;
        })
        .map((n) => n.id)
    );

    const cleanedDismissed = Object.fromEntries(
      Object.entries(dismissed).filter(([id]) => validNotificationIds.has(id))
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedDismissed));
  } catch (error) {
    console.error("Error cleaning up dismissed notifications:", error);
  }
};
