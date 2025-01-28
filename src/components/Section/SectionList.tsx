import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  AlertCircle,
  Check,
  ChevronDown,
} from "lucide-react";
import { groupSectionsByRole } from "../../utils";
import ColorSelectionModal from "../Modal/ColorSelectionModal";
import SectionCalendarFilter from "./SectionCalendarFilter";
import { showToast } from "../Modal/CustomToast";
import Modal from "../Modal/Modal";
import {
  CellSelection,
  MergedCell,
  MergedFields,
  Section,
  SectionListProps,
  SectionRowProps,
  SectionWithLevel,
  SelectionState,
} from "../../types/sections";
import { BorderStyle, TableHeader, TableStyles } from "../../types/ui";
import { TimeSlot } from "../../types/common";

const MAX_SECTION_DEPTH = 10;

const sectionLevelColors = {
  0: {
    bg: "bg-gradient-to-r from-white dark:from-slate-900 to-blue-50/30 dark:to-blue-900/10",
    border: "border-l-[3px] border-l-blue-500 dark:border-l-blue-400",
    text: "text-gray-900 dark:text-gray-900 ",
    hover: "hover:bg-blue-50/40 dark:hover:bg-blue-900/20",
    indicator: "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
  },
  1: {
    bg: "bg-gradient-to-r from-white dark:from-slate-900 to-indigo-50/20 dark:to-indigo-900/10",
    border: "border-l-[3px] border-l-indigo-400 dark:border-l-indigo-300",
    text: "text-gray-800 dark:text-gray-200",
    hover: "hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20",
    indicator: "bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-300 dark:to-indigo-400",
  },
  2: {
    bg: "bg-gradient-to-r from-white dark:from-slate-900 to-violet-50/10 dark:to-violet-900/10",
    border: "border-l-[3px] border-l-violet-400 dark:border-l-violet-300",
    text: "text-gray-700 dark:text-gray-300",
    hover: "hover:bg-violet-50/20 dark:hover:bg-violet-900/20",
    indicator: "bg-gradient-to-r from-violet-400 to-violet-500 dark:from-violet-300 dark:to-violet-400",
  },
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
  const allSections: SectionWithLevel[] = [];

  const traverse = (section: Section, level = 0) => {
    allSections.push({ ...section, level });
    section.subsections?.forEach((subsection) =>
      traverse(subsection, level + 1)
    );
  };

  sections.forEach((section) => traverse(section));
  return allSections;
};

const getSectionValue = (section: SectionWithLevel, key: keyof MergedFields) =>
  section[key as keyof Section];

const generateSectionColors = (level: number) => {
  const colorSchemes = {
    0: {
      bg: "from-blue-50 via-blue-50 to-white",
      border: "border-blue-200",
      hover: "hover:from-blue-200/80 hover:to-blue-50",
      text: "from-blue-700 to-blue-500",
      dot: "from-blue-500 to-blue-600",
      ring: "ring-blue-100",
      indicator: "M",
    },
    1: {
      bg: "from-indigo-50 via-indigo-50 to-white",
      border: "border-indigo-200",
      hover: "hover:from-indigo-100/80 hover:to-indigo-50",
      text: "from-indigo-700 to-indigo-500",
      dot: "from-indigo-500 to-indigo-600",
      ring: "ring-indigo-100",
      indicator: "S1",
    },
    2: {
      bg: "from-violet-50 via-violet-50 to-white",
      border: "border-violet-200",
      hover: "hover:from-violet-100/80 hover:to-violet-50",
      text: "from-violet-700 to-violet-500",
      dot: "from-violet-500 to-violet-600",
      ring: "ring-violet-100",
      indicator: "S2",
    },
    3: {
      bg: "from-purple-50 via-purple-50 to-white",
      border: "border-purple-200",
      hover: "hover:from-purple-100/80 hover:to-purple-50",
      text: "from-purple-700 to-purple-500",
      dot: "from-purple-500 to-purple-600",
      ring: "ring-purple-100",
      indicator: "S3",
    },
    4: {
      bg: "from-fuchsia-50 via-fuchsia-50 to-white",
      border: "border-fuchsia-200",
      hover: "hover:from-fuchsia-100/80 hover:to-fuchsia-50",
      text: "from-fuchsia-700 to-fuchsia-500",
      dot: "from-fuchsia-500 to-fuchsia-600",
      ring: "ring-fuchsia-100",
      indicator: "S4",
    },
  };

  return colorSchemes[level as keyof typeof colorSchemes] || colorSchemes[0];
};

const getLevelIndicator = (level: number) => {
  const colorSet = generateSectionColors(level);
  const indentWidth = level * 6;

  return (
    <div
      className="flex items-center h-full"
      style={{ paddingLeft: `${indentWidth}px` }}
    >
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${colorSet.bg} border ${colorSet.border} group ${colorSet.hover} transition-all duration-200`}
      >
        <div className="relative">
          <div
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorSet.dot} ring-2 ${colorSet.ring}`}
          />
          <div className="absolute -inset-1 bg-current/20 rounded-full animate-pulse group-hover:animate-none opacity-50" />
        </div>
        <span
          className={`text-xs font-medium tracking-wide bg-gradient-to-r ${colorSet.text} bg-clip-text text-transparent`}
        >
          {level === 0 ? "MAIN" : `SUB ${level}`}
        </span>
      </div>
    </div>
  );
};

const SectionRow = React.memo(
  ({
    section,
    level = 0,
    headers,
    onAddSubsection,
    onUpdateSection,
    selection,
    onSelect = () => {},
    setFlyoverState,
    activeTrack,
    tableStyles,
    rowIndex,
  }: SectionRowProps & {
    selection?: SelectionState;
    onSelect?: (
      cellId: string,
      sectionId: string,
      columnType: keyof MergedFields
    ) => void;
    tableStyles: TableStyles;
    rowIndex: number;
  }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState<Section | null>(
      null
    );

    const getLevelColor = useCallback(
      (level: number, index: number) => {
        if (level === 0) {
          // Update CSS variables for gradient
          const style = document.documentElement.style;
          style.setProperty(
            "--gradient-start",
            tableStyles.mainSectionGradientStart
          );
          style.setProperty(
            "--gradient-end",
            tableStyles.mainSectionGradientEnd
          );

          const gradientStyle =
            tableStyles.mainSectionGradientStart &&
            tableStyles.mainSectionGradientEnd
              ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]"
              : "bg-gradient-to-r from-blue-400/50 to-white";

          const alternateStyle =
            tableStyles.alternateRowColors && index % 2 === 1
              ? `bg-[${tableStyles.alternateRowColor}]`
              : "";

          return `group ${gradientStyle} ${alternateStyle} border-l-[3px] border-l-blue-500 transition-all duration-200 hover:!bg-blue-100/50`.trim();
        } else if (level === 1) {
          return `group bg-slate-50/40 border-l-[3px] border-l-indigo-400 transition-all duration-200 hover:!bg-indigo-100/50`.trim();
        } else {
          return `group bg-slate-50/20 border-l-[3px] border-l-violet-300 transition-all duration-200 hover:!bg-violet-100/50`.trim();
        }
      },
      [tableStyles]
    );

    const getMergedCellInfo = useCallback(
      (sectionId: string, columnType: keyof MergedFields) => {
        return selection?.mergedCellsHistory.find(
          (cell) =>
            cell.sectionIds.includes(sectionId) &&
            cell.columnType === columnType
        );
      },
      [selection]
    );

    const isColumnSelected = useCallback(
      (columnType: keyof MergedFields) => {
        const cellId = `${section.id}-${columnType}`;
        return selection?.selectedCells.some((cell) => cell.cellId === cellId);
      },
      [section.id, selection]
    );

    const getColumnClassName = useCallback(
      (columnType: keyof MergedFields) => {
        const baseClasses = "border text-sm relative select-none";
        const timeClasses = columnType === "timeSlot" ? "pr-2" : "px-4 py-2";
        const mergedCell = getMergedCellInfo(section.id, columnType);
        const isSelected = isColumnSelected(columnType);
        const textColor =
          level === 0
            ? sectionLevelColors[0].text
            : `text-[${tableStyles.cellTextColor}]`;
        const bgColor =
          level === 0
            ? "transparent"
            : `bg-[${tableStyles.tableBackgroundColor}]`;

        return [
          baseClasses,
          timeClasses,
          textColor,
          bgColor,
          mergedCell ? mergedCell.color : "",
          mergedCell ? "font-medium" : "",
          isSelected ? "ring-1 ring-blue-500 bg-blue-50/50" : "",
          selection?.isSelecting ? "cursor-pointer" : "",
          "transition-colors duration-150",
        ]
          .filter(Boolean)
          .join(" ");
      },
      [
        getMergedCellInfo,
        isColumnSelected,
        level,
        section.id,
        selection,
        tableStyles,
      ]
    );

    const handleColumnClick = useCallback(
      (columnType: keyof MergedFields) => {
        if (!onSelect || !selection?.isSelecting) return;
        const cellId = `${section.id}-${columnType}`;
        onSelect(cellId, section.id, columnType);
      },
      [onSelect, section.id, selection]
    );

    const renderTimeSlot = useCallback(
      (timeSlot: TimeSlot, level: number, sectionId: string) => {
        const baseIndent = 20;
        const indentWidth = level * baseIndent;

        return (
          <div
            className="flex items-center min-h-[1.25rem] relative"
            key={`${sectionId}-${timeSlot.start}-${timeSlot.end}`}
          >
            {level > 0 ? (
              <div
                className="absolute flex items-center h-full"
                style={{ left: `${indentWidth}px` }}
              >
                <div
                  className="absolute h-full w-px bg-indigo-200/60"
                  style={{ left: "-1px", top: "-50%" }}
                />
                <div className="h-px w-3 bg-indigo-200/60" />
                <div
                  className={`w-1.5 h-1.5 rounded-sm border border-indigo-300/60 ${
                    level === 1 ? "bg-indigo-50" : "bg-white"
                  }`}
                />
              </div>
            ) : (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/20" />
            )}
            <span
              className={`whitespace-nowrap flex items-center gap-2 ${
                level === 0 ? "text-gray-700 font-medium" : ""
              }`}
              style={{
                marginLeft: level > 0 ? `${indentWidth + 24}px` : "12px",
                color: level === 0 ? undefined : tableStyles.cellTextColor,
              }}
            >
              {timeSlot.start} - {timeSlot.end}
            </span>
          </div>
        );
      },
      [tableStyles.cellTextColor]
    );

    const renderColumnContent = useCallback(
      (columnType: keyof MergedFields) => {
        const mergedCell = getMergedCellInfo(section.id, columnType);
        const isSelected = isColumnSelected(columnType);
        const isActiveSection = mergedCell?.sectionIds.includes(section.id);

        let content;
        if (columnType === "timeSlot") {
          content = renderTimeSlot(section.timeSlot, level, section.id);
        } else {
          content = mergedCell
            ? mergedCell.value
            : getSectionValue(section, columnType as keyof MergedFields);
        }

        return (
          <div
            className={`relative h-full w-full transition-all duration-200
        ${mergedCell ? mergedCell.color : ""} 
        ${isSelected ? "ring-2 ring-indigo-400" : ""} 
        ${mergedCell ? "font-medium" : ""} 
        ${columnType === "timeSlot" ? "pl-0" : "p-2"} 
        rounded`}
          >
            <div className="flex items-center justify-between h-full">
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
      },
      [
        getMergedCellInfo,
        isColumnSelected,
        level,
        renderTimeSlot,
        section.id,
        section.timeSlot,
      ]
    );

    const renderActionButtons = useCallback(
      (section: Section) => (
        <div className="flex items-center justify-end gap-2">
          <button
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              level >= MAX_SECTION_DEPTH
                ? "opacity-50 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onAddSubsection?.(section.id)}
            disabled={level >= MAX_SECTION_DEPTH}
            title={
              level >= MAX_SECTION_DEPTH
                ? "Maximum section depth reached"
                : "Add subsection"
            }
          >
            <Plus className="w-4 h-4 text-gray-600" />
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
                  mergedFields: section.mergedFields,
                },
              })
            }
          />
          <Trash
            className="w-4 h-4 mr-2 cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleDeleteClick}
          />
        </div>
      ),
      [
        activeTrack?.id,
        level,
        onAddSubsection,
        onUpdateSection,
        setFlyoverState,
      ]
    );

    const isColumnVisible = useCallback(
      (type: string) => {
        const header = headers.find((h) => h.type === type);
        return header?.isVisible ?? true;
      },
      [headers]
    );

    const renderSubsections = useCallback(
      (subsections: Section[], currentLevel: number) => {
        if (!subsections || subsections.length === 0) return null;

        return subsections.map((subsection: Section) => {
          // Create a unique key that includes all relevant data
          const subsectionKey = `${
            subsection.id
          }-${currentLevel}-${JSON.stringify(subsection.mergedFields)}`;

          return (
            <React.Fragment key={subsectionKey}>
              <SectionRow
                section={subsection}
                level={currentLevel + 1}
                headers={headers}
                onAddSubsection={onAddSubsection}
                onUpdateSection={onUpdateSection}
                selection={selection}
                onSelect={onSelect}
                setFlyoverState={setFlyoverState}
                activeTrack={activeTrack}
                tableStyles={tableStyles}
                rowIndex={rowIndex}
              />
            </React.Fragment>
          );
        });
      },
      [
        activeTrack,
        headers,
        onAddSubsection,
        onSelect,
        onUpdateSection,
        rowIndex,
        selection,
        setFlyoverState,
        tableStyles,
      ]
    );

    // Add section ID to key for better update detection
    const rowKey = `${section.id}-${section.timeSlot.start}-${section.timeSlot.end}-${level}`;

    const handleDeleteClick = () => {
      setSectionToDelete(section);
      setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
      setShowDeleteConfirmation(false);
      setSectionToDelete(null);
    };

    const handleConfirmDelete = () => {
      if (sectionToDelete) {
        onUpdateSection(sectionToDelete.id, { deleted: true });
        setShowDeleteConfirmation(false);
        setSectionToDelete(null);
      }
    };

    return (
      <React.Fragment key={rowKey}>
        <tr
          className={`${getLevelColor(level, rowIndex)} ${
            level === 0 ? "font-medium text-gray-700" : "text-gray-600"
          }`}
        >
          {isColumnVisible("indicator") && (
            <td
              className="w-40 border-b border-r relative"
              style={{
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
              }}
            >
              <div className="absolute inset-0 flex items-center pl-2">
                {getLevelIndicator(level)}
              </div>
            </td>
          )}
          {isColumnVisible("time") && (
            <td
              id={`${section.id}-timeSlot`}
              className={getColumnClassName("timeSlot")}
              onClick={() => handleColumnClick("timeSlot")}
              style={{
                backgroundColor: "transparent",
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
              }}
            >
              {renderColumnContent("timeSlot")}
            </td>
          )}
          {isColumnVisible("name") && (
            <td
              id={`${section.id}-name`}
              className={getColumnClassName("name")}
              onClick={() => handleColumnClick("name")}
              style={{
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
                color: level === 0 ? undefined : tableStyles.cellTextColor,
              }}
            >
              {renderColumnContent("name")}
            </td>
          )}
          {isColumnVisible("speaker") && (
            <td
              id={`${section.id}-speaker`}
              className={getColumnClassName("speaker")}
              onClick={() => handleColumnClick("speaker")}
              style={{
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
                color: level === 0 ? undefined : tableStyles.cellTextColor,
              }}
            >
              {renderColumnContent("speaker")}
            </td>
          )}
          {isColumnVisible("role") && (
            <td
              id={`${section.id}-role`}
              className={getColumnClassName("role")}
              onClick={() => handleColumnClick("role")}
              style={{
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
                color: level === 0 ? undefined : tableStyles.cellTextColor,
              }}
            >
              {renderColumnContent("role")}
            </td>
          )}
          {isColumnVisible("actions") && !selection?.isSelecting && (
            <td
              className="px-4 py-2 border-b text-sm"
              style={{
                borderColor: tableStyles.cellBorderColor,
                borderStyle: tableStyles.cellBorderStyle,
              }}
            >
              {renderActionButtons(section)}
            </td>
          )}
        </tr>
        {section.subsections &&
          section.subsections.length > 0 &&
          renderSubsections(section.subsections, level)}

        {showDeleteConfirmation && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/10 z-50 
                animate-[fade-in_200ms_ease-out]"
              onClick={handleCancelDelete}
            />

            {/* Modal */}
            <div className="fixed z-50 right-10 bottom-10 mt-2 animate-[slide-up_300ms_ease-out]">
              <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden border border-gray-200
                hover:shadow-2xl transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-3">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <h3 className="text-sm font-semibold">Delete Section</h3>
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    Are you sure you want to delete this section? This action cannot be undone.
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleCancelDelete}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 
                        hover:bg-gray-100 rounded-md transition-all duration-200
                        hover:shadow-sm active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="px-2.5 py-1.5 text-xs font-medium text-white 
                        bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200
                        hover:shadow-md active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </React.Fragment>
    );
  }
);

function SectionList({
  sections,
  onUpdateSection,
  activeTrack,
  setFlyoverState,
  currentStyles,
  tracks,
  onSelectTrack,
}: SectionListProps) {
  const [headers, setHeaders] = useState<TableHeader[]>([
    { id: "0", label: "Level", type: "indicator", isVisible: true },
    { id: "1", label: "Time", type: "time", isVisible: true },
    { id: "2", label: "Section", type: "name", isVisible: true },
    { id: "3", label: "Speaker", type: "speaker", isVisible: true },
    { id: "4", label: "Role", type: "role", isVisible: true },
    { id: "5", label: "Actions", type: "actions", isVisible: true },
  ]);
  const [tableStyles, setTableStyles] = useState<TableStyles>({
    headerColor: "#f3f4f6",
    headerTextColor: "#374151",
    cellTextColor: "#374151",
    borderColor: "#e5e7eb",
    cellBorderColor: "#e5e7eb",
    headerBorderStyle: "solid" as BorderStyle,
    cellBorderStyle: "solid" as BorderStyle,
    tableBackgroundColor: "#ffffff",
    mainSectionGradientStart: "#93c5fd80",
    mainSectionGradientEnd: "#FFFFFF",
    alternateRowColors: false,
    alternateRowColor: "#f9fafb",
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
  const [showMergeWarning, setShowMergeWarning] = useState(false);
  const [showMergeConfirmation, setShowMergeConfirmation] = useState(false);
  const [pendingMergeColor, setPendingMergeColor] = useState("");
  const [pendingMergeName, setPendingMergeName] = useState("");
  const [pendingMergeNameBehavior, setPendingMergeNameBehavior] = useState<'replace' | 'append' | 'replace_current'>('replace');
  const [filteredSections, setFilteredSections] = useState(
    groupSectionsByRole(sections)
  );
  const [showTrackDropdown, setShowTrackDropdown] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) setIsFullScreen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullScreen]);

  useEffect(() => {
    if (currentStyles) {
      setTableStyles({
        headerColor: currentStyles.headerColor || "#f3f4f6",
        headerTextColor: currentStyles.headerTextColor || "#374151",
        cellTextColor: currentStyles.cellTextColor || "#374151",
        borderColor: currentStyles.borderColor || "#e5e7eb",
        cellBorderColor: currentStyles.cellBorderColor || "#e5e7eb",
        headerBorderStyle: currentStyles.headerBorderStyle || "solid",
        cellBorderStyle: currentStyles.cellBorderStyle || "solid",
        tableBackgroundColor: currentStyles.tableBackgroundColor || "#ffffff",
        mainSectionGradientStart:
          currentStyles.mainSectionGradientStart || "#93c5fd80",
        mainSectionGradientEnd:
          currentStyles.mainSectionGradientEnd || "#FFFFFF",
        alternateRowColors: currentStyles.alternateRowColors || false,
        alternateRowColor: currentStyles.alternateRowColor || "#f9fafb",
      });
    }
  }, [currentStyles]);

  useEffect(() => {
    const newGroupedSections = groupSectionsByRole(sections);
    setFilteredSections((prevSections) => {
      // Deep comparison of sections to prevent unnecessary updates
      if (JSON.stringify(prevSections) === JSON.stringify(newGroupedSections)) {
        return prevSections;
      }
      return newGroupedSections;
    });
  }, [sections]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTrackDropdown && !(event.target as HTMLElement).closest('.track-dropdown-container')) {
        setShowTrackDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTrackDropdown]);

  const handleSelect = useCallback(
    (
      cellIdOrSectionId: string,
      sectionId: string,
      columnType?: keyof MergedFields
    ) => {
      const allSections = findAllSections(sections);
      const targetSection = allSections.find((s) => s.id === sectionId);
      if (!targetSection) return;

      const cellId = cellIdOrSectionId;
      const actualColumnType = columnType as keyof MergedFields;

      setSelection((prev) => {
        const existingSelection = prev.selectedCells.find(
          (cell) => cell.cellId === cellId
        );
        const existingMergedCell = prev.mergedCellsHistory.find(
          (cell) =>
            cell.sectionIds.includes(sectionId) &&
            cell.columnType === actualColumnType
        );

        let newSelectedCells = [...prev.selectedCells];
        if (!existingSelection) {
          if (existingMergedCell) {
            const mergedGroupCells = existingMergedCell.sectionIds.map(
              (id) => ({
                cellId: `${id}-${actualColumnType}`,
                sectionId: id,
                columnType: actualColumnType,
                originalValue: existingMergedCell.value,
                level: targetSection.level || 0,
                mergeId: existingMergedCell.id,
              })
            );
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

        return { ...prev, isSelecting: true, selectedCells: newSelectedCells };
      });
    },
    [sections]
  );

  const hasDifferentTypes = useCallback(() => {
    const types = new Set(
      selection.selectedCells.map((cell) => cell.columnType)
    );
    return types.size > 1;
  }, [selection.selectedCells]);

  const hasAlreadyMergedCells = useCallback(
    () => selection.selectedCells.some((cell) => cell.mergeId),
    [selection.selectedCells]
  );

  const handleApplySelection = useCallback(
    (
      color: string, 
      mergeName: string, 
      mergeNameBehavior: 'replace' | 'append' | 'replace_current'
    ) => {
      if (!mergeName.trim()) return alert("Please enter a merge name");
      if (selection.selectedCells.length < 1)
        return alert("Please select at least 1 cell to merge");

      if (hasDifferentTypes()) {
        setPendingMergeColor(color);
        setPendingMergeName(mergeName);
        setPendingMergeNameBehavior(mergeNameBehavior);
        setShowMergeWarning(true);
        return;
      }

      if (hasAlreadyMergedCells()) {
        setPendingMergeColor(color);
        setPendingMergeName(mergeName);
        setPendingMergeNameBehavior(mergeNameBehavior);
        setShowMergeConfirmation(true);
        return;
      }

      executeMerge(color, mergeName, mergeNameBehavior);
    },
    [hasAlreadyMergedCells, hasDifferentTypes, selection.selectedCells.length]
  );

  const handleUnmergeSelection = useCallback(
    (mergeId: string, columnType: keyof MergedFields) => {
      const mergedCell = selection.mergedCellsHistory.find(
        (cell) => cell.id === mergeId
      );
      if (!mergedCell) return;

      mergedCell.sectionIds.forEach((sectionId) =>
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
        })
      );

      setSelection((prev) => ({
        ...prev,
        mergedCellsHistory: prev.mergedCellsHistory.filter(
          (cell) => cell.id !== mergeId
        ),
        selectedCells: prev.selectedCells.filter(
          (cell) => cell.mergeId !== mergeId
        ),
      }));
    },
    [onUpdateSection, selection.mergedCellsHistory]
  );

  const executeMerge = useCallback(
    (color: string, mergeName: string, mergeNameBehavior: 'replace' | 'append' | 'replace_current') => {
      const cellsByType = selection.selectedCells.reduce((acc, cell) => {
        if (!acc[cell.columnType]) acc[cell.columnType] = [];
        acc[cell.columnType].push(cell);
        return acc;
      }, {} as Record<keyof MergedFields, CellSelection[]>);

      Object.entries(cellsByType).forEach(([columnType, cells]) => {
        const cellsByMergeId = cells.reduce((acc, cell) => {
          const mergeId = cell.mergeId || "unmerged";
          if (!acc[mergeId]) acc[mergeId] = [];
          acc[mergeId].push(cell);
          return acc;
        }, {} as Record<string, CellSelection[]>);

        const existingMergeGroups = Object.entries(cellsByMergeId)
          .filter(([mergeId]) => mergeId !== "unmerged")
          .map(([_, cells]) => cells);
        const unmergedCells = cellsByMergeId["unmerged"] || [];
        const allSectionIds = new Set([
          ...unmergedCells.map((cell) => cell.sectionId),
          ...existingMergeGroups.flatMap((group) =>
            group.map((cell) => cell.sectionId)
          ),
        ]);

        const newMergeId = `merge-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Get the merge name based on behavior
        const finalMergeName = (() => {
          switch (mergeNameBehavior) {
            case 'replace_current':
              return mergeName;
            case 'append':
              const existingMergeNames = cells
                .filter(cell => cell.mergeId)
                .map(cell => {
                  const mergedCell = selection.mergedCellsHistory.find(
                    mc => mc.id === cell.mergeId
                  );
                  return mergedCell?.mergeName || '';
                })
                .filter(Boolean);
              return [...new Set([...existingMergeNames, mergeName])].join(' + ');
            case 'replace':
            default:
              return mergeName;
          }
        })();

        const newMergedCell: MergedCell = {
          id: newMergeId,
          sectionIds: Array.from(allSectionIds),
          color,
          mergeName: mergeNameBehavior !== 'replace_current' ? finalMergeName : '',
          columnType: columnType as keyof MergedFields,
          value: mergeNameBehavior === 'replace_current' ? mergeName : cells[0].originalValue,
        };

        existingMergeGroups.forEach((group) => {
          if (group[0].mergeId)
            handleUnmergeSelection(
              group[0].mergeId,
              columnType as keyof MergedFields
            );
        });

        Array.from(allSectionIds).forEach((sectionId) =>
          onUpdateSection(sectionId, {
            mergedFields: {
              [columnType]: {
                isMerged: true,
                color,
                mergeName:mergeNameBehavior !== 'replace_current' ? finalMergeName : '',
                value: mergeNameBehavior === 'replace_current' ? mergeName : cells[0].originalValue,
                mergeId: newMergeId,
              },
            },
          })
        );

        setSelection((prev) => ({
          ...prev,
          mergedCellsHistory: [
            ...prev.mergedCellsHistory.filter(
              (cell) =>
                cell.columnType !== columnType ||
                !newMergedCell.sectionIds.some((id) => cell.sectionIds.includes(id))
            ),
            newMergedCell,
          ],
        }));
      });

      setSelection((prev) => ({
        ...prev,
        isSelecting: false,
        selectedCells: [],
        selectedColor: colorOptions[0].class,
        mergeName: "",
        selectedColumns: [],
      }));

      setShowColorModal(false);
    },
    [handleUnmergeSelection, onUpdateSection, selection.selectedCells, selection.mergedCellsHistory]
  );

  const handleAddSubsection = useCallback(
    (parentId: string) => {
      if (!activeTrack) return showToast.error("No active track selected");
      setFlyoverState({
        isOpen: true,
        type: "add-subsection",
        data: { parentId, trackId: activeTrack.id },
      });
    },
    [activeTrack, setFlyoverState, showToast]
  );

  const handleAddSection = useCallback(() => {
    if (!activeTrack) return showToast.error("No active track selected");
    setFlyoverState({
      isOpen: true,
      type: "add-section",
      data: { trackId: activeTrack.id, parentId: null, sectionType: "program" },
    });
  }, [activeTrack, setFlyoverState]);

  const displayedSections = useMemo(() => {
    let filtered = filteredSections;

    if (searchQuery) {
      filtered = filtered.map((group) => ({
        ...group,
        sections: group.sections.filter((section: Section) =>
          section.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
    }

    if (sectionFilter) {
      filtered = filtered.map((group) => ({
        ...group,
        sections: group.sections.filter((section: Section) => {
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
  }, [filteredSections, searchQuery, sectionFilter]);

  const tableHeaders = useMemo(
    () =>
      headers
        .filter(
          (header) =>
            header.isVisible &&
            (!selection.isSelecting || header.type !== "actions")
        )
        .map((header) => (
          <th
            key={header.id}
            className="px-4 py-2 border text-left text-sm font-semibold"
            style={{
              background: tableStyles.headerColor,
              color: tableStyles.headerTextColor,
              borderColor: tableStyles.borderColor,
              borderStyle: tableStyles.headerBorderStyle,
            }}
          >
            {header.label}
          </th>
        )),
    [headers, tableStyles, selection.isSelecting]
  );

  const SelectionIndicator = useCallback(() => {
    const hasMergedCells = selection.selectedCells.some((cell) => cell.mergeId);
    const uniqueColumnTypes = new Set(
      selection.selectedCells.map((cell) => cell.columnType)
    );
    const uniqueMergeIds = new Set(
      selection.selectedCells
        .filter((cell) => cell.mergeId)
        .map((cell) => cell.mergeId)
    );

    const handleCancelSelection = () => {
      setSelection((prev) => ({
        ...prev,
        isSelecting: false,
        selectedCells: [],
        selectedColor: colorOptions[0].class,
        mergeName: "",
        selectedColumns: [],
        unmergeMode: false,
        selectedMergeId: null,
        selectedColumnType: null,
      }));
    };

    return (
      <div className="w-full sm:w-auto flex-shrink-0 flex flex-col sm:flex-row items-center gap-2">
        <span className="text-sm font-medium gap-1 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-sm border border-gray-100/80 dark:border-gray-800/80 text-gray-600 dark:text-gray-300 rounded-xl p-1 shadow-sm transition-all duration-300 hover:shadow-md py-2.5 px-3 whitespace-nowrap">
          {selection.selectedCells.length} cells selected (
          {Array.from(uniqueColumnTypes).join(", ")})
        </span>
        <div className="flex items-center gap-2">
          {hasMergedCells && (
            <button
              onClick={() => {
                uniqueMergeIds.forEach((mergeId) => {
                  if (mergeId) {
                    const cell = selection.selectedCells.find(
                      (c) => c.mergeId === mergeId
                    );
                    if (cell)
                      handleUnmergeSelection(mergeId, cell.columnType);
                  }
                });
              }}
              className="inline-flex items-center px-3 py-2.5 text-sm bg-gradient-to-br from-red-50 to-red-100/80 dark:from-red-500/10 dark:to-red-600/5 text-red-700 dark:text-red-400 hover:from-red-100 hover:to-red-200/80 dark:hover:from-red-500/20 dark:hover:to-red-600/10 rounded-md transition-all duration-200 group"
            >
              <Unlink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="inline">Unmerge</span>
            </button>
          )}
          
          {/* Merge Button */}
          <button
            onClick={() => setShowColorModal(true)}
            disabled={selection.selectedCells.length < 1}
            className={`inline-flex items-center px-4 py-2.5 text-sm rounded-md transition-all duration-200 ${
              selection.selectedCells.length < 1
                ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/15"
            }`}
          >
            <Link className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            <span className="inline">
              {hasMergedCells ? "New Merge" : "Merge"}
            </span>
          </button>
          <button
            onClick={handleCancelSelection}
            className={`inline-flex items-center px-4 py-2.5 text-sm rounded-md transition-all duration-200 ${
              selection.selectedCells.length < 1
                ? "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-400"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:shadow-md active:scale-95"
            }`}
            title="Cancel Selection"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    );
  }, [handleUnmergeSelection, selection.selectedCells]);

  const ControlButtons = useCallback(() => {
    const handleCancelSelection = () => {
      setSelection((prev) => ({
        ...prev,
        isSelecting: false,
        selectedCells: [],
        selectedColor: colorOptions[0].class,
        mergeName: "",
        selectedColumns: [],
        unmergeMode: false,
        selectedMergeId: null,
        selectedColumnType: null,
      }));
    };

    return (
      <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
        <div className="flex w-full sm:w-auto  justify-evenly sm:justify-center sm:items-center gap-1 bg-white/70 dark:bg-slate-900 backdrop-blur-sm border border-gray-100  dark:border-gray-800  rounded-xl p-1 shadow-sm transition-all duration-300 hover:shadow-md">
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/10 transition-all duration-200 group relative"
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
            ) : (
              <Maximize2 className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            onClick={() => {
              if (selection.isSelecting) handleCancelSelection();
              else setSelection((prev) => ({ ...prev, isSelecting: true }));
            }}
            className="p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/10 group relative"
          >
            {selection.isSelecting ? (
              <TableProperties className="w-4 h-4 text-blue-500  dark:text-blue-400  transform group-hover:scale-110 transition-transform" />
            ) : (
              <Table className="w-4 h-4 text-gray-600 dark:text-gray-400 transform  group-hover:scale-110 transition-transform" />
            )}
            {selection.isSelecting && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() =>
              setFlyoverState({
                isOpen: true,
                type: "header-settings",
                data: {
                  headers,
                  onUpdateHeaders: setHeaders,
                  currentStyles: {
                    headerColor: tableStyles.headerColor,
                    headerTextColor: tableStyles.headerTextColor,
                    cellTextColor: tableStyles.cellTextColor,
                    borderColor: tableStyles.borderColor,
                    cellBorderColor: tableStyles.cellBorderColor,
                    headerBorderStyle: tableStyles.headerBorderStyle,
                    cellBorderStyle: tableStyles.cellBorderStyle,
                    tableBackgroundColor: tableStyles.tableBackgroundColor,
                    mainSectionGradientStart:
                      tableStyles.mainSectionGradientStart,
                    mainSectionGradientEnd: tableStyles.mainSectionGradientEnd,
                    alternateRowColors: tableStyles.alternateRowColors,
                    alternateRowColor: tableStyles.alternateRowColor,
                  },
                  onApplyStyles: setTableStyles,
                },
              })
            }
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/10 transition-all duration-200 group relative"
          >
            <Settings className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        {selection.isSelecting ? (
          <SelectionIndicator />
        ) : (
          <button
            onClick={handleAddSection}
            className="flex w-full sm:w-auto items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl relative group overflow-hidden hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-1px] active:scale-[0.98] active:translate-y-[1px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-full flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative whitespace-nowrap">Add Section</span>
            </div>
            <div className="absolute inset-0 transform translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
          </button>
        )}
      </div>
    );
  }, [
    handleAddSection,
    headers,
    isFullScreen,
    selection.isSelecting,
    setFlyoverState,
    tableStyles,
    selection.selectedCells,
  ]);

  const TrackDropdown = () => {
    const [showTrackDropdown, setShowTrackDropdown] = useState(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showTrackDropdown && !(event.target as HTMLElement).closest('.track-dropdown-container')) {
          setShowTrackDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTrackDropdown]);

    if (!tracks?.length) {
      return (
        <div className="w-full px-3 py-2.5 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
          No tracks available
        </div>
      );
    }

    return (
      <div className="relative track-dropdown-container transform transition-all duration-200 hover:scale-[1.02]">
        <button 
          onClick={() => setShowTrackDropdown(prev => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm 
            bg-white rounded-xl border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 
            hover:border-blue-400 active:border-blue-500
            transition-all duration-200 group-hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="truncate">{activeTrack?.name || 'Select Track'}</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 transform transition-transform duration-200 
            ${showTrackDropdown ? 'rotate-180' : ''}`} 
          />
        </button>

        {showTrackDropdown && (
          <>
            <div 
              className="fixed inset-0  z-[998]"
              onClick={() => setShowTrackDropdown(false)}
            />
            <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-xl 
              border border-gray-200 py-1 z-[999]">
              <div className="max-h-[300px] overflow-y-auto">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      try {
                        onSelectTrack(track.id);
                        setShowTrackDropdown(false);
                      } catch (error) {
                        showToast.error("Failed to select track");
                      }
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-200 
                      flex items-center gap-2 hover:bg-gray-50
                      ${track.id === activeTrack?.id ? 'bg-blue-50/80 text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                      ${track.id === activeTrack?.id ? 'bg-blue-500' : 'bg-gray-300'}`} 
                    />
                    <span className="truncate">{track.name}</span>
                    {track.id === activeTrack?.id && (
                      <Check className="w-4 h-4 ml-auto text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const MergeWarningModal = useCallback(
    () => (
      <Modal
        isOpen={showMergeWarning}
        onClose={() => setShowMergeWarning(false)}
        title="Warning: Different Column Types"
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-700">
            You are attempting to merge cells from different columns. This may
            cause unexpected behavior.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowMergeWarning(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowMergeWarning(false);
                executeMerge(pendingMergeColor, pendingMergeName, pendingMergeNameBehavior);
              }}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Proceed Anyway
            </button>
          </div>
        </div>
      </Modal>
    ),
    [executeMerge, pendingMergeColor, pendingMergeName, pendingMergeNameBehavior, showMergeWarning]
  );

  const MergeConfirmationModal = useCallback(
    () => (
      <Modal
        isOpen={showMergeConfirmation}
        onClose={() => setShowMergeConfirmation(false)}
        title="Confirm Merge"
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-700">
            Some of the selected cells are already part of other merge groups.
            Proceeding will remove them from their current groups.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowMergeConfirmation(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowMergeConfirmation(false);
                executeMerge(pendingMergeColor, pendingMergeName, pendingMergeNameBehavior);
              }}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Proceed
            </button>
          </div>
        </div>
      </Modal>
    ),
    [executeMerge, pendingMergeColor, pendingMergeName, pendingMergeNameBehavior, showMergeConfirmation]
  );

  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 z-40 bg-white dark:bg-slate-900  overflow-auto"
          : "relative flex flex-col h-full"
      }`}
    >
      <div
        className={`${isFullScreen ? "min-h-screen" : "h-full"} flex flex-col`}
      >
        <div className="w-full sm:w-auto flex-shrink-0 bg-white/80 dark:bg-slate-900 backdrop-blur-sm rounded-xl shadow-sm dark:shadow-slate-800/50 ">
          <div className="p-3">
            {activeTrack && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <h2 className="relative group">
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <span className="whitespace-nowrap">Track :</span>
                        <span className="font-semibold text-nowrap text-ellipsis overflow-hidden">
                          {activeTrack.name}
                        </span>
                      </span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                    </h2>
                    <div className="hidden sm:block w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 animate-pulse" />
                  </div>
                  <div className="flex w-full sm:w-auto sm:min-w-40 items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activeTrack.startDate).toLocaleDateString()} -{" "}
                        {new Date(activeTrack.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  <div className="flex w-full sm:w-auto flex-col sm:flex-row items-start md:items-center gap-3 md:gap-6">
                    <div className="flex w-full sm:max-w-40 sm:flex-row items-center justify-center gap-2 bg-violet-50 dark:bg-violet-900/10 px-3 py-1.5 rounded-lg">
                      <Layers className="w-4 h-4  text-violet-600 dark:text-violet-400" />
                      <span className="text-sm  text-violet-600 dark:text-violet-400 whitespace-nowrap ">
                        {activeTrack.sections.length} sections
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex items-center gap-3">
                  <ControlButtons />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`flex-1 py-4 sticky top-0 ${isFullScreen && "p-4"}`}>
          <div className="rounded-xl border border-gray-200 bg-white h-full overflow-hidden shadow-sm">
            <div className="border-b border-gray-100 bg-white/95 sticky top-0 z-50 backdrop-blur-md">
              <div className="p-3 bg-gradient-to-r from-slate-50/90 to-white/80">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                  {/* Track Dropdown */}
                  <div className="flex-1 w-full sm:max-w-[200px] order-2 sm:order-1">
                    <TrackDropdown />
                  </div>
                  
                  <div className=" w-full sm:w-auto order-3 sm:order-2">
                    <div className="relative transform transition-all duration-200 hover:scale-[1.02]">
                      <SectionCalendarFilter
                        sections={sections}
                        onFilterChange={setSectionFilter}
                        activeFilter={sectionFilter}
                      />
                    </div>
                  </div>
                  <div className="relative flex-1 w-full sm:w-auto order-1 sm:order-3">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search sections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 placeholder-gray-400 transition-all duration-200 group-hover:shadow-md backdrop-blur-sm z"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 group-hover:text-blue-500" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 overflow-hidden">
                <div className="bg-gradient-to-br from-slate-50/30 to-white dark:from-slate-900/30 dark:to-slate-900/30 rounded-lg shadow max-h-[86vh] flex flex-col">
                  <div className="overflow-auto flex-1 min-h-[65vh] relative dark:bg-slate-900/50">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 dark:bg-slate-900/50">
                      <thead className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-20 dark:bg-slate-900/50">
                        <tr>{tableHeaders}</tr>
                      </thead>
                      <tbody className="dark:bg-slate-900/50">
                        {displayedSections.map((group, groupIndex: number) =>
                          group.sections.map(
                            (section: Section, sectionIndex: number) => {
                              const sectionKey = `${
                                section.id
                              }-${JSON.stringify(section.mergedFields)}`;
                              return (
                                <React.Fragment key={sectionKey}>
                                  <SectionRow
                                    section={section}
                                    level={0}
                                    headers={headers}
                                    onAddSubsection={handleAddSubsection}
                                    onUpdateSection={onUpdateSection}
                                    selection={selection}
                                    onSelect={handleSelect}
                                    setFlyoverState={setFlyoverState}
                                    activeTrack={activeTrack ?? null}
                                    tableStyles={tableStyles}
                                    rowIndex={
                                      groupIndex * group.sections.length +
                                      sectionIndex
                                    }
                                  />
                                </React.Fragment>
                              );
                            }
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ColorSelectionModal
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        onApply={handleApplySelection}
      />
      <MergeWarningModal />
      <MergeConfirmationModal />
    </div>
  );
}

export default SectionList;
