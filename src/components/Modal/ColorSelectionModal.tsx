import  { useState } from 'react';
import Modal from './Modal';
import { Check } from 'lucide-react';

const colorOptions = [
  { name: 'Blue', class: 'bg-blue-100', hover: 'hover:bg-blue-200' },
  { name: 'Green', class: 'bg-green-100', hover: 'hover:bg-green-200' },
  { name: 'Purple', class: 'bg-purple-100', hover: 'hover:bg-purple-200' },
  { name: 'Orange', class: 'bg-orange-100', hover: 'hover:bg-orange-200' },
  { name: 'Pink', class: 'bg-pink-100', hover: 'hover:bg-pink-200' },
  { name: 'Yellow', class: 'bg-yellow-100', hover: 'hover:bg-yellow-200' },
  { name: 'Teal', class: 'bg-teal-100', hover: 'hover:bg-teal-200' },
  { name: 'Indigo', class: 'bg-indigo-100', hover: 'hover:bg-indigo-200' },
  { name: 'Red', class: 'bg-red-100', hover: 'hover:bg-red-200' },
] as const;

export interface ColorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (
    color: string, 
    mergeName: string, 
    mergeNameBehavior: 'replace' | 'append' | 'replace_current'
  ) => void;
}

export default function ColorSelectionModal({ isOpen, onClose, onApply }: ColorSelectionModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].class);
  const [mergeName, setMergeName] = useState('');
  const [mergeNameBehavior, setMergeNameBehavior] = useState<'replace' | 'append' | 'replace_current'>('replace');

  const handleApply = () => {
    onApply(selectedColor, mergeName, mergeNameBehavior);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Merge Color">
      <div className="space-y-4 bg-gradient-to-br from-slate-50/50 to-white p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merge Name
          </label>
          <input
            type="text"
            value={mergeName}
            onChange={(e) => setMergeName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter merge name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Merge Name Behavior
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={mergeNameBehavior === 'replace_current'}
                onChange={() => setMergeNameBehavior('replace_current')}
                className="text-indigo-600"
              />
              <span className="text-sm text-gray-700">Replace with current cell name</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={mergeNameBehavior === 'replace'}
                onChange={() => setMergeNameBehavior('replace')}
                className="text-indigo-600"
              />
              <span className="text-sm text-gray-700">Replace with new name</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={mergeNameBehavior === 'append'}
                onChange={() => setMergeNameBehavior('append')}
                className="text-indigo-600"
              />
              <span className="text-sm text-gray-700">Append to existing names</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Color
          </label>
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.class}
                onClick={() => setSelectedColor(color.class)}
                className={`
                  h-12 rounded-lg transition-all duration-200
                  ${color.class} ${color.hover}
                  ${selectedColor === color.class 
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' 
                    : 'ring-1 ring-gray-200'
                  }
                `}
              >
                {selectedColor === color.class && (
                  <Check className="w-5 h-5 mx-auto text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
} 