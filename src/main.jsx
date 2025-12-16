import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import "./utils/global-error-blocker";
// import "./utils/aggressive-error-handler";
// import "./utils/error-handler";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./components/ui/ghost-404-page";
import { SmoothCursor } from "./components/ui/smooth-cursor";
import {
  Navbar,
  Hero,
  Guildelines,
  About,
} from "./components";
import EventsPage from "./pages/events/Events";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CreateProject from "./pages/projects/CreateProject";
import EventDetail from "./pages/events/EventDetail";
import CreateEvent from "./pages/events/CreateEvent";
import StudentDashboard from "./pages/student/StudentDashboard";
import GitHubCallback from "./pages/github/GitHubCallback";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ReactGA from "react-ga";
ReactGA.initialize("K6F7N5MR4K");
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
                <EventsPage />
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
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
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
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <NotFound />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <SmoothCursor />
  </React.StrictMode>
);
