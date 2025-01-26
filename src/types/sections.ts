import { TimeSlot } from './common';
import { TableHeader, FlyoverState, TableStyles } from './ui';
import { Track } from './tracks';

export const SPECIAL_SECTION_TYPES = {
  lunch: 'lunch',
  break: 'break',
  introduction: 'introduction',
  other: 'other'
} as const;

export interface Section {
  readonly id: string;
  name: string;
  timeSlot: TimeSlot;
  speaker: string;
  role: string;
  sectionTypeId?: string;
  specialType?: keyof typeof SPECIAL_SECTION_TYPES | null;
  subsections: Section[];
  mergedFields?: Partial<MergedFields>;
  deleted?: boolean;
  hideFields?: {
    speaker?: boolean;
    role?: boolean;
  };
}

export interface SectionWithLevel extends Section {
  level?: number;
}

export interface SectionGroup {
  speaker: string | boolean;
  role: string;
  sections: Section[];
}

export interface SectionManagementItem {
  id: string;
  name: string;
  type: 'sectionstypes';
  sectionType: keyof typeof SPECIAL_SECTION_TYPES | 'program' | string;
  description?: string;
  maxParticipants?: number;
  location?: string;
  color?: string;
  timeSlot?: TimeSlot;
}

export interface MergedFields {
  [key: string]: {
    isMerged: boolean;
    color: string;
    mergeId: string;
    mergeName: string;
    value: any;
  };
}

export interface SectionListProps {
  sections: Section[];
  headers: TableHeader[];
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  activeTrack: Track | null;
  setFlyoverState: (state: FlyoverState) => void;
  sectionTypes: SectionManagementItem[];
  currentStyles: TableStyles;
  tracks: Track[];
  onSelectTrack: (trackId: string | null) => void;
}

export interface SectionFormProps {
  onSubmit: (formData: Partial<Section>) => void;
  initialData?: Section;
  isSubsection?: boolean;
  sectionTypes?: SectionManagementItem[];
}

export interface ExtendedSectionFormProps extends SectionFormProps {
  speakers?: { id: string; name: string }[];
  roles?: { id: string; name: string }[];
  setFlyoverState: (state: FlyoverState) => void;
}

export interface SectionTypeFormProps {
  initialData?: SectionManagementItem;
  onSubmit: (data: Partial<SectionManagementItem>) => void;
  isSubsection?: boolean;
}

export interface SectionRowProps {
  section: Section;
  level?: number;
  headers: TableHeader[];
  onAddSubsection?: (sectionId: string) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  setFlyoverState: (state: FlyoverState) => void;
  activeTrack: Track | null;
  sectionTypes?: SectionManagementItem[];
}

export interface SelectionState {
  isSelecting: boolean;
  selectedCells: CellSelection[];
  selectedColor: string;
  mergeName: string;
  mergedCellsHistory: MergedCell[];
  selectedColumns: string[];
  unmergeMode: boolean;
  selectedMergeId: string | null;
  selectedColumnType: keyof MergedFields | null;
}

export interface CellSelection {
  cellId: string;
  sectionId: string;
  columnType: keyof MergedFields;
  originalValue: any;
  level: number;
  mergeId?: string;
}

export interface MergedCell {
  id: string;
  sectionIds: string[];
  color: string;
  mergeName: string;
  columnType: keyof MergedFields;
  value: any;
}

export interface SectionCalendarFilterProps {
  sections: Section[];
  onFilterChange: (filter: { type: 'time' | 'day' | 'month', value: { start?: string; day?: string; month?: string } } | null) => void;
  activeFilter: { type: 'time' | 'day' | 'month', value: { start?: string; day?: string; month?: string } } | null;
} 