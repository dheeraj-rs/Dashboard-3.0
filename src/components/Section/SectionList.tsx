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
  ChevronDown,
  Plus,
  Edit,
  Trash,
  MoreVertical,
} from "lucide-react";
import {
  Section,
  MergedFields,
  SectionListProps,
  TableHeader,
  SelectionState,
  SectionRowProps,
} from "../../types/scheduler";
import { groupSectionsByRole } from "../../utils/sectionUtils";
import HeaderSettingsModal from "../Modal/HeaderSettingsModal";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Menu, Transition } from "@headlessui/react";
import CustomDropdown from "../Modal/CustomDropdown";

const sectionLevelColors = {
  0: "bg-blue-50 border-l-4 border-l-blue-500",
  1: "bg-purple-50 border-l-4 border-l-purple-500",
  2: "bg-green-50 border-l-4 border-l-green-500",
  3: "bg-orange-50 border-l-4 border-l-orange-500",
  4: "bg-pink-50 border-l-4 border-l-pink-500",
};

function SectionRow({
  section,
  level = 0,
  showSpeakerRole = true,
  onAddSubsection,
  onUpdateSection,
  selection,
  onSelect,
  setFlyoverState,
}: SectionRowProps) {
  const isColumnSelected = (columnType: keyof MergedFields) => {
    return selection?.selectedColumns.some(
      (col) => col.sectionId === section.id && col.columnType === columnType
    );
  };

  const handleColumnClick = (
    sectionId: string,
    columnType: keyof MergedFields
  ) => {
    if (!selection?.isSelecting || !onSelect) return;
    onSelect(sectionId, columnType);
  };

  const getLevelColor = (level: number) => {
    return (
      sectionLevelColors[level as keyof typeof sectionLevelColors] ||
      sectionLevelColors[0]
    );
  };

  const renderActionButtons = (section: Section) => (
    <div className="flex items-center justify-center gap-2">
      {/* Add Subsection Button */}
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
  
      {/* Custom Dropdown Menu */}
      <CustomDropdown
        trigger={
          <div className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors duration-200">
            <MoreVertical className="w-5 h-5" />
          </div>
        }
      >
        {/* Edit Option */}
        <button
          onClick={() =>
            setFlyoverState({
              isOpen: true,
              type: "edit-section",
              data: section,
            })
          }
          className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200 flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Section
        </button>
  
        {/* Delete Option */}
        <button
          onClick={() => onUpdateSection(section.id, { deleted: true })}
          className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200 flex items-center"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete Section
        </button>
      </CustomDropdown>
    </div>
  );
  const getColumnClassName = (columnType: keyof MergedFields) => {
    const baseClasses = "px-4 py-2 border-b border-r text-sm cursor-pointer";
    const hoverClass = selection?.isSelecting ? "hover:bg-gray-100" : "";
    const selectedClass = isColumnSelected(columnType)
      ? selection?.selectedColor
      : "";
    const mergedClass =
      section.mergedFields?.[columnType] && section.mergedFields?.color
        ? section.mergedFields.color
        : "";

    return `${baseClasses} ${hoverClass} ${selectedClass} ${mergedClass}`;
  };

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
              onClick={() => handleColumnClick(section.id, "timeSlot")}
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
              onClick={() => handleColumnClick(section.id, "name")}
            >
              {section.name}
            </td>
            {showSpeakerRole && (
              <>
                <td
                  className={getColumnClassName("speaker")}
                  onClick={() => handleColumnClick(section.id, "speaker")}
                >
                  {section.speaker}
                </td>
                <td
                  className={getColumnClassName("role")}
                  onClick={() => handleColumnClick(section.id, "role")}
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
          {section.subsections?.map((subsection, index) => (
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
  const [selection, setSelection] = useState<SelectionState>({
    isSelecting: false,
    selectedColumns: [],
    selectedColor: "bg-blue-100",
  });
  const [showColorModal, setShowColorModal] = useState(false);
  const [showHeaderSettings, setShowHeaderSettings] = useState(false);
  const [headers, setHeaders] = useState<TableHeader[]>([
    { id: "1", label: "Time", type: "time", isVisible: true },
    { id: "2", label: "Section", type: "name", isVisible: true },
    { id: "3", label: "Speaker", type: "speaker", isVisible: true },
    { id: "4", label: "Role", type: "role", isVisible: true },
    { id: "5", label: "Actions", type: "actions", isVisible: true },
  ]);
  const [tableStyles, setTableStyles] = useState({
    headerColor: "#f3f4f6", // gray-50
    textColor: "#374151", // gray-700
    borderColor: "#e5e7eb", // gray-200
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery) return groupedSections;
    return groupedSections.map((group) => ({
      ...group,
      sections: group.sections.filter((section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }));
  }, [groupedSections, searchQuery]);

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
    const allSelectedSectionIds = [
      ...new Set(selection.selectedColumns.map((col) => col.sectionId)),
    ];
    allSelectedSectionIds.forEach((sectionId) => {
      const selectedColumns = selection.selectedColumns
        .filter((col) => col.sectionId === sectionId)
        .map((col) => col.columnType);

      const mergedFields: Partial<MergedFields> = {
        speaker: false,
        role: false,
        timeSlot: false,
      };
      selectedColumns.forEach((columnType) => {
        (mergedFields[columnType] as boolean) = true;
      });
      mergedFields.color = color;
      mergedFields.name = mergeName;

      onUpdateSection(sectionId, {
        mergedFields,
      });
    });

    setSelection({
      isSelecting: false,
      selectedColumns: [],
      selectedColor: "bg-blue-100",
    });
  };

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

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Droppable droppableId={activeTrack?.id || "sections"} type="section">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            transition-all duration-300 ease-in-outm
            ${
              isFullView
                ? "fixed inset-0 bg-white z-50 ml-64 pt-16"
                : "relative"
            }
          `}
        >
          {/* Sections Header */}
          <div
            className={`
              ${isFullView ? "sticky top-0 z-10 bg-white" : ""}
            `}
          >
            {activeTrack && (
              <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-6 py-4 shadow-sm border border-gray-100">
                {/* Track Info Section */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Current Track Info */}
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold text-blue-700 flex-shrink-0">
                      Current Track :{" "}
                      <span className="text-xl font-light text-blue-800">
                        {activeTrack.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDateTime(activeTrack.startDate)} -{" "}
                      {formatDateTime(activeTrack.endDate)}
                    </div>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Full View / Compact View Button */}
                  <button
                    onClick={() => setIsFullView(!isFullView)}
                    className="flex items-center gap-1.5 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    {isFullView ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {isFullView ? "Compact View" : "Full View"}
                    </span>
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setShowHeaderSettings(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>

                  {/* Apply Selection or Add Section Button */}
                  {selection.isSelecting ? (
                    <>
                      <button
                        onClick={() => setShowColorModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
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
                            selectedColor: "bg-blue-100",
                          })
                        }
                        className="flex items-center gap-1.5 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
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
                      className="flex items-center gap-1.5 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
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
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Search Icon */}
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              {/* Clear 'X' Button */}
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
            className={`
              ${
                isFullView
                  ? "px-6 py-4 h-[calc(100vh-8rem)] overflow-y-auto"
                  : "mt-4  h-full"
              }
            `}
          >
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                            speaker={
                              typeof section.speaker === "string"
                                ? section.speaker
                                : undefined
                            }
                            role={section.role}
                            rowSpan={group.sections.length}
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
        </div>
      )}
    </Droppable>
  );
}