export type ViewType = 
  | 'landing' 
  | 'dashboard' 
  | 'map' 
  | 'editor' 
  | 'gallery' 
  | 'bucket-list' 
  | 'ai' 
  | 'stats' 
  | 'profile';

export interface Trip {
  id: string;
  title: string;
  location: string;
  coordinates: { lat: number, lng: number };
  startDate: string;
  endDate: string;
  coverImage: string;
  isPublic?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  icon?: any;
}
