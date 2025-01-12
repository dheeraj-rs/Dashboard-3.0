import React, { useState } from "react";
import { TableHeader } from "../../types/scheduler";
import { Trash2 } from "lucide-react";

interface HeaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: TableHeader[];
  onUpdateHeaders: (headers: TableHeader[]) => void;
  onApplyStyles: (styles: {
    headerColor: string;
    textColor: string;
    borderColor: string;
    columnColors: { [key: string]: string };
    sectionColors: { [key: string]: string };
    subsectionColors: { [key: string]: string };
    mergedItemColors: { [key: string]: string };
  }) => void;
}

const HeaderSettingsModal: React.FC<HeaderSettingsModalProps> = ({
  isOpen,
  onClose,
  headers,
  onUpdateHeaders,
  onApplyStyles,
}) => {
  const [localHeaders, setLocalHeaders] = useState(headers);
  const [headerColor, setHeaderColor] = useState("#f3f4f6");
  const [textColor, setTextColor] = useState("#374151");
  const [borderColor, setBorderColor] = useState("#e5e7eb");
  const [columnColors, setColumnColors] = useState<{ [key: string]: string }>({});
  const [sectionColors, setSectionColors] = useState<{ [key: string]: string }>({});
  const [subsectionColors, setSubsectionColors] = useState<{ [key: string]: string }>({});
  const [mergedItemColors, setMergedItemColors] = useState<{ [key: string]: string }>({});
  const [showAddItemAlert, setShowAddItemAlert] = useState(false);
  const [newItemType, setNewItemType] = useState<"section" | "subsection" | "mergedItem">("section");
  const [newItemName, setNewItemName] = useState("");

  const handleHeaderLabelChange = (id: string, newLabel: string) => {
    setLocalHeaders((prev) =>
      prev.map((header) =>
        header.id === id ? { ...header, label: newLabel } : header
      )
    );
  };

  const handleColumnColorChange = (columnType: string, color: string) => {
    setColumnColors((prev) => ({ ...prev, [columnType]: color }));
  };

  const handleSectionColorChange = (sectionId: string, color: string) => {
    setSectionColors((prev) => ({ ...prev, [sectionId]: color }));
  };

  const handleSubsectionColorChange = (subsectionId: string, color: string) => {
    setSubsectionColors((prev) => ({ ...prev, [subsectionId]: color }));
  };

  const handleMergedItemColorChange = (itemName: string, color: string) => {
    setMergedItemColors((prev) => ({ ...prev, [itemName]: color }));
  };

  const handleDeleteSection = (sectionId: string) => {
    setSectionColors((prev) => {
      const newSectionColors = { ...prev };
      delete newSectionColors[sectionId];
      return newSectionColors;
    });
  };

  const handleDeleteSubsection = (subsectionId: string) => {
    setSubsectionColors((prev) => {
      const newSubsectionColors = { ...prev };
      delete newSubsectionColors[subsectionId];
      return newSubsectionColors;
    });
  };

  const handleDeleteMergedItem = (itemName: string) => {
    setMergedItemColors((prev) => {
      const newMergedItemColors = { ...prev };
      delete newMergedItemColors[itemName];
      return newMergedItemColors;
    });
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      alert("Please enter a valid name.");
      return;
    }

    switch (newItemType) {
      case "section":
        handleSectionColorChange(newItemName, "#f9fafb");
        break;
      case "subsection":
        handleSubsectionColorChange(newItemName, "#f9fafb");
        break;
      case "mergedItem":
        handleMergedItemColorChange(newItemName, "#f9fafb");
        break;
      default:
        break;
    }

    setNewItemName("");
    setShowAddItemAlert(false);
  };

  const handleApply = () => {
    onUpdateHeaders(localHeaders);
    onApplyStyles({
      headerColor,
      textColor,
      borderColor,
      columnColors,
      sectionColors,
      subsectionColors,
      mergedItemColors,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Customization</h2>

          {/* Header Label Customization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Header Labels</h3>
            <div className="space-y-2">
              {localHeaders.map((header) => (
                <div key={header.id} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{header.type}</label>
                  <input
                    type="text"
                    value={header.label}
                    onChange={(e) => handleHeaderLabelChange(header.id, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="color"
                    value={columnColors[header.type] || "#f9fafb"}
                    onChange={(e) => handleColumnColorChange(header.type, e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Header, Text, and Border Color Customization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Header Color</label>
                <input
                  type="color"
                  value={headerColor}
                  onChange={(e) => setHeaderColor(e.target.value)}
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Border Color</label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section and Subsection Color Customization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Sections & Subsections</h3>
            <div className="space-y-2">
              {Object.keys(sectionColors).map((sectionId) => (
                <div key={sectionId} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Section {sectionId}</label>
                  <input
                    type="color"
                    value={sectionColors[sectionId]}
                    onChange={(e) => handleSectionColorChange(sectionId, e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer"
                  />
                  <button
                    onClick={() => handleDeleteSection(sectionId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {Object.keys(subsectionColors).map((subsectionId) => (
                <div key={subsectionId} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Subsection {subsectionId}</label>
                  <input
                    type="color"
                    value={subsectionColors[subsectionId]}
                    onChange={(e) => handleSubsectionColorChange(subsectionId, e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer"
                  />
                  <button
                    onClick={() => handleDeleteSubsection(subsectionId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewItemType("section");
                  setShowAddItemAlert(true);
                }}
                className="w-full px-2 py-1 text-sm text-slate-50 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Section
              </button>
              <button
                onClick={() => {
                  setNewItemType("subsection");
                  setShowAddItemAlert(true);
                }}
                className="w-full px-2 py-1 text-sm text-slate-50 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Subsection
              </button>
            </div>
          </div>

          {/* Merged Items Color Customization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Merged Items</h3>
            <div className="space-y-2">
              {Object.keys(mergedItemColors).map((itemName) => (
                <div key={itemName} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{itemName}</label>
                  <input
                    type="color"
                    value={mergedItemColors[itemName]}
                    onChange={(e) => handleMergedItemColorChange(itemName, e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer"
                  />
                  <button
                    onClick={() => handleDeleteMergedItem(itemName)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setNewItemType("mergedItem");
                  setShowAddItemAlert(true);
                }}
                className="w-full px-2 py-1 text-sm text-slate-50 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Merged Item
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-slate-50 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Alert Box */}
      {showAddItemAlert && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add {newItemType === "section" ? "Section" : newItemType === "subsection" ? "Subsection" : "Merged Item"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={`Enter ${newItemType} name`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddItemAlert(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 text-slate-50 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSettingsModal;