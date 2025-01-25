import { SectionManagementItem } from './sections';
import { FlyoverState } from './ui';

export interface DataManagementItem {
  id: string;
  name: string;
  type: 'section' | 'speaker' | 'role' | 'sectionstypes' | 'guest';
  color?: string;
  description?: string;
}

export interface DataManagementState {
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

export interface SpeakerFormProps {
  initialData?: SpeakerManagementItem;
  onSubmit: (data: Partial<SpeakerManagementItem>) => void;
}

export interface RoleFormProps {
  initialData?: RoleManagementItem;
  onSubmit: (data: Partial<RoleManagementItem>) => void;
} 