import React, { useState, useEffect } from 'react';
import { showToast } from '../Modal/CustomToast';
import { validateTrackName, getDefaultDateTime, validateTrackDateTime } from '../../utils/validations';
import { TrackFormProps } from '../../types/tracks';

// Helper function to format date
const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TrackForm({ onSubmit, initialData, tracks }: TrackFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(initialData?.startDate || getDefaultDateTime());
  const [endDate, setEndDate] = useState(() => {
    if (initialData?.endDate) return initialData.endDate;
    
    // Set initial end date to 1 hour after start date
    const startDateTime = new Date(initialData?.startDate || getDefaultDateTime());
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    
    return formatDateTime(endDateTime);
  });

  // Only update time automatically for new tracks and when the form first loads
  useEffect(() => {
    if (!initialData) {
      const currentDateTime = getDefaultDateTime();
      setStartDate(currentDateTime);
      
      const startDateTime = new Date(currentDateTime);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
      setEndDate(formatDateTime(endDateTime));

      // Update time every minute only if user hasn't manually changed it
      const interval = setInterval(() => {
        setStartDate(prev => {
          if (prev === startDate) {
            const newDateTime = getDefaultDateTime();
            const newEndDateTime = new Date(new Date(newDateTime).getTime() + 60 * 60 * 1000);
            setEndDate(formatDateTime(newEndDateTime));
            return newDateTime;
          }
          return prev;
        });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [initialData]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    // Validate name immediately
    const error = validateTrackName(newName, tracks || [], initialData?.id);
    setNameError(error);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    const timeError = validateTrackDateTime(newStartDate, !!initialData);
    
    if (timeError) {
      showToast.error(timeError);
      return;
    }
    
    setStartDate(newStartDate);
    
    // If end date is before new start date, update it
    if (new Date(newStartDate) > new Date(endDate)) {
      setEndDate(newStartDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate track name
    const nameError = validateTrackName(name, tracks || [], initialData?.id);
    if (nameError) {
      showToast.error(nameError);
      setNameError(nameError);
      return;
    }

    // Validate start time
    const startTimeError = validateTrackDateTime(startDate, !!initialData);
    if (startTimeError) {
      showToast.error(startTimeError);
      return;
    }

    // Validate end time is after start time
    if (new Date(endDate) <= new Date(startDate)) {
      showToast.error("End time must be after start time");
      return;
    }

   onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name,
      startDate,
      endDate,
      sections: initialData?.sections || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Track Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Track Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className={`mt-1 block w-full rounded-md border px-3 py-2 ${
            nameError 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          required
        />
        {nameError && (
          <p className="mt-1 text-sm text-red-600">{nameError}</p>
        )}
      </div>

      {/* Start Date and Time Field */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date and Time
        </label>
        <input
          type="datetime-local"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      {/* End Date and Time Field */}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date and Time
        </label>
        <input
          type="datetime-local"
          id="endDate"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update Track' : 'Create Track'}
        </button>
      </div>
    </form>
  );
}