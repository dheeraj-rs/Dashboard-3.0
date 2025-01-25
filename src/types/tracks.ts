import { Section } from './sections';
import { FlyoverState } from './ui';

export interface Track {
  id: string;
  name: string;
  sections: Section[];
  startDate: string;
  endDate: string;
}

export type Tracks = Track[];

export interface TrackListProps {
  tracks: Track[];
  onSelectTrack: (id: string) => void;
  selectedTrackId: string | null;
  setFlyoverState: (state: FlyoverState) => void;
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

export interface TrackSettingsPanelProps {
  track: Track;
  onDelete: () => void;
  setFlyoverState: (state: FlyoverState) => void;
  handleUpdateTrack: (trackData: Partial<Track>) => boolean;
  tracks: Track[];
}

export interface CalendarFilterProps {
  tracks: Track[];
  onFilterChange: (filter: { type: 'day' | 'month' | 'year', value: string } | null) => void;
  activeFilter: { type: 'day' | 'month' | 'year', value: string } | null;
} 