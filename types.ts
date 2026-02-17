export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'BETA';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Offensive' | 'Defensive' | 'General';
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface Visitor {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  notes?: string;
  duration?: string; // Formatted duration string (e.g., "2m 15s")
  sessionCount: number;
}