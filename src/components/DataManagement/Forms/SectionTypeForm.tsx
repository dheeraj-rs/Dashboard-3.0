import React, { useState } from 'react';
import { SectionManagementItem, SectionTypeFormProps } from '../../../types/scheduler';

export const SectionTypeForm: React.FC<SectionTypeFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<SectionManagementItem>>({
    name: initialData?.name ?? '',
    type: 'sectionstypes',
    sectionType: initialData?.sectionType ?? 'program',
    description: initialData?.description ?? '',
    maxParticipants: initialData?.maxParticipants ?? undefined,
    location: initialData?.location ?? '',
    timeSlot: initialData?.timeSlot ?? { start: '09:00', end: '10:00' },
    color: initialData?.color ?? '#000000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Type Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.sectionType}
            onChange={(e) => setFormData({ ...formData, sectionType: e.target.value as any })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="program">Program</option>
            <option value="lunch">Lunch</option>
            <option value="break">Break</option>
            <option value="introduction">Introduction</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.sectionType !== 'break' && formData.sectionType !== 'lunch' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max Participants</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 h-10"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
          text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {initialData ? 'Update Section Type' : 'Create Section Type'}
      </button>
    </form>
  );
};

export default SectionTypeForm;
