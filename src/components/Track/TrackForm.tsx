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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Track Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Track Name
        </label>
        <div className="mt-1.5 relative group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className={`block w-full rounded-xl px-4 py-2.5 
              transition-all duration-200
              bg-white dark:bg-slate-900
              ${nameError 
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-500' 
                : 'border-gray-200 dark:border-slate-700 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400'
              }
              hover:border-blue-300 dark:hover:border-blue-600
              group-hover:shadow-md dark:group-hover:shadow-slate-800/50
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500`}
            required
          />
          {/* Glass Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-blue-100/10 to-purple-100/20 
            dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-purple-400/5
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 pointer-events-none" />
        </div>
        {nameError && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{nameError}</p>
        )}
      </div>

      {/* Start Date and Time Field */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Start Date and Time
        </label>
        <div className="mt-1.5 relative group">
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="block w-full rounded-xl px-4 py-2.5 
              bg-white dark:bg-slate-900
              border-gray-200 dark:border-slate-700 
              text-gray-900 dark:text-gray-100
              focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
              focus:border-blue-500 dark:focus:border-blue-400
              hover:border-blue-300 dark:hover:border-blue-600
              transition-all duration-200
              group-hover:shadow-md dark:group-hover:shadow-slate-800/50"
            required
          />
          {/* Glass Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-blue-100/10 to-purple-100/20 
            dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-purple-400/5
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>

      {/* End Date and Time Field */}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          End Date and Time
        </label>
        <div className="mt-1.5 relative group">
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full rounded-xl px-4 py-2.5 
              bg-white dark:bg-slate-900
              border-gray-200 dark:border-slate-700 
              text-gray-900 dark:text-gray-100
              focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
              focus:border-blue-500 dark:focus:border-blue-400
              hover:border-blue-300 dark:hover:border-blue-600
              transition-all duration-200
              group-hover:shadow-md dark:group-hover:shadow-slate-800/50"
            required
          />
          {/* Glass Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-blue-100/10 to-purple-100/20 
            dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-purple-400/5
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-sm font-medium
            bg-gradient-to-r from-blue-600 to-violet-600 
            dark:from-blue-500 dark:to-violet-500
            text-white 
            hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20
            transform transition-all duration-200 
            hover:scale-[1.02] hover:-translate-y-[1px]
            active:scale-[0.98] active:translate-y-[1px]
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
        >
          {initialData ? 'Update Track' : 'Create Track'}
        </button>
      </div>
    </form>
  );
}