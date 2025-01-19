import TrackForm from "../Track/TrackForm";
import SectionForm from "../Section/SectionForm";
import { X } from "lucide-react";
import { FlyoverPanelProps } from '../../types/scheduler';
import ParticipantForm from "../Participants/ParticipantForm";

function FlyoverPanel({
  flyoverState,
  getFlyoverTitle,
  setFlyoverState,
  handleUpdateTrack,
  handleAddTrack,
  handleUpdateSection,
  handleSubmitSection,
  handleAddParticipant,
  handleUpdateParticipant,
}: FlyoverPanelProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out z-[90]
        ${flyoverState.isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="h-16 flex items-center justify-between px-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {getFlyoverTitle(flyoverState.type)}
        </h2>
        <button
          onClick={() =>
            setFlyoverState({ isOpen: false, type: null, data: null })
          }
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
        {(flyoverState.type === "add-track" ||
          flyoverState.type === "edit-track") && (
          <TrackForm
            initialData={
              flyoverState.type === "edit-track"
                ? flyoverState.data
                : undefined // No initialData for adding a new track
            }
            onSubmit={(trackData) => {
              if (flyoverState.type === "edit-track") {
                handleUpdateTrack(trackData);
              } else {
                handleAddTrack(trackData);
              }
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
          />
        )}

        {(flyoverState.type === "add-section" ||
          flyoverState.type === "edit-section" ||
          flyoverState.type === "add-subsection") && (
          <SectionForm
            initialData={
              flyoverState.type === "edit-section"
                ? flyoverState.data
                : undefined
            }
            isSubsection={flyoverState.type === "add-subsection"}
            onSubmit={(sectionData) => {
              if (flyoverState.type === "edit-section") {
                handleUpdateSection(flyoverState.data.id, {
                  ...sectionData,
                  subsections: flyoverState.data.subsections,
                });
              } else if (flyoverState.type === "add-subsection") {
                handleSubmitSection(sectionData);
              } else {
                handleSubmitSection(sectionData);
              }
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
          />
        )}

        {(flyoverState.type === "add-participant" || flyoverState.type === "edit-participant") && (
          <ParticipantForm
            initialData={flyoverState.type === "edit-participant" ? flyoverState.data : undefined}
            onSubmit={(participantData) => {
              if (flyoverState.type === "edit-participant") {
                handleUpdateParticipant(flyoverState.data.id, participantData);
              } else {
                handleAddParticipant(participantData);
              }
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
          />
        )}
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-end px-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
        <button
          onClick={() =>
            setFlyoverState({ isOpen: false, type: null, data: null })
          }
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </aside>
  );
}

export default FlyoverPanel;