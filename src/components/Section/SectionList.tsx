import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  Check,
  X,
  Settings,
  Search,
  Plus,
  Edit,
  Trash,
  Table,
  TableProperties,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  Section,
  SectionListProps,
  TableHeader,
  SectionRowProps,
  MergedFields,
  TimeSlot,
  SectionWithLevel,
  SelectionState,
  MergedCell,
} from '../../types/scheduler';
import { groupSectionsByRole } from "../../utils";
import HeaderSettingsModal from "../Modal/HeaderSettingsModal";
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

const findAllSections = (sections: Section[]): SectionWithLevel[] => {
  let allSections: SectionWithLevel[] = [];

  const traverse = (section: Section, level = 0) => {
    allSections.push({ ...section, level });
    section.subsections?.forEach((subsection) => {
      traverse(subsection, level + 1);
    });
  };

  sections.forEach((section) => {
    traverse(section);
  });

  return allSections;
};

const getSectionValue = (section: SectionWithLevel, key: keyof MergedFields) => {
  return section[key as keyof Section];
};

const SectionRow = ({
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
  onSelect?: (cellId: string, sectionId: string, columnType: keyof MergedFields) => void;
}) => {
  
  const getLevelColor = (level: number) => {
    return (
      sectionLevelColors[level as keyof typeof sectionLevelColors] ||
      sectionLevelColors[0]
    );
  };

  const getMergedCellInfo = (sectionId: string, columnType: keyof MergedFields) => {
    return selection?.mergedCellsHistory.find(
      cell => cell.sectionIds.includes(sectionId) && cell.columnType === columnType
    );
  };

  const isColumnSelected = (columnType: keyof MergedFields) => {
    const cellId = `${section.id}-${columnType}`;
    return selection?.selectedCells.some((cell) => cell.cellId === cellId);
  };

  const getColumnClassName = (columnType: keyof MergedFields) => {
    const baseClasses = "border-b border-r text-sm relative cursor-pointer";
    const timeClasses = columnType === "timeSlot" ? "pr-2" : "px-4 py-2";
    
    const mergedCell = getMergedCellInfo(section.id, columnType);
    const isSelected = isColumnSelected(columnType);

    const classes = [
      baseClasses,
      timeClasses,
      mergedCell ? mergedCell.color : "",
      mergedCell ? "font-medium" : "",
      isSelected ? "ring-2 ring-indigo-400 bg-indigo-50" : "",
      selection?.isSelecting ? "hover:bg-indigo-50/50" : "",
      "transition-colors duration-200",
    ];

    return classes.filter(Boolean).join(" ");
  };

  const handleColumnClick = (columnType: keyof MergedFields) => {
    if (!selection?.isSelecting || !onSelect) return;
    const cellId = `${section.id}-${columnType}`;
    onSelect(cellId, section.id, columnType);
  };

  const renderTimeSlot = (timeSlot: TimeSlot, level: number) => {
    const baseIndent = 24;
    const indentWidth = level * baseIndent;

    return (
      <div className="flex items-center min-h-[2rem] relative">
        {level > 0 && (
          <div
            className="absolute flex items-center h-full"
            style={{ left: `${indentWidth}px` }}
          >
            <div
              className="absolute h-full w-[2px] bg-gray-200"
              style={{ left: "-1px", top: "-50%" }}
            />
            <div className="h-[2px] w-4 bg-gray-200" />
            <div className="w-2 h-2 rounded-full border border-gray-300 bg-white" />
          </div>
        )}
        <span
          className={`
            whitespace-nowrap
            ${level > 0 ? "text-gray-500 text-sm" : "text-gray-700 font-medium"}
          `}
          style={{ marginLeft: level > 0 ? `${indentWidth + 32}px` : "8px" }}
        >
          {timeSlot.start} - {timeSlot.end}
        </span>
      </div>
    );
  };

  const renderColumnContent = (columnType: keyof MergedFields) => {
    const mergedCell = getMergedCellInfo(section.id, columnType);
    const isSelected = isColumnSelected(columnType);

    let content;
    if (columnType === "timeSlot") {
      content = renderTimeSlot(section.timeSlot, level);
    } else {
      content = mergedCell ? mergedCell.value : getSectionValue(section, columnType as keyof MergedFields);
    }

    return (
      <div
        className={`
          relative group
          ${mergedCell ? mergedCell.color : ""}
          ${isSelected ? "ring-2 ring-indigo-400" : ""}
          ${mergedCell ? "font-medium" : ""}
          ${columnType === "timeSlot" ? "pl-0" : "p-2"}
          rounded transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between">
          <div className={columnType === "timeSlot" ? "" : "px-2"}>
            {content}
          </div>
          {mergedCell && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">
                {mergedCell.mergeName}
              </span>
            </div>
          )}
        </div>
      </div>
    );
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
        className="w-4 h-4 mr-2 cursor-pointer"
        onClick={() =>
          setFlyoverState({
            isOpen: true,
            type: "edit-section",
            data: section,
          })
        }
      />
      <Trash
        className="w-4 h-4 mr-2 cursor-pointer"
        onClick={() => onUpdateSection(section.id, { deleted: true })}
      />
    </div>
  );

  return (
    <>
      <tr className={getLevelColor(level)}>
        <td
          id={`${section.id}-timeSlot`}
          className={getColumnClassName("timeSlot")}
          onClick={() => handleColumnClick("timeSlot")}
        >
          {renderColumnContent("timeSlot")}
        </td>
        <td
          id={`${section.id}-name`}
          className={getColumnClassName("name")}
          onClick={() => handleColumnClick("name")}
        >
          {renderColumnContent("name")}
        </td>
        {showSpeakerRole && (
          <>
            <td
              id={`${section.id}-speaker`}
              className={getColumnClassName("speaker")}
              onClick={() => handleColumnClick("speaker")}
            >
              {renderColumnContent("speaker")}
            </td>
            <td
              id={`${section.id}-role`}
              className={getColumnClassName("role")}
              onClick={() => handleColumnClick("role")}
            >
              {renderColumnContent("role")}
            </td>
          </>
        )}
        <td className="px-4 py-2 border-b text-sm">
          {!selection?.isSelecting && renderActionButtons(section)}
        </td>
      </tr>

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
  );
};

export default function SectionList({
  sections,
  onUpdateSection,
  onAddSubsection,
  activeTrack,
  setFlyoverState,
}: SectionListProps) {
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
    selectedCells: [],
    selectedColor: colorOptions[0].class,
    mergeName: "",
    mergedCellsHistory: [],
    selectedColumns: [],
  });
  const [showColorModal, setShowColorModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullScreen]);

  const handleSelect = (
    cellIdOrSectionId: string,
    sectionIdOrColumnType: string | number,
    columnType?: keyof MergedFields
  ) => {
    const sectionId = columnType ? sectionIdOrColumnType as string : cellIdOrSectionId;
    const actualColumnType = (columnType || sectionIdOrColumnType) as keyof MergedFields;
    const cellId = columnType ? cellIdOrSectionId : `${sectionId}-${actualColumnType}`;

    const allSections = findAllSections(sections);
    const targetSection = allSections.find((s) => s.id === sectionId) as SectionWithLevel;
    if (!targetSection) return;

    setSelection((prev) => {
      const existingSelection = prev.selectedCells.find(
        (cell) => cell.cellId === cellId
      );

      // Check if cell is already part of a merged group
      const existingMergedCell = prev.mergedCellsHistory.find(
        cell => cell.sectionIds.includes(sectionId) && cell.columnType === actualColumnType
      );

      if (existingMergedCell) {
        // If selecting a merged cell, select all cells in the merge group
        const mergedGroupCells = existingMergedCell.sectionIds.map(id => ({
          cellId: `${id}-${actualColumnType}`,
          sectionId: id,
          columnType: actualColumnType,
          originalValue: existingMergedCell.value,
          level: targetSection.level || 0,
          mergeId: existingMergedCell.id,
        }));
        
        return {
          ...prev,
          isSelecting: true,
          selectedCells: mergedGroupCells,
        };
      }

      if (prev.selectedCells.length > 0) {
        const firstColumnType = prev.selectedCells[0].columnType;
        if (actualColumnType !== firstColumnType) {
          alert("You can only merge cells of the same type");
          return prev;
        }
      }

      let newSelectedCells = [...prev.selectedCells];
      if (!existingSelection) {
        newSelectedCells.push({
          cellId,
          sectionId,
          columnType: actualColumnType,
          originalValue: getSectionValue(targetSection, actualColumnType),
          level: targetSection.level || 0,
        });
      } else {
        newSelectedCells = prev.selectedCells.filter(
          (cell) => cell.cellId !== cellId
        );
      }

      return {
        ...prev,
        isSelecting: true,
        selectedCells: newSelectedCells,
      };
    });
  };

  const handleApplySelection = (color: string, mergeName: string) => {
    if (!mergeName.trim()) {
      alert("Please enter a merge name");
      return;
    }

    const columnType = selection.selectedCells[0]?.columnType;

    if (!columnType || selection.selectedCells.length < 2) {
      alert("Please select at least 2 cells to merge");
      return;
    }

    const mergeId = `merge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sectionIds = selection.selectedCells.map(cell => cell.sectionId);
    
    // Create new merged cell entry
    const newMergedCell: MergedCell = {
      id: mergeId,
      sectionIds,
      color,
      mergeName,
      columnType,
      value: selection.selectedCells[0].originalValue,
    };

    // Update all affected sections
    sectionIds.forEach(sectionId => {
      onUpdateSection(sectionId, {
        mergedFields: {
          [columnType]: {
            isMerged: true,
            color,
            mergeName,
            value: selection.selectedCells[0].originalValue,
            mergeId,
          },
        },
      });
    });

    setSelection(prev => ({
      isSelecting: false,
      selectedCells: [],
      selectedColor: colorOptions[0].class,
      mergeName: "",
      mergedCellsHistory: [...prev.mergedCellsHistory, newMergedCell],
      selectedColumns: [],
    }));

    setShowColorModal(false);
  };

  const groupedSections = useMemo(() => groupSectionsByRole(sections), [sections]);

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
              background: tableStyles.headerColor,
              color: tableStyles.textColor,
              borderColor: tableStyles.borderColor,
            }}
          >
            {header.label}
          </th>
        )),
    [headers, tableStyles]
  );

  const SelectionIndicator = () => {
    if (!selection.selectedCells.length) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selection.selectedCells.length} cells selected (
            {selection.selectedCells[0]?.columnType})
          </span>
          <button
            onClick={() => setShowColorModal(true)}
            disabled={selection.selectedCells.length < 2}
            className={`px-3 py-1.5 rounded-md text-sm ${
              selection.selectedCells.length < 2
                ? "bg-gray-200 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Merge Cells
          </button>
          <button
            onClick={() =>
              setSelection({
                isSelecting: false,
                selectedCells: [],
                selectedColor: colorOptions[0].class,
                mergeName: "",
                mergedCellsHistory: selection.mergedCellsHistory,
                selectedColumns: [],
              })
            }
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`
        bg-white overflow-hidden transition-all duration-300
        ${isFullScreen ? 'fixed inset-0 z-[80] w-screen h-screen' : 'relative w-full'}
      `}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="p-4">
          {activeTrack && (
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-violet-50/40 rounded-xl px-6 py-4 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-lg font-bold text-blue-700 flex-shrink-0">
                  Current Track:{" "}
                  <span className="text-xl font-light text-blue-800">
                    {activeTrack.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-5">
              
                <button
                  onClick={() => setIsFullScreen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {isFullScreen ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Exit Full Screen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Full Screen</span>
                    </>
                  )}
                </button>
             
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
                   <Settings
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setShowHeaderSettings(true)}
                />
                {selection.isSelecting ? (
                  <>
                    <button
                      onClick={() => setShowColorModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-slate-50 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">Apply Selection</span>
                    </button>
                    <button
                      onClick={() =>
                        setSelection({
                          isSelecting: false,
                          selectedCells: [],
                          selectedColor: colorOptions[0].class,
                          mergeName: "",
                          mergedCellsHistory: selection.mergedCellsHistory,
                          selectedColumns: [],
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
        <div className="px-4 py-3 bg-gray-50/80 backdrop-blur-sm">
          <div className="mx-auto relative flex items-center justify-between gap-4">
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
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-slate-50/30 to-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>{tableHeaders}</tr>
              </thead>
              <tbody>
                {filteredSections.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {group.sections.map((section) => (
                      <SectionRow
                        key={section.id}
                        section={section}
                        showSpeakerRole={headers.find((h) => h.type === "speaker")?.isVisible}
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

      {/* Modals */}
      {showHeaderSettings && (
        <HeaderSettingsModal
          isOpen={showHeaderSettings}
          onClose={() => setShowHeaderSettings(false)}
          headers={headers}
          onUpdateHeaders={setHeaders}
          onApplyStyles={setTableStyles}
        />
      )}

      <ColorSelectionModal
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        onApply={handleApplySelection}
      />

      {/* Selection Indicator */}
      <SelectionIndicator />
    </div>
  );
}