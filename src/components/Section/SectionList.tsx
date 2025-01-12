import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  ChevronRight,
  Check,
  X,
  Settings,
  Maximize2,
  Minimize2,
  Search,
  Plus,
  Edit,
  Trash,
  Table,
  TableProperties,
} from "lucide-react";
import {
  Section,
  SectionListProps,
  TableHeader,
  SectionRowProps,
  MergedFields,
} from "../../types/scheduler";
import { groupSectionsByRole } from "../../utils/sectionUtils";
import HeaderSettingsModal from "../Modal/HeaderSettingsModal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import ColorSelectionModal from "../Modal/ColorSelectionModal";

const sectionLevelColors = {
  0: "bg-blue-50 border-l-4 border-l-blue-500",
  1: "bg-purple-50 border-l-4 border-l-purple-500",
  2: "bg-green-50 border-l-4 border-l-green-500",
  3: "bg-orange-50 border-l-4 border-l-orange-500",
  4: "bg-pink-50 border-l-4 border-l-pink-500",
};

const colorOptions = [
  { name: "Blue", class: "bg-blue-100", hover: "hover:bg-blue-200" },
  { name: "Green", class: "bg-green-100", hover: "hover:bg-green-200" },
  { name: "Purple", class: "bg-purple-100", hover: "hover:bg-purple-200" },
  { name: "Orange", class: "bg-orange-100", hover: "hover:bg-orange-200" },
  { name: "Pink", class: "bg-pink-100", hover: "hover:bg-pink-200" },
  { name: "Yellow", class: "bg-yellow-100", hover: "hover:bg-yellow-200" },
  { name: "Teal", class: "bg-teal-100", hover: "hover:bg-teal-200" },
  { name: "Indigo", class: "bg-indigo-100", hover: "hover:bg-indigo-200" },
  { name: "Red", class: "bg-red-100", hover: "hover:bg-red-200" },
] as const;

type ColorClass = typeof colorOptions[number]["class"];

interface SelectionState {
  isSelecting: boolean;
  selectedColumns: { sectionId: string; columnType: keyof MergedFields }[];
  selectedColor: ColorClass;
}

function SectionRow({
  section,
  level = 0,
  showSpeakerRole = true,
  onAddSubsection,
  onUpdateSection,
  selection,
  onSelect,
  setFlyoverState,
}: SectionRowProps & {
  selection?: SelectionState;
  onSelect?: (sectionId: string, columnType: keyof MergedFields) => void;
}) {
  const getLevelColor = (level: number) => {
    return (
      sectionLevelColors[level as keyof typeof sectionLevelColors] ||
      sectionLevelColors[0]
    );
  };

  const isColumnSelected = (columnType: keyof MergedFields) => {
    return selection?.selectedColumns.some(
      (col) => col.sectionId === section.id && col.columnType === columnType
    );
  };

  const handleColumnClick = (columnType: keyof MergedFields) => {
    if (!selection?.isSelecting || !onSelect) return;
    onSelect(section.id, columnType);
  };

  const getColumnClassName = (columnType: keyof MergedFields) => {
    const baseClasses = "px-4 py-2 border-b border-r text-sm";
    const selectedClass = isColumnSelected(columnType)
      ? `${selection?.selectedColor} ring-2 ring-offset-1 ring-indigo-400`
      : "";
    const mergedClass = section.mergedFields?.[columnType]
      ? `${section.mergedFields.color} font-medium`
      : "";
    return `${baseClasses} ${selectedClass} ${mergedClass}`;
  };

  const renderActionButtons = (section: Section) => (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() =>
          setFlyoverState({
            isOpen: true,
            type: "add-subsection",
            data: { parentId: section.id },
          })
        }
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        title="Add Subsection"
      >
        <Plus className="w-4 h-4" />
        <span>Add Sub</span>
      </button>
      <Edit
        className="w-4 h-4 mr-2"
        onClick={() =>
          setFlyoverState({
            isOpen: true,
            type: "edit-section",
            data: section,
          })
        }
      />
      <Trash
        className="w-4 h-4 mr-2"
        onClick={() => onUpdateSection(section.id, { deleted: true })}
      />
    </div>
  );

  return (
    <Draggable key={section.id} draggableId={section.id} index={level}>
      {(provided) => (
        <>
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={getLevelColor(level)}
          >
            <td
              className={getColumnClassName("timeSlot")}
              onClick={() => handleColumnClick("timeSlot")}
            >
              <div
                className="flex items-center gap-1"
                style={{ paddingLeft: `${level * 1}rem` }}
              >
                {level > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="whitespace-nowrap">
                  {section.timeSlot.start} - {section.timeSlot.end}
                </span>
              </div>
            </td>
            <td
              className={getColumnClassName("name")}
              onClick={() => handleColumnClick("name")}
            >
              {section.name}
            </td>
            {showSpeakerRole && (
              <>
                <td
                  className={getColumnClassName("speaker")}
                  onClick={() => handleColumnClick("speaker")}
                >
                  {section.speaker}
                </td>
                <td
                  className={getColumnClassName("role")}
                  onClick={() => handleColumnClick("role")}
                >
                  {section.role}
                </td>
              </>
            )}
            <td className="px-4 py-2 border-b text-sm">
              {!selection?.isSelecting && renderActionButtons(section)}
            </td>
          </tr>

          {/* Render Subsections */}
          {section.subsections?.map((subsection) => (
            <SectionRow
              key={subsection.id}
              section={subsection}
              level={level + 1}
              showSpeakerRole={showSpeakerRole}
              onAddSubsection={onAddSubsection}
              onUpdateSection={onUpdateSection}
              selection={selection}
              onSelect={onSelect}
              setFlyoverState={setFlyoverState}
            />
          ))}
        </>
      )}
    </Draggable>
  );
}

export default function SectionList({
  sections,
  onAddSection,
  onUpdateSection,
  onAddSubsection,
  activeTrack,
  setFlyoverState,
}: SectionListProps) {
  const groupedSections = groupSectionsByRole(sections);
  const [isFullView, setIsFullView] = useState(false);
  const [showHeaderSettings, setShowHeaderSettings] = useState(false);
  const [headers, setHeaders] = useState<TableHeader[]>([
    { id: "1", label: "Time", type: "time", isVisible: true },
    { id: "2", label: "Section", type: "name", isVisible: true },
    { id: "3", label: "Speaker", type: "speaker", isVisible: true },
    { id: "4", label: "Role", type: "role", isVisible: true },
    { id: "5", label: "Actions", type: "actions", isVisible: true },
  ]);
  const [tableStyles, setTableStyles] = useState({
    headerColor: "linear-gradient(to right, #f8fafc, #f1f5f9)",
    textColor: "#374151",
    borderColor: "#e5e7eb",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    selectedColumns: [],
    selectedColor: colorOptions[0].class,
  });
  const [showColorModal, setShowColorModal] = useState(false);

  const handleSelect = (sectionId: string, columnType: keyof MergedFields) => {
    setSelection((prev) => {
      const existingSelection = prev.selectedColumns.find(
        (col) => col.sectionId === sectionId && col.columnType === columnType
      );
      return {
        ...prev,
        selectedColumns: existingSelection
          ? prev.selectedColumns.filter(
              (col) =>
                !(col.sectionId === sectionId && col.columnType === columnType)
            )
          : [...prev.selectedColumns, { sectionId, columnType }],
      };
    });
  };

  const handleApplySelection = (color: string, mergeName: string) => {
    if (!mergeName.trim()) {
      alert("Please enter a merge name");
      return;
    }

    const mergeId = `merge-${Date.now()}`;

    selection.selectedColumns.forEach(({ sectionId, columnType }) => {
      onUpdateSection(sectionId, {
        mergedFields: {
          [columnType]: true,
          color,
          mergeId,
          name: mergeName,
        },
      });
    });

    setSelection({
      isSelecting: false,
      selectedColumns: [],
      selectedColor: colorOptions[0].class,
    });
    setShowColorModal(false);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return groupedSections;
    return groupedSections.map((group) => ({
      ...group,
      sections: group.sections.filter((section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }));
  }, [groupedSections, searchQuery]);

  const tableHeaders = useMemo(
    () =>
      headers
        .filter((header) => header.isVisible)
        .map((header) => (
          <th
            key={header.id}
            className="px-4 py-2 border-b border-r text-left text-sm font-semibold"
            style={{
              backgroundColor: tableStyles.headerColor,
              color: tableStyles.textColor,
              borderColor: tableStyles.borderColor,
            }}
          >
            {header.label}
          </th>
        )),
    [headers, tableStyles]
  );

  return (
    <Droppable droppableId={activeTrack?.id || "sections"} type="section">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`transition-all duration-300 ease-in-out ${
            isFullView ? "fixed inset-0 z-50 bg-white" : "relative"
          }`}
        >
          {/* Sections Header */}
          <div className={`${isFullView ? "sticky top-0 z-10 bg-white p-4 shadow-sm" : ""}`}>
            {activeTrack && (
              <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-violet-50/40 rounded-xl px-6 py-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="text-lg font-bold text-blue-700 flex-shrink-0">
                    Current Track :{" "}
                    <span className="text-xl font-light text-blue-800">
                      {activeTrack.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  {isFullView ? (
                    <Minimize2
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setIsFullView(!isFullView)}
                    />
                  ) : (
                    <Maximize2
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setIsFullView(!isFullView)}
                    />
                  )}
                  <Settings
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => setShowHeaderSettings(true)}
                  />
                  {selection.isSelecting ? (
                    <TableProperties
                      className="w-5 h-5 cursor-pointer"
                      onClick={() =>
                        setSelection((prev) => ({
                          ...prev,
                          isSelecting: !prev.isSelecting,
                        }))
                      }
                    />
                  ) : (
                    <Table
                      className="w-5 h-5 cursor-pointer"
                      onClick={() =>
                        setSelection((prev) => ({
                          ...prev,
                          isSelecting: !prev.isSelecting,
                        }))
                      }
                    />
                  )}
                  {selection.isSelecting ? (
                    <>
                      <button
                        onClick={() => setShowColorModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-slate-50 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                      >
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Apply Selection
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setSelection({
                            isSelecting: false,
                            selectedColumns: [],
                            selectedColor: colorOptions[0].class,
                          })
                        }
                        className="flex items-center gap-1.5 px-4 py-2 text-gray-50 bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                        <span className="text-sm font-medium">Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setFlyoverState({
                          isOpen: true,
                          type: "add-section",
                          data: null,
                        })
                      }
                      className="flex items-center gap-1.5 px-4 py-2 text-gray-50 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Add Section</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-4 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sections..."
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
          </div>

          <div
            className={`${
              isFullView
                ? "px-4 py-4 h-[calc(100vh-8rem)] overflow-y-auto"
                : "mt-4 h-full"
            }`}
          >
            <div className="bg-gradient-to-br from-slate-50/30 to-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto h-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>{tableHeaders}</tr>
                  </thead>
                  <tbody>
                    {filteredSections.map((group, groupIndex) => (
                      <React.Fragment key={groupIndex}>
                        {group.sections.map((section, sectionIndex) => (
                          <SectionRow
                            key={section.id}
                            section={section}
                            showSpeakerRole={sectionIndex === 0}
                            onAddSubsection={onAddSubsection}
                            onUpdateSection={onUpdateSection}
                            selection={selection}
                            onSelect={handleSelect}
                            setFlyoverState={setFlyoverState}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {provided.placeholder}

          {/* Header Settings Modal */}
          {showHeaderSettings && (
            <HeaderSettingsModal
              isOpen={showHeaderSettings}
              onClose={() => setShowHeaderSettings(false)}
              headers={headers}
              onUpdateHeaders={(updatedHeaders) => setHeaders(updatedHeaders)}
              onApplyStyles={(styles) => {
                setTableStyles({
                  headerColor: styles.headerColor,
                  textColor: styles.textColor,
                  borderColor: styles.borderColor,
                });
              }}
            />
          )}

          {/* Color Selection Modal */}
          {showColorModal && (
            <ColorSelectionModal
              isOpen={showColorModal}
              onClose={() => setShowColorModal(false)}
              onApply={handleApplySelection}
            />
          )}
        </div>
      )}
    </Droppable>
  );
}