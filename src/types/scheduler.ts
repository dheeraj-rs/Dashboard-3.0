import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

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
  speaker: string | boolean;
  role: string;
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
  setFlyoverState: (state: any) => void;
}

export interface TrackItemProps {
  track: Track;
  onSelect: () => void;
  onEdit: () => void;
  colorIndex: number;
  isFullView: boolean;
}

export interface TrackFormProps {
  onSubmit: (track: Partial<Track>) => void;
  initialData?: Track;
}


export interface SectionListProps {
  sections: Section[];
  onAddSection?: (sectionData: Partial<Section>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onAddSubsection?: (sectionId: string) => void;
  activeTrack?: Track;
  setFlyoverState: (state: {
    isOpen: boolean;
    type: 'add-track' | 'edit-track' | 'add-section' | 'edit-section' | 'add-subsection';
    data: any;
  }) => void;
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
  onSelect?: (sectionId: string, columnType: keyof MergedFields) => void;
  setFlyoverState: (state: {
    isOpen: boolean;
    type: 'add-track' | 'edit-track' | 'add-section' | 'edit-section' | 'add-subsection';
    data: any;
  }) => void;
}

export interface TableHeader {
  id: string;
  label: string;
  type: 'time' | 'name' | 'speaker' | 'role' | 'actions';
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
  onSubmit: (section: Partial<Section>) => void;
  initialData?: Section;
  isSubsection?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}



export interface TableHeader {
  id: string;
  label: string;
  type: 'time' | 'name' | 'speaker' | 'role' | 'actions';
  isVisible: boolean;
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
  type: string | null;
  data: any;

}
export interface FlyoverPanelProps {
  flyoverState: FlyoverState;
  getFlyoverTitle: (type: string | null) => string;
  setFlyoverState: (state: FlyoverState) => void;
  handleUpdateTrack: (trackData: any) => void;
  handleAddTrack: (trackData: any) => void;
  handleUpdateSection: (id: string, sectionData: any) => void;
  handleSubmitSection: (sectionData: any) => void;
  handleAddParticipant: (participantData: Partial<Participant>) => void;
  handleUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
}




export type Tracks = Track[];

export interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  organization: string;
  sessions: string[];
}

export interface ParticipantsPageProps {
  setFlyoverState: (state: FlyoverState) => void;
  participants: Participant[];
  onAddParticipant: (participantData: Partial<Participant>) => void;
  onUpdateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  onDeleteParticipant: (participantId: string) => void;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navigationItems: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSearch?: (query: string) => void;
}

export interface ParticipantFormProps {
  onSubmit: (participant: Partial<Participant>) => void;
  initialData?: Participant;
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