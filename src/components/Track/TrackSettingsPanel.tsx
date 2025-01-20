import { TrackSettingsPanelProps } from '../../types/scheduler';
import { Pencil, Trash2, Calendar, Clock, Layers, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import TrackForm from './TrackForm';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';

export default function TrackSettingsPanel({ 
  track, 
  onDelete,
  setFlyoverState,
  handleUpdateTrack,
  tracks
}: TrackSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>
        <TrackForm
          initialData={track}
          tracks={tracks}
          onSubmit={(trackData) => {
            handleUpdateTrack(trackData);
            setIsEditing(false);
            return true;
          }}
        />
      </div>
    );
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Track Icon and Name */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{track.name}</h3>
            <p className="text-sm text-gray-500">Track Details</p>
          </div>
        </div>

        {/* Track Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Start Date */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(track.startDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* End Date */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(track.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sections Count */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sections</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {track.sections.length} sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
              bg-white border border-gray-200 rounded-lg text-gray-700 
              hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Track</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
              bg-red-50 border border-red-100 rounded-lg text-red-600
              hover:bg-red-100 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Track</span>
          </button>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete();
          setFlyoverState({ isOpen: false, type: null, data: null });
        }}
        title="Delete Track"
        message={`Are you sure you want to delete "${track.name}"? This action cannot be undone.`}
      />
    </>
  );
} 