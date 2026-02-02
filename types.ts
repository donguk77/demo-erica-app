export interface Competition {
  id: string;
  title: string;
  category: string; // IT/SW, Design, Idea, etc.
  type: 'General' | 'IC-PBL';
  organizer: string;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  views: number;
  applicants: number;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

export interface UserStats {
  department: string;
  interest: string;
  count: number;
}

export interface DailyStats {
  date: string;
  visits: number;
  clicks: number;
}
