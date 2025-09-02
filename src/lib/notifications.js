/**
 * Feature notifications configuration
 * Add new notifications here when you release new features
 */

export const FEATURE_NOTIFICATIONS = [
  {
    id: "recepies-feature-2025-09",
    title: "Novo: Recepti! 📝",
    message: "Sada možete spremati svoje omiljene recepte. Mljac!",
    icon: "📝",
    releaseDate: "2025-09-02",
    durationFromRelease: 10,
  },
];

/**
 * Get current active notifications
 * You can also filter these based on user preferences, A/B testing, etc.
 */
export const getCurrentNotifications = () => {
  return FEATURE_NOTIFICATIONS;
};
