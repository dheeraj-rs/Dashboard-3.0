import TrackForm from "../Track/TrackForm";
import SectionForm from "../Section/SectionForm";
import { X } from "lucide-react";
import { FlyoverPanelProps, SpeakerManagementItem, RoleManagementItem, SectionManagementItem } from '../../types/scheduler';
import ParticipantForm from "../Participants/ParticipantForm";
import TrackSettingsPanel from "../Track/TrackSettingsPanel";
import HeaderSettingsModal from './HeaderSettingsModal';
import { DataManagementForms } from '../DataManagement/Forms';

function FlyoverPanel({
  flyoverState,
  getFlyoverTitle,
  setFlyoverState,
  handleUpdateTrack,
  handleAddTrack,
  handleSubmitSection,
  handleAddParticipant,
  handleUpdateParticipant,
  handleAddManagementItem,
  handleUpdateManagementItem,
  tracks,
  managementData,
  showToast = { success: () => {}, error: () => {} },
}: FlyoverPanelProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 right-0 w-full max-w-96 bg-white shadow-2xl 
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
                : undefined
            }
            tracks={tracks}
            onSubmit={(trackData) => {
              try {
                if (flyoverState.type === "edit-track") {
                  handleUpdateTrack(trackData);
                } else {
                  const success = handleAddTrack(trackData);
                  if (!success) {
                    showToast.error("Failed to create track");
                    return false;
                  }
                }
                setFlyoverState({ isOpen: false, type: null, data: null });
                showToast.success(
                  flyoverState.type === "edit-track"
                    ? "Track updated successfully"
                    : "Track created successfully"
                );
                return true;
              } catch (error) {
                console.error('Error handling track:', error);
                showToast.error("An error occurred");
                return false;
              }
            }}
          />
        )}

        {(flyoverState.type === "add-section" ||
          flyoverState.type === "edit-section" ||
          flyoverState.type === "add-subsection" ||
          flyoverState.type === "edit-subsection") && (
          <SectionForm
            initialData={
              (flyoverState.type === "edit-section" || flyoverState.type === "edit-subsection") 
                ? flyoverState.data 
                : undefined
            }
            isSubsection={
              flyoverState.type === "add-subsection" || 
              flyoverState.type === "edit-subsection"
            }
            onSubmit={(formData) => {
              handleSubmitSection(formData);
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
            sectionTypes={managementData.sectionstypes}
            speakers={managementData.speakers}
            roles={managementData.roles}
            setFlyoverState={setFlyoverState}
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
        
        {flyoverState.type === "track-settings" && (
          <TrackSettingsPanel
            track={flyoverState.data.track}
            onDelete={flyoverState.data.onDelete}
            setFlyoverState={setFlyoverState}
            handleUpdateTrack={handleUpdateTrack}
            tracks={tracks}
          />
        )}

        {flyoverState.type === "header-settings" && (
          <div className="h-full">
            <HeaderSettingsModal
              isOpen={true}
              onClose={() => setFlyoverState({ isOpen: false, type: null, data: null })}
              headers={flyoverState.data.headers}
              onUpdateHeaders={flyoverState.data.onUpdateHeaders}
              onApplyStyles={flyoverState.data.onApplyStyles}
            />
          </div>
        )}

        {(flyoverState.type === "add-speaker" || 
          flyoverState.type === "edit-speaker") && (
          <DataManagementForms.SpeakerForm
            initialData={flyoverState.type === "edit-speaker" ? flyoverState.data : undefined}
            onSubmit={(formData: Partial<SpeakerManagementItem>) => {
              if (flyoverState.type === "edit-speaker") {
                handleUpdateManagementItem('speakers', flyoverState.data.id, formData);
              } else {
                handleAddManagementItem('speakers', formData);
              }
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
          />
        )}

        {(flyoverState.type === "add-role" || 
          flyoverState.type === "edit-role") && (
          <DataManagementForms.RoleForm
            initialData={flyoverState.type === "edit-role" ? flyoverState.data : undefined}
            onSubmit={(formData: Partial<RoleManagementItem>) => {
              if (flyoverState.type === "edit-role") {
                handleUpdateManagementItem('roles', flyoverState.data.id, formData);
              } else {
                handleAddManagementItem('roles', formData);
              }
              setFlyoverState({ isOpen: false, type: null, data: null });
            }}
          />
        )}

        {(flyoverState.type === "add-section-type" || 
          flyoverState.type === "edit-section-type") && (
          <DataManagementForms.SectionTypeForm
            initialData={flyoverState.type === "edit-section-type" ? flyoverState.data : undefined}
            onSubmit={(formData: Partial<SectionManagementItem>) => {
              if (flyoverState.type === "edit-section-type") {
                handleUpdateManagementItem('sectionstypes', flyoverState.data.id, formData);
              } else {
                handleAddManagementItem('sectionstypes', formData);
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