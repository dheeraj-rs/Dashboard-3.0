import React, { useState } from "react";
import { validateTimeSlot } from "../../utils/validations";
import { showToast } from "../Modal/CustomToast";
import { Section, ExtendedSectionFormProps } from "../../types/sections";
type SectionField = keyof Omit<Section, "id" | "subsections" | "deleted">;

export default function SectionForm({
  onSubmit,
  initialData,
  isSubsection,
  sectionTypes = [],
  speakers = [],
  roles = [],
  setFlyoverState,
}: ExtendedSectionFormProps) {
  const [formData, setFormData] = useState<Partial<Section>>({
    name: initialData?.name || "",
    speaker: initialData?.speaker || "",
    role: initialData?.role || "",
    sectionTypeId: initialData?.sectionTypeId || "",
    timeSlot: initialData?.timeSlot || {
      start: "09:00",
      end: "10:00",
    },
    specialType: initialData?.specialType || null,
    mergedFields: initialData?.mergedFields || {
      speaker: {
        isMerged: false,
        color: "",
        mergeId: "",
        mergeName: "",
        value: null,
      },
      role: {
        isMerged: false,
        color: "",
        mergeId: "",
        mergeName: "",
        value: null,
      },
      timeSlot: {
        isMerged: false,
        color: "",
        mergeId: "",
        mergeName: "",
        value: null,
      },
    },
    ...(initialData?.id ? { id: initialData.id } : {}),
    ...(initialData?.subsections
      ? { subsections: initialData.subsections }
      : {}),
  });

  const timeSlot = formData.timeSlot!;

  const handleChange = (field: SectionField, value: any) => {
    if (field === "speaker") {
      setFormData((prev) => ({
        ...prev,
        [field]: value as string,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const timeSlot = formData.timeSlot!;
    if (!formData.mergedFields?.timeSlot?.isMerged) {
      const validationError = validateTimeSlot(timeSlot.start, timeSlot.end);
      if (validationError) {
        showToast.error(validationError);
        return;
      }
    }

    // Prepare the submission data
    const submissionData: Partial<Section> = {
      ...formData,
      // Preserve subsections when editing
      ...(initialData?.subsections
        ? { subsections: initialData.subsections }
        : []),
    };

    onSubmit(submissionData);
    setFlyoverState({ isOpen: false, type: null, data: null });
  };

  // Add new function to check if it's a special section type
  const isSpecialSection = (typeId: string) => {
    const sectionType = sectionTypes.find((type) => type.id === typeId);
    return (
      sectionType?.sectionType === "lunch" ||
      sectionType?.sectionType === "break"
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="text-xl font-semibold text-gray-900 mb-6">
        {initialData?.id
          ? isSubsection
            ? "Edit Subsection"
            : "Edit Section"
          : isSubsection
          ? "Add New Subsection"
          : "Add New Section"}
      </div>

      {!isSubsection && (
        <>
          <div>
            <label
              htmlFor="sectionType"
              className="block text-sm font-medium text-gray-700"
            >
              Section Type
            </label>
            <select
              id="sectionType"
              value={formData.sectionTypeId}
              onChange={(e) => {
                const newTypeId = e.target.value;
                handleChange("sectionTypeId", newTypeId);

                // Find the selected section type
                const selectedType = sectionTypes.find(type => type.id === newTypeId);
                
                // Update both sectionTypeId and name
                setFormData((prev) => ({
                  ...prev,
                  sectionTypeId: newTypeId,
                  name: selectedType?.name || "", // Set the name from the selected type
                  ...(isSpecialSection(newTypeId) && {
                    speaker: "",
                    role: "",
                  }),
                }));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select a type</option>
              {sectionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {isSubsection && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Subsection Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter subsection name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      )}

      {!isSpecialSection(formData.sectionTypeId!) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="speaker"
              className="block text-sm font-medium text-gray-700"
            >
              Speaker
            </label>
            <select
              id="speaker"
              value={formData.speaker}
              onChange={(e) => handleChange("speaker", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a speaker</option>
              {speakers.map((speaker) => (
                <option key={speaker.id} value={speaker.name}>
                  {speaker.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={timeSlot.start}
            onChange={(e) =>
              handleChange("timeSlot", { ...timeSlot, start: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={timeSlot.end}
            onChange={(e) =>
              handleChange("timeSlot", { ...timeSlot, end: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
            text-white rounded-lg hover:from-blue-700 hover:to-violet-700 
            transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {initialData
            ? isSubsection
              ? "Update Subsection"
              : "Update Section"
            : isSubsection
            ? "Create Subsection"
            : "Create Section"}
        </button>
      </div>
    </form>
  );
}
