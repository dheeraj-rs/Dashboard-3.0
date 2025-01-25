import TrackForm from "../Track/TrackForm";
import SectionForm from "../Section/SectionForm";
import { X } from "lucide-react";
import TrackSettingsPanel from "../Track/TrackSettingsPanel";
import HeaderSettingsModal from './HeaderSettingsModal';
import { DataManagementForms } from '../DataManagement/Forms';
import { GuestManagementItem, RoleManagementItem, SpeakerManagementItem } from "../../types/management";
import { SectionManagementItem } from "../../types/sections";
import { FlyoverPanelProps } from "../../types/common";

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
      {/* Exploding Glass Effect Backdrop */}
      <div 
        className={`fixed inset-0 transition-all duration-500 z-[89]
          perspective-[2000px] overflow-hidden
          ${flyoverState.isOpen 
            ? 'opacity-90 backdrop-blur-[2px] backdrop-filter backdrop-saturate-150'
            : 'opacity-0 pointer-events-none'
          }
        `}
        onClick={() => setFlyoverState({ isOpen: false, type: null, data: null })}
      >
        {/* Enhanced Base Glass Layer with Shadow */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-black/5 via-black/1 to-transparent
            backdrop-blur-[8px] transition-all duration-700 transform-gpu
            shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]
            ${flyoverState.isOpen ? 'scale-100 opacity-100' : 'scale-125 rotate-12 opacity-0'}
          `}
        />

        {/* Improved Exploding Glass Shards */}
        <div 
          className={`absolute inset-0 grid grid-cols-5 grid-rows-5
            transform-gpu transition-all duration-1000
            ${flyoverState.isOpen ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}
          `}
        >
          {[...Array(25)].map((_, i) => {
            const randomX = (Math.random() - 0.5) * 300;
            const randomY = (Math.random() - 0.5) * 300;
            const randomRotate = (Math.random() - 0.5) * 360;
            const randomScale = 0.3 + Math.random() * 0.7;
            
            return (
              <div
                key={i}
                className={`relative overflow-hidden backdrop-blur-[6px]
                  before:absolute before:inset-0 
                  before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-black/10
                  after:absolute after:inset-0 
                  after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]
                  transition-all duration-700 ease-out
                  transform-gpu origin-center
                  hover:z-10 hover:scale-110 hover:rotate-0
                  group cursor-pointer
                  shadow-[0_0_15px_rgba(255,255,255,0.1)]
                  hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]
                  hover:bg-gradient-to-br hover:from-white/30 hover:to-blue-200/30
                  hover:backdrop-blur-[12px]
                  active:scale-95
                `}
                style={{
                  transitionDelay: `${i * 40}ms`,
                  transform: flyoverState.isOpen 
                    ? 'translate(0, 0) rotate(0) scale(1)'
                    : `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`,
                  opacity: flyoverState.isOpen ? 1 : 0,
                  transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Enhanced Shard Shine Effect with better hover timing */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-tr from-white/40 via-blue-200/30 to-transparent
                    transition-all duration-300 transform rotate-45 
                    group-hover:rotate-90 group-hover:scale-125
                    ${flyoverState.isOpen ? 'scale-100' : 'scale-0'}
                  `}
                />
                
                {/* Enhanced Inner Glow Effect with faster response */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_60%)]
                    after:absolute after:inset-0 
                    after:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]
                    before:absolute before:inset-0
                    before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_80%)]
                    transition-all duration-300
                    group-hover:scale-125 group-hover:rotate-90
                  `}
                />

                {/* Improved Shimmer Animation with shorter duration */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-transparent via-blue-100/40 to-transparent
                    -translate-x-full group-hover:translate-x-full
                    transition-all duration-700 ease-in-out
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>

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
                    currentStyles={flyoverState.data.currentStyles}
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