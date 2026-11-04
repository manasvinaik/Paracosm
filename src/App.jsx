import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { LibraryProvider } from "./context/LibraryContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AllMediaPage from "./pages/AllMediaPage";
import BooksPage from "./pages/BooksPage";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import FanfictionsPage from "./pages/FanfictionsPage";
import AddMediaPage from "./pages/AddMediaPage";
import MediaDetailsPage from "./pages/MediaDetailsPage";
import EditMediaPage from "./pages/EditMediaPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailsPage from "./pages/CollectionDetailsPage";
import TrackingPage from "./pages/TrackingPage";
import StatisticsPage from "./pages/StatisticsPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import LibrarySettingsPage from "./pages/LibrarySettingsPage";
import ImportExportPage from "./pages/ImportExportPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setStatus(data.session ? "signed-in" : "signed-out"); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setStatus(session ? "signed-in" : "signed-out"));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  if (status === "checking") return <div className="auth-loading">Opening your archive...</div>;
  if (status === "signed-out") return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function PrivatePage({ children }) { return <RequireAuth>{children}</RequireAuth>; }

export default function App() {
  return <LibraryProvider><Routes>
    <Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/signup" element={<SignupPage/>}/><Route path="/forgot-password" element={<ForgotPasswordPage/>}/><Route path="/reset-password" element={<ResetPasswordPage/>}/>
    <Route path="/dashboard" element={<PrivatePage><DashboardPage/></PrivatePage>}/><Route path="/library" element={<PrivatePage><AllMediaPage/></PrivatePage>}/><Route path="/library/books" element={<PrivatePage><BooksPage/></PrivatePage>}/><Route path="/library/movies" element={<PrivatePage><MoviesPage/></PrivatePage>}/><Route path="/library/tv-shows" element={<PrivatePage><TVShowsPage/></PrivatePage>}/><Route path="/library/fanfictions" element={<PrivatePage><FanfictionsPage/></PrivatePage>}/>
    <Route path="/media/add" element={<PrivatePage><AddMediaPage/></PrivatePage>}/><Route path="/media/:id/edit" element={<PrivatePage><EditMediaPage/></PrivatePage>}/><Route path="/media/:id" element={<PrivatePage><MediaDetailsPage/></PrivatePage>}/><Route path="/collections" element={<PrivatePage><CollectionsPage/></PrivatePage>}/><Route path="/collections/:id" element={<PrivatePage><CollectionDetailsPage/></PrivatePage>}/><Route path="/tracking" element={<PrivatePage><TrackingPage/></PrivatePage>}/><Route path="/statistics" element={<PrivatePage><StatisticsPage/></PrivatePage>}/><Route path="/activity" element={<PrivatePage><ActivityPage/></PrivatePage>}/>
    <Route path="/settings" element={<PrivatePage><SettingsPage/></PrivatePage>}/><Route path="/settings/profile" element={<PrivatePage><ProfileSettingsPage/></PrivatePage>}/><Route path="/settings/library" element={<PrivatePage><LibrarySettingsPage/></PrivatePage>}/><Route path="/settings/import-export" element={<PrivatePage><ImportExportPage/></PrivatePage>}/><Route path="/settings/account" element={<PrivatePage><AccountSettingsPage/></PrivatePage>}/><Route path="*" element={<NotFoundPage/>}/>
  </Routes></LibraryProvider>;
}
