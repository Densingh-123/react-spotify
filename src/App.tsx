import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/ui/MiniPlayer';
import AnimatedBackground from './components/AnimatedBackground';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import PlayerPage from './pages/PlayerPage';
import SettingsPage from './pages/SettingsPage';
import ThemesPage from './pages/ThemesPage';
import SupportChatPage from './pages/SupportChatPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import LikedSongsPage from './pages/LikedSongsPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import RingtoneHistoryPage from './pages/RingtoneHistoryPage';
import DownloadsPage from './pages/DownloadsPage';
import ArtistPage from './pages/ArtistPage';
import RingtonesPage from './pages/RingtonesPage';
import RingtoneEditPage from './pages/RingtoneEditPage';
import StatsPage from './pages/StatsPage';
import BlendPage from './pages/BlendPage';
import CollaborationHubPage from './pages/CollaborationHubPage';
import CollabDetailPage from './pages/CollabDetailPage';
import PlaylistManagementPage from './pages/PlaylistManagementPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
});

import CinematicLoader from './components/ui/CinematicLoader';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <CinematicLoader />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <CinematicLoader />;

  const isRingtoneStudio = location.pathname.includes('/ringtones/edit');

  return (
    <div className="app-root">
      <AnimatedBackground />
      {user && <Sidebar />}
      <div className="main-content">
        <div className="page-area">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

            {/* Main pages (accessible but some features need auth) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/playlist/:id" element={<PlaylistDetailPage />} />

            {/* Protected pages */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/support" element={<SupportChatPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
            <Route path="/recently-played" element={<RecentlyPlayedPage />} />
            <Route path="/ringtones-history" element={<RingtoneHistoryPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/artist/:name" element={<ArtistPage />} />
            <Route path="/ringtones" element={<RingtonesPage />} />
            <Route path="/ringtones/edit/:id" element={<RingtoneEditPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/blend" element={<BlendPage />} />
            <Route path="/blend/:partnerId" element={<BlendPage />} />
            <Route path="/collab" element={<CollaborationHubPage />} />
            <Route path="/collab/:id" element={<CollabDetailPage />} />
            <Route path="/manage/:id" element={<PlaylistManagementPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      {user && !isRingtoneStudio && <MiniPlayer />}
      {user && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <AppLayout />
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
