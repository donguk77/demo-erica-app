import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout';
import { HomePage, CompetitionListPage, CompetitionDetailPage, CalendarPage } from './pages/ClientPages';
import { AdminDashboard } from './pages/AdminPage';

// Wrapper for public pages to include the layout
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Root is now the comprehensive Home Page */}
        <Route path="/" element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } />

        {/* Competitions Routes */}
        <Route path="/competitions" element={<Navigate to="/competitions/all" replace />} />
        <Route path="/competitions/:category" element={
          <PublicRoute>
            <CompetitionListPage filterType="General" />
          </PublicRoute>
        } />
        <Route path="/competition/:id" element={
          <PublicRoute>
            <CompetitionDetailPage />
          </PublicRoute>
        } />

        {/* IC-PBL Routes */}
        <Route path="/ic-pbl" element={
           <PublicRoute>
            <CompetitionListPage filterType="IC-PBL" />
          </PublicRoute>
        } />

        {/* Calendar Route */}
        <Route path="/calendar" element={
          <PublicRoute>
            <CalendarPage />
          </PublicRoute>
        } />

        {/* Support Routes (Placeholder using List Page for demo) */}
        <Route path="/support/*" element={
           <PublicRoute>
             <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300">
               <h2 className="text-xl font-bold text-slate-700 mb-2">고객지원 센터</h2>
               <p className="text-slate-500">준비 중인 페이지입니다.</p>
             </div>
           </PublicRoute>
        } />

        {/* Admin Route - No Layout (Has its own) */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </HashRouter>
  );
};

export default App;
