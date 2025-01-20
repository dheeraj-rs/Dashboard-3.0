import React, { useState } from "react";
import { HeaderSettingsModalProps } from '../../types/scheduler';
import { Trash2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../Modal/Alert";

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
   <>
     {/* Modal Header */}
          {/* Header Label Customization */}
          <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Header Labels</h3>
              <div className="space-y-3">
                {localHeaders.map((header) => (
                  <div key={header.id} className="group flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                    <span className="text-sm font-medium text-gray-700">{header.type}</span>
                    <input
                      type="text"
                      value={header.label}
                      onChange={(e) => handleHeaderLabelChange(header.id, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="color"
                      value={columnColors[header.type] || "#f9fafb"}
                      onChange={(e) => handleColumnColorChange(header.type, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-md border-2 border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Colors</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Header Color", value: headerColor, onChange: setHeaderColor },
                  { label: "Text Color", value: textColor, onChange: setTextColor },
                  { label: "Border Color", value: borderColor, onChange: setBorderColor },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border bg-white p-3 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                    <input
                      type="color"
                      value={item.value}
                      onChange={(e) => item.onChange(e.target.value)}
                      className="mt-2 h-8 w-full cursor-pointer rounded-md"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Sections & Subsections */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Sections & Subsections</h3>
              <div className="space-y-3">
                {Object.entries(sectionColors).map(([sectionId, color]) => (
                  <div key={sectionId} className="group flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <span className="text-sm font-medium text-gray-700">Section {sectionId}</span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleSectionColorChange(sectionId, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-md border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleDeleteSection(sectionId)}
                      className="ml-auto rounded-full p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {Object.entries(subsectionColors).map(([subsectionId, color]) => (
                  <div key={subsectionId} className="group flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <span className="text-sm font-medium text-gray-700">Subsection {subsectionId}</span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleSubsectionColorChange(subsectionId, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-md border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleDeleteSubsection(subsectionId)}
                      className="ml-auto rounded-full p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setNewItemType("section");
                      setShowAddItemAlert(true);
                    }}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Section
                  </button>
                  <button
                    onClick={() => {
                      setNewItemType("subsection");
                      setShowAddItemAlert(true);
                    }}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Subsection
                  </button>
                </div>
              </div>
            </section>

            {/* Merged Items */}
            <section className="space-y-4 pb-24">
              <h3 className="text-lg font-medium text-gray-900">Merged Items</h3>
              <div className="space-y-3">
                {Object.entries(mergedItemColors).map(([itemName, color]) => (
                  <div key={itemName} className="group flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md">
                    <span className="text-sm font-medium text-gray-700">{itemName}</span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleMergedItemColorChange(itemName, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-md border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleDeleteMergedItem(itemName)}
                      className="ml-auto rounded-full p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setNewItemType("mergedItem");
                    setShowAddItemAlert(true);
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Merged Item
                </button>
              </div>
            </section>

          {/* Modal Footer */}
          <div className="sticky bottom-10 flex justify-end gap-3 border-t bg-white/80 p-4 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Changes
            </button>
          </div>
      {/* Add Item Dialog */}
      {showAddItemAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add {newItemType === "section" ? "Section" : newItemType === "subsection" ? "Subsection" : "Merged Item"}
              </h3>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="itemName"
                  type="text"
                  placeholder={`Enter ${newItemType} name`}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {!newItemName.trim() && (
                  <Alert className="mt-2" variant="destructive">
                    <AlertTitle>Required</AlertTitle>
                    <AlertDescription>
                      Please enter a name for the {newItemType === "section" ? "section" : newItemType === "subsection" ? "subsection" : "merged item"}.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddItemAlert(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!newItemName.trim()}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
   </>
  );
};

export default HeaderSettingsModal;