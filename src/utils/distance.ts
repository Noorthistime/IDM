import { Location } from '../types';

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistance(loc1: Location, loc2: Location): number {
  if (!loc1 || !loc2 || typeof loc1.lat !== 'number' || typeof loc1.lng !== 'number' || typeof loc2.lat !== 'number' || typeof loc2.lng !== 'number') {
    return Infinity; // Fallback distance
  }

  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}
