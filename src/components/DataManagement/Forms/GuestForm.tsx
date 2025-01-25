import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { GuestManagementItem } from '../../../types/management';

interface GuestFormProps {
  initialData?: GuestManagementItem;
  onSubmit: (data: Partial<GuestManagementItem>) => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<GuestManagementItem>>(
    initialData || {
      name: '',
      type: 'guest',
      email: '',
      phone: '',
      organization: '',
      invitationStatus: 'pending',
      dietaryRestrictions: [],
      notes: '',
      accessLevel: 'standard'
    }
  );

  const [newDietary, setNewDietary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addDietaryRestriction = () => {
    if (newDietary.trim()) {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), newDietary.trim()]
      }));
      setNewDietary('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Guest Name</label>
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
          <label className="block text-sm font-medium text-gray-700">Access Level</label>
          <select
            value={formData.accessLevel}
            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="vip">VIP</option>
            <option value="standard">Standard</option>
            <option value="limited">Limited</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invitation Status</label>
          <select
            value={formData.invitationStatus}
            onChange={(e) => setFormData({ ...formData, invitationStatus: e.target.value as any })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newDietary}
              onChange={(e) => setNewDietary(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add dietary restriction"
            />
            <button
              type="button"
              onClick={addDietaryRestriction}
              className="px-3 py-2 bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.dietaryRestrictions?.map((diet, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-md"
              >
                {diet}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    dietaryRestrictions: prev.dietaryRestrictions?.filter((_, i) => i !== index)
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
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
          text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {initialData ? 'Update Guest' : 'Add Guest'}
      </button>
    </form>
  );
}; 