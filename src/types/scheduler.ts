import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Toast } from 'react-hot-toast';

export const SPECIAL_SECTION_TYPES = {
  lunch: 'lunch',
  break: 'break',
  introduction: 'introduction',
  other: 'other'
} as const;

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

export interface TimeSlot {
  readonly start: string;
  readonly end: string;
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

export interface Section {
  readonly id: string;
  name: string;
  timeSlot: TimeSlot;
  speaker: string;
  role: string;
  sectionTypeId?: string;
  subsections: Section[];
  mergedFields?: Partial<MergedFields>;
  deleted?: boolean;
}

export interface Track {
  id: string;
  name: string;
  sections: Section[];
  startDate: string;
  endDate: string;
}


export interface TrackListProps {
  tracks: Track[];
  onSelectTrack: (id: string) => void;
  selectedTrackId: string | null;
  setFlyoverState: (state: {
    isOpen: boolean;
    type: 'add-track' | 'edit-track' | 'add-section' | 'edit-section' | 'add-subsection' | 'track-settings';
    data: any;
  }) => void;
  onDeleteTrack: (id: string) => void;
}

export interface TrackItemProps {
  track: Track;
  onSelect: () => void;
  onEdit: () => void;
  colorIndex: number;
  isFullView: boolean;
}

export interface TrackFormProps {
  onSubmit: (track: Partial<Track>) => boolean;
  initialData?: Track;
  tracks?: Track[];
}


export interface SectionListProps {
  sections: Section[];
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  activeTrack: Track | null;
  setFlyoverState: (state: FlyoverState) => void;
}

export interface SectionRowProps {
  section: Section;
  level?: number;
  showSpeakerRole?: boolean;
  speaker?: string;
  role?: string;
  rowSpan?: number;
  parentTimeSlot?: TimeSlot;
  onAddSubsection?: (sectionId: string) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  selection?: SelectionState;
  onSelect?: (
    cellId: string,
    sectionId: string, 
    columnType: keyof MergedFields
  ) => void;
  setFlyoverState: (state: FlyoverState) => void;
  activeTrack: Track | null;
  sectionTypes?: SectionManagementItem[];
  
}

export interface TableHeader {
  id: string;
  label: string;
  type: 'indicator' | 'time' | 'name' | 'speaker' | 'role' | 'actions';
  isVisible: boolean;
}

export interface SectionItemProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onAddSubsection: (parentId: string) => void;
  level?: number;
}

export interface SectionFormProps {
  onSubmit: (formData: Partial<Section>) => void;
  initialData?: Section;
  isSubsection?: boolean;
  sectionTypes?: SectionManagementItem[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface HeaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: TableHeader[];
  onUpdateHeaders: (headers: TableHeader[]) => void;
  onApplyStyles: (styles: {
    headerColor: string;
    textColor: string;
    borderColor: string;
    columnColors: { [key: string]: string };
    sectionColors: { [key: string]: string };
    subsectionColors: { [key: string]: string };
    mergedItemColors: { [key: string]: string };
  }) => void;
}

export interface ColorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (color: string, name: string) => void;
}

export interface FlyoverState {
  isOpen: boolean;
  type: 'add-track' | 'edit-track' | 'add-section' | 'edit-section' | 'add-subsection' | 
        'edit-subsection' | 'track-settings' | 'header-settings' | 'add-participant' | 
        'edit-participant' | 'add-section-item' | 'edit-section-item' | 'add-speaker' | 
        'edit-speaker' | 'add-role' | 'edit-role' | 'add-section-type' | 'edit-section-type' |
        'add-guest' | 'edit-guest' | 
        '' | null;
  data: any;
}
export interface FlyoverPanelProps {
  flyoverState: FlyoverState;
  getFlyoverTitle: (type: string | null) => string;
  setFlyoverState: (state: FlyoverState) => void;
  handleUpdateTrack: (trackData: Partial<Track>) => boolean;
  handleAddTrack: (trackData: Partial<Track>) => boolean;
  handleUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  handleSubmitSection: (sectionData: Partial<Section>) => void;
  handleAddManagementItem: (type: string, item: Partial<DataManagementItem>) => void;
  handleUpdateManagementItem: (type: string, id: string, updates: Partial<DataManagementItem>) => void;
  tracks: Track[];
  managementData: DataManagementState;
  showToast?: { success: (msg: string) => void; error: (msg: string) => void; };
}




export type Tracks = Track[];

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navigationItems: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearch?: (query: string) => void;
}

export interface MergedCell {
  id: string;
  sectionIds: string[];
  color: string;
  mergeName: string;
  columnType: keyof MergedFields;
  value: any;
}

export interface CellSelection {
  cellId: string;
  sectionId: string;
  columnType: keyof MergedFields;
  originalValue: any;
  level: number;
  mergeId?: string;
}

type ColorClass = typeof colorOptions[number]["class"];


export interface SelectionState {
  isSelecting: boolean;
  selectedCells: CellSelection[];
  selectedColor: ColorClass;
  mergeName: string;
  mergedCellsHistory: MergedCell[];
  selectedColumns: { sectionId: string; columnType: string | number; }[];
  unmergeMode: boolean;
  selectedMergeId: string | null;
  selectedColumnType: keyof MergedFields | null;
}

export interface SectionWithLevel extends Section {
  level?: number;
}

export interface Props {
  children: ReactNode;
}

export interface State {
  hasError: boolean;
}

export interface SectionGroup {
  speaker: string | boolean;
  role: string;
  sections: Section[];
}


export interface TrackSettingsPanelProps {
  track: Track;
  onDelete: () => void;
  setFlyoverState: (state: FlyoverState) => void;
  handleUpdateTrack: (trackData: Partial<Track>) => boolean;
  tracks: Track[];
}

export interface SectionCalendarFilterProps {
  sections: Section[];
  onFilterChange: (filter: { 
    type: 'time' | 'day' | 'month', 
    value: { 
      start?: string; 
      end?: string; 
      day?: string;
      month?: string;
    } 
  } | null) => void;
  activeFilter: {
    type: 'time' | 'day' | 'month',
    value: { 
      start?: string; 
      end?: string; 
      day?: string;
      month?: string;
    }
  } | null;
}

export interface SpeakerManagementItem extends DataManagementItem {
  type: 'speaker';
  email: string;
  phone?: string;
  organization?: string;
  expertise: string[];
  availability: {
    start: string;
    end: string;
    days: string[];
  }[];
  bio?: string;
}

export interface RoleManagementItem extends DataManagementItem {
  type: 'role';
  responsibilities: string[];
  requirements?: string[];
  level: 'junior' | 'mid' | 'senior' | 'lead';
  department?: string;
}

export interface DataManagementItem {
  id: string;
  name: string;
  type: 'section' | 'speaker' | 'role' | 'sectionstypes' | 'guest';
  color?: string;
  description?: string;
}

export interface GuestManagementItem extends DataManagementItem {
  type: 'guest';
  email: string;
  phone?: string;
  organization?: string;
  invitationStatus: 'pending' | 'accepted' | 'declined';
  dietaryRestrictions?: string[];
  notes?: string;
  accessLevel: 'vip' | 'standard' | 'limited';
}

export interface DataManagementState {
  sections: SectionManagementItem[];
  speakers: SpeakerManagementItem[];
  roles: RoleManagementItem[];
  sectionstypes: SectionManagementItem[];
  guests: GuestManagementItem[];
}

export interface DataManagementPageProps {
  setFlyoverState: (state: FlyoverState) => void;
  onAddItem: (type: string, item: Partial<DataManagementItem>) => void;
  onUpdateItem: (type: string, id: string, updates: Partial<DataManagementItem>) => void;
  onDeleteItem: (type: string, id: string) => void;
  data: DataManagementState;
}

export interface SectionManagementItem {
  id: string;
  name: string;
  type: 'sectionstypes';
  sectionType: keyof typeof SPECIAL_SECTION_TYPES | 'program';
  description?: string;
  maxParticipants?: number;
  location?: string;
  color?: string;
  timeSlot?: TimeSlot;
}


export interface CalendarFilterProps {
  tracks: Track[];
  onFilterChange: (filter: { type: 'day' | 'month' | 'year', value: string } | null) => void;
  activeFilter: { type: 'day' | 'month' | 'year', value: string } | null;
}


export interface ExtendedSectionFormProps extends SectionFormProps {
  sectionTypes: SectionManagementItem[];
  speakers: SpeakerManagementItem[];
  roles: RoleManagementItem[];
  setFlyoverState: (state: FlyoverState) => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface ToastProps {
  t: Toast;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface AlertProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive';
}

export interface SpeakerFormProps {
  initialData?: SpeakerManagementItem;
  onSubmit: (data: Partial<SpeakerManagementItem>) => void;
}

export interface RoleFormProps {
  initialData?: RoleManagementItem;
  onSubmit: (data: Partial<RoleManagementItem>) => void;
}

export interface SectionTypeFormProps {
  initialData?: SectionManagementItem;
  onSubmit: (data: Partial<SectionManagementItem>) => void;
}

export interface RoleFormProps {
  initialData?: RoleManagementItem;
  onSubmit: (data: Partial<RoleManagementItem>) => void;
}