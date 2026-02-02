
import React, { useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_COMPETITIONS } from '../constants';
import { Competition } from '../types';
import { useViewMode } from '../components/Layout';
import { Calendar as CalendarIcon, Eye, ArrowRight, Search, Trophy, Star, Megaphone, Lightbulb, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon } from 'lucide-react';

export const getDDay = (endDate: string) => {
  const today = new Date('2024-05-15');
  const end = new Date(endDate);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? '마감' : diffDays === 0 ? 'D-Day' : `D-${diffDays}`;
};

export const CompetitionCard: React.FC<{ comp: Competition; onClick?: () => void }> = ({ comp, onClick }) => {
  const navigate = useNavigate();
  const dDay = getDDay(comp.endDate);
  const isClosed = dDay === '마감';

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all cursor-pointer h-full" onClick={() => onClick ? onClick() : navigate(`/competition/${comp.id}`)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={comp.imageUrl} alt={comp.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isClosed ? 'grayscale opacity-80' : ''}`} />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">{comp.category}</div>
        {!isClosed && <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm z-10">{dDay}</div>}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-blue-800 transition-colors mb-2">{comp.title}</h3>
        <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[60%]">{comp.organizer}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400"><Eye className="w-3 h-3" /><span>{comp.views.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isApp = viewMode === 'app';

  return (
    <div className="w-full bg-slate-50 pb-20">
      {/* Hero Banner - Mobile optimized height by default, scales on Desktop */}
      <div className={`w-full bg-blue-900 relative overflow-hidden transition-all duration-500 h-[280px] md:h-[450px]`}>
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent"></div>
         <div className="max-w-[1400px] mx-auto h-full flex flex-col justify-end px-6 pb-8 md:pb-16 relative z-10 text-white">
            <span className="inline-block px-2 py-0.5 bg-yellow-400 text-blue-950 font-black rounded text-[10px] mb-3 w-fit uppercase tracking-tighter">HOT ISSUE</span>
            <h1 className="font-black leading-[1.15] mb-4 text-2xl md:text-5xl">ERICA<br/>소프트웨어 융합<br/>학술대회 모집</h1>
            <div className="flex gap-2">
               <button onClick={() => navigate('/competition/c1')} className="bg-white text-blue-900 font-bold rounded-lg px-6 py-2 md:px-8 md:py-3 text-xs md:text-base hover:bg-blue-50 transition-colors">자세히 보기</button>
            </div>
         </div>
      </div>

      {/* Quick Menu - Grid 4 cols on mobile, 5 cols on desktop */}
      <div className="max-w-[1400px] mx-auto relative z-20 px-4 -mt-6 md:-mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-4 md:grid-cols-5 gap-2 md:p-6 text-center border border-slate-100">
           {[
             { label: '전체', icon: Trophy, path: '/competitions/all', color: 'bg-blue-50 text-blue-600' },
             { label: 'IC-PBL', icon: Lightbulb, path: '/ic-pbl', color: 'bg-purple-50 text-purple-600' },
             { label: '대외활동', icon: Megaphone, path: '/competitions/activity', color: 'bg-emerald-50 text-emerald-600' },
             { label: '캘린더', icon: CalendarIcon, path: '/calendar', color: 'bg-orange-50 text-orange-600' },
             { label: '수상작', icon: Star, path: '/support/gallery', color: 'bg-yellow-50 text-yellow-600', hideOnMobile: true },
           ].map((item) => (
             <div key={item.label} className={`flex flex-col items-center justify-center py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${item.hideOnMobile ? 'hidden md:flex' : 'flex'}`} onClick={() => navigate(item.path)}>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center mb-2 group">
                  <item.icon className={`w-5 h-5 md:w-7 h-7 ${item.color.split(' ')[1]}`} />
                </div>
                <span className="font-bold text-slate-700 text-[11px] md:text-sm">{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 mt-12 md:px-6 md:mt-20 space-y-12 md:space-y-24">
        <section>
           <div className="flex justify-between items-end mb-6">
              <h2 className="font-bold text-slate-900 text-lg md:text-2xl"><span className="text-blue-600">추천 PICK!</span> 챌린지</h2>
              <div className="flex gap-1.5">
                 <button onClick={() => scrollRef.current?.scrollBy({left: -300, behavior: 'smooth'})} className="p-2 border border-slate-200 rounded-full bg-white hover:bg-slate-100"><ChevronLeftIcon className="w-4 h-4" /></button>
                 <button onClick={() => scrollRef.current?.scrollBy({left: 300, behavior: 'smooth'})} className="p-2 border border-slate-200 rounded-full bg-white hover:bg-slate-100"><ChevronRightIcon className="w-4 h-4" /></button>
              </div>
           </div>
           <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {MOCK_COMPETITIONS.map((comp) => (
                <div key={comp.id} className="snap-start min-w-[220px] md:min-w-[300px] max-w-[220px] md:max-w-[300px]">
                  <CompetitionCard comp={comp} />
                </div>
              ))}
           </div>
        </section>

        <section className="bg-white md:bg-purple-50 rounded-2xl md:rounded-[40px] p-5 md:p-12 border border-slate-100 md:border-none shadow-sm md:shadow-none">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-purple-900 text-lg md:text-2xl">ERICA <span className="text-purple-600">IC-PBL</span></h2>
              <Link to="/ic-pbl" className="text-xs font-bold text-purple-600 flex items-center">전체보기 <ChevronRightIcon className="w-3 h-3 ml-0.5" /></Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_COMPETITIONS.filter(c => c.type === 'IC-PBL').slice(0, 4).map((comp) => (
                <CompetitionCard key={comp.id} comp={comp} />
              ))}
           </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-8 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-600" />주요 일정</h2>
                 <Link to="/calendar" className="text-xs text-slate-400 font-bold">전체보기</Link>
              </div>
              <div className="space-y-3">
                 {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/calendar')}>
                       <div className="text-center w-10 shrink-0">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">MAY</div>
                          <div className="text-xl font-black text-slate-800">{15 + i}</div>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate">소프트웨어 융합 학술대회 접수 마감</h4>
                          <p className="text-xs text-slate-500 mt-0.5">본관 4층 회의실</p>
                       </div>
                       <span className="hidden sm:inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">D-{i + 1}</span>
                    </div>
                 ))}
              </div>
           </div>
           <div className="hidden lg:flex bg-blue-900 rounded-2xl p-8 flex-col justify-center items-center text-center text-white">
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">당신의 꿈을 펼치세요</h3>
              <p className="text-blue-100 text-sm mb-6 opacity-80">지금 바로 도전하고<br/>한양의 주인공이 되세요.</p>
              <button onClick={() => navigate('/competitions/all')} className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl">공모전 찾기</button>
           </div>
        </section>
      </div>
    </div>
  );
};

export const CompetitionListPage: React.FC<{ filterType?: 'IC-PBL' | 'General' }> = ({ filterType }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('전체');

  const filtered = useMemo(() => {
    let data = MOCK_COMPETITIONS;
    if (filterType) data = data.filter(c => c.type === filterType);
    if (selectedCategory !== '전체') data = data.filter(c => c.category.includes(selectedCategory));
    return data;
  }, [filterType, selectedCategory]);

  return (
    <div className="p-4 md:p-0 space-y-6">
      <div className="md:mb-10">
         <h1 className="text-xl md:text-3xl font-black text-slate-900 mb-1">{filterType === 'IC-PBL' ? 'IC-PBL 전용관' : '전체 공모전'}</h1>
         <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">Hanyang University ERICA</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {['전체', 'IT/SW', '디자인', '아이디어', '대외활동'].map(cat => (
           <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-900'}`}>{cat}</button>
         ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map(comp => <CompetitionCard key={comp.id} comp={comp} />)}
      </div>
    </div>
  );
};

export const CompetitionDetailPage: React.FC = () => {
  const { id } = useParams();
  const competition = MOCK_COMPETITIONS.find(c => c.id === id);
  if (!competition) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-0">
      <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">{competition.category}</span>
        <h1 className="text-xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">{competition.title}</h1>
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-8">
           <img src={competition.imageUrl} alt={competition.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-50">
           <div><div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Organizer</div><div className="text-xs font-bold text-slate-800">{competition.organizer}</div></div>
           <div><div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Deadline</div><div className="text-xs font-bold text-red-600">{competition.endDate}</div></div>
           <div><div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Type</div><div className="text-xs font-bold text-slate-800">{competition.type}</div></div>
           <div><div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Status</div><div className="text-xs font-bold text-green-600">접수중</div></div>
        </div>
        <div className="mt-8 space-y-4">
           <h3 className="font-bold text-slate-900">상세 정보</h3>
           <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{competition.description}</p>
        </div>
      </div>
      <button className="w-full py-4 bg-blue-900 text-white font-black rounded-xl shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2">지금 바로 지원하기 <ArrowRight className="w-5 h-5" /></button>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="p-4 md:p-0 space-y-6">
      <h1 className="text-xl md:text-3xl font-black text-slate-900">2024년 5월 일정</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-[450px] md:h-[600px] flex flex-col">
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
           {['일','월','화','수','목','금','토'].map((d, i) => (
             <div key={d} className={`p-3 text-center text-[10px] font-black ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-400'}`}>{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
           {days.map(d => (
             <div key={d} className="border-b border-r border-slate-50 p-1 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500">{d}</span>
                {(d === 15 || d === 16) && <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></div>}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
