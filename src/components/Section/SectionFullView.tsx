import { Clock, User, UserCircle, Plus, Edit, Trash, ChevronRight } from 'lucide-react';
import { SectionRowProps } from '../../types/scheduler';

const sectionLevelColors = {
  0: "border-l-blue-500 bg-blue-50/40",
  1: "border-l-purple-500 bg-purple-50/40",
  2: "border-l-green-500 bg-green-50/40",
  3: "border-l-orange-500 bg-orange-50/40",
  4: "border-l-pink-500 bg-pink-50/40",
};

export default function SectionFullView({
  section,
  level = 0,
  showSpeakerRole = true,
  onAddSubsection,
  onUpdateSection,
  setFlyoverState,
}: Omit<SectionRowProps, 'selection' | 'onSelect'>) {
  const baseIndent = 24;
  const indentWidth = level * baseIndent;
  
  const getLevelColor = (level: number) => {
    return sectionLevelColors[level as keyof typeof sectionLevelColors] || sectionLevelColors[0];
  };

  return (
    <div className="mb-4 w-full">
      <div
        className={`
          p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200
          border-l-4 ${getLevelColor(level)}
        `}
        style={{ marginLeft: `${indentWidth}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {level > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <h3 className="text-lg font-medium text-gray-900">
              {section.name}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setFlyoverState({
                  isOpen: true,
                  type: "add-subsection",
                  data: { parentId: section.id },
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Sub</span>
            </button>
            <button
              onClick={() =>
                setFlyoverState({
                  isOpen: true,
                  type: "edit-section",
                  data: section,
                })
              }
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSection(section.id, { deleted: true })}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Time Slot</div>
                <span className="text-sm text-gray-900">
                  {section.timeSlot.start} - {section.timeSlot.end}
                </span>
              </div>
            </div>
          </div>

          {showSpeakerRole && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Speaker</div>
                    <span className="text-sm text-gray-900">{section.speaker || 'Not assigned'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Role</div>
                    <span className="text-sm text-gray-900">{section.role || 'Not assigned'}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subsections */}
      {section.subsections?.length > 0 && (
        <div className="mt-2 space-y-2">
          {section.subsections.map((subsection) => (
            <SectionFullView
              key={subsection.id}
              section={subsection}
              level={level + 1}
              showSpeakerRole={showSpeakerRole}
              onAddSubsection={onAddSubsection}
              onUpdateSection={onUpdateSection}
              setFlyoverState={setFlyoverState}
            />
          ))}
        </div>
      )}
    </div>
  );
} 