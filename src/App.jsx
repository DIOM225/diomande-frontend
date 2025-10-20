// ✅ Diomande.com — App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🧭 Shared Components
import Header from "./components/Header.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireLoyeRole from "./components/RequireLoyeRole.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";

// 🏠 Core Pages
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx"; // ✅ NEW PAGE

// 💼 Loye System
import LoyeDashboard from "./pages/loye/LoyeDashboard.jsx";
import OwnerProperties from "./pages/loye/OwnerProperties.jsx";
import CreateProperty from "./pages/loye/CreateProperty.jsx";
import PropertyDetailView from "./pages/loye/PropertyDetailView.jsx";
import LoyeOnboarding from "./pages/loye/LoyeOnboarding.jsx";
import ReceiptPage from "./pages/loye/ReceiptPage.jsx"; // ✅ NEW: Receipt Page

import Profile from "./pages/Profile";

// 🧰 Utilities
import "./App.css";
import { testApiConnection } from "./utils/testApi.js";

export default function App() {
  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <>
      <Header />

      <Routes>
        {/* 🌍 Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* ✅ Added */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* 🏢 Loye Flow — All protected by RequireAuth */}
        <Route
          path="/loye/onboarding"
          element={
            <RequireAuth>
              <LoyeOnboarding />
            </RequireAuth>
          }
        />

        {/* 👤 Renter Dashboard */}
        <Route
          path="/loye/dashboard"
          element={
            <RequireAuth>
              <RequireLoyeRole role="renter">
                <LoyeDashboard />
              </RequireLoyeRole>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />


        {/* 🏠 Owner / Manager Dashboard */}
        <Route
          path="/loye/properties"
          element={
            <RequireAuth>
              <RequireLoyeRole role={["owner", "manager"]}>
                <OwnerProperties />
              </RequireLoyeRole>
            </RequireAuth>
          }
        />

        {/* ➕ Create Property */}
        <Route
          path="/loye/create"
          element={
            <RequireAuth>
              <RequireLoyeRole role={["owner", "manager"]}>
                <CreateProperty />
              </RequireLoyeRole>
            </RequireAuth>
          }
        />

        {/* 🏘 Property Detail */}
        <Route
          path="/loye/property/:id"
          element={
            <RequireAuth>
              <RequireLoyeRole role={["owner", "manager"]}>
                <PropertyDetailView />
              </RequireLoyeRole>
            </RequireAuth>
          }
        />

        {/* 🧾 NEW: Payment Receipt */}
        <Route
          path="/loye/receipt/:id"
          element={
            <RequireAuth>
              <ReceiptPage />
            </RequireAuth>
          }
        />
        <Route
          path="/loye/receipt/success"
          element={
            <RequireAuth>
              <ReceiptPage />
            </RequireAuth>
          }
        />

        {/* 🚫 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
