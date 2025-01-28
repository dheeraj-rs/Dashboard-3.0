import { useState, useCallback } from 'react';
import { Sprout, Trash2, CheckSquare } from 'lucide-react';
import { seedData } from '../../utils/seedData';
import { showToast } from '../../components/Modal/CustomToast';
import { DataManagementItem } from '../../types/management';
import { Track } from '../../types/tracks';

interface DataSeedingPageProps {
  onAddItem: (type: string, item: Partial<DataManagementItem>) => void;
  onAddTrack?: (track: Track, silent?: boolean) => void;
  onDeleteItem: (type: string, id: string) => void;
  onDeleteTrack?: (id: string, silent?: boolean) => void;
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

  const handleToggleAll = () => {
    setSelectedTypes(prev => 
      prev.length === dataTypes.length ? [] : dataTypes.map(type => type.id)
    );
  };

  const checkForDuplicates = useCallback((type: string, item: any): boolean => {
    const existingItems = data[type as keyof typeof data];
    if (type === 'tracks') {
      return existingItems.some(existing => existing.name === item.name);
    }
    return existingItems.some(existing => 
      existing.name === item.name || 
      ('email' in existing && 'email' in item && existing.email === item.email)
    );
  }, [data]);

  const handleSeedSelected = () => {
    let seedCount = 0;
    let duplicateCount = 0;

    selectedTypes.forEach(type => {
      if (type === 'tracks') {
        seedData.tracks.forEach(track => {
          if (!data.tracks.some(existing => existing.name === track.name)) {
            onAddTrack?.(track, true);
            seedCount++;
          } else {
            duplicateCount++;
          }
        });
      } else {
        seedData[type as keyof typeof seedData].forEach(item => {
          if (!checkForDuplicates(type, item)) {
            onAddItem(type, item as Partial<DataManagementItem>);
            seedCount++;
          } else {
            duplicateCount++;
          }
        });
      }
    });

    if (seedCount > 0) {
      showToast.success(`Successfully seeded ${seedCount} items`);
    }
    if (duplicateCount > 0) {
      showToast.info(`Skipped ${duplicateCount} duplicate items`);
    }
    if (seedCount === 0 && duplicateCount > 0) {
      showToast.info('All selected items already exist');
    }
  };

  const handleClearSelected = () => {
    let clearCount = 0;

    selectedTypes.forEach(type => {
      if (type === 'tracks') {
        clearCount += data.tracks.length;
        data.tracks.forEach(track => {
          onDeleteTrack?.(track.id, true);
        });
      } else {
        clearCount += data[type as keyof typeof data].length;
        data[type as keyof typeof data].forEach(item => {
          onDeleteItem(type, item.id);
        });
      }
    });

    if (clearCount > 0) {
      showToast.success(`Successfully cleared ${clearCount} items`);
    } else {
      showToast.info('No items to clear');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="flex flex-wrap flex-col sm:flex-row items-center justify-between gap-4  bg-white/80 dark:bg-gray-900 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 dark:from-gray-50 to-gray-700 dark:to-gray-500 bg-clip-text text-transparent">
              Data Seeding
            </h1>
            <button
              onClick={handleToggleAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                bg-gradient-to-r from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-lg hover:from-gray-100 dark:hover:from-gray-800 hover:to-gray-200 dark:hover:to-gray-700 
                transition-all duration-200 shadow-sm hover:shadow-md button-pop"
            >
              <CheckSquare className="w-5 h-5 text-gray-700 icon-spin dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {selectedTypes.length === dataTypes.length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleSeedSelected}
              disabled={selectedTypes.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-r from-blue-500 dark:from-blue-600 to-violet-500 dark:to-violet-600 text-white font-medium 
                rounded-lg hover:from-blue-600 dark:hover:from-blue-700 hover:to-violet-600 dark:hover:to-violet-700 
                transition-all duration-200 shadow-sm hover:shadow-md 
                disabled:opacity-50 disabled:cursor-not-allowed 
                disabled:hover:shadow-none button-pop w-full sm:w-auto"
            >
              <Sprout className="w-5 h-5 icon-spin" />
              <span className="whitespace-nowrap">Seed Selected Data</span>
            </button>
            
            <button
              onClick={handleClearSelected}
              disabled={selectedTypes.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-r from-pink-500 dark:from-pink-600 to-rose-500 dark:to-rose-600 text-white font-medium 
                  rounded-lg hover:from-pink-600 dark:hover:from-pink-700 hover:to-rose-600 dark:hover:to-rose-700 
                transition-all duration-200 shadow-sm hover:shadow-md 
                disabled:opacity-50 disabled:cursor-not-allowed 
                disabled:hover:shadow-none button-pop w-full sm:w-auto"
            >
              <Trash2 className="w-5 h-5 icon-spin" />
              <span className="whitespace-nowrap">Clear Selected Data</span>
            </button>
          </div>
        </div>

        {/* Enhanced Data Type Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleToggleType(type.id)}
              className={`
                cursor-pointer p-6 bg-white/80 dark:bg-gray-900 backdrop-blur-sm rounded-xl 
                transition-all duration-300 group perspective-1000
                hover-lift hover-glow
                ${selectedTypes.includes(type.id)
                  ? 'border-2 border-blue-400 bg-blue-50/80'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'}
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 dark:from-gray-50 to-gray-700 dark:to-gray-500 bg-clip-text text-transparent">
                  {type.label}
                </h3>
                <span className="text-sm bg-gradient-to-r from-gray-100 dark:from-gray-900 to-gray-50 dark:to-gray-800 
                  px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 
                  group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-600 dark:group-hover:to-blue-700 
                  transition-all duration-300">
                  {type.count}
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 ">
                <span>Current Count:</span>
                <span className="font-medium">
                  {type.id === 'tracks' 
                    ? (data.tracks?.length || 0)
                    : (data[type.id as keyof typeof data]?.length || 0)}
                </span>
              </div>

              {/* Card Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                bg-gradient-to-r from-transparent via-white/10 dark:via-gray-900 to-transparent
                -translate-x-full group-hover:translate-x-full transition-all 
                duration-1000 ease-in-out rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}