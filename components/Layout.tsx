import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';
import { Menu, Search, Bell, User, ChevronRight, GraduationCap } from 'lucide-react';

// --- Header / Mega Menu Component ---
export const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-20 px-6">
          {/* Logo Area */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="w-8 h-8 text-blue-900" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-900 leading-none">HANYANG UNIVERSITY</span>
              <span className="text-sm font-medium text-blue-600 tracking-wider">ERICA COMPETITION HUB</span>
            </div>
          </div>

          {/* GNB - Mega Menu Trigger */}
          <nav className="hidden md:flex h-full items-center">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative h-full flex items-center group px-6"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {/* Made clickable to navigate to the main section path */}
                <span 
                  className={`text-lg font-medium cursor-pointer transition-colors duration-200 ${activeMenu === item.label ? 'text-blue-700' : 'text-slate-700'}`}
                  onClick={() => navigate(item.href)}
                >
                  {item.label}
                </span>
                
                {/* Mega Menu Dropdown */}
                {activeMenu === item.label && item.subItems && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl border-t-2 border-blue-900 rounded-b-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <ul className="py-2">
                      {item.subItems.map((sub) => (
                        <li key={sub.label}>
                          <NavLink
                            to={sub.href}
                            className="block px-6 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-500 hover:text-blue-900 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="text-slate-500 hover:text-blue-900 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center space-x-2 text-slate-700 font-medium hover:text-blue-900 transition-colors" onClick={() => navigate('/admin')}>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="w-5 h-5 text-slate-500" />
               </div>
               <span className="hidden lg:block text-sm">로그인</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Placeholder */}
      <div className="md:hidden border-t px-4 py-2 bg-slate-50 flex justify-between">
         <span className="text-xs text-slate-500">데스크톱 환경에 최적화된 사이트입니다.</span>
         <Menu className="w-5 h-5 text-slate-500" />
      </div>
    </header>
  );
};

// --- Sidebar (LNB) Component ---
export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  // Hide Sidebar on Home Page to provide full-width portal experience
  if (location.pathname === '/') return null;

  // Determine active parent category based on URL
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
      
      {/* Banner / Info Box in LNB */}
      <div className="mt-8 mx-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-blue-900 font-bold text-sm mb-2">공모전 지원 문의</h3>
        <p className="text-xs text-blue-700 mb-2">
          평일 09:00 - 18:00
          <br />
          (점심시간 12:00 - 13:00)
        </p>
        <div className="text-lg font-bold text-blue-900">031-400-0000</div>
      </div>
    </aside>
  );
};

// --- Footer Component ---
export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white">ERICA COMPETITION HUB</span>
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
              <li><a href="#" className="hover:text-white transition-colors">포털 바로가기</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">정책 및 약관</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2024 Hanyang University ERICA. All rights reserved.</p>
          <p>Designed for Desktop Web Experience.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Layout Wrapper ---
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      {/* 
        Adjust container: 
        If Home, use full width container without top margin to accommodate banners.
        If Subpage, use existing card layout.
      */}
      <div className={`flex flex-1 w-full mx-auto ${isHome ? '' : 'max-w-[1600px] shadow-xl bg-white my-8 rounded-xl overflow-hidden min-h-[800px]'}`}>
        <Sidebar />
        <main className={`flex-1 ${isHome ? '' : 'p-8 lg:p-12'} overflow-y-auto`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
