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

const MAX_SECTION_DEPTH = 10;

const sectionLevelColors = {
  0: {
    bg: "bg-gradient-to-r from-white to-blue-50/30",
    border: "border-l-[3px] border-l-blue-500",
    text: "text-gray-900",
    hover: "hover:bg-blue-50/40",
    indicator: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  1: {
    bg: "bg-gradient-to-r from-white to-indigo-50/20",
    border: "border-l-[3px] border-l-indigo-400",
    text: "text-gray-800",
    hover: "hover:bg-indigo-50/30",
    indicator: "bg-gradient-to-r from-indigo-400 to-indigo-500",
  },
  2: {
    bg: "bg-gradient-to-r from-white to-violet-50/10",
    border: "border-l-[3px] border-l-violet-400",
    text: "text-gray-700",
    hover: "hover:bg-violet-50/20",
    indicator: "bg-gradient-to-r from-violet-400 to-violet-500",
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

const generateSectionColors = (level: number) => {
  const colorSchemes = {
    0: {
      // Main section
      bg: "from-blue-50 via-blue-50 to-white",
      border: "border-blue-200",
      hover: "hover:from-blue-100/80 hover:to-blue-50",
      text: "from-blue-700 to-blue-500",
      dot: "from-blue-500 to-blue-600",
      ring: "ring-blue-100",
      indicator: "M",
    },
    1: {
      // First level subsection
      bg: "from-indigo-50 via-indigo-50 to-white",
      border: "border-indigo-200",
      hover: "hover:from-indigo-100/80 hover:to-indigo-50",
      text: "from-indigo-700 to-indigo-500",
      dot: "from-indigo-500 to-indigo-600",
      ring: "ring-indigo-100",
      indicator: "S1",
    },
    2: {
      // Second level subsection
      bg: "from-violet-50 via-violet-50 to-white",
      border: "border-violet-200",
      hover: "hover:from-violet-100/80 hover:to-violet-50",
      text: "from-violet-700 to-violet-500",
      dot: "from-violet-500 to-violet-600",
      ring: "ring-violet-100",
      indicator: "S2",
    },
    3: {
      // Third level subsection
      bg: "from-purple-50 via-purple-50 to-white",
      border: "border-purple-200",
      hover: "hover:from-purple-100/80 hover:to-purple-50",
      text: "from-purple-700 to-purple-500",
      dot: "from-purple-500 to-purple-600",
      ring: "ring-purple-100",
      indicator: "S3",
    },
    4: {
      // Fourth level subsection
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
        className={`
        flex items-center gap-2 px-2.5 py-1.5 rounded-lg
        bg-gradient-to-r ${colorSet.bg}
        border ${colorSet.border}
        group ${colorSet.hover}
        transition-all duration-200
      `}
      >
        {/* Level dot with pulse effect */}
        <div className="relative">
          <div
            className={`
            w-2 h-2 rounded-full 
            bg-gradient-to-r ${colorSet.dot}
            ring-2 ${colorSet.ring}
          `}
          />
          <div className="absolute -inset-1 bg-current/20 rounded-full animate-pulse group-hover:animate-none opacity-50" />
        </div>

        {/* Level indicator text */}
        <span
          className={`
          text-xs font-medium tracking-wide
          bg-gradient-to-r ${colorSet.text}
          bg-clip-text text-transparent
        `}
        >
          {level === 0 ? "MAIN" : `SUB ${level}`}
        </span>
      </div>
    </div>
  );
};

const SectionRow = ({
  section,
  level = 0,
  showSpeakerRole = true,
  onAddSubsection,
  onUpdateSection,
  selection,
  onSelect = () => {},
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
    if (level === 0) {
      return `
        bg-gradient-to-r from-slate-300/50 to-white
        border-l-[3px] border-l-blue-500
        bg-blue-300/50
        transition-colors duration-200
        shadow-[0_1px_3px_0_rgb(0,0,0,0.05)]
      `;
    } else if (level === 1) {
      return `
        bg-slate-50/40
        border-l-[3px] border-l-indigo-400
         hover:bg-slate-400/30
        transition-colors duration-200
      `;
    } else {
      return `
        bg-slate-50/20
        border-l-[3px] border-l-violet-300
        hover:bg-slate-400/30
        transition-colors duration-200
      `;
    }
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
    const baseClasses =
      "border-b border-r text-sm relative cursor-pointer select-none";
    const timeClasses = columnType === "timeSlot" ? "pr-2" : "px-4 py-2";

    const mergedCell = getMergedCellInfo(section.id, columnType);
    const isSelected = isColumnSelected(columnType);

    const classes = [
      baseClasses,
      timeClasses,
      mergedCell ? mergedCell.color : "",
      mergedCell ? "font-medium" : "",
      isSelected ? "ring-1 ring-blue-500 bg-blue-50/50" : "",
      selection?.isSelecting ? "hover:bg-blue-50/30" : "",
      "transition-colors duration-150",
      "first:border-l",
    ];

    return classes.filter(Boolean).join(" ");
  };

  const handleColumnClick = (columnType: keyof MergedFields) => {
    if (!onSelect) return;
    const cellId = `${section.id}-${columnType}`;
    onSelect(cellId, section.id, columnType);
  };

  const renderTimeSlot = (timeSlot: TimeSlot, level: number) => {
    const baseIndent = 20;
    const indentWidth = level * baseIndent;
    const colors =
      sectionLevelColors[level as keyof typeof sectionLevelColors] ||
      sectionLevelColors[0];

    return (
      <div className="flex items-center min-h-[1.25rem] relative">
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
          className={`
            whitespace-nowrap flex items-center gap-2
            ${level === 0 ? "text-gray-700 font-medium" : colors.text}
            ${level > 0 ? "text-sm" : ""}
          `}
          style={{ marginLeft: level > 0 ? `${indentWidth + 24}px` : "12px" }}
        >
          {/* {level === 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-blue-500">Main</span>
            </div>
          )}
          {level > 0 && (
            <span className={`text-xs ${level === 1 ? 'text-indigo-400' : 'text-indigo-300'}`}>
              Sub{level}
            </span>
          )} */}
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
        onClick={() => {
          onUpdateSection(section.id, { deleted: true });
        }}
      />
    </div>
  );

  return (
    <>
      <tr
        className={`
        ${getLevelColor(level)}
        ${level === 0 ? "font-medium text-gray-700" : "text-gray-600"}
      `}
      >
        <td className="w-40 border-b border-r relative">
          <div className="absolute inset-0 flex items-center pl-2">
            {getLevelIndicator(level)}
          </div>
        </td>
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

      {section.subsections?.map((subsection) =>
        level < MAX_SECTION_DEPTH ? (
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
        ) : null
      )}
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
    { id: "0", label: "Level", type: "indicator", isVisible: true },
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

      // Check if cell is part of a merged group
      const existingMergedCell = prev.mergedCellsHistory.find(
        (cell) =>
          cell.sectionIds.includes(sectionId) &&
          cell.columnType === actualColumnType
      );

      if (prev.selectedCells.length > 0) {
        const firstColumnType = prev.selectedCells[0].columnType;
        if (actualColumnType !== firstColumnType) {
          showToast.error("You can only merge cells of the same type");
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
      showToast.error("No active track selected");
      return;
    }

    setFlyoverState({
      isOpen: true,
      type: "add-subsection",
      data: {
        parentId,
        trackId: activeTrack.id,
      },
    });
  };

  const handleAddSection = () => {
    if (!activeTrack) {
      showToast.error("No active track selected");
      return;
    }

    setFlyoverState({
      isOpen: true,
      type: "add-section",
      data: {
        trackId: activeTrack.id,
        parentId: null,
        sectionType: "program",
      },
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
            onClick={() =>
              setFlyoverState({
                isOpen: true,
                type: "header-settings",
                data: {
                  headers,
                  onUpdateHeaders: setHeaders,
                  onApplyStyles: setTableStyles,
                },
              })
            }
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 
              hover:bg-blue-50/80 transition-all duration-200 group relative"
          >
            <Settings className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Action Button */}
        {selection.isSelecting ? (
          <SelectionIndicator />
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
          ? "fixed inset-0 z-50 bg-white overflow-auto"
          : "relative flex flex-col h-full"
      }
    `}
    >
      <div
        className={`
        ${isFullScreen ? "min-h-screen" : "h-full"} 
        flex flex-col
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
                      <span
                        className="text-xl font-bold bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 
                      bg-clip-text text-transparent inline-flex items-center gap-2"
                      >
                        <span className="whitespace-nowrap">Track :</span>
                        <span className="font-semibold text-nowrap text-ellipsis overflow-hidden">
                          {activeTrack.name}
                        </span>
                      </span>
                      {/* Animated underline effect */}
                      <span
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-violet-500 
                      to-purple-600 group-hover:w-full transition-all duration-300"
                      />
                    </h2>

                    {/* Optional: Add a decorative element */}
                    <div
                      className="hidden sm:block w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 
                    animate-pulse"
                    />
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
          <div className="border-t border-gray-100 relative hidden">
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
                        background:
                          "linear-gradient(90deg, rgba(96, 165, 250, 0) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(96, 165, 250, 0) 100%)",
                        opacity: 0,
                        transition: "opacity 300ms ease-in-out",
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

        <div className="flex-1 p-4 pb-10 sticky top-0">
          <div className="rounded-xl border border-gray-200 bg-white h-full overflow-hidden shadow-sm ">
            {/* Enhanced Search and Filters Bar */}
            <div className="border-b border-gray-100 bg-white/95 sticky top-0 z-20 backdrop-blur-md">
              <div className="p-3 bg-gradient-to-r from-slate-50/90 to-white/80">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Left Side Controls */}
                  <div className="flex items-center gap-3">
                    {/* Timeline Toggle */}
                    <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 border border-gray-100">
                      <Clock className="w-4 h-4" />
                    </button>

                    {/* View Options Dropdown */}
                    <select className="px-3 py-2 min-w-36 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50 cursor-pointer">
                      <option>Timeline View</option>
                      <option>Table View</option>
                      <option>Gantt View</option>
                    </select>
                  </div>

                  {/* Center - Calendar Filter */}
                  <div className="flex-1 max-w-md">
                    <div className="relative transform transition-all duration-200 hover:scale-[1.02]">
                      <SectionCalendarFilter
                        sections={sections}
                        onFilterChange={setSectionFilter}
                        activeFilter={sectionFilter}
                      />
                    </div>
                  </div>

                  {/* Right - Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Search sections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/50 rounded-xl border border-gray-200
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30
                          placeholder-gray-400 transition-all duration-200 group-hover:shadow-md
                          backdrop-blur-sm"
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
                  </div>
                </div>
              </div>
            </div>

            {/* Table Container with Timeline */}
            <div className="flex">
              {/* Main Table */}
              <div className="flex-1 overflow-hidden">
                <div className="bg-gradient-to-br from-slate-50/30 to-white rounded-lg shadow h-full flex flex-col">
                  <div className="overflow-auto flex-1  min-h-[65vh] ">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr>{tableHeaders}</tr>
                      </thead>
                      <tbody>
                        {filteredSections.map((group) =>
                          group.sections.map((section) => (
                            <React.Fragment key={section.id}>
                              <SectionRow
                                section={section}
                                showSpeakerRole={
                                  headers.find((h) => h.type === "speaker")
                                    ?.isVisible
                                }
                                onAddSubsection={handleAddSubsection}
                                onUpdateSection={onUpdateSection}
                                selection={selection}
                                onSelect={handleSelect}
                                setFlyoverState={setFlyoverState}
                                activeTrack={activeTrack}
                              />
                            </React.Fragment>
                          ))
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
    </div>
  );
}

export default SectionList;
