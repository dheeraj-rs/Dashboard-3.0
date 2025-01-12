import { useState, useEffect } from "react";
import { Participant } from "../../types/scheduler";

interface ParticipantFormProps {
  onSubmit: (participant: Partial<Participant>) => void;
  initialData?: Participant;
}

export default function ParticipantForm({ onSubmit, initialData }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Partial<Participant>>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    email: initialData?.email || "",
    organization: initialData?.organization || "",
    sessions: initialData?.sessions || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
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
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <input
          type="text"
          id="organization"
          value={formData.organization}
          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="sessions" className="block text-sm font-medium text-gray-700">
          Sessions (comma-separated)
        </label>
        <input
          type="text"
          id="sessions"
          value={formData.sessions?.join(", ")}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            sessions: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
          }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          {initialData ? "Update Participant" : "Add Participant"}
        </button>
      </div>
    </form>
  );
} 