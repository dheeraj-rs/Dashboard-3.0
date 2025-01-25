import { Track } from "../types/tracks";

export const validateTrackDates = (startDate: string, endDate: string, isEdit: boolean = false): string | null => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Remove time component from current date for comparison
  now.setHours(0, 0, 0, 0);

  if (!isEdit && start < now) {
    return "Start date cannot be in the past";
  }

  if (end < start) {
    return "End date must be after start date";
  }

  return null;
};

export const validateTimeSlot = (startTime: string, endTime: string): string | null => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
    return "End time must be after start time";
  }

  return null;
};

export const validateTrackName = (name: string, existingTracks: Track[], currentTrackId?: string): string | null => {
  // Check if name is empty or only whitespace
  if (!name.trim()) {
    return "Track name is required";
  }

  // Check maximum length
  if (name.trim().length > 50) {
    return "Track name must not exceed 50 characters";
  }

  // Check for special characters
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
  if (specialCharsRegex.test(name)) {
    return "Track name cannot contain special characters";
  }

  // Check for duplicate names (case-insensitive)
  const trimmedName = name.trim().toLowerCase();
  const nameExists = existingTracks.some(track => 
    track.name.toLowerCase() === trimmedName && 
    track.id !== currentTrackId
  );
  
  if (nameExists) {
    return "Track name already exists";
  }

  return null;
};

export const validateTrackDateTime = (dateTimeStr: string, isEdit: boolean = false): string | null => {
  const selectedDateTime = new Date(dateTimeStr);
  const now = new Date();
  
  // For comparison, set seconds and milliseconds to 0
  now.setSeconds(0, 0);
  selectedDateTime.setSeconds(0, 0);
  
  // Only validate against past dates when creating a new track
  if (!isEdit && selectedDateTime < now) {
    return "Cannot select a past date or time";
  }
  
  return null;
};

export const getDefaultDateTime = () => {
  const now = new Date();
  // Round up to next 5 minutes
  const minutes = Math.ceil(now.getMinutes() / 5) * 5;
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  
  // If minutes were rounded to 60, increment hour
  if (minutes === 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  }
  
  // Format as YYYY-MM-DDTHH:mm
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${mins}`;
};

export const getMinDateTime = () => {
  const now = new Date();
  // Round down to current minute to prevent immediate past times
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.toISOString().slice(0, 16);
}; 