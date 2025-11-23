import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./utils/global-error-blocker";
import "./utils/aggressive-error-handler";
import "./utils/error-handler";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./error.jsx";
import ErrorBoundary from "./components/ui/error-boundary";
import {
  Navbar,
  Hero,
  Events,
  Guildelines,
  About,
} from "./components";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";
import CreateProject from "./pages/projects/CreateProject";
import EventDetail from "./pages/events/EventDetail";
import CreateEvent from "./pages/events/CreateEvent";
import StudentDashboard from "./pages/student/StudentDashboard";
import GitHubCallback from "./pages/github/GitHubCallback";

import ReactGA from "react-ga";
ReactGA.initialize("K6F7N5MR4K");
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route
            path="/"
            element={
              <div className="bg">
                <Navbar />
                <Hero />
              </div>
            }
          />
          <Route
            path="/events"
            element={
              <div className="events-bg">
                <Navbar />
                <Events />
              </div>
            }
          />
          <Route
            path="/guidelines"
            element={
              <div className="guidelines-bg">
                <Navbar />
                <Guildelines />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div>
                <Navbar />
                <About />
              </div>
            }
          />
          {/* Auth Routes */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          {/* Project Routes */}
          <Route
            path="/projects"
            element={<Projects />}
          />
          <Route
            path="/project/:id"
            element={<ProjectDetail />}
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          {/* Event Routes */}
          <Route
            path="/event/:id"
            element={<EventDetail />}
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          {/* Student Dashboard Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          {/* GitHub Routes */}
          <Route
            path="/github/callback"
            element={
              <ProtectedRoute>
                <GitHubCallback />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="bg-error">
                <Navbar /> <Error />
              </div>
            }
          />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
