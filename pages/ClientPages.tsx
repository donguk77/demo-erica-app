
import React, { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_COMPETITIONS } from '../constants';
import { Competition } from '../types';
import { useViewMode } from '../components/Layout';
import { Calendar as CalendarIcon, Users, Eye, ArrowRight, CheckCircle, Bookmark, Search, Filter, Trophy, Star, Megaphone, Lightbulb, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon, Home } from 'lucide-react';

// --- Components Helpers ---

const StatusBadge: React.FC<{ status: Competition['status'] }> = ({ status }) => {
  const styles = {
    Open: 'bg-green-100 text-green-700 border-green-200',
    Closed: 'bg-slate-100 text-slate-500 border-slate-200',
    Upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  
  const labels = {
    Open: '접수중',
    Closed: '마감',
    Upcoming: '예정',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export const getDDay = (endDate: string) => {
  const today = new Date('2024-05-15');
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
};

// --- Component: Competition Card ---
export const CompetitionCard: React.FC<{ comp: Competition; isRecommended?: boolean; onClick?: () => void }> = ({ comp, isRecommended, onClick }) => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const dDay = getDDay(comp.endDate);
  const isClosed = dDay === '마감';
  const isApp = viewMode === 'app';

  const handleClick = () => {
      if (onClick) onClick();
      else navigate(`/competition/${comp.id}`);
  }

  return (
    <div 
      className={`group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${isApp ? 'shadow-sm' : ''}`}
      onClick={handleClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={comp.imageUrl} 
          alt={comp.title} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isClosed ? 'grayscale opacity-80' : ''}`} 
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
            {comp.category}
        </div>
        {!isClosed && (
            <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm z-10">
                {dDay}
            </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
          <h3 className={`font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-800 transition-colors mb-2 ${isApp ? 'text-sm' : 'text-[16px]'}`}>
            {comp.title}
          </h3>
          
          <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[60%]">{comp.organizer}</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Eye className="w-3 h-3" />
                <span>{comp.views.toLocaleString()}</span>
            </div>
          </div>
      </div>
    </div>
  );
};


// --- Page: Home ---
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isApp = viewMode === 'app';

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = isApp ? 280 : 400;
      const scrollTo = direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={`w-full bg-slate-50 ${isApp ? 'pb-10' : 'pb-20'}`}>
      {/* 1. Hero Banner - Responsive height */}
      <div className={`w-full bg-blue-900 relative overflow-hidden transition-all duration-500 ${isApp ? 'h-[280px]' : 'h-[450px]'}`}>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent"></div>
         <div className={`max-w-[1400px] mx-auto h-full flex flex-col justify-end px-6 pb-10 relative z-10 text-white ${isApp ? 'pb-8' : 'justify-center'}`}>
            <span className={`inline-block px-2 py-0.5 bg-yellow-400 text-blue-950 font-black rounded text-[10px] mb-3 w-fit uppercase tracking-tighter`}>
              HOT ISSUE
            </span>
            <h1 className={`font-black leading-[1.15] mb-4 ${isApp ? 'text-2xl' : 'text-5xl'}`}>
              ERICA<br/>소프트웨어 융합<br/>학술대회 모집
            </h1>
            {!isApp && (
              <p className="text-blue-100 text-lg mb-8 max-w-xl">
                창의적인 아이디어를 가진 ERICA 학생 여러분을 기다립니다.<br/>
                총 상금 2,000만원의 주인공이 되어보세요.
              </p>
            )}
            <div className="flex gap-2">
               <button onClick={() => navigate('/competition/c1')} className={`bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors ${isApp ? 'px-4 py-2 text-xs' : 'px-8 py-3'}`}>
                 자세히 보기
               </button>
            </div>
         </div>
      </div>

      {/* 2. Quick Menu - Grid Responsive */}
      <div className={`max-w-[1400px] mx-auto relative z-20 px-4 transition-all duration-300 ${isApp ? '-mt-6' : '-mt-10'}`}>
        <div className={`bg-white rounded-2xl shadow-xl p-4 grid gap-2 text-center border border-slate-100 ${isApp ? 'grid-cols-4' : 'grid-cols-5 md:p-6'}`}>
           {[
             { label: '전체', icon: Trophy, path: '/competitions/all', color: 'bg-blue-50 text-blue-600' },
             { label: 'IC-PBL', icon: Lightbulb, path: '/ic-pbl', color: 'bg-purple-50 text-purple-600' },
             { label: '대외활동', icon: Megaphone, path: '/competitions/activity', color: 'bg-emerald-50 text-emerald-600' },
             { label: '캘린더', icon: CalendarIcon, path: '/calendar', color: 'bg-orange-50 text-orange-600' },
             { label: '수상작', icon: Star, path: '/support/gallery', color: 'bg-yellow-50 text-yellow-600', hideOnApp: true },
           ].filter(item => !isApp || !item.hideOnApp).map((item) => (
             <div key={item.label} className="flex flex-col items-center justify-center py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors" onClick={() => navigate(item.path)}>
                <div className={`${isApp ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-2xl'} ${item.color} flex items-center justify-center mb-2`}>
                  <item.icon className={isApp ? 'w-5 h-5' : 'w-7 h-7'} />
                </div>
                <span className={`font-bold text-slate-700 ${isApp ? 'text-[11px]' : 'text-sm'}`}>{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className={`max-w-[1400px] mx-auto px-4 mt-12 transition-all duration-500 ${isApp ? 'space-y-12' : 'px-6 mt-20 space-y-24'}`}>
        
        {/* 3. Recommended Section */}
        <section className="relative">
           <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className={`font-bold text-slate-900 ${isApp ? 'text-lg' : 'text-2xl'}`}>
                   <span className="text-blue-600">추천 PICK!</span> 챌린지
                </h2>
                {!isApp && <p className="text-slate-500 mt-1 text-sm">지금 가장 주목받는 교내외 활동입니다.</p>}
              </div>
              <div className="flex gap-1.5">
                 <button onClick={() => scroll('left')} className="p-2 border border-slate-200 rounded-full bg-white hover:bg-slate-100"><ChevronLeftIcon className="w-4 h-4" /></button>
                 <button onClick={() => scroll('right')} className="p-2 border border-slate-200 rounded-full bg-white hover:bg-slate-100"><ChevronRightIcon className="w-4 h-4" /></button>
              </div>
           </div>

           <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {MOCK_COMPETITIONS.map((comp, idx) => (
                <div key={comp.id} className={`snap-start transition-all ${isApp ? 'min-w-[200px] max-w-[200px]' : 'min-w-[300px] max-w-[300px]'}`}>
                  <CompetitionCard comp={comp} isRecommended={idx < 2} />
                </div>
              ))}
           </div>
        </section>

        {/* 4. IC-PBL Section - Simplified for App Mode */}
        <section className={`${isApp ? 'bg-white border border-slate-100 p-5 rounded-2xl' : 'bg-purple-50 rounded-[40px] p-12'}`}>
           <div className="flex justify-between items-center mb-6">
              <h2 className={`font-bold text-purple-900 ${isApp ? 'text-lg' : 'text-2xl'}`}>
                 ERICA <span className="text-purple-600">IC-PBL</span>
              </h2>
              <Link to="/ic-pbl" className="text-xs font-bold text-purple-600 flex items-center">
                전체보기 <ChevronRightIcon className="w-3 h-3 ml-0.5" />
              </Link>
           </div>
           <div className={`grid gap-4 ${isApp ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
              {MOCK_COMPETITIONS.filter(c => c.type === 'IC-PBL').slice(0, isApp ? 2 : 4).map((comp) => (
                <CompetitionCard key={comp.id} comp={comp} />
              ))}
           </div>
        </section>

        {/* 5. Schedule - Minimal for App */}
        <section className={`grid gap-6 ${isApp ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
           <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${isApp ? 'p-5' : 'p-8 lg:col-span-2'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className={`font-bold text-slate-900 flex items-center gap-2 ${isApp ? 'text-lg' : 'text-xl'}`}>
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    주요 일정
                 </h2>
                 <Link to="/calendar" className="text-xs text-slate-400 font-bold uppercase tracking-widest">More</Link>
              </div>
              <div className="space-y-3">
                 {[1, 2].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors" onClick={() => navigate('/calendar')}>
                       <div className="flex-shrink-0 w-10 text-center">
                          <div className="text-[10px] text-slate-400 font-bold">05.{15 + i}</div>
                          <div className="text-lg font-black text-slate-800 leading-none">{15 + i}</div>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate">글로벌 봉사단 오리엔테이션</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">학생회관 소극장</p>
                       </div>
                       <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">D-{i + 2}</span>
                    </div>
                 ))}
              </div>
           </div>

           {!isApp && (
             <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2">도움이 필요하신가요?</h2>
                <p className="text-slate-500 text-sm mb-6">지원 방법이나 일정 문의 등<br/>무엇이든 물어보세요.</p>
                <button onClick={() => navigate('/support/qna')} className="py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20">1:1 문의하기</button>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

// ... (Rest of CompetitionListPage, CompetitionDetailPage, CalendarPage are updated to respect viewMode)
export const CompetitionListPage: React.FC<{ filterType?: 'IC-PBL' | 'General' }> = ({ filterType }) => {
  const { category } = useParams();
  const { viewMode } = useViewMode();
  const navigate = useNavigate();
  const isApp = viewMode === 'app';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterCategories = ['전체', 'IT/SW', '디자인', '아이디어', '대외활동'];

  const filteredCompetitions = useMemo(() => {
    let data = MOCK_COMPETITIONS;
    if (filterType) data = data.filter(c => c.type === filterType);
    if (selectedCategory !== '전체') data = data.filter(c => c.category.includes(selectedCategory));
    if (searchTerm) data = data.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return data;
  }, [filterType, selectedCategory, searchTerm]);

  return (
    <div className={`${isApp ? 'p-4' : ''} space-y-6`}>
      <div className={isApp ? 'text-center' : ''}>
         <h1 className={`font-black text-slate-900 mb-1 ${isApp ? 'text-xl' : 'text-3xl'}`}>
           {filterType === 'IC-PBL' ? 'IC-PBL 전용관' : '전체 공모전'}
         </h1>
         <p className="text-xs text-slate-500">한양대학교 ERICA의 다양한 기회를 확인하세요.</p>
      </div>

      <div className={`bg-white border border-slate-100 rounded-2xl ${isApp ? 'p-3' : 'p-6 shadow-sm'} space-y-4`}>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterCategories.map((cat) => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
               >
                 {cat}
               </button>
            ))}
         </div>

         <div className="relative">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
      </div>

      <div className={`grid gap-4 ${isApp ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4 md:gap-6'}`}>
        {filteredCompetitions.map((comp) => (
           <CompetitionCard key={comp.id} comp={comp} />
        ))}
      </div>
    </div>
  );
};

export const CompetitionDetailPage: React.FC = () => {
  const { id } = useParams();
  const { viewMode } = useViewMode();
  const isApp = viewMode === 'app';
  const competition = MOCK_COMPETITIONS.find(c => c.id === id);
  
  if (!competition) return <div className="text-center py-20 text-slate-400">정보가 없습니다.</div>;

  return (
    <div className={`max-w-5xl mx-auto ${isApp ? 'p-0' : ''}`}>
      {/* Header Info */}
      <div className={`bg-white border-b border-slate-100 ${isApp ? 'p-5' : 'pb-8 pt-4'}`}>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">{competition.category}</span>
          {competition.type === 'IC-PBL' && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">IC-PBL</span>}
        </div>
        <h1 className={`font-black text-slate-900 leading-tight mb-4 ${isApp ? 'text-xl' : 'text-3xl'}`}>{competition.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
           <span>{competition.organizer}</span>
           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
           <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {competition.endDate} 마감</span>
        </div>
      </div>

      <div className={`flex flex-col gap-6 ${isApp ? 'p-5' : 'mt-8 md:flex-row'}`}>
        <div className="flex-1 space-y-6">
           <div className={`w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-sm`}>
              <img src={competition.imageUrl} alt={competition.title} className="w-full h-full object-cover" />
           </div>
           
           <section className="space-y-4">
             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">공모 요강</h2>
             <div className="bg-white border border-slate-100 p-5 rounded-2xl text-sm leading-relaxed text-slate-600 shadow-sm whitespace-pre-wrap">
               {competition.description}
             </div>
           </section>
        </div>

        {/* Sidebar Sticky for Web, Fixed Bottom for App */}
        <div className={`md:w-72 shrink-0`}>
          <div className={`${isApp ? 'fixed bottom-[72px] left-0 right-0 px-4 py-3 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40' : 'sticky top-28 bg-white border border-blue-50 p-6 rounded-2xl shadow-xl'}`}>
             <button className="w-full py-4 bg-blue-900 text-white font-black rounded-2xl shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
               지금 바로 지원하기 <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const { viewMode } = useViewMode();
  const isApp = viewMode === 'app';
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className={`flex flex-col h-full ${isApp ? 'p-4' : ''}`}>
      <div className="mb-6 flex justify-between items-center">
         <h1 className={`font-black text-slate-900 ${isApp ? 'text-xl' : 'text-3xl'}`}>2024년 5월</h1>
      </div>
      
      <div className={`bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col ${isApp ? 'h-[400px]' : 'flex-1 min-h-[600px]'}`}>
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={`p-3 text-center text-[10px] font-black ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-400'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map(d => {
            const hasEvent = d % 7 === 0 || d % 10 === 0;
            return (
              <div key={d} className={`border-b border-r border-slate-50 p-1 flex flex-col items-center group active:bg-blue-50 transition-colors`}>
                <span className="text-[10px] font-bold text-slate-500 mb-1">{d}</span>
                {hasEvent && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4 overflow-y-auto flex-1">
         <h3 className="text-sm font-bold text-slate-900 px-1">오늘의 주요 마감</h3>
         {[1, 2].map(i => (
           <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">D-Day</div>
             <div className="flex-1">
               <div className="text-xs font-bold text-slate-900 line-clamp-1">ERICA AI 챌린지 2024</div>
               <div className="text-[10px] text-slate-400 font-medium">소프트웨어융합대학</div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};
