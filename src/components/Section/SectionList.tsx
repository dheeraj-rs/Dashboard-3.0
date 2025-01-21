import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
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
  Unlink,
  Link,
  Clock,
  Layers,
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
} from "../../types/scheduler";
import { groupSectionsByRole } from "../../utils";
import ColorSelectionModal from "../Modal/ColorSelectionModal";
import SectionCalendarFilter from "./SectionCalendarFilter";
import { showToast } from "../Modal/CustomToast";

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

const getSectionValue = (
  section: SectionWithLevel,
  key: keyof MergedFields
) => {
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
  activeTrack,
}: SectionRowProps & {
  selection?: SelectionState;
  onSelect?: (
    cellId: string,
    sectionId: string,
    columnType: keyof MergedFields
  ) => void;
}) => {
  const getLevelColor = (level: number) => {
    return (
      sectionLevelColors[level as keyof typeof sectionLevelColors] ||
      sectionLevelColors[0]
    );
  };

  const getMergedCellInfo = (
    sectionId: string,
    columnType: keyof MergedFields
  ) => {
    return selection?.mergedCellsHistory.find(
      (cell) =>
        cell.sectionIds.includes(sectionId) && cell.columnType === columnType
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
    const isActiveSection = mergedCell?.sectionIds.includes(section.id);

    let content;
    if (columnType === "timeSlot") {
      content = renderTimeSlot(section.timeSlot, level);
    } else {
      content = mergedCell
        ? mergedCell.value
        : getSectionValue(section, columnType as keyof MergedFields);
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
          {mergedCell && isActiveSection && (
            <span className="text-xs text-gray-600">
              {mergedCell.mergeName}
            </span>
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
            data: {
              parentId: section.id,
              trackId: activeTrack?.id
            },
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
            type: level > 0 ? "edit-subsection" : "edit-section",
            data: {
              ...section,
              trackId: activeTrack?.id,
              isSubsection: level > 0,
              sectionTypeId: section.sectionTypeId,
              timeSlot: section.timeSlot,
              speaker: section.speaker,
              role: section.role,
              name: section.name,
              mergedFields: section.mergedFields
            },
          })
        }
      />
      <Trash
        className="w-4 h-4 mr-2 cursor-pointer text-red-500 hover:text-red-700"
        onClick={() => {
          onUpdateSection(section.id, { deleted: true });
        }}
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
          activeTrack={activeTrack}
        />
      ))}
    </>
  );
};

function SectionList({
  sections,
  onUpdateSection,
  activeTrack,
  setFlyoverState,
}: SectionListProps) {
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
    unmergeMode: false,
    selectedMergeId: null,
    selectedColumnType: null,
  });
  const [showColorModal, setShowColorModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<{
    type: "time" | "day" | "month";
    value: { start?: string; end?: string; day?: string; month?: string };
  } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullScreen]);

  const handleSelect = (
    cellIdOrSectionId: string,
    sectionIdOrColumnType: string | number,
    columnType?: keyof MergedFields
  ) => {
    const sectionId = columnType
      ? (sectionIdOrColumnType as string)
      : cellIdOrSectionId;
    const actualColumnType = (columnType ||
      sectionIdOrColumnType) as keyof MergedFields;
    const cellId = columnType
      ? cellIdOrSectionId
      : `${sectionId}-${actualColumnType}`;

    const allSections = findAllSections(sections);
    const targetSection = allSections.find(
      (s) => s.id === sectionId
    ) as SectionWithLevel;
    if (!targetSection) return;

    setSelection((prev) => {
      const existingSelection = prev.selectedCells.find(
        (cell) => cell.cellId === cellId
      );

      // Check if cell is part of a merged group
      const existingMergedCell = prev.mergedCellsHistory.find(
        (cell) =>
          cell.sectionIds.includes(sectionId) &&
          cell.columnType === actualColumnType
      );

      if (prev.selectedCells.length > 0) {
        const firstColumnType = prev.selectedCells[0].columnType;
        if (actualColumnType !== firstColumnType) {
          showToast.error('You can only merge cells of the same type');
          return prev;
        }
      }

      let newSelectedCells = [...prev.selectedCells];
      if (!existingSelection) {
        if (existingMergedCell) {
          // Add all cells from the merged group
          const mergedGroupCells = existingMergedCell.sectionIds.map((id) => ({
            cellId: `${id}-${actualColumnType}`,
            sectionId: id,
            columnType: actualColumnType,
            originalValue: existingMergedCell.value,
            level: targetSection.level || 0,
            mergeId: existingMergedCell.id,
          }));
          newSelectedCells = [...newSelectedCells, ...mergedGroupCells];
        } else {
          newSelectedCells.push({
            cellId,
            sectionId,
            columnType: actualColumnType,
            originalValue: getSectionValue(targetSection, actualColumnType),
            level: targetSection.level || 0,
          });
        }
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

    if (!columnType || selection.selectedCells.length < 1) {
      alert("Please select at least 1 cell to merge");
      return;
    }

    // Remove any existing merges for selected cells
    const existingMergeIds = new Set(
      selection.selectedCells
        .filter((cell) => cell.mergeId)
        .map((cell) => cell.mergeId)
    );

    existingMergeIds.forEach((mergeId) => {
      if (mergeId) handleUnmergeSelection(mergeId, columnType);
    });

    const mergeId = `merge-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const sectionIds = selection.selectedCells.map((cell) => cell.sectionId);

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
    sectionIds.forEach((sectionId) => {
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

    setSelection((prev) => ({
      ...prev,
      isSelecting: false,
      selectedCells: [],
      selectedColor: colorOptions[0].class,
      mergeName: "",
      mergedCellsHistory: [...prev.mergedCellsHistory, newMergedCell],
      selectedColumns: [],
    }));

    setShowColorModal(false);
  };

  const handleUnmergeSelection = (
    mergeId: string,
    columnType: keyof MergedFields
  ) => {
    const mergedCell = selection.mergedCellsHistory.find(
      (cell) => cell.id === mergeId
    );

    if (!mergedCell) return;

    // Update all affected sections to remove merge
    mergedCell.sectionIds.forEach((sectionId) => {
      onUpdateSection(sectionId, {
        mergedFields: {
          [columnType]: {
            isMerged: false,
            color: "",
            mergeName: "",
            value: null,
            mergeId: "",
          },
        },
      });
    });

    // Remove from merge history
    setSelection((prev) => ({
      ...prev,
      mergedCellsHistory: prev.mergedCellsHistory.filter(
        (cell) => cell.id !== mergeId
      ),
      selectedCells: prev.selectedCells.filter(
        (cell) => cell.mergeId !== mergeId
      ),
    }));
  };

  const handleAddSubsection = (parentId: string) => {
    if (!activeTrack) {
      showToast.error('No active track selected');
      return;
    }

    setFlyoverState({
      isOpen: true,
      type: 'add-subsection',
      data: {
        parentId,
        trackId: activeTrack.id
      }
    });
  };

  const handleAddSection = () => {
    if (!activeTrack) {
      showToast.error('No active track selected');
      return;
    }

    setFlyoverState({
      isOpen: true,
      type: "add-section",
      data: { 
        trackId: activeTrack.id,
        parentId: null,
        sectionType: 'program'
      }
    });
  };

  const groupedSections = useMemo(
    () => groupSectionsByRole(sections),
    [sections]
  );

  const filteredSections = useMemo(() => {
    let filtered = groupedSections;

    // Text search filter
    if (searchQuery) {
      filtered = filtered.map((group) => ({
        ...group,
        sections: group.sections.filter((section) =>
          section.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
    }

    // Calendar filter
    if (sectionFilter) {
      filtered = filtered.map((group) => ({
        ...group,
        sections: group.sections.filter((section) => {
          if (sectionFilter.type === "time" && sectionFilter.value.start) {
            return (
              section.timeSlot.start === sectionFilter.value.start ||
              section.timeSlot.end === sectionFilter.value.start
            );
          }

          if (sectionFilter.type === "day" && sectionFilter.value.day) {
            const [hours] = section.timeSlot.start.split(":");
            const date = new Date();
            date.setHours(parseInt(hours), 0, 0, 0);
            const dayName = date.toLocaleString("en-US", { weekday: "long" });
            return dayName === sectionFilter.value.day;
          }

          return true;
        }),
      }));
    }
    return filtered;
  }, [groupedSections, searchQuery, sectionFilter]);

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
    const hasMergedCells = selection.selectedCells.some((cell) => cell.mergeId);
    const uniqueMergeIds = new Set(
      selection.selectedCells
        .filter((cell) => cell.mergeId)
        .map((cell) => cell.mergeId)
    );

    return (
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 h-9">
          {/* Selection Count - Compact display */}
          <span className="text-sm font-medium bg-gray-50/80 px-3 py-1.5 rounded-md whitespace-nowrap">
            {selection.selectedCells.length} cells selected
          </span>

          {/* Action Buttons - Responsive design */}
          <div className="flex items-center gap-2">
            {/* Unmerge Button - Conditional render */}
            {hasMergedCells && uniqueMergeIds.size === 1 && (
              <button
                onClick={() => {
                  const mergeId = selection.selectedCells[0]?.mergeId;
                  if (mergeId && selection.selectedCells[0]?.columnType) {
                    handleUnmergeSelection(
                      mergeId,
                      selection.selectedCells[0].columnType
                    );
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors duration-200"
              >
                <Unlink className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Unmerge</span>
              </button>
            )}

            {/* Merge Button */}
            <button
              onClick={() => setShowColorModal(true)}
              className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                selection.selectedCells.length < 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Link className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">
                {hasMergedCells ? "New Merge" : "Merge"}
              </span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() =>
                setSelection({
                  isSelecting: false,
                  selectedCells: [],
                  selectedColor: colorOptions[0].class,
                  mergeName: "",
                  mergedCellsHistory: selection.mergedCellsHistory,
                  selectedColumns: [],
                  unmergeMode: false,
                  selectedMergeId: null,
                  selectedColumnType: null,
                })
              }
              className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors duration-200"
            >
              <X className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ControlButtons = () => {
    return (
      <div className="flex items-center gap-3">
        {/* Control Button Group with Glass Effect */}
        <div
          className="flex items-center gap-1 bg-white/70 backdrop-blur-sm border border-gray-100 
          rounded-xl p-1 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 
              hover:bg-blue-50/80 transition-all duration-200 group relative"
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
            ) : (
              <Maximize2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
            )}
           
          </button>

          {/* Table Selection Button */}
          <button
            onClick={() =>
              setSelection((prev) => ({
                ...prev,
                isSelecting: !prev.isSelecting,
              }))
            }
            className="p-2 rounded-lg transition-all duration-200 group relative"
          >
            {selection.isSelecting ? (
              <TableProperties className="w-4 h-4 text-blue-500 transform group-hover:scale-110 transition-transform" />
            ) : (
              <Table className="w-4 h-4 text-gray-600 transform group-hover:scale-110 transition-transform" />
            )}
            {/* Active Selection Indicator */}
            {selection.isSelecting && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Settings Button with Rotation Animation */}
          <button
            onClick={() => setFlyoverState({
              isOpen: true,
              type: "header-settings",
              data: {
                headers,
                onUpdateHeaders: setHeaders,
                onApplyStyles: setTableStyles
              }
            })}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 
              hover:bg-blue-50/80 transition-all duration-200 group relative"
          >
            <Settings className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Action Button */}
        {selection.isSelecting ? (
          <SelectionIndicator  />
        ) : (
          <button
            onClick={handleAddSection}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 
              text-white text-sm font-medium rounded-xl relative group overflow-hidden
              hover:shadow-lg transform transition-all duration-300 
              hover:scale-[1.02] hover:translate-y-[-1px]
              active:scale-[0.98] active:translate-y-[1px]"
          >
            {/* Background Animation */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Content */}
            <div className="relative flex items-center gap-2">
              <PlusCircle className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative">Add Section</span>
            </div>

            {/* Shine Effect */}
            <div
              className="absolute inset-0 transform translate-x-[-100%] group-hover:translate-x-[100%] 
              bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform 
              duration-1000 ease-out"
            />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
      ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen overflow-hidden"
          : "relative flex flex-col"
      }
    `}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 mb-6">
        <div className="p-4">
          {activeTrack && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Track Info - Left */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="relative group">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 
                      bg-clip-text text-transparent inline-flex items-center gap-2">
                      <span className="whitespace-nowrap">Track :</span>
                      <span className="font-semibold text-nowrap text-ellipsis overflow-hidden">
                        {activeTrack.name}
                      </span>
                    </span>
                    {/* Animated underline effect */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-violet-500 
                      to-purple-600 group-hover:w-full transition-all duration-300" />
                  </h2>
                  
                  {/* Optional: Add a decorative element */}
                  <div className="hidden sm:block w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 
                    animate-pulse" />
                </div>
                
                <div className="flex w-full flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
                  <div className="flex min-w-40 md:w-auto items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(activeTrack.startDate).toLocaleDateString()} -
                      {new Date(activeTrack.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex md:flex-row md:w-auto items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-lg">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span className="text-sm text-gray-600 flex-nowrap min-w-20">
                      {activeTrack.sections.length} sections
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions - Right */}
              <div className="flex items-center gap-3">
                <ControlButtons />
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="border-t border-gray-100 relative">
          <div className="p-4 bg-gradient-to-r from-gray-50/80 to-white/60 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Calendar Filter */}
              <div className="w-full sm:w-auto">
                <div className="relative transform transition-all duration-200 hover:scale-[1.02]">
                  <SectionCalendarFilter
                    sections={sections}
                    onFilterChange={setSectionFilter}
                    activeFilter={sectionFilter}
                  />
                  {/* Improved Highlight Effect */}
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(96, 165, 250, 0) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(96, 165, 250, 0) 100%)',
                      opacity: 0,
                      transition: 'opacity 300ms ease-in-out'
                    }}
                  />
                </div>
                
               
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative flex-1 group">
                <div className="relative transform transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white rounded-xl border border-gray-200 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 
                      placeholder-gray-400 transition-all duration-200 group-hover:shadow-md"
                  />
                  <Search
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 
                    transition-colors duration-200 group-hover:text-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                        hover:bg-gray-100 text-gray-400 hover:text-gray-600 
                        transition-all duration-200 hover:rotate-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="absolute right-0 mt-1 text-xs text-gray-500">
                    {filteredSections.reduce(
                      (count, group) => count + group.sections.length,
                      0
                    )}{" "}
                    results found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-50/30 to-white rounded-lg shadow h-full flex flex-col">
          <div className="overflow-auto flex-1  min-h-[65vh] ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 bg-white z-10">
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
                        onAddSubsection={handleAddSubsection}
                        onUpdateSection={onUpdateSection}
                        selection={selection}
                        onSelect={handleSelect}
                        setFlyoverState={setFlyoverState}
                        activeTrack={activeTrack}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ColorSelectionModal
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        onApply={handleApplySelection}
      />
    </div>
  );
}

export default SectionList;
