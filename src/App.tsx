import { useState, lazy, Suspense, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Calendar, Settings, Layout, Database, Sprout } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { showToast } from "./components/Modal/CustomToast";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import DataSeedingPage from "./components/DataSeeding/DataSeedingPage";
import { Track } from "./types/tracks";
import { FlyoverState, TableHeader } from "./types/ui";
import { Section, SectionManagementItem } from "./types/sections";
import { DataManagementItem, DataManagementState, GuestManagementItem, RoleManagementItem, SpeakerManagementItem } from "./types/management";
const TrackList = lazy(() => import("./components/Track/TrackList"));
const SectionList = lazy(() => import("./components/Section/SectionList"));
const FlyoverPanel = lazy(() => import("./components/Modal/FlyoverPanel"));
const DataManagementPage = lazy(
  () => import("./components/DataManagement/DataManagementPage")
);

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
  const [managementData, setManagementData] = useState<DataManagementState>({
    speakers: [],
    roles: [],
    sectionstypes: [],
    guests: []
  });

  const sectionTypes: SectionManagementItem[] = [
    { id: '1', name: 'Regular Section', sectionType: 'regular', type: 'sectionstypes' },
    { id: '2', name: 'Lunch Break', sectionType: 'lunch', type: 'sectionstypes' },
    { id: '3', name: 'Break', sectionType: 'break', type: 'sectionstypes' }
  ];

  const headers: TableHeader[] = [
    { id: "1", type: "indicator", label: "Level", isVisible: true },
    { id: "2", type: "time", label: "Time", isVisible: true },
    { id: "3", type: "name", label: "Name", isVisible: true },
    { id: "4", type: "speaker", label: "Speaker", isVisible: true },
    { id: "5", type: "role", label: "Role", isVisible: true },
    { id: "6", type: "actions", label: "Actions", isVisible: true },
  ] as const;
  
  const navigationItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "data", label: "Data Management", icon: Database },
    { id: "seeding", label: "Data Seeding", icon: Sprout },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleAddTrack = (
    trackData: Partial<Track>,
    silent: boolean = false
  ): boolean => {
    try {
      const newTrack: Track = {
        id: crypto.randomUUID(),
        name: trackData.name || "",
        startDate: trackData.startDate || new Date().toISOString(),
        endDate: trackData.endDate || new Date().toISOString(),
        sections: trackData.sections || [],
      };
      setTracks((prev) => [...prev, newTrack]);
      if (!silent) {
        showToast.success("Track added successfully");
      }
      return true;
    } catch (error) {
      if (!silent) {
        showToast.error("Failed to create track");
      }
      return false;
    }
  };

  const handleUpdateTrack = (
    trackData: Partial<Track>,
    silent: boolean = false
  ): boolean => {
    try {
      setTracks((prev) =>
        prev.map((track) =>
          track.id === trackData.id ? { ...track, ...trackData } : track
        )
      );
      if (!silent) {
        showToast.success("Track updated successfully");
      }
      return true;
    } catch (error) {
      if (!silent) {
        showToast.error("Failed to update track");
      }
      return false;
    }
  };

  const handleDeleteTrack = (trackId: string, silent: boolean = false) => {
    try {
      if (selectedTrackId === trackId) {
        const remainingTracks = tracks.filter((track) => track.id !== trackId);
        if (remainingTracks.length > 0) {
          setSelectedTrackId(remainingTracks[0].id);
        } else {
          setSelectedTrackId(null);
        }
      }

      setTracks((prev) => prev.filter((track) => track.id !== trackId));
      if (!silent) {
        showToast.success("Track deleted successfully");
      }
    } catch (error) {
      if (!silent) {
        showToast.error("Failed to delete track");
      }
    }
  };

  const handleAddSection = (trackId: string, sectionData: Partial<Section>) => {
    try {
      setTracks((prev) =>
        prev.map((track) => {
          if (track.id !== trackId) return track;

          const hideFields = (() => {
            switch (sectionData.sectionTypeId) {
              case "break":
              case "lunch":
                return { speaker: true, role: true };
              default:
                return undefined;
            }
          })();

          const newSection: Section = {
            id: crypto.randomUUID(),
            name: sectionData.name || `Section ${track.sections.length + 1}`,
            timeSlot: sectionData.timeSlot || { start: "09:00", end: "10:00" },
            speaker: sectionData.speaker || "",
            role: sectionData.role || "",
            sectionTypeId: sectionData.sectionTypeId || "program",
            hideFields,
            subsections: [],
            mergedFields: {
              speaker: {
                isMerged: false,
                color: "",
                mergeId: "",
                mergeName: "",
                value: null,
              },
              role: {
                isMerged: false,
                color: "",
                mergeId: "",
                mergeName: "",
                value: null,
              },
              timeSlot: {
                isMerged: false,
                color: "",
                mergeId: "",
                mergeName: "",
                value: null,
              },
            },
          };

          return { ...track, sections: [...track.sections, newSection] };
        })
      );
    } catch (error) {
      showToast.error("Failed to add section");
    }
  };

  const createNewSubsection = (
    parentSection: Section,
    sectionData: Partial<Section>
  ): Section => {
    // Calculate default time slot based on parent's time slot
    const defaultTimeSlot = (() => {
      const parentStart = parentSection.timeSlot.start;
      const parentEnd = parentSection.timeSlot.end;
      
      // If parent has no subsections, split parent's time in half
      if (!parentSection.subsections.length) {
        const [startHours, startMinutes] = parentStart.split(':').map(Number);
        const [endHours, endMinutes] = parentEnd.split(':').map(Number);
        
        const totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        const halfPoint = startHours * 60 + startMinutes + Math.floor(totalMinutes / 2);
        
        const midHours = Math.floor(halfPoint / 60);
        const midMinutes = halfPoint % 60;
        
        const midTime = `${midHours.toString().padStart(2, '0')}:${midMinutes.toString().padStart(2, '0')}`;
        
        return { start: parentStart, end: midTime };
      }
      
      // If parent has subsections, place new subsection after the last one
      const lastSubsection = parentSection.subsections[parentSection.subsections.length - 1];
      return { start: lastSubsection.timeSlot.end, end: parentEnd };
    })();

    return {
      id: crypto.randomUUID(),
      name: sectionData.name || `Subsection ${parentSection.subsections.length + 1}`,
      timeSlot: sectionData.timeSlot || defaultTimeSlot,
      speaker: sectionData.speaker || parentSection.speaker,
      role: sectionData.role || parentSection.role,
      sectionTypeId: sectionData.sectionTypeId || parentSection.sectionTypeId,
      subsections: [],
      mergedFields: {
        speaker: {
          isMerged: false,
          color: "",
          mergeId: "",
          mergeName: "",
          value: null,
        },
        role: {
          isMerged: false,
          color: "",
          mergeId: "",
          mergeName: "",
          value: null,
        },
        timeSlot: {
          isMerged: false,
          color: "",
          mergeId: "",
          mergeName: "",
          value: null,
        },
      },
    };
  };

  const handleSubmitSection = (sectionData: Partial<Section>) => {
    if (!selectedTrackId) return;

    try {
      // Handle section update
      if (sectionData.id) {
        handleUpdateSection(sectionData.id, sectionData);
        showToast.success("Section updated successfully");
        return;
      }

      // Handle new subsection
      if (flyoverState.type === "add-subsection" && flyoverState.data?.parentId) {
        setTracks((prev) =>
          prev.map((track) => {
            if (track.id !== selectedTrackId) return track;

            const addSubsectionToSection = (sections: Section[]): Section[] => {
              return sections.map((section) => {
                // Only add subsection to the target parent
                if (section.id === flyoverState.data.parentId) {
                  const newSubsection = createNewSubsection(section, sectionData);
                  return {
                    ...section,
                    subsections: [...section.subsections, newSubsection],
                  };
                }

                // If this section has subsections, recursively check them
                if (section.subsections?.length > 0) {
                  return {
                    ...section,
                    subsections: addSubsectionToSection(section.subsections),
                  };
                }

                // Return unmodified section if no match
                return section;
              });
            };

            return {
              ...track,
              sections: addSubsectionToSection(track.sections),
            };
          })
        );
        showToast.success("Subsection added successfully");
      } else {
        // Handle new top-level section
        handleAddSection(selectedTrackId, sectionData);
      }
    } catch (error) {
      showToast.error("Failed to save section");
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

    try {
      setTracks((prev) => {
        const newTracks = prev.map((track) => {
          if (track.id !== selectedTrackId) return track;

          const updateSectionRecursively = (
            sections: Section[],
            targetId: string,
            updates: Partial<Section>
          ): Section[] => {
            // If we're deleting, filter out the target section
            if (updates.deleted) {
              return sections.filter(section => {
                // If this is the section to delete, return false to remove it
                if (section.id === targetId) {
                  return false;
                }
                // If this section has subsections, recursively filter them
                if (section.subsections?.length) {
                  section.subsections = updateSectionRecursively(
                    section.subsections,
                    targetId,
                    updates
                  );
                }
                return true;
              });
            }

            // If not deleting, proceed with normal updates
            return sections.map((section) => {
              if (section.id === targetId) {
                const updatedTimeSlot = updates.timeSlot
                  ? { ...section.timeSlot, ...updates.timeSlot }
                  : section.timeSlot;

                const updatedSection = {
                  ...section,
                  ...updates,
                  timeSlot: updatedTimeSlot,
                  subsections: updates.subsections || section.subsections || [],
                  mergedFields: {
                    ...section.mergedFields,
                    ...(updates.mergedFields || {}),
                  },
                };
                return updatedSection;
              }

              if (section.subsections?.length) {
                const updatedSubsections = updateSectionRecursively(
                  section.subsections,
                  targetId,
                  updates
                );

                if (
                  updates.timeSlot ||
                  updatedSubsections !== section.subsections
                ) {
                  return {
                    ...section,
                    subsections: updatedSubsections,
                  };
                }
              }

              return section;
            });
          };

          const updatedSections = updateSectionRecursively(
            track.sections,
            sectionId,
            updates
          );

          return {
            ...track,
            sections: updatedSections,
          };
        });

        return newTracks;
      });

      if (updates.deleted) {
        showToast.success("Section deleted successfully");
      }
    } catch (error) {
      showToast.error("Failed to update section");
      console.error("Error updating section:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

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
      case "edit-section":
        return "Edit Section";
      case "add-subsection":
        return "Add New Subsection";
      case "edit-subsection":
        return "Edit Subsection";
      case "add-section-type":
        return "Add New Section Type";
      case "edit-section-type":
        return "Edit Section Type";
      case "add-speaker":
        return "Add New Speaker";
      case "edit-speaker":
        return "Edit Speaker";
      case "add-role":
        return "Add New Role";
      case "edit-role":
        return "Edit Role";
      case "add-guest":
        return "Add New Guest";
      case "edit-guest":
        return "Edit Guest";
      default:
        return "Details";
    }
  };

  const handleAddManagementItem = (
    type: string,
    item: Partial<DataManagementItem>
  ) => {
    const baseItem = {
      id: crypto.randomUUID(),
      name: item.name || "",
      type:
        type === "guests"
          ? "guest"
          : (type.slice(0, -1) as
              | "section"
              | "speaker"
              | "role"
              | "sectionstypes"),
      color: item.color,
      description: item.description,
    };

    let newItem;
    switch (type) {
      case "sections":
        newItem = {
          ...baseItem,
          sectionType: (item as SectionManagementItem).sectionType || "program",
          maxParticipants: (item as SectionManagementItem).maxParticipants,
          location: (item as SectionManagementItem).location,
          timeSlot: (item as SectionManagementItem).timeSlot,
        };
        break;
      case "speakers":
        newItem = {
          ...baseItem,
          email: (item as SpeakerManagementItem).email,
          phone: (item as SpeakerManagementItem).phone,
          organization: (item as SpeakerManagementItem).organization,
          expertise: (item as SpeakerManagementItem).expertise || [],
          availability: (item as SpeakerManagementItem).availability || [],
          bio: (item as SpeakerManagementItem).bio,
        };
        break;
      case "roles":
        newItem = {
          ...baseItem,
          responsibilities: (item as RoleManagementItem).responsibilities || [],
          requirements: (item as RoleManagementItem).requirements || [],
          level: (item as RoleManagementItem).level || "mid",
          department: (item as RoleManagementItem).department,
        };
        break;
      case "guests":
        newItem = {
          ...baseItem,
          type: "guest",
          email: (item as GuestManagementItem).email,
          phone: (item as GuestManagementItem).phone,
          organization: (item as GuestManagementItem).organization,
          invitationStatus:
            (item as GuestManagementItem).invitationStatus || "pending",
          dietaryRestrictions:
            (item as GuestManagementItem).dietaryRestrictions || [],
          notes: (item as GuestManagementItem).notes,
          accessLevel: (item as GuestManagementItem).accessLevel || "standard",
        };
        break;
      default:
        newItem = baseItem;
    }

    setManagementData((prev) => ({
      ...prev,
      [type]: [...prev[type as keyof DataManagementState], newItem],
    }));
  };

  const handleUpdateManagementItem = (
    type: string,
    id: string,
    updates: Partial<DataManagementItem>
  ) => {
    setManagementData((prev) => ({
      ...prev,
      [type]: prev[type as keyof DataManagementState].map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const handleDeleteManagementItem = (type: string, id: string) => {
    setManagementData((prev) => ({
      ...prev,
      [type]: prev[type as keyof DataManagementState].filter(
        (item) => item.id !== id
      ),
    }));
  };

  useEffect(() => {
    console.clear();
    console.log(tracks);
  }, [tracks]);

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
                        onDeleteTrack={handleDeleteTrack}
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
                          sectionTypes={sectionTypes}
                          headers={headers}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            )}
            {activeTab === "data" && (
              <DataManagementPage
                setFlyoverState={setFlyoverState}
                onAddItem={handleAddManagementItem}
                onUpdateItem={handleUpdateManagementItem}
                onDeleteItem={handleDeleteManagementItem}
                data={managementData}
              />
            )}
            {activeTab === "seeding" && (
              <DataSeedingPage
                onAddItem={handleAddManagementItem}
                onDeleteItem={handleDeleteManagementItem}
                onAddTrack={handleAddTrack}
                onDeleteTrack={handleDeleteTrack}
                data={{
                  ...managementData,
                  tracks: tracks,
                }}
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
          handleAddManagementItem={handleAddManagementItem}
          handleUpdateManagementItem={handleUpdateManagementItem}
          tracks={tracks}
          managementData={managementData}
        />
      </DashboardLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "transparent",
            padding: "12px",
            margin: "0px",
            boxShadow: "none",
            maxWidth: "420px",
          },
        }}
      />
    </DragDropContext>
  );
}

export default App;
