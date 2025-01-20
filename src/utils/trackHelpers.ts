import { Track } from '../types/scheduler';

export const isTrackNameUnique = (name: string, tracks: Track[]): boolean => {
  return !tracks.some(track => track.name.toLowerCase() === name.trim().toLowerCase());
}; 