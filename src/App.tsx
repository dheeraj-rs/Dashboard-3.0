import { useState, lazy, Suspense, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Track, Section, FlyoverState } from "./types/scheduler";
import ErrorBoundary from "./components/ErrorBoundary";
import { Calendar, Users, Settings, Layout } from "lucide-react";
import DashboardLayout from "./layouts/DashboardLayout";

const TrackList = lazy(() => import("./components/Track/TrackList"));
const SectionList = lazy(() => import("./components/Section/SectionList"));
import FlyoverPanel from "./components/Modal/FlyoverPanel";
import ParticipantsPage from "./components/Participants/ParticipantsPage";

function App() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [flyoverState, setFlyoverState] = useState<FlyoverState>({
    isOpen: false,
    type: "",
    data: null,
  });

  useEffect(() => {
    console.log(tracks);
  }, [tracks]);

  const [participants, setParticipants] = useState<Participant[]>([]);

  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "participants", label: "Participants", icon: Users },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleAddTrack = (trackData: Partial<Track>) => {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: trackData.name || `Track ${tracks.length + 1}`,
      startDate: trackData.startDate || new Date().toISOString(), // Default to current date and time
      endDate: trackData.endDate || new Date().toISOString(), // Default to current date and time
      sections: [],
    };
    setTracks((prev) => [...prev, newTrack]);
    setSelectedTrackId(newTrack.id);
  };

  const handleAddSection = (trackId: string, sectionData: Partial<Section>) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id !== trackId) return track;

        const newSection: Section = {
          id: crypto.randomUUID(),
          name: sectionData.name || `Section ${track.sections.length + 1}`,
          timeSlot: sectionData.timeSlot || { start: "09:00", end: "10:00" },
          speaker: sectionData.speaker || "",
          role: sectionData.role || "",
          subsections: [],
          mergedFields: {
            speaker: false,
            role: false,
            timeSlot: false,
          },
        };

        return { ...track, sections: [...track.sections, newSection] };
      })
    );
  };

  const createNewSubsection = (
    parentSection: Section,
    sectionData: Partial<Section>
  ): Section => {
    return {
      id: `subsection-${Date.now()}`,
      name:
        sectionData.name ||
        `Subsection ${parentSection.subsections.length + 1}`,
      timeSlot: sectionData.mergedFields?.timeSlot
        ? parentSection.timeSlot
        : sectionData.timeSlot || { start: "09:00", end: "10:00" },
      speaker: sectionData.mergedFields?.speaker
        ? parentSection.speaker
        : sectionData.speaker || "",
      role: sectionData.mergedFields?.role
        ? parentSection.role
        : sectionData.role || "",
      subsections: [],
      mergedFields: sectionData.mergedFields || {
        speaker: false,
        role: false,
        timeSlot: false,
      },
    };
  };

  const handleSubmitSection = (sectionData: Partial<Section>) => {
    if (!selectedTrackId) return;

    if (flyoverState.type === "add-subsection") {
      setTracks(
        tracks.map((track) => {
          if (track.id !== selectedTrackId) return track;

          const addSubsectionToSection = (sections: Section[]): Section[] => {
            return sections.map((section) => {
              if (section.id === flyoverState.data.parentId) {
                const newSubsection = createNewSubsection(section, sectionData);
                return {
                  ...section,
                  subsections: [...section.subsections, newSubsection],
                };
              }
              if (section.subsections.length > 0) {
                return {
                  ...section,
                  subsections: addSubsectionToSection(section.subsections),
                };
              }
              return section;
            });
          };

          return {
            ...track,
            sections: addSubsectionToSection(track.sections),
          };
        })
      );
    } else {
      handleAddSection(selectedTrackId, sectionData);
    }
  };

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<Section>
  ) => {
    if (!selectedTrackId) {
      console.warn("No track selected for update");
      return;
    }

    const updatedTracks = tracks.map((track) => {
      if (track.id === selectedTrackId) {
        const updateSectionRecursively = (
          sections: Section[],
          targetId: string,
          updates: Partial<Section>
        ): Section[] => {
          return sections
            .map((section) => {
              if (section.id === targetId) {
                return updates.deleted
                  ? null
                  : {
                      ...section,
                      ...updates,
                      subsections: section.subsections,
                      mergedFields: {
                        ...section.mergedFields,
                        ...updates.mergedFields,
                      },
                    };
              }

              if (section.subsections?.length) {
                const updatedSubsections = updateSectionRecursively(
                  section.subsections,
                  targetId,
                  updates
                );
                if (updatedSubsections !== section.subsections) {
                  return { ...section, subsections: updatedSubsections };
                }
              }
              return section;
            })
            .filter((section): section is Section => section !== null);
        };

        const updatedSections = updateSectionRecursively(
          track.sections,
          sectionId,
          updates
        );
        if (updatedSections === track.sections) {
          console.warn(`Section with ID ${sectionId} not found`);
        }

        return {
          ...track,
          sections: updatedSections,
        };
      }
      return track;
    });

    setTracks(updatedTracks);
  };

  const handleUpdateTrack = (updates: Partial<Track>) => {
    if (!updates.id) {
      console.warn("No track ID provided for update");
      return;
    }

    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === updates.id) {
          return {
            ...track,
            ...updates,
            sections: track.sections,
          };
        }
        return track;
      })
    );
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "track") {
      const newTracks = Array.from(tracks);
      const [removed] = newTracks.splice(source.index, 1);
      newTracks.splice(destination.index, 0, removed);
      setTracks(newTracks);
    } else if (type === "section") {
      const track = tracks.find((track) => track.id === source.droppableId);
      if (!track) return;

      const newSections = Array.from(track.sections);
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, removed);

      const newTracks = tracks.map((track) =>
        track.id === source.droppableId
          ? { ...track, sections: newSections }
          : track
      );
      setTracks(newTracks);
    }
  };

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId);

  const getFlyoverTitle = (type: string | null): string => {
    switch (type) {
      case "add-track":
        return "Add New Track";
      case "edit-track":
        return "Edit Track";
      case "add-section":
        return "Add New Section";
      case "add-subsection":
        return "Add Subsection";
      case "edit-section":
        return "Edit Section";
      case "add-participant":
        return "Add New Participant";
      case "edit-participant":
        return "Edit Participant";
      default:
        return "Details";
    }
  };

  const handleAddParticipant = (participantData: Partial<Participant>) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name: participantData.name || "",
      role: participantData.role || "",
      email: participantData.email || "",
      organization: participantData.organization || "",
      sessions: participantData.sessions || []
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const handleUpdateParticipant = (participantId: string, updates: Partial<Participant>) => {
    setParticipants(prev =>
      prev.map(participant =>
        participant.id === participantId
          ? { ...participant, ...updates }
          : participant
      )
    );
  };

  const handleDeleteParticipant = (participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DashboardLayout
        navigationItems={navigationItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
          {activeTab === "schedule" && (
  <div className="space-y-8">
    <Droppable droppableId="tracks" type="track">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <TrackList
            tracks={tracks}
            onSelectTrack={setSelectedTrackId}
            selectedTrackId={selectedTrackId}
            setFlyoverState={setFlyoverState}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    {selectedTrack && (
      <Droppable droppableId={selectedTrack.id} type="section">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <SectionList
              sections={selectedTrack.sections}
              onUpdateSection={handleUpdateSection}
              activeTrack={selectedTrack}
              setFlyoverState={setFlyoverState}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )}
  </div>
)}
{activeTab === "participants" && (
  <ParticipantsPage 
    setFlyoverState={setFlyoverState}
    participants={participants}
    onAddParticipant={handleAddParticipant}
    onUpdateParticipant={handleUpdateParticipant}
    onDeleteParticipant={handleDeleteParticipant}
  />
)}
          </Suspense>
        </ErrorBoundary>
        <FlyoverPanel
          flyoverState={flyoverState}
          getFlyoverTitle={getFlyoverTitle}
          setFlyoverState={setFlyoverState}
          handleUpdateTrack={handleUpdateTrack}
          handleAddTrack={handleAddTrack}
          handleUpdateSection={handleUpdateSection}
          handleSubmitSection={handleSubmitSection}
          handleAddParticipant={handleAddParticipant}
          handleUpdateParticipant={handleUpdateParticipant}
        />
      </DashboardLayout>
    </DragDropContext>
  );
}

export default App;