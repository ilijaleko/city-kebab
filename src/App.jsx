import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Group from "./components/Group";
import Home from "./components/Home";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="city-kebab-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group/:groupId" element={<Group />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
