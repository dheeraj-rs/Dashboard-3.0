import { useState } from 'react';
import { Sprout, Trash2 } from 'lucide-react';
import { seedData } from '../../utils/seedData';
import { DataManagementItem, Track } from '../../types/scheduler';

interface DataSeedingPageProps {
  onAddItem: (type: string, item: Partial<DataManagementItem>) => void;
  onAddTrack?: (track: Track) => void;
  onDeleteItem: (type: string, id: string) => void;
  onDeleteTrack?: (id: string) => void;
  data: {
    sectionstypes: DataManagementItem[];
    speakers: DataManagementItem[];
    roles: DataManagementItem[];
    guests: DataManagementItem[];
    tracks: Track[];
  };
}

export default function DataSeedingPage({
  onAddItem,
  onAddTrack,
  onDeleteItem,
  onDeleteTrack,
  data
}: DataSeedingPageProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const dataTypes = [
    { id: 'sectionstypes', label: 'Section Types', count: seedData.sectionstypes.length },
    { id: 'speakers', label: 'Speakers', count: seedData.speakers.length },
    { id: 'roles', label: 'Roles', count: seedData.roles.length },
    { id: 'guests', label: 'Guests', count: seedData.guests.length },
    { id: 'tracks', label: 'Tracks & Sections', count: seedData.tracks?.length || 0 }
  ];

  const handleToggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSeedSelected = () => {
    selectedTypes.forEach(type => {
      if (type === 'tracks') {
        seedData.tracks.forEach(track => {
          onAddTrack?.(track);
        });
      } else {
        seedData[type as keyof typeof seedData].forEach(item => {
          onAddItem(type, item as Partial<DataManagementItem>);
        });
      }
    });
  };

  const handleClearSelected = () => {
    selectedTypes.forEach(type => {
      if (type === 'tracks') {
        data.tracks.forEach(track => {
          onDeleteTrack?.(track.id);
        });
      } else {
        data[type as keyof typeof data].forEach(item => {
          onDeleteItem(type, item.id);
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Data Seeding</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSeedSelected}
              disabled={selectedTypes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 
                text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 
                shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sprout className="w-5 h-5" />
              <span>Seed Selected Data</span>
            </button>
            <button
              onClick={handleClearSelected}
              disabled={selectedTypes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 
                text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 
                shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Selected Data</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleToggleType(type.id)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
                ${selectedTypes.includes(type.id)
                  ? 'border-violet-500 bg-violet-50/50'
                  : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/20'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{type.label}</h3>
                <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                  {type.count}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Current Count:</span>
                <span>
                  {type.id === 'tracks' 
                    ? (data.tracks?.length || 0)
                    : (data[type.id as keyof typeof data]?.length || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 