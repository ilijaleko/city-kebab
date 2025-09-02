# Notification System

Notification system for showing feature announcements to users with localStorage persistence.

## Quick Start

Edit `src/data/notifications.js` to add your feature notifications:

```javascript
export const FEATURE_NOTIFICATIONS = [
  {
    id: "my-new-feature-2024-01", // Unique ID
    title: "New Feature: Dark Mode! 🌙",
    message:
      "You can now toggle between light and dark themes for better viewing experience.",
    icon: "🌙", // Optional emoji or use 'sparkles' for default
    startDate: "2024-01-15T00:00:00.000Z", // Optional
    endDate: "2024-02-15T23:59:59.000Z", // Optional
  },
];
```

## Notification Object Properties

| Property    | Type   | Required | Description                                       |
| ----------- | ------ | -------- | ------------------------------------------------- |
| `id`        | string | ✅       | Unique identifier for the notification            |
| `title`     | string | ❌       | Title shown in modal (defaults to "New Feature!") |
| `message`   | string | ✅       | Main notification message                         |
| `icon`      | string | ❌       | Emoji or 'sparkles' (defaults to sparkles ✨)     |
| `startDate` | string | ❌       | ISO date when notification should start showing   |
| `endDate`   | string | ❌       | ISO date when notification should stop showing    |

## User Behavior

### When User Clicks confirm button:

- Notification is permanently dismissed for this user
- Saved to localStorage with timestamp
- Won't show again within the date range
- Next notification in queue is shown (if any)

### When User Clicks "Maybe later" or X:

- Notification is closed but NOT dismissed
- Will show again on next visit during the notification period
- Next notification in queue will be shown next visit (if any)

### Multiple Notifications:

- Notifications are shown one at a time
- Queue system ensures good UX
- Users can dismiss or ignore each notification individually

## Advanced Usage

### Manual Notification Triggers

Use the notification context in any component:

```javascript
import { useNotifications } from "../contexts/NotificationContext";

function MyComponent() {
  const { checkForNotifications, hasNotifications, getPendingCount } =
    useNotifications();

  return (
    <div>
      <button onClick={checkForNotifications}>
        Check for Updates {hasNotifications && `(${getPendingCount()})`}
      </button>
    </div>
  );
}
```
