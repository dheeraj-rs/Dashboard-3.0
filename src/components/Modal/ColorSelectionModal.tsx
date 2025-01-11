import  { useState } from 'react';
import Modal from './Modal';
import { ColorSelectionModalProps } from '../../types/scheduler';

const colorOptions = [
  { name: 'Blue', class: 'bg-blue-100' },
  { name: 'Green', class: 'bg-green-100' },
  { name: 'Purple', class: 'bg-purple-100' },
  { name: 'Orange', class: 'bg-orange-100' },
  { name: 'Pink', class: 'bg-pink-100' },
] as const;

type ColorClass = typeof colorOptions[number]['class'];

export default function ColorSelectionModal({ isOpen, onClose, onApply }: ColorSelectionModalProps) {
  const [selectedColor, setSelectedColor] = useState<ColorClass>(colorOptions[0].class);
  const [mergeName, setMergeName] = useState('');

  const handleApply = () => {
    onApply(selectedColor, mergeName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Merge Color">
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.class}
                onClick={() => setSelectedColor(color.class)}
                className={`h-10 rounded-md ${color.class} border-2 ${
                  selectedColor === color.class ? 'border-blue-500' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
} 