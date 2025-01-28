import { Pencil, Trash2, Calendar, Clock, Layers, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import TrackForm from './TrackForm';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';
import { TrackSettingsPanelProps } from '../../types/tracks';
import { Track } from '../../types/tracks';

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
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 
            hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </button>
        <TrackForm
          initialData={track}
          tracks={tracks}
          onSubmit={(trackData: Partial<Track>) => {
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
        <div className="flex items-center gap-3 p-4 rounded-xl relative group overflow-hidden
          bg-gradient-to-r from-blue-50 to-purple-50 
          dark:from-blue-900/20 dark:to-purple-900/20
          border border-blue-100/50 dark:border-blue-800/50">
          <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 relative">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{track.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track Details</p>
          </div>
          {/* Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-100/10 to-purple-100/20 
            dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-purple-400/5
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Track Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Start Date */}
            <div className="p-4 rounded-xl relative group overflow-hidden
              bg-white dark:bg-slate-900 
              border border-gray-100 dark:border-slate-800
              shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 relative z-10">
                <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(track.startDate)}
                  </p>
                </div>
              </div>
              {/* Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-100/10 to-transparent 
                dark:from-blue-400/5 dark:via-indigo-400/10 dark:to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* End Date - Similar structure to Start Date */}
            <div className="p-4 rounded-xl relative group overflow-hidden
              bg-white dark:bg-slate-900 
              border border-gray-100 dark:border-slate-800
              shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 relative z-10">
                <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(track.endDate)}
                  </p>
                </div>
              </div>
              {/* Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-purple-100/10 to-transparent 
                dark:from-purple-400/5 dark:via-indigo-400/10 dark:to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Sections Count - Similar structure */}
            <div className="p-4 rounded-xl relative group overflow-hidden
              bg-white dark:bg-slate-900 
              border border-gray-100 dark:border-slate-800
              shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 relative z-10">
                <Layers className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sections</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {track.sections.length} sections
                  </p>
                </div>
              </div>
              {/* Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-green-100/10 to-transparent 
                dark:from-green-400/5 dark:via-green-400/10 dark:to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-white dark:bg-slate-900 
              border border-gray-200 dark:border-slate-700 
              text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-slate-800 
              hover:border-blue-300 dark:hover:border-blue-600
              hover:shadow-md dark:hover:shadow-slate-800/50
              transition-all duration-200 group"
          >
            <Pencil className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Edit Track</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-red-50 dark:bg-red-900/20 
              border border-red-100 dark:border-red-800/50
              text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/30
              hover:shadow-md dark:hover:shadow-red-900/20
              transition-all duration-200 group"
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