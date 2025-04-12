// lib/types.ts
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Included' | 'Excluded';
  location?: string;
  workModel?: string;
  age?: number;
  gender?: string;
  ethnicity?: string;
  timeZone?: string;
  tenure?: string;
  language?: string;
  profilePicture?: string;
  workActivity?: {
    avgHours: number;
    weeklyHours: number[];
  };
}

export interface DepartmentDistribution {
  name: string;
  count: number;
}

export interface LocationDistribution {
  name: string;
  count: number;
}

export interface WorkModelDistribution {
  name: string;
  count: number;
}