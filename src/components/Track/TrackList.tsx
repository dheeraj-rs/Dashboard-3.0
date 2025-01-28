import { useState, useRef, useEffect } from "react";
import {
  Clock,
  PlusCircle,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import CalendarFilter from "./CalendarFilter";
import { Track, TrackListProps } from "../../types/tracks";
import { Section } from "../../types/sections";

export default function TrackList({
  tracks,
  onSelectTrack,
  selectedTrackId,
  setFlyoverState,
  onDeleteTrack,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dateFilter, setDateFilter] = useState<{ type: 'day' | 'month' | 'year', value: string } | null>(null);

  useEffect(() => {
    if (tracks.length > 0 && !selectedTrackId) {
      onSelectTrack(tracks[0].id);
    }
  }, [tracks, selectedTrackId, onSelectTrack]);

  const filteredTracks = tracks.filter((track) => {
    // First apply search filter
    const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then apply date filter if active
    if (dateFilter) {
      const trackDate = new Date(track.startDate);
      
      switch (dateFilter.type) {
        case 'year':
          return matchesSearch && trackDate.getFullYear().toString() === dateFilter.value;
        case 'month':
          const [year, month] = dateFilter.value.split('-');
          return matchesSearch && 
            trackDate.getFullYear().toString() === year &&
            (trackDate.getMonth() + 1).toString().padStart(2, '0') === month;
        default:
          return matchesSearch;
      }
    }
    
    return matchesSearch;
  });

  const totalSections = tracks.reduce(
    (acc, track) => acc + track.sections.length,
    0
  );

  const totalParticipants = tracks.reduce(
    (acc: number, track: Track) =>
      acc +
      track.sections.reduce(
        (sum: number, section: Section) => sum + (section.speaker ? 1 : 0),
        0
      ),
    0
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    })}`;
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-slate-800/50">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col gap-4 w-full">
            {/* Title and Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <h2 className="relative group">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent inline-flex items-center gap-2">
                      Tracks
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 group-hover:w-full transition-all duration-300" />
                  </h2>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 whitespace-nowrap min-w-max px-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium flex flex-row">{tracks.length} <span className="sm:block hidden"> Tracks</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 whitespace-nowrap min-w-max px-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium flex flex-row">{totalSections} <span className="sm:block hidden"> Sections</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 whitespace-nowrap min-w-max px-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium flex flex-row">{totalParticipants} <span className="sm:block hidden"> Participants</span></span>
                  </div>
                </div>
              </div>

              {/* New Track Button */}
              <button
                onClick={() => {
                  setFlyoverState({
                    isOpen: true,
                    type: "add-track",
                    data: null
                  });
                }}
                className="sm:w-36 w-full flex items-center gap-2 px-4 py-2.5 
                  bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500
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
                  <span className="relative whitespace-nowrap">New Track</span>
                </div>

                {/* Shine Effect */}
                <div
                  className="absolute inset-0 transform translate-x-[-100%] group-hover:translate-x-[100%] 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform 
                  duration-1000 ease-out"
                />
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <CalendarFilter
                  tracks={tracks}
                  onFilterChange={setDateFilter}
                  activeFilter={dateFilter}
                />
              </div>

              {/* Search Input */}
              <div className="relative flex-1 group">
                <div className="relative transform transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm 
                      bg-blue-100 dark:bg-blue-900/30
                      rounded-xl border border-gray-200 dark:border-slate-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
                      focus:border-blue-500/30 dark:focus:border-blue-400/30
                      placeholder-gray-400 dark:placeholder-gray-500
                      text-gray-900 dark:text-gray-100
                      transition-all duration-200 group-hover:shadow-md"
                  />
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 
                    transition-colors duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                        hover:bg-gray-100 dark:hover:bg-slate-700
                        text-gray-400 dark:text-gray-500 
                        hover:text-gray-600 dark:hover:text-gray-300
                        transition-all duration-200 hover:rotate-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="absolute right-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {filteredTracks.length} results found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Grid */}
      {filteredTracks?.length > 0 && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto px-1 py-2
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4
              scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 
              scrollbar-track-transparent"
          >
            {filteredTracks.map((track, index) => (
              <Draggable key={track.id} draggableId={track.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onSelectTrack(track.id)}
                    className={`
                      group relative p-4 rounded-xl cursor-pointer
                      transform transition-all duration-300 ease-out
                      hover:scale-[1.02] hover:-translate-y-1
                      ${
                        track.id === selectedTrackId
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400"
                          : "bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-slate-800/60 dark:hover:to-blue-800/40"
                      }
                      before:absolute before:inset-0 before:rounded-xl before:shadow-md
                      before:transition-all before:duration-300
                      hover:before:shadow-lg hover:before:shadow-blue-100/30 dark:hover:before:shadow-blue-500/20
                      motion-safe:animate-fadeIn
                    `}
                    style={{
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-blue-100/10 to-purple-100/20 
                      dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-purple-400/5
                      backdrop-blur-sm opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 shadow-lg" />

                    {/* Content Container */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate
                            group-hover:text-blue-700 transition-colors duration-200">
                            {track.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                            {formatDateTime(track.startDate)} - {formatDateTime(track.endDate)}
                          </div>
                        </div>

                        {/* Settings Button with Enhanced Animation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlyoverState({
                              isOpen: true,
                              type: "track-settings",
                              data: {
                                track,
                                onDelete: () => onDeleteTrack(track.id)
                              },
                            });
                          }}
                          className="ml-2 p-2 rounded-lg bg-transparent
                            hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200
                            transform group-hover:rotate-180
                            opacity-50 group-hover:opacity-100"
                        >
                          <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      </div>

                      {/* Track Stats */}
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700
                        grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 dark:bg-violet-500" />
                          <span>{track.sections.length} Sections</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500" />
                          <span>
                            {track.sections.reduce((acc, section) => 
                              acc + (section.speaker ? 1 : 0), 0)} Speakers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}