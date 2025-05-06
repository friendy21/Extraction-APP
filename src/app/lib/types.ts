import { ReactNode } from 'react';

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Included' | 'Excluded';
  profilePicture?: string;
  location?: string;
  workModel?: string;
  age?: number;
  gender?: string;
  ethnicity?: string;
  timeZone?: string;
  language?: string;
  phone?: string;
}

export interface DepartmentDistribution {
  name: string;
  count: number;
}

export interface ExtractedField {
  name: string;
  source: string;
  dataType: string;
  coverage: number;
  status: string;
}

export interface DataSource {
  name: string;
  type: string;
  fieldsExtracted: number;
  lastSync: string;
  status: string;
  color: string;
  icon: ReactNode;
}