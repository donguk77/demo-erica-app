import { Competition, NavItem, UserStats, DailyStats } from './types';

// Navigation Structure
export const NAV_ITEMS: NavItem[] = [
  {
    label: '공모전',
    href: '/competitions',
    subItems: [
      { label: '전체보기', href: '/competitions/all' },
      { label: 'IT/SW', href: '/competitions/it-sw' },
      { label: '디자인', href: '/competitions/design' },
      { label: '기획/아이디어', href: '/competitions/idea' },
      { label: '대외활동', href: '/competitions/activity' },
    ],
  },
  {
    label: 'IC-PBL',
    href: '/ic-pbl',
    subItems: [
      { label: 'IC-PBL 소개', href: '/ic-pbl/intro' },
      { label: '진행중인 과제', href: '/ic-pbl/active' },
      { label: '우수 사례', href: '/ic-pbl/cases' },
    ],
  },
  {
    label: '캘린더',
    href: '/calendar',
    subItems: [
      { label: '월별 일정', href: '/calendar/month' },
      { label: '마감 임박', href: '/calendar/deadline' },
    ],
  },
  {
    label: '고객지원',
    href: '/support',
    subItems: [
      { label: '공지사항', href: '/support/notice' },
      { label: 'FAQ', href: '/support/faq' },
      { label: 'Q&A', href: '/support/qna' },
    ],
  },
];

// Mock Competitions Data
export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    title: '2024 ERICA 소프트웨어 경진대회',
    category: 'IT/SW',
    type: 'General',
    organizer: '소프트웨어융합대학',
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    status: 'Open',
    views: 1250,
    applicants: 45,
    description: '창의적인 소프트웨어 아이디어를 가진 학생들의 참여를 기다립니다. 본 대회는 AI, IoT, Web/App 분야를 포함합니다.',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    tags: ['AI', 'Coding', 'Team Project']
  },
  {
    id: 'c2',
    title: 'IC-PBL 지역사회 문제해결 챌린지',
    category: '기획/아이디어',
    type: 'IC-PBL',
    organizer: 'IC-PBL센터',
    startDate: '2024-05-10',
    endDate: '2024-06-15',
    status: 'Open',
    views: 890,
    applicants: 20,
    description: '안산시 지역 사회 문제를 해결하기 위한 창의적인 솔루션을 제안해주세요.',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    tags: ['Local', 'Problem Solving', 'Volunteering']
  },
  {
    id: 'c3',
    title: '제5회 캠퍼스 디자인 공모전',
    category: '디자인',
    type: 'General',
    organizer: '디자인대학',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'Upcoming',
    views: 450,
    applicants: 0,
    description: '아름다운 캠퍼스를 만들기 위한 공공 디자인 아이디어.',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    tags: ['Design', 'Public Art']
  },
  {
    id: 'c4',
    title: '2024 하계 글로벌 봉사단 모집',
    category: '대외활동',
    type: 'General',
    organizer: '사회봉사단',
    startDate: '2024-05-05',
    endDate: '2024-05-20',
    status: 'Closed',
    views: 2100,
    applicants: 150,
    description: '여름방학 동안 해외에서 봉사활동을 진행할 열정적인 학생을 모집합니다.',
    imageUrl: 'https://picsum.photos/800/400?random=4',
    tags: ['Volunteer', 'Global']
  },
  {
    id: 'c5',
    title: '스마트 팩토리 데이터 분석 경진대회',
    category: 'IT/SW',
    type: 'IC-PBL',
    organizer: '공학대학',
    startDate: '2024-05-15',
    endDate: '2024-06-10',
    status: 'Open',
    views: 1100,
    applicants: 30,
    description: '제조 데이터를 활용하여 공정 최적화 모델을 개발하는 대회입니다.',
    imageUrl: 'https://picsum.photos/800/400?random=5',
    tags: ['Data Science', 'Manufacturing', 'Python']
  }
];

// Mock Stats Data for Admin
export const USER_STATS: UserStats[] = [
  { department: '컴퓨터공학과', interest: 'IT/SW', count: 120 },
  { department: '디자인대학', interest: '디자인', count: 85 },
  { department: '경영학부', interest: '기획/아이디어', count: 90 },
  { department: '기계공학과', interest: 'IT/SW', count: 45 },
  { department: '신문방송학과', interest: '대외활동', count: 60 },
];

export const DAILY_STATS: DailyStats[] = Array.from({ length: 7 }, (_, i) => ({
  date: `2024-05-0${i + 1}`,
  visits: Math.floor(Math.random() * 500) + 200,
  clicks: Math.floor(Math.random() * 300) + 100,
}));
