import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Modern notification modal component
 * @param {Object} props
 * @param {Object} props.notification - The notification object
 * @param {string} props.notification.id - Unique identifier
 * @param {string} props.notification.message - Notification message
 * @param {string} [props.notification.title] - Optional title (defaults to "New Feature!")
 * @param {string} [props.notification.icon] - Optional icon (defaults to sparkles)
 * @param {Function} props.onDismiss - Callback when notification is dismissed
 * @param {boolean} [props.show] - Whether to show the modal
 */
export function NotificationModal({ notification, onDismiss, show = true }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      // Delay to allow for smooth animation
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 500);
    }
  }, [show]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.(notification.id);
    }, 200);
  };

  if (!show || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto z-50 bg-black/80">
      <div className="flex justify-center items-start pt-20 px-4 h-full">
        <div
          className={`max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto transform transition-all duration-300 ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="text-lg">{notification.icon || "✨"}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {notification.title || "Nova značajka!"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  {notification.message}
                </p>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  className="h-7 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                >
                  U redu
                </Button>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
