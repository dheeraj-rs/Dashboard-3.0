import { ReactNode } from 'react';
import { Toast } from 'react-hot-toast';
import { LucideIcon } from 'lucide-react';
import { BorderStyle, TableHeader } from './ui';
import { Track } from './tracks';
import { FlyoverState } from './ui';
import { DataManagementState } from './management';

export interface TimeSlot {
  readonly start: string;
  readonly end: string;
}

export interface Props {
  children: ReactNode;
}

export interface State {
  hasError: boolean;
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

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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

export interface HeaderSettingsState {
  tableBackgroundColor: string;
  headerColor: string;
  headerTextColor: string;
  cellTextColor: string;
  borderColor: string;
  headerBorderStyle: BorderStyle;
  cellBorderStyle: BorderStyle;
  alternateRowColors: boolean;
  alternateRowColor: string;
  cellBorderColor: string;
  mainSectionGradientStart: string;
  mainSectionGradientEnd: string;
}

export interface HeaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: TableHeader[];
  onUpdateHeaders: (headers: TableHeader[]) => void;
  onApplyStyles: (styles: HeaderSettingsState) => void;
  currentStyles?: HeaderSettingsState;
}

export interface FlyoverPanelProps {
  flyoverState: FlyoverState;
  getFlyoverTitle: (type: string | null) => string;
  setFlyoverState: (state: FlyoverState) => void;
  handleUpdateTrack: (trackData: Partial<Track>) => boolean;
  handleAddTrack: (trackData: Partial<Track>) => boolean;
  handleSubmitSection: (formData: any) => void;
  handleAddManagementItem: (type: string, item: any) => void;
  handleUpdateManagementItem: (type: string, id: string, updates: any) => void;
  tracks: Track[];
  managementData: DataManagementState;
  showToast?: { success: (msg: string) => void; error: (msg: string) => void };
}

export interface ColorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (color: string, mergeName: string) => void;
}