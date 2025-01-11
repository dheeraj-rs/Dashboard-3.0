import React, { useState } from "react";

interface CustomDropdownProps {
  trigger: React.ReactNode; // The button or icon that triggers the dropdown
  children: React.ReactNode; // The dropdown content
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="absolute right-0">
      {/* Dropdown Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-50"
            onClick={closeDropdown}
          ></div>

          {/* Dropdown Content */}
          <div
            className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDropdown;