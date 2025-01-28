export type BorderStyle = 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';

export interface TableStyles {
  headerColor: string;
  headerTextColor: string;
  cellTextColor: string;
  borderColor: string;
  cellBorderColor: string;
  headerBorderStyle: BorderStyle;
  cellBorderStyle: BorderStyle;
  tableBackgroundColor: string;
  mainSectionGradientStart: string;
  mainSectionGradientEnd: string;
  alternateRowColors: boolean;
  alternateRowColor: string;
}

export interface TableHeader {
  id: string;
  label: string;
  type: 'indicator' | 'time' | 'name' | 'speaker' | 'role' | 'actions';
  isVisible: boolean;
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