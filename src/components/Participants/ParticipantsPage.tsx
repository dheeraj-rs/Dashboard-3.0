import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Participant } from "../../types/scheduler";
import ParticipantForm from "./ParticipantForm";

interface ParticipantsPageProps {
  setFlyoverState: (state: FlyoverState) => void;
  participants: Participant[];
  onAddParticipant: (participantData: Partial<Participant>) => void;
  onUpdateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  onDeleteParticipant: (participantId: string) => void;
}

export default function ParticipantsPage({ 
  setFlyoverState, 
  participants,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant
}: ParticipantsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-800">Participants</h1>
        <button
          onClick={() => setFlyoverState({
            isOpen: true,
            type: "add-participant",
            data: null,
          })}
          className="flex items-center gap-1.5 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Add Participant</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="px-6 py-3 relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParticipants.map((participant) => (
              <tr key={participant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{participant.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{participant.organization}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{participant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {participant.sessions.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => setFlyoverState({
                      isOpen: true,
                      type: "edit-participant",
                      data: participant,
                    })}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteParticipant(participant.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 