import React, { useState } from 'react';
import { SpeakerManagementItem } from '../../../types/scheduler';
import { Plus, X } from 'lucide-react';

interface Props {
  initialData?: SpeakerManagementItem;
  onSubmit: (data: Partial<SpeakerManagementItem>) => void;
}

export const SpeakerForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<SpeakerManagementItem>>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      organization: '',
      expertise: [],
      availability: [],
      bio: '',
    }
  );

  const [newExpertise, setNewExpertise] = useState('');
  const [availabilityInput, setAvailabilityInput] = useState({
    start: '',
    end: '',
    days: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...(prev.expertise || []), newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const addAvailability = () => {
    if (availabilityInput.start && availabilityInput.end && availabilityInput.days.length > 0) {
      setFormData(prev => ({
        ...prev,
        availability: [...(prev.availability || []), { ...availabilityInput }]
      }));
      setAvailabilityInput({ start: '', end: '', days: [] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expertise</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add expertise"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="px-3 py-2 bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.expertise?.map((exp, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-md"
              >
                {exp}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    expertise: prev.expertise?.filter((_, i) => i !== index)
                  }))}
                  className="text-violet-400 hover:text-violet-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Availability</label>
          <div className="mt-1 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="time"
                  value={availabilityInput.start}
                  onChange={(e) => setAvailabilityInput(prev => ({
                    ...prev,
                    start: e.target.value
                  }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Start time"
                />
              </div>
              <div className="flex-1">
                <input
                  type="time"
                  value={availabilityInput.end}
                  onChange={(e) => setAvailabilityInput(prev => ({
                    ...prev,
                    end: e.target.value
                  }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="End time"
                />
              </div>
              <button
                type="button"
                onClick={addAvailability}
                className="px-3 py-2 bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.availability?.map((time, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-md"
                >
                  {time.start} - {time.end}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      availability: prev.availability?.filter((_, i) => i !== index)
                    }))}
                    className="text-violet-400 hover:text-violet-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 pb-14 bg-gradient-to-r from-blue-600 to-violet-600 
          text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {initialData ? 'Update Speaker' : 'Create Speaker'}
      </button>
     
    </form>
  );
}; 