import { useState, useRef, useEffect } from "react";
import { PlusCircle, Users, Clock, Search, Layers, Settings, X } from "lucide-react";
import { Section, Track, TrackListProps } from "../../types/scheduler";
import { Draggable } from "react-beautiful-dnd";

export default function TrackList({
  tracks,
  onSelectTrack,
  selectedTrackId,
  setFlyoverState,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set first track as active by default
  useEffect(() => {
    if (tracks.length > 0 && !selectedTrackId) {
      onSelectTrack(tracks[0].id);
    }
  }, [tracks, selectedTrackId, onSelectTrack]);

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSections = tracks.reduce(
    (acc, track) => acc + track.sections.length,
    0
  );

  const totalParticipants: number = tracks.reduce(
    (acc: number, track: Track) =>
      acc +
      track.sections.reduce(
        (sum: number, section: Section) => sum + (section.speaker ? 1 : 0),
        0
      ),
    0
  );

  const getTrackColor = (track: any, index: number) => {
    if (track.id === selectedTrackId) {
      return "bg-blue-600 text-white ring-2 ring-blue-500";
    }
    const colors = [
      "bg-purple-500/10 text-purple-600",
      "bg-green-500/10 text-green-600",
      "bg-orange-500/10 text-orange-600",
    ];
    return colors[index % colors.length];
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="relative bg-white rounded-lg shadow-sm">
  {/* Header Section */}
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-4 border border-gray-100">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Tracks Heading */}
      <div className="text-xl font-bold text-blue-700 flex-shrink-0">
        Tracks
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
        {/* Tracks Stat */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
          <Layers className="w-4 h-4 text-blue-600" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">{tracks.length}</span> Tracks
          </div>
        </div>

        {/* Sections Stat */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
          <Clock className="w-4 h-4 text-purple-600" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">{totalSections}</span> Sections
          </div>
        </div>

        {/* Participants Stat */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
          <Users className="w-4 h-4 text-green-600" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">{totalParticipants}</span> Participants
          </div>
        </div>
      </div>

      {/* Search and New Track Button */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Track Button */}
        <button
          onClick={() =>
            setFlyoverState({
              isOpen: true,
              type: "add-track",
              data: {
                name: "",
                startDate: new Date().toISOString(), // Default to current date and time
                endDate: new Date().toISOString(), // Default to current date and time
              },
            })
          }
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Track</span>
        </button>
      </div>
    </div>
  </div>
</div>

        {/* Track List with Scroll Buttons */}
        {filteredTracks?.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap overflow-x-auto scrollbar-hide py-3 px-4 gap-4 min-h-[90px]"
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
                      flex-none w-full sm:w-72 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        track.id === selectedTrackId
                          ? "bg-gradient-to-r from-blue-500/10 to-blue-400/5 border-l-4 border-blue-500 shadow-md transform scale-105"
                          : "bg-white border border-gray-200 hover:border-blue-200 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              p-2 rounded-lg transition-all duration-200
                              ${
                                track.id === selectedTrackId
                                  ? "bg-blue-500 text-white"
                                  : `${getTrackColor(track, index)}`
                              }
                            `}
                          >
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`
                                text-sm font-medium truncate max-w-[120px]
                                ${
                                  track.id === selectedTrackId
                                    ? "text-blue-700"
                                    : "text-gray-900"
                                }
                              `}
                            >
                              {track.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(track.startDate)} - {formatDateTime(track.endDate)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlyoverState({
                              isOpen: true,
                              type: "edit-track",
                              data: track,
                            });
                          }}
                          className={`
                            p-1.5 rounded-md transition-colors
                            ${
                              track.id === selectedTrackId
                                ? "text-blue-600 hover:bg-blue-100"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}