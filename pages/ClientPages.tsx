
import React, { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_COMPETITIONS } from '../constants';
import { Competition } from '../types';
import { Calendar as CalendarIcon, Users, Eye, ArrowRight, CheckCircle, Bookmark, Search, Filter, Trophy, Star, Megaphone, Lightbulb, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon } from 'lucide-react';

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
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Helper to calculate D-Day
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
  const dDay = getDDay(comp.endDate);
  const isClosed = dDay === '마감';

  const handleClick = () => {
      if (onClick) {
          onClick();
      } else {
          navigate(`/competition/${comp.id}`);
      }
  }

  return (
    <div 
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={comp.imageUrl} 
          alt={comp.title} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isClosed ? 'grayscale opacity-80' : ''}`} 
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image')}
        />
        
        {/* Overlay: Bookmark */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-[2px] text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 z-10">
            <Bookmark className="w-3 h-3 fill-white" />
            <span>{comp.views > 800 ? '999+' : comp.views}</span>
        </div>

        {/* Overlay: D-Day */}
        {!isClosed && (
            <div className="absolute bottom-3 right-3 bg-red-600/95 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
                {dDay}
            </div>
        )}

        {/* Closed Overlay */}
        {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 z-10">
                <span className="text-white font-bold border-2 border-white px-3 py-1 rounded tracking-widest">마감</span>
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
          {/* Title & Badge */}
          <div className="mb-3">
            {isRecommended && (
              <span className="inline-block px-1.5 py-[2px] border border-red-500 text-red-500 text-[11px] font-bold rounded-[3px] mb-1.5 mr-1.5 align-text-top">
                추천
              </span>
            )}
            <h3 className="text-[17px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
              {comp.title}
            </h3>
          </div>

          {/* Team Recruiting */}
          {!isClosed && (
            <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-bold text-red-500">팀원 모집</span>
                <span className="text-xs font-bold text-red-500">{comp.applicants}</span>
            </div>
          )}
          
          <div className="mt-auto space-y-3">
            {/* Organizer */}
            <p className="text-xs text-slate-500 truncate font-medium">{comp.organizer}</p>
            
            {/* Stats Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 mt-1">
                <div className="flex gap-2">
                    <span className={isClosed ? "text-slate-400" : "text-red-500 font-bold"}>
                        {isClosed ? '종료' : dDay}
                    </span>
                </div>
                <div className="flex gap-2">
                    <span>조회 {comp.views.toLocaleString()}</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};


// --- Page: Home (Portal Dashboard) ---
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock data subsets
  const featuredCompetitions = MOCK_COMPETITIONS; // Using all for horizontal scroll
  const icPblCompetitions = MOCK_COMPETITIONS.filter(c => c.type === 'IC-PBL').slice(0, 4);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll about 80% of width
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 pb-20">
      {/* 1. Hero Banner */}
      <div className="w-full bg-blue-900 relative overflow-hidden h-[450px]">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent"></div>
         <div className="max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6 relative z-10 text-white">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-blue-900 font-bold rounded-full text-sm mb-4 w-fit">
              HOT ISSUE
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              2024 ERICA<br/>
              소프트웨어 융합<br/>
              학술대회 연구계획서 공모
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              창의적인 아이디어를 가진 ERICA 학생 여러분을 기다립니다.<br/>
              총 상금 2,000만원의 주인공이 되어보세요.
            </p>
            <div className="flex gap-4">
               <button onClick={() => navigate('/competition/c1')} className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                 자세히 보기
               </button>
               <button className="px-8 py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                 지난 수상작 보기
               </button>
            </div>
         </div>
      </div>

      {/* 2. Quick Menu (Icons) */}
      <div className="max-w-[1400px] mx-auto -mt-10 relative z-20 px-6">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-center border border-slate-100">
           {[
             { label: '전체 공모전', icon: Trophy, path: '/competitions/all', color: 'bg-blue-100 text-blue-600' },
             { label: 'IC-PBL', icon: Lightbulb, path: '/ic-pbl', color: 'bg-purple-100 text-purple-600' },
             { label: '대외활동', icon: Megaphone, path: '/competitions/activity', color: 'bg-green-100 text-green-600' },
             { label: '캘린더', icon: CalendarIcon, path: '/calendar', color: 'bg-orange-100 text-orange-600' },
             { label: '수상작 갤러리', icon: Star, path: '/support/gallery', color: 'bg-yellow-100 text-yellow-600' },
           ].map((item) => (
             <div key={item.label} className="flex flex-col items-center justify-center p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => navigate(item.path)}>
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-3`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="font-bold text-slate-700">{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-16 space-y-20">
        
        {/* 3. ERICA 핵심 PICK Section (Horizontal Carousel) */}
        <section className="relative">
           <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                   <span className="text-blue-600">ERICA 추천 PICK!</span> 당신의 꿈을 향한 열정적인 도전
                </h2>
                <p className="text-slate-500 mt-2">지금 ERICA 캠퍼스에서 가장 핫한 활동들을 확인해보세요.</p>
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={() => scroll('left')}
                    className="p-3 border border-slate-200 rounded-full bg-white hover:bg-slate-100 transition-colors shadow-sm hover:shadow-md"
                    aria-label="이전 공모전 보기"
                 >
                    <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
                 </button>
                 <button 
                    onClick={() => scroll('right')}
                    className="p-3 border border-slate-200 rounded-full bg-white hover:bg-slate-100 transition-colors shadow-sm hover:shadow-md"
                    aria-label="다음 공모전 보기"
                 >
                    <ChevronRightIcon className="w-6 h-6 text-slate-600" />
                 </button>
              </div>
           </div>

           {/* Horizontal Scroll Container */}
           <div 
             ref={scrollRef}
             className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x"
             style={{ scrollBehavior: 'smooth' }}
           >
              {featuredCompetitions.map((comp, idx) => (
                <div key={comp.id} className="min-w-[320px] max-w-[320px] snap-start">
                  <CompetitionCard comp={comp} isRecommended={idx < 3} />
                </div>
              ))}
              <div className="min-w-[1px] h-full invisible shrink-0"></div>
           </div>
        </section>

        {/* 4. IC-PBL Section */}
        <section className="bg-purple-50 rounded-3xl p-8 lg:p-12">
           <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                   ERICA 특화 <span className="text-purple-600">IC-PBL</span> 프로그램
                </h2>
                <p className="text-purple-700/70 mt-2">산업체와 연계하여 실무 문제를 해결하는 프로젝트에 참여해보세요.</p>
              </div>
              <Link to="/ic-pbl" className="text-sm font-medium text-purple-600 hover:text-purple-900 flex items-center">
                IC-PBL 전용관 이동 <ChevronRightIcon className="w-4 h-4" />
              </Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {icPblCompetitions.length > 0 ? icPblCompetitions.map((comp) => (
                <CompetitionCard key={comp.id} comp={comp} />
              )) : (
                 MOCK_COMPETITIONS.slice(0, 4).map((comp) => (
                    <CompetitionCard key={`fallback-${comp.id}`} comp={{...comp, type: 'IC-PBL', category: 'IC-PBL'}} />
                 ))
              )}
           </div>
        </section>

        {/* 5. Calendar Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    이번 달 주요 일정
                 </h2>
                 <Link to="/calendar" className="text-sm text-slate-500">전체보기</Link>
              </div>
              <div className="space-y-4">
                 {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/calendar')}>
                       <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-xs text-slate-500 font-bold uppercase">MAY</div>
                          <div className="text-2xl font-bold text-slate-900">{15 + i}</div>
                       </div>
                       <div className="w-px h-10 bg-slate-300"></div>
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-900">2024 하계 글로벌 봉사단 오리엔테이션</h4>
                          <p className="text-xs text-slate-500 mt-1">14:00 ~ 16:00 | 학생회관 소극장</p>
                       </div>
                       <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">D-{i * 3 + 2}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">고객센터</h2>
              <div className="space-y-6">
                 <div>
                    <div className="text-3xl font-bold text-blue-900">031-400-0000</div>
                    <p className="text-sm text-slate-500 mt-1">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('/support/qna')} className="py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">1:1 문의</button>
                    <button onClick={() => navigate('/support/faq')} className="py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">FAQ</button>
                 </div>
                 <div className="pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2">공지사항</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                       <li className="truncate hover:text-blue-600 cursor-pointer">• 2024학년도 1학기 공모전 마일리지 적립 안내</li>
                       <li className="truncate hover:text-blue-600 cursor-pointer">• 시스템 점검 안내 (5/20 00:00 ~ 04:00)</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

// ... (CompetitionListPage, CompetitionDetailPage, CalendarPage are identical to previous version)
export const CompetitionListPage: React.FC<{ filterType?: 'IC-PBL' | 'General' }> = ({ filterType }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [sortOption, setSortOption] = useState<string>('최신순');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterCategories = ['전체', '스페셜공모', '공모전', '대외활동', '교육·강연'];

  const filteredCompetitions = useMemo(() => {
    let data = MOCK_COMPETITIONS;
    if (filterType) data = data.filter(c => c.type === filterType);
    if (selectedCategory !== '전체') {
       if (selectedCategory === '공모전') data = data.filter(c => c.category === 'IT/SW' || c.category === '디자인' || c.category === '기획/아이디어');
       else if (selectedCategory === '대외활동') data = data.filter(c => c.category === '대외활동');
    }
    if (selectedStatus !== '전체') {
       if (selectedStatus === '접수중') data = data.filter(c => c.status === 'Open');
       if (selectedStatus === '마감') data = data.filter(c => c.status === 'Closed');
       if (selectedStatus === '접수예정') data = data.filter(c => c.status === 'Upcoming');
    }
    if (searchTerm) data = data.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortOption === '최신순') data = [...data].sort((a, b) => b.id.localeCompare(a.id)); 
    else if (sortOption === '조회순') data = [...data].sort((a, b) => b.views - a.views);
    return data;
  }, [filterType, selectedCategory, selectedStatus, sortOption, searchTerm]);

  const pageTitle = filterType === 'IC-PBL' ? 'IC-PBL 전용관' : '공모전 목록';

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-bold text-slate-900 mb-2">{pageTitle}</h1>
         <p className="text-slate-500">
           {filterType === 'IC-PBL' ? '한양대학교 ERICA만의 특화된 산학연계 문제해결 프로그램을 만나보세요.' : '다양한 분야의 공모전에 도전하여 역량을 키워보세요.'}
         </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
         <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100">
            {filterCategories.map((cat) => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
               >
                 {cat}
               </button>
            ))}
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="검색어를 입력하세요 (예: 2026, 서포터즈)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
             </div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer">
                   <option value="전체">진행상태 전체</option>
                   <option value="접수중">접수중</option>
                   <option value="접수예정">접수예정</option>
                   <option value="마감">마감</option>
                </select>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer">
                   <option value="최신순">최신순</option>
                   <option value="마감임박순">마감임박순</option>
                   <option value="조회순">조회순</option>
                </select>
             </div>
         </div>
      </div>

      <div className="text-sm text-slate-600">
        총 <span className="font-bold text-red-500">{filteredCompetitions.length}</span> 건의 공고가 있습니다.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filteredCompetitions.map((comp, idx) => (
           <CompetitionCard key={comp.id} comp={comp} isRecommended={idx < 2 && comp.status === 'Open'} />
        ))}
      </div>
    </div>
  );
};

export const CompetitionDetailPage: React.FC = () => {
  const { id } = useParams();
  const competition = MOCK_COMPETITIONS.find(c => c.id === id);
  if (!competition) return <div className="text-center py-20 text-slate-500">존재하지 않는 공모전입니다.</div>;
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="border-b border-slate-200 pb-8">
        <div className="flex gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-md">{competition.category}</span>
          {competition.type === 'IC-PBL' && <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-bold rounded-md">IC-PBL</span>}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">{competition.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">
           <div className="flex items-center gap-2 font-medium">주최: {competition.organizer}</div>
           <div className="h-4 w-px bg-slate-300"></div>
           <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {competition.startDate} ~ {competition.endDate}</div>
           <div className="h-4 w-px bg-slate-300"></div>
           <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> {competition.views.toLocaleString()}회 조회</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="w-full h-80 bg-slate-200 rounded-xl overflow-hidden shadow-md"><img src={competition.imageUrl} alt={competition.title} className="w-full h-full object-cover" /></div>
           <section>
             <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-blue-600" /> 공모 요강</h2>
             <div className="bg-white border border-slate-200 p-8 rounded-xl leading-relaxed text-slate-700 whitespace-pre-wrap shadow-sm">
               <p className="mb-4 font-semibold text-lg">{competition.description}</p>
               <p>본 공모전은 한양대학교 ERICA 학생들의 역량 강화를 위해 개최됩니다. 상세한 내용은 첨부파일을 확인하시거나 주최 측에 문의 바랍니다.</p>
             </div>
           </section>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-blue-100 rounded-xl p-6 shadow-xl">
            <h3 className="font-bold text-lg text-slate-900 mb-4 border-b pb-2">지원 정보</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm"><span className="text-slate-500">접수 상태</span><StatusBadge status={competition.status} /></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-500">마감일까지</span><span className="text-red-600 font-bold">D-12</span></div>
            </div>
            <button className="w-full py-4 bg-blue-900 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">지원하기 <ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-slate-900">2024년 5월 일정</h1></div>
      <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
        <div className="grid grid-cols-7 border-b border-slate-200">{['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (<div key={day} className={`p-4 text-center font-bold ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-700'}`}>{day}</div>))}</div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((day) => {
             const dayNum = day > 31 ? day - 31 : day;
             const isCurrentMonth = day <= 31;
             const events = MOCK_COMPETITIONS.filter(c => parseInt(c.startDate.split('-')[2]) === dayNum && isCurrentMonth);
             return (
              <div key={day} className={`min-h-[120px] border-b border-r border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : ''}`}>
                <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}`}>{dayNum}</span>
                <div className="mt-2 space-y-1">{events.map(event => (<div key={event.id} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded truncate cursor-pointer hover:bg-blue-200">{event.title}</div>))}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
