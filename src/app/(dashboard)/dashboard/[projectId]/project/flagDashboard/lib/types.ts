export interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

export interface FeatureFlag {
  id: string
  key: string
  valueType: string
  lifecycle: "draft" | "active" | "deprecated" | "archived"
  description:string
  createdAt: string
  createdBy: {
    name: string
  }
 
}

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export type TabType = 'overview' | 'applications' | 'event-log' | 'settings';
