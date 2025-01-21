import TrackForm from "../Track/TrackForm";
import SectionForm from "../Section/SectionForm";
import { X } from "lucide-react";
import { FlyoverPanelProps, SpeakerManagementItem, RoleManagementItem, SectionManagementItem, GuestManagementItem } from '../../types/scheduler';
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
  handleAddManagementItem,
  handleUpdateManagementItem,
  tracks,
  managementData,
  showToast = { success: () => {}, error: () => {} },
}: FlyoverPanelProps) {
  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-[89] 
          ${flyoverState.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setFlyoverState({ isOpen: false, type: null, data: null })}
      />

      <aside
        className={`
          fixed inset-y-0 right-0 w-full max-w-96 bg-white/95 backdrop-blur-sm
          shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col
          transform transition-all duration-300 ease-out z-[90]
          ${flyoverState.isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {getFlyoverTitle(flyoverState.type)}
          </h2>
          <button
            onClick={() => setFlyoverState({ isOpen: false, type: null, data: null })}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section with Improved Scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="space-y-4">
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

              {(flyoverState.type === "add-guest" || 
                flyoverState.type === "edit-guest") && (
                <DataManagementForms.GuestForm
                  initialData={flyoverState.type === "edit-guest" ? flyoverState.data : undefined}
                  onSubmit={(formData: Partial<GuestManagementItem>) => {
                    if (flyoverState.type === "edit-guest") {
                      handleUpdateManagementItem('guests', flyoverState.data.id, formData);
                    } else {
                      handleAddManagementItem('guests', formData);
                    }
                    setFlyoverState({ isOpen: false, type: null, data: null });
                  }}
                />
              )}
            </div>
          </div>

          {/* Footer - Always visible */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-t border-gray-200">
            <button
              onClick={() => setFlyoverState({ isOpen: false, type: null, data: null })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 
                hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 
                shadow-sm hover:shadow active:scale-95"
            >
              Cancel
            </button>
            {/* <button
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 
                rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 
                shadow-sm hover:shadow-md active:scale-95"
            >
              Save Changes
            </button> */}
          </div>
        </div>
      </aside>
    </>
  );
}

export default FlyoverPanel;