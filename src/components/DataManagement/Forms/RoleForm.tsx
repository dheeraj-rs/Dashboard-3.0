import React, { useState } from 'react';
import { RoleFormProps, RoleManagementItem } from '../../../types/scheduler';
import { Plus, X } from 'lucide-react';

export const RoleForm: React.FC<RoleFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<RoleManagementItem>>(
    initialData || {
      name: '',
      responsibilities: [],
      requirements: [],
      level: 'mid',
      department: '',
    }
  );

  const [newResponsibility, setNewResponsibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...(prev.responsibilities || []), newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add responsibility"
            />
            <button
              type="button"
              onClick={addResponsibility}
              className="px-3 py-2 bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.responsibilities?.map((resp, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-md"
              >
                {resp}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    responsibilities: prev.responsibilities?.filter((_, i) => i !== index)
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
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              placeholder="Add requirement"
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-3 py-2 bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.requirements?.map((req, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-md"
              >
                {req}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    requirements: prev.requirements?.filter((_, i) => i !== index)
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

      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
          text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {initialData ? 'Update Role' : 'Create Role'}
      </button>
    </form>
  );
}; 