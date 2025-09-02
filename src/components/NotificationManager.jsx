import { NotificationModal } from "./ui/notification-modal";
import { useNotifications } from "../hooks/useNotifications";

/**
 * Component that manages the display of notification modals
 * This component handles the logic for showing and dismissing notifications
 */
export function NotificationManager() {
  const { currentNotification, dismissNotification } = useNotifications();

  return (
    <>
      {/* Notification Modal */}
      {currentNotification && (
        <NotificationModal
          notification={currentNotification}
          onDismiss={dismissNotification}
          show={!!currentNotification}
        />
      )}
    </>
  );
}

