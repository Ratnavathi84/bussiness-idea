import { Trip } from './types';

export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Autumn in Kyoto',
    location: 'Kyoto, Japan',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    startDate: '2023-11-12',
    endDate: '2023-11-24',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    isPublic: true,
  },
  {
    id: '2',
    title: 'Amalfi Coast Retreat',
    location: 'Amalfi, Italy',
    coordinates: { lat: 40.6333, lng: 14.6029 },
    startDate: '2023-06-05',
    endDate: '2023-06-15',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f40af5eba324?q=80&w=2048&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Northern Lights Quest',
    location: 'Tromsoe, Norway',
    coordinates: { lat: 69.6492, lng: 18.9553 },
    startDate: '2024-01-10',
    endDate: '2024-01-18',
    coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
  }
];
