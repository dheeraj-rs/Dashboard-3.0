import React, { useState, useEffect } from 'react';
import { TrackFormProps } from '../../types/scheduler';

export default function TrackForm({ onSubmit, initialData }: TrackFormProps) {
  // Initialize state with default values
  const [name, setName] = useState(initialData?.name || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');

  // Set default startDate and endDate to current date and time when adding a new track
  useEffect(() => {
    if (!initialData) {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
      setStartDate(formattedDateTime);
      setEndDate(formattedDateTime);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || Date.now().toString(), // Generate a unique ID if not editing
      name,
      startDate,
      endDate,
      sections: initialData?.sections || [], // Preserve existing sections if editing
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
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
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
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {/* Save Button */}
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          Save Track
        </button>
      </div>
    </form>
  );
}