import { ThemeProvider } from "@/components/ui/theme-provider";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Group from "./components/Group";
import Home from "./components/Home";
import { NotificationManager } from "./components/NotificationManager";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { getCurrentNotifications } from "./lib/notifications";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="city-kebab-theme">
      <NotificationProvider notifications={getCurrentNotifications()}>
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/group/:groupId" element={<Group />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>

          {/* Notification Manager handles all notification display logic */}
          <NotificationManager />
        </>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
