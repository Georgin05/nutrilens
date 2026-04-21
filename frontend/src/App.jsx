import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import api from './services/api';
import {
  ScanLine,
  Moon,
  Sun,
  Activity,
  Search,
  Target,
  UserCircle2,
  ChevronRight,
  ScanBarcode,
  ArrowRight,
  Mail,
  Lock,
  Apple,
  Chrome
} from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import ScanningPage from './pages/ScanningPage';
import LiveScannerPage from './pages/LiveScannerPage';
import LogsPage from './pages/LogsPage';
import ProfilePage from './pages/ProfilePage';
import UserNutritionLensPage from './pages/UserNutritionLensPage';
import LensGalleryPage from './pages/LensGalleryPage';
import LensWizardLimits from './pages/LensWizardLimits';
import LensWizardGuard from './pages/LensWizardGuard';
import LensWizardFinal from './pages/LensWizardFinal';
import SmartCartHub from './pages/SmartCartHub';
import SmartCartSetup from './pages/SmartCartSetup';
import SmartCartDashboard from './pages/SmartCartDashboard';
import MealCartPage from './pages/MealCartPage';
import MealCartSetup from './pages/MealCartSetup';
import GroceryPage from './pages/GroceryPage';
import AiBuddyPage from './pages/AiBuddyPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import MainLayout from './components/MainLayout';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminUsers from './pages/AdminUsers';
import AdminAiInsights from './pages/AdminAiInsights';
import AdminLenses from './pages/AdminLenses';
import AdminFoodDatabase from './pages/AdminFoodDatabase';

// --- Global Theme & Utilities ---
const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(true);
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const toggle = () => {
    // Optionally disable toggle if app is strictly dark mode
    // setIsDark(!isDark);
    // document.documentElement.classList.toggle('dark');
  };

  return { isDark, toggle };
};

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// --- Main App Route Configuration ---

export default function App() {
  const { isDark, toggle } = useTheme();

  // Test the connection to the backend when the app mounts
  useEffect(() => {
    const testApi = async () => {
      try {
        const result = await api.testConnection();
        console.log('✅ Backend Connection Successful:', result);
      } catch (error) {
        console.error('❌ Backend Connection Failed. Is FastAPI running?', error);
      }
    };
    testApi();
  }, []);

  return (
    <div className="app-wrapper">
      <Routes>
        <Route
          path="/"
          element={<LandingPage isDarkMode={isDark} toggleTheme={toggle} />}
        />
        <Route
          path="/auth"
          element={<AuthPage isDarkMode={isDark} toggleTheme={toggle} />}
        />
        <Route
          path="/scan"
          element={
            <MainLayout>
              <ScanningPage />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage isDarkMode={isDark} />
            </MainLayout>
          }
        />
        <Route
          path="/live-scan"
          element={
            <MainLayout>
              <LiveScannerPage />
            </MainLayout>
          }
        />
        <Route
          path="/ai-buddy"
          element={
            <MainLayout>
              <AiBuddyPage />
            </MainLayout>
          }
        />
        <Route
          path="/logs"
          element={
            <MainLayout>
              <LogsPage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route
          path="/user-lens"
          element={
            <MainLayout>
              <UserNutritionLensPage />
            </MainLayout>
          }
        />
        <Route
          path="/lenses"
          element={<LensGalleryPage />}
        />
        <Route
          path="/lenses/wizard/limits"
          element={<LensWizardLimits />}
        />
        <Route
          path="/lenses/wizard/guard"
          element={<LensWizardGuard />}
        />
        <Route
          path="/lenses/wizard/final"
          element={<LensWizardFinal />}
        />
        <Route
          path="/smart-cart"
          element={
            <MainLayout>
              <SmartCartHub />
            </MainLayout>
          }
        />
        <Route path="/history" element={<ScanHistoryPage />} />
        <Route path="/smart-cart/setup" element={<SmartCartSetup />} />
        <Route path="/smart-cart/dashboard" element={<SmartCartDashboard />} />
        <Route
          path="/meals-cart"
          element={
            <MainLayout>
              <MealCartPage />
            </MainLayout>
          }
        />
        <Route
          path="/meals-cart/grocery"
          element={
            <MainLayout>
              <MealCartPage initialMode="groceries" />
            </MainLayout>
          }
        />
        <Route path="/meals-cart/planner" element={<Navigate to="/meals-cart" replace />} />
        <Route path="/meal-cart-setup" element={<MealCartSetup />} />
        <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/ai" element={<AdminAiInsights />} />
        <Route path="/admin/lenses" element={<AdminLenses />} />
        <Route path="/admin/products" element={<AdminFoodDatabase />} />
      </Routes>
    </div>
  );
}