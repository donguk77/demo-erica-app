
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { Menu, Search, Bell, User, ChevronRight, GraduationCap, Smartphone, Monitor, Home, Calendar } from 'lucide-react';

// --- View Mode Context ---
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

// --- Header Component ---
export const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { viewMode, toggleViewMode } = useViewMode();
  const navigate = useNavigate();

  const isApp = viewMode === 'app';

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm transition-all duration-300 ${isApp ? 'w-full' : 'w-full'}`}>
      <div className={`${isApp ? 'px-4' : 'max-w-[1600px] mx-auto px-6'}`}>
        <div className={`flex items-center justify-between ${isApp ? 'h-14' : 'h-20'}`}>
          {/* Logo Area */}
          <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <GraduationCap className={`${isApp ? 'w-5 h-5' : 'w-8 h-8'} text-blue-900`} />
            <div className="flex flex-col">
              <span className={`${isApp ? 'text-sm' : 'text-xl'} font-bold text-blue-900 leading-none uppercase`}>ERICA Hub</span>
              {!isApp && <span className="text-[10px] font-medium text-blue-600 tracking-wider">COMPETITION</span>}
            </div>
          </div>

          {/* GNB - Hidden in App Mode */}
          {!isApp && (
            <nav className="hidden md:flex h-full items-center">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center group px-4 lg:px-6"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <span 
                    className={`text-base lg:text-lg font-medium cursor-pointer transition-colors duration-200 ${activeMenu === item.label ? 'text-blue-700' : 'text-slate-700'}`}
                    onClick={() => navigate(item.href)}
                  >
                    {item.label}
                  </span>
                  {activeMenu === item.label && item.subItems && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-white shadow-xl border-t-2 border-blue-900 rounded-b-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <ul className="py-2">
                        {item.subItems.map((sub) => (
                          <li key={sub.label}>
                            <NavLink to={sub.href} className="block px-6 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">{sub.label}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Utility Icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <button className="p-2 text-slate-500 hover:text-blue-900 transition-colors">
              <Search className={`${isApp ? 'w-5 h-5' : 'w-6 h-6'}`} />
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-900 transition-colors relative">
              <Bell className={`${isApp ? 'w-5 h-5' : 'w-6 h-6'}`} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* View Mode Toggle Button */}
            <button 
              onClick={toggleViewMode}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-blue-900 hover:text-white transition-all"
              title={isApp ? '웹 모드' : '앱 모드'}
            >
              {isApp ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            </button>

            {!isApp && (
              <button className="flex items-center space-x-2 text-slate-700 font-medium hover:text-blue-900 transition-colors ml-2" onClick={() => navigate('/admin')}>
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-4 h-4 text-slate-500" />
                 </div>
              </button>
            )}
            {isApp && <Menu className="w-5 h-5 text-slate-500 ml-1" />}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Sidebar Component ---
export const Sidebar: React.FC = () => {
  const { viewMode } = useViewMode();
  const location = useLocation();
  
  if (location.pathname === '/' || viewMode === 'app') return null;

  const activeParent = NAV_ITEMS.find(item => location.pathname.startsWith(item.href)) || NAV_ITEMS[0];

  return (
    <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-900 pb-4">
          {activeParent.label}
        </h2>
        <nav className="space-y-1">
          {activeParent.subItems?.map((sub) => (
            <NavLink
              key={sub.label}
              to={sub.href}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  isActive || location.pathname.includes(sub.href)
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
                }`
              }
            >
              {sub.label}
              {(location.pathname.includes(sub.href)) && <ChevronRight className="w-4 h-4" />}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

// --- Footer Component ---
export const Footer: React.FC = () => {
  const { viewMode } = useViewMode();
  if (viewMode === 'app') return null;

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white uppercase">ERICA Competition Hub</span>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed max-w-md">
               경기도 안산시 상록구 한양대학로 55<br/>
               한양대학교 ERICA 캠퍼스 공모전 지원센터
             </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">학교 홈페이지</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IC-PBL 센터</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 Hanyang University ERICA.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Layout Wrapper ---
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleViewMode = () => setViewMode(prev => prev === 'web' ? 'app' : 'web');

  const isApp = viewMode === 'app';

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      <div className={`min-h-screen flex flex-col bg-slate-100 transition-colors duration-500 ${isApp ? 'lg:py-10 lg:items-center' : ''}`}>
        <div className={`flex flex-col bg-white transition-all duration-500 overflow-hidden ${
          isApp 
            ? 'w-full lg:max-w-[420px] lg:h-[880px] lg:shadow-2xl lg:rounded-[48px] lg:border-[10px] lg:border-slate-900 relative' 
            : 'w-full min-h-screen'
        }`}>
          {/* App Status Bar Mock (only in App Mode on Desktop) */}
          {isApp && (
            <div className="hidden lg:flex h-8 bg-white justify-between items-center px-8 text-[11px] font-bold text-slate-700 shrink-0">
               <span>9:41</span>
               <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-2 border border-slate-700 rounded-sm relative after:absolute after:right-[-3px] after:top-0.5 after:w-0.5 after:h-0.5 after:bg-slate-700"></div>
               </div>
            </div>
          )}
          
          <Header />
          
          <div className={`flex flex-1 w-full mx-auto overflow-hidden ${
            isApp 
              ? 'flex-col' 
              : isHome ? 'flex-col' : 'max-w-[1600px] shadow-sm bg-white md:my-6 md:rounded-xl min-h-[800px]'
          }`}>
            <Sidebar />
            <main className={`flex-1 overflow-y-auto scrollbar-hide bg-slate-50 ${
              isApp ? 'p-0' : (isHome ? '' : 'p-6 lg:p-12')
            }`}>
              {children}
            </main>

            {/* Bottom Nav for App Mode */}
            {isApp && (
              <div className="h-16 bg-white border-t border-slate-100 flex justify-around items-center shrink-0 pb-safe">
                 <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-bold">홈</span>
                 </NavLink>
                 <NavLink to="/competitions/all" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">탐색</span>
                 </NavLink>
                 <NavLink to="/calendar" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px] font-medium">일정</span>
                 </NavLink>
                 <button onClick={() => setViewMode('web')} className="flex flex-col items-center gap-1 text-slate-400">
                    <Monitor className="w-5 h-5" />
                    <span className="text-[10px] font-medium">웹모드</span>
                 </button>
              </div>
            )}
          </div>
          
          <Footer />
        </div>
      </div>
    </ViewModeContext.Provider>
  );
};
