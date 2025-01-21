import React, { useState } from 'react';
import { SectionManagementItem, SectionTypeFormProps } from '../../../types/scheduler';
import { ChevronRight } from 'lucide-react';

const SECTION_TYPE_CATEGORIES = [
  { value: 'program' as const, label: 'Program Session', icon: '🎯' },
  { value: 'lunch' as const, label: 'Lunch Break', icon: '🍽️' },
  { value: 'break' as const, label: 'Break Time', icon: '☕' },
  { value: 'introduction' as const, label: 'Introduction', icon: '👋' },
  { value: 'other' as const, label: 'Other', icon: '📌' },
];

export const SectionTypeForm: React.FC<SectionTypeFormProps> = ({ initialData, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
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

  if (!selectedType && !initialData) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Select Section Type</h3>
        <div className="grid grid-cols-1 gap-3">
          {SECTION_TYPE_CATEGORIES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setSelectedType(type.value);
                setFormData(prev => ({ ...prev, sectionType: type.value }));
              }}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg 
                hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-500">Create a new {type.label.toLowerCase()} section</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 
                transform group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

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

        {(selectedType !== 'break' && selectedType !== 'lunch') && (
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

      <div className="flex gap-3">
        {!initialData && (
          <button
            type="button"
            onClick={() => setSelectedType(null)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
              hover:bg-gray-200 transition-all duration-200"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
            text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
            transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {initialData ? 'Update Section Type' : 'Create Section Type'}
        </button>
      </div>
    </form>
  );
};

export default SectionTypeForm;
