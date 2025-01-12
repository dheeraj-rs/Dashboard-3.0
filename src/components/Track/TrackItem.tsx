import { Layers, Settings } from 'lucide-react';
import { TrackItemProps } from '../../types/scheduler';

const trackColors = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-orange-100 text-orange-600',
  'bg-pink-100 text-pink-600',
] as const;

export default function TrackItem({ track, onSelect, onEdit, colorIndex, isFullView }: TrackItemProps & { isFullView: boolean }) {
  const colorClass = trackColors[colorIndex % trackColors.length];
  const borderColor = colorClass.split(' ')[0].replace('bg-', 'border-');

  return (
    <div className={`
      p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 ${borderColor}
      ${isFullView ? 'h-48' : ''}
    `}>
      <div className="flex items-start justify-between h-full">
        <div 
          onClick={onSelect}
          className="flex items-start gap-3 cursor-pointer flex-1"
        >
          <div className={`p-2 rounded-lg ${colorClass} mt-1`}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {track.name}
            </h3>
            <div className="text-xs text-gray-600">
              {track.sections.length} section{track.sections.length !== 1 ? 's' : ''}
            </div>
            {isFullView && track.sections.length > 0 && (
              <div className="mt-4 space-y-2">
                {track.sections.slice(0, 3).map(section => (
                  <div key={section.id} className="text-sm text-gray-600 truncate">
                    • {section.name}
                  </div>
                ))}
                {track.sections.length > 3 && (
                  <div className="text-sm text-gray-400">
                    +{track.sections.length - 3} more sections
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}