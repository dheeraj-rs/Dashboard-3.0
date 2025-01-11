import { Clock, User, UserCircle, Plus, Trash2, Settings } from 'lucide-react';
import { SectionItemProps } from '../../types/scheduler';

const sectionColors = [
  'border-blue-200 bg-blue-50',
  'border-purple-200 bg-purple-50',
  'border-green-200 bg-green-50',
  'border-orange-200 bg-orange-50',
  'border-pink-200 bg-pink-50',
];



export default function SectionItem({
  section,
  onUpdate,
  onDelete,
  onAddSubsection,
  level = 0
}: SectionItemProps) {
  const colorClass = sectionColors[level % sectionColors.length];

  return (
    <div className="space-y-2">
      <div 
        className={`p-4 rounded-lg border ${colorClass} transition-colors`}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">
                {section.timeSlot.start} - {section.timeSlot.end}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">{section.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">{section.speaker}</span>
            </div>
            
            <div className="text-sm text-gray-600">{section.role}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddSubsection(section.id)}
              className="p-1 hover:bg-white/50 rounded text-gray-600 hover:text-gray-900"
              title="Add Subsection"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(section);
              }}
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
              title="Edit Section"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-white/50 rounded text-gray-600 hover:text-red-600"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {section.subsections.map((subsection) => (
        <SectionItem
          key={subsection.id}
          section={subsection}
          onUpdate={(updates) => onUpdate({ 
            ...section, 
            subsections: section.subsections.map(s => 
              s.id === subsection.id ? { ...s, ...updates } : s
            )
          })}
          onDelete={() => onUpdate({
            ...section,
            subsections: section.subsections.filter(s => s.id !== subsection.id)
          })}
          onAddSubsection={onAddSubsection}
          level={level + 1}
        />
      ))}
    </div>
  );
}