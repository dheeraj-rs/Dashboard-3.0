import React, { useState } from 'react';
import { Section, SectionFormProps } from '../../types/scheduler';

export default function SectionForm({ onSubmit, initialData, isSubsection }: SectionFormProps) {
  const [formData, setFormData] = useState<Partial<Section>>({
    name: initialData?.name || '',
    speaker: initialData?.speaker || '',
    role: initialData?.role || '',
    timeSlot: initialData?.timeSlot || {
      start: '09:00',
      end: '10:00'
    },
    mergedFields: initialData?.mergedFields || {
      speaker: false,
      role: false,
      timeSlot: false
    }
  });

  const timeSlot = formData.timeSlot!;

  const handleChange = (field: keyof Section, value: Section[keyof Section]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mergedFields?.timeSlot) {
      const startTime = new Date(`2000-01-01T${timeSlot.start}`);
      const endTime = new Date(`2000-01-01T${timeSlot.end}`);
      
      if (endTime <= startTime) {
        alert('End time must be after start time');
        return;
      }
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {isSubsection ? 'Subsection Name' : 'Section Name'}
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="speaker" className="block text-sm font-medium text-gray-700">
            Speaker
          </label>
          <input
            type="text"
            id="speaker"
            value={formData.speaker}
            onChange={(e) => handleChange('speaker', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={timeSlot.start}
            onChange={(e) => handleChange('timeSlot', { ...timeSlot, start: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={timeSlot.end}
            onChange={(e) => handleChange('timeSlot', { ...timeSlot, end: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}