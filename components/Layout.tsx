
import React, { useState, createContext, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Menu, Search, Bell, User, ChevronRight, GraduationCap, Smartphone, Monitor, Home, Calendar } from 'lucide-react';

type ViewMode = 'web' | 'app';
interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}
const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) throw new Error('useViewMode must be used within a ViewModeProvider');
  return context;
};

export const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { viewMode, toggleViewMode } = useViewMode();
  const navigate = useNavigate();
  const isApp = viewMode === 'app';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm w-full">
      <div className={`${isApp ? 'px-4' : 'max-w-[1400px] mx-auto px-4 md:px-6'}`}>
        <div className={`flex items-center justify-between ${isApp ? 'h-14' : 'h-16 md:h-20'}`}>
          <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <GraduationCap className={`${isApp ? 'w-5 h-5' : 'w-7 h-7 md:w-8 h-8'} text-blue-900`} />
            <div className="flex flex-col">
              <span className={`${isApp ? 'text-sm' : 'text-base md:text-xl'} font-bold text-blue-900 leading-none uppercase`}>ERICA Hub</span>
              {!isApp && <span className="hidden md:block text-[10px] font-medium text-blue-600 tracking-wider">COMPETITION</span>}
            </div>
          </div>

          {!isApp && (
            <nav className="hidden lg:flex h-full items-center">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative h-full flex items-center group px-4 lg:px-6" onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
                  <span className="text-base font-medium text-slate-700 group-hover:text-blue-700 cursor-pointer transition-colors" onClick={() => navigate(item.href)}>{item.label}</span>
                  {activeMenu === item.label && item.subItems && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl border-t-2 border-blue-900 rounded-b-lg overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                      {item.subItems.map((sub) => (
                        <NavLink key={sub.label} to={sub.href} className="block px-6 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-800">{sub.label}</NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}

          <div className="flex items-center space-x-1 md:space-x-3">
            <button className="p-2 text-slate-500 hover:text-blue-900 transition-colors"><Search className="w-5 h-5 md:w-6 h-6" /></button>
            <button className="p-2 text-slate-500 hover:text-blue-900 transition-colors relative"><Bell className="w-5 h-5 md:w-6 h-6" /><span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span></button>
            <button onClick={toggleViewMode} className="hidden md:flex p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-blue-900 hover:text-white transition-all">{isApp ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}</button>
            {!isApp && <button className="hidden md:flex p-2 text-slate-500 hover:text-blue-900"><User className="w-6 h-6" /></button>}
            {isApp && <Menu className="w-5 h-5 text-slate-500" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export const Sidebar: React.FC = () => {
  const { viewMode } = useViewMode();
  const location = useLocation();
  if (location.pathname === '/' || viewMode === 'app') return null;
  const activeParent = NAV_ITEMS.find(item => location.pathname.startsWith(item.href)) || NAV_ITEMS[0];

  return (
    <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{activeParent.label}</h2>
        <nav className="space-y-1">
          {activeParent.subItems?.map((sub) => (
            <NavLink key={sub.label} to={sub.href} className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>{sub.label}<ChevronRight className="w-4 h-4" /></NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isApp = viewMode === 'app';

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode: () => setViewMode(prev => prev === 'web' ? 'app' : 'web') }}>
      <div className={`min-h-screen flex flex-col bg-slate-100 transition-all duration-500 ${isApp ? 'md:py-10 md:items-center' : ''}`}>
        <div className={`flex flex-col bg-white shadow-sm transition-all duration-500 overflow-hidden ${isApp ? 'w-full md:max-w-[420px] md:h-[850px] md:rounded-[40px] md:border-[8px] md:border-slate-900 relative' : 'w-full min-h-screen'}`}>
          {isApp && <div className="hidden md:flex h-6 bg-white shrink-0" />}
          <Header />
          <div className={`flex flex-1 w-full overflow-hidden ${isApp ? 'flex-col' : isHome ? 'flex-col' : 'max-w-[1400px] mx-auto md:my-6 md:rounded-xl'}`}>
            <Sidebar />
            <main className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50">
              {children}
            </main>
            {isApp && (
              <div className="h-16 bg-white border-t border-slate-100 flex justify-around items-center shrink-0 pb-safe">
                <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}><Home className="w-5 h-5" /><span className="text-[10px] font-bold">홈</span></NavLink>
                <NavLink to="/competitions/all" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}><Search className="w-5 h-5" /><span className="text-[10px] font-medium">탐색</span></NavLink>
                <NavLink to="/calendar" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}><Calendar className="w-5 h-5" /><span className="text-[10px] font-medium">일정</span></NavLink>
                <button onClick={() => setViewMode('web')} className="flex flex-col items-center gap-1 text-slate-400"><Monitor className="w-5 h-5" /><span className="text-[10px] font-medium">웹버전</span></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewModeContext.Provider>
  );
};
