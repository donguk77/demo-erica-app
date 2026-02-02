import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { USER_STATS, DAILY_STATS, MOCK_COMPETITIONS } from '../constants';
import { Competition } from '../types';
import { 
  LayoutDashboard, FileText, Users, Settings, PlusCircle, 
  Edit, Trash2, Save, X, Image as ImageIcon, Calendar, 
  ArrowLeft, ArrowRight, Move, Check, Eye, Bookmark, Database, Cloud, RefreshCw, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CompetitionCard, getDDay } from './ClientPages';

// --- Shared Types & Helpers for Admin ---
type AdminTab = 'dashboard' | 'content' | 'users' | 'api' | 'settings';
type DataSource = 'local' | 'airtable' | 'sheets';

const StatusBadge: React.FC<{ status: Competition['status'] }> = ({ status }) => {
  const styles = {
    Open: 'bg-green-100 text-green-700 border-green-200',
    Closed: 'bg-slate-100 text-slate-500 border-slate-200',
    Upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status === 'Open' ? '접수중' : status === 'Closed' ? '마감' : '예정'}
    </span>
  );
};

// --- API Management Sub-Component ---
const AdminAPIManager: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="border-b border-slate-200 pb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">API 관리</h1>
                <p className="text-slate-500">외부 데이터 소스(Airtable, Google Sheets) 및 AI 서비스 연결 설정을 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Airtable Config */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <Database className="w-5 h-5 text-blue-600" />
                            Airtable 연동
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">연동됨</span>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">API Key</label>
                            <input type="password" value="pat-xxxxxxxxxxxx" disabled className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-600 text-sm font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Base ID</label>
                            <input type="text" value="appMc38d9s7f8" disabled className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-600 text-sm font-mono" />
                        </div>
                        <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded hover:bg-slate-50 transition-colors text-sm">
                            연동 테스트 및 갱신
                        </button>
                    </div>
                </div>

                {/* Google Sheets Config */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <FileText className="w-5 h-5 text-green-600" />
                            Google Sheets 연동
                        </div>
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">미연동</span>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Sheet ID</label>
                            <input type="text" placeholder="스프레드시트 ID를 입력하세요" className="w-full px-3 py-2 border border-slate-200 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm" />
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                             서비스 계정(JSON) 인증이 필요합니다. 보안 설정에서 키 파일을 업로드해주세요.
                        </div>
                        <button className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors text-sm shadow-sm">
                            설정 저장
                        </button>
                    </div>
                </div>

                {/* OpenAI Config */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <Cloud className="w-5 h-5 text-purple-600" />
                            AI 콘텐츠 생성 (OpenAI)
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">Active</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <p className="text-sm text-slate-600">
                                 공모전 포스터 이미지를 분석하여 자동으로 제목, 기간, 내용을 추출하거나 
                                 설명을 요약하는데 사용됩니다.
                             </p>
                             <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-mono text-slate-600">sk-proj-********************</span>
                             </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 text-sm">
                                API 키 변경
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Admin Dashboard Sub-Component ---
const AdminDashboardView: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSource>('local');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(DAILY_STATS);

  // Simulate Fetching Data from External Sources
  const handleSync = (source: DataSource) => {
      setLoading(true);
      setDataSource(source);

      // Simulate async API delay
      setTimeout(() => {
          if (source === 'airtable') {
              // Mock Airtable Data (slightly different numbers)
               setChartData(DAILY_STATS.map(d => ({
                   ...d,
                   visits: d.visits + Math.floor(Math.random() * 200),
                   clicks: d.clicks + Math.floor(Math.random() * 100)
               })));
          } else if (source === 'sheets') {
              // Mock Sheets Data
              setChartData(DAILY_STATS.map(d => ({
                  ...d,
                  visits: Math.floor(Math.random() * 300),
                  clicks: Math.floor(Math.random() * 100)
              })));
          } else {
              setChartData(DAILY_STATS);
          }
          setLoading(false);
      }, 800);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">대시보드</h1>
            <p className="text-sm text-slate-500 mt-1">
                데이터 소스: <span className="font-bold text-blue-600 uppercase">{dataSource}</span>
            </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
            <button 
                onClick={() => handleSync('local')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dataSource === 'local' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
                Mock Data
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <button 
                onClick={() => handleSync('airtable')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dataSource === 'airtable' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-blue-700'}`}
            >
                <Database className="w-3 h-3" /> Airtable
            </button>
            <button 
                onClick={() => handleSync('sheets')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${dataSource === 'sheets' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:text-green-700'}`}
            >
                <FileText className="w-3 h-3" /> Sheets
            </button>
            {loading && <RefreshCw className="w-4 h-4 ml-2 animate-spin text-blue-600" />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
            { label: '총 방문자', value: dataSource === 'local' ? '12,450' : '15,200', change: '+12%', color: 'border-l-4 border-blue-500' },
            { label: '활성 공모전', value: '24', change: '0', color: 'border-l-4 border-green-500' },
            { label: '신규 가입자', value: '156', change: '+5%', color: 'border-l-4 border-purple-500' },
            { label: '오늘 클릭수', value: dataSource === 'local' ? '890' : '1,020', change: '+22%', color: 'border-l-4 border-orange-500' },
        ].map((stat, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-lg shadow-sm ${stat.color} transition-all duration-500`}>
                <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-green-600 mt-2 font-medium">전월 대비 {stat.change}</div>
            </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex justify-between">
              주간 방문자 및 클릭 추이
              {loading && <span className="text-xs text-slate-400 font-normal">Updating...</span>}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="visits" name="방문자 수" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={true} />
                <Line type="monotone" dataKey="clicks" name="클릭 수" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">학과별/관심분야 현황</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USER_STATS} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="department" type="category" width={100} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} />
                 <Bar dataKey="count" fill="#0f172a" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Content Manager Sub-Component ---
const AdminContentManager: React.FC = () => {
  // Local state to manage competitions (simulation of backend)
  const [items, setItems] = useState<Competition[]>(MOCK_COMPETITIONS);
  
  // "View Mode": 'list' shows grid, 'edit' shows split-screen editor
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<Competition | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Handlers
  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setItems(prev => prev.filter(item => item.id !== id));
      if (editingItem?.id === id) {
          setViewMode('list');
          setEditingItem(null);
      }
    }
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
    } else if (direction === 'right' && index < items.length - 1) {
      const newItems = [...items];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      setItems(newItems);
    }
  };

  const startEdit = (item: Competition) => {
    setEditingItem({ ...item });
    setIsNew(false);
    setViewMode('edit');
  };

  const startCreate = () => {
    const newItem: Competition = {
      id: `c${Date.now()}`,
      title: '새로운 공모전 제목',
      category: 'IT/SW',
      type: 'General',
      organizer: '주최 기관 입력',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      status: 'Open',
      views: 0,
      applicants: 0,
      description: '상세 내용을 입력해주세요.',
      imageUrl: 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 100),
      tags: []
    };
    setEditingItem(newItem);
    setIsNew(true);
    setViewMode('edit');
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    if (isNew) {
      setItems([editingItem, ...items]);
    } else {
      setItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
    }
    setViewMode('list');
    setEditingItem(null);
  };

  // --- Render List View ---
  if (viewMode === 'list') {
      return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">콘텐츠 관리</h1>
              <p className="text-sm text-slate-500">사용자 사이트에 노출되는 공모전을 직접 수정하고 순서를 변경하세요.</p>
            </div>
            <button 
              onClick={startCreate}
              className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-md hover:bg-blue-800 transition-colors shadow-sm font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              신규 콘텐츠 등록
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((comp, idx) => {
              const dDay = getDDay(comp.endDate);
              const isClosed = dDay === '마감';

              return (
                <div key={comp.id} className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  {/* Admin Overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMove(idx, 'left')} 
                        disabled={idx === 0}
                        className="p-2 bg-white rounded-full hover:bg-slate-100 disabled:opacity-50"
                        title="앞으로 이동"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-900" />
                      </button>
                      <button 
                        onClick={() => handleMove(idx, 'right')}
                        disabled={idx === items.length - 1}
                        className="p-2 bg-white rounded-full hover:bg-slate-100 disabled:opacity-50"
                        title="뒤로 이동"
                      >
                        <ArrowRight className="w-5 h-5 text-slate-900" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(comp)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 shadow-lg"
                      >
                        <Edit className="w-4 h-4" /> 편집
                      </button>
                      <button 
                        onClick={() => handleDelete(comp.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" /> 삭제
                      </button>
                    </div>
                    <span className="text-white text-xs font-medium mt-2 bg-black/50 px-2 py-1 rounded">
                      {idx + 1}번째 순서
                    </span>
                  </div>

                  {/* Visual Representation (Using shared Client component style structure manually or Component) */}
                  {/* We reuse the structure from CompetitionCard but without navigation events to prevent navigation in admin */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={comp.imageUrl} alt={comp.title} className={`w-full h-full object-cover ${isClosed ? 'grayscale opacity-80' : ''}`} />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-[2px] text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 z-10">
                       <Bookmark className="w-3 h-3 fill-white" />
                       <span>{comp.views > 800 ? '999+' : comp.views}</span>
                    </div>
                    {!isClosed && <div className="absolute bottom-3 right-3 bg-red-600/95 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">{dDay}</div>}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                     <div className="mb-3">
                       <h3 className="text-[17px] font-bold text-slate-900 leading-snug line-clamp-2">
                         {comp.title}
                       </h3>
                     </div>
                     {!isClosed && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-xs font-bold text-red-500">팀원 모집</span>
                            <span className="text-xs font-bold text-red-500">{comp.applicants}</span>
                        </div>
                     )}
                     <div className="mt-auto space-y-3">
                        <p className="text-xs text-slate-500 truncate font-medium">{comp.organizer}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 mt-1">
                           <span className={isClosed ? "text-slate-400" : "text-red-500 font-bold"}>
                                {isClosed ? '종료' : dDay}
                           </span>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
  }

  // --- Render Split-Screen Editor ---
  if (viewMode === 'edit' && editingItem) {
      return (
          <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewMode('list')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{isNew ? '신규 콘텐츠 등록' : '콘텐츠 편집'}</h2>
                        <p className="text-xs text-slate-500">좌측에서 내용을 수정하면 우측 미리보기에 실시간으로 반영됩니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setViewMode('list')} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">취소</button>
                      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 shadow-md flex items-center gap-2">
                          <Save className="w-4 h-4" /> 저장하기
                      </button>
                  </div>
              </div>

              <div className="flex-1 flex gap-6 overflow-hidden">
                  {/* Left Pane: Form */}
                  <div className="w-1/3 overflow-y-auto pr-2 space-y-6 pb-20">
                      
                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">기본 정보</h3>
                          
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500">제목</label>
                             <input 
                                type="text" 
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                             />
                          </div>

                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500">이미지 URL</label>
                             <input 
                                type="text" 
                                value={editingItem.imageUrl}
                                onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 font-mono"
                             />
                             <p className="text-[10px] text-slate-400">외부 이미지 링크를 사용하세요.</p>
                          </div>
                      </div>

                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">분류 및 일정</h3>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">카테고리</label>
                                <select 
                                    value={editingItem.category}
                                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                                >
                                    <option value="IT/SW">IT/SW</option>
                                    <option value="디자인">디자인</option>
                                    <option value="기획/아이디어">기획/아이디어</option>
                                    <option value="대외활동">대외활동</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">상태</label>
                                <select 
                                    value={editingItem.status}
                                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                                >
                                    <option value="Open">접수중</option>
                                    <option value="Upcoming">예정</option>
                                    <option value="Closed">마감</option>
                                </select>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">시작일</label>
                                <input 
                                    type="date"
                                    value={editingItem.startDate}
                                    onChange={(e) => setEditingItem({...editingItem, startDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">종료일</label>
                                <input 
                                    type="date"
                                    value={editingItem.endDate}
                                    onChange={(e) => setEditingItem({...editingItem, endDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm" 
                                />
                              </div>
                          </div>
                      </div>

                      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">상세 내용</h3>
                           <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500">주최 기관</label>
                             <input 
                                type="text" 
                                value={editingItem.organizer}
                                onChange={(e) => setEditingItem({...editingItem, organizer: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-500">내용</label>
                             <textarea 
                                value={editingItem.description}
                                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                                className="w-full px-3 py-3 border border-slate-300 rounded h-40 resize-none text-sm leading-relaxed"
                             />
                          </div>
                      </div>

                  </div>

                  {/* Right Pane: Live Preview */}
                  <div className="w-2/3 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                      <div className="bg-slate-200 px-4 py-2 text-xs font-bold text-slate-600 flex justify-between">
                          <span>LIVE PREVIEW: USER CLIENT VIEW</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> 실시간 미리보기</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-8">
                          
                          {/* 1. Card Preview */}
                          <div className="w-full max-w-[300px]">
                              <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">List Card View</div>
                              <div className="bg-transparent">
                                  {/* Using the actual client component logic manually to simulate exact render */}
                                  <CompetitionCard comp={editingItem} onClick={()=>{}} /> 
                              </div>
                          </div>

                          <div className="w-full border-t border-slate-300/50"></div>

                          {/* 2. Detail Page Header Preview */}
                          <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden ring-1 ring-slate-900/5">
                             <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Detail Page Header View</div>
                             <div className="p-8">
                                <div className="flex gap-2 mb-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">{editingItem.category}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-4">{editingItem.title}</h1>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                                   <span>주최: {editingItem.organizer}</span>
                                   <span className="w-px h-3 bg-slate-300"></span>
                                   <span>{editingItem.startDate} ~ {editingItem.endDate}</span>
                                </div>
                                <div className="mt-6 p-4 bg-slate-50 rounded text-sm text-slate-700 whitespace-pre-wrap">
                                    {editingItem.description}
                                </div>
                             </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      );
  }
  return null;
};

// --- Main Admin Layout & Page ---
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 sticky top-0 h-screen transition-all shadow-xl z-20">
        <div className="h-20 flex items-center px-6 font-bold text-white text-xl border-b border-slate-800 bg-slate-900">
          <Settings className="w-6 h-6 mr-2 text-blue-500" />
          ERICA Admin
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 px-2">Main Menu</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">대시보드</span>
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'content' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">콘텐츠 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'api' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Database className="w-5 h-5" />
              <span className="font-medium text-sm">API 관리</span>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">회원 관리</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
                <ArrowLeft className="w-3 h-3" />
                Back to Site
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto h-screen bg-slate-100">
        <div className="max-w-[1600px] mx-auto min-h-full">
           {activeTab === 'dashboard' && <AdminDashboardView />}
           {activeTab === 'content' && <AdminContentManager />}
           {activeTab === 'api' && <AdminAPIManager />}
           {activeTab === 'users' && (
             <div className="flex flex-col items-center justify-center h-[500px] text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                <Users className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">회원 관리 기능 준비 중입니다.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};
