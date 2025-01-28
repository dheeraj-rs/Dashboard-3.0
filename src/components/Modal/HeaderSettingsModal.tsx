import React, { useState, useCallback, useMemo } from "react";
import { RefreshCw, Layout, Type, Grid, Palette, Eye, EyeOff } from 'lucide-react';
import { HeaderSettingsState, HeaderSettingsModalProps } from "../../types/common";
import { BorderStyle, TableHeader } from "../../types/ui";

const calculateTextColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Adjust threshold for dark mode
  const isDarkMode = document.documentElement.classList.contains('dark');
  const threshold = isDarkMode ? 0.4 : 0.5;
  
  return luminance > threshold ? '#000000' : '#ffffff';
};

const HeaderSettingsModal: React.FC<HeaderSettingsModalProps> = ({
  isOpen,
  onClose,
  headers,
  onUpdateHeaders,
  onApplyStyles,
  currentStyles,
}) => {
  const [activeTab, setActiveTab] = useState<'headers' | 'styles'>('headers');
  const [localHeaders, setLocalHeaders] = useState(headers);
  const [styles, setStyles] = useState<HeaderSettingsState>({
    tableBackgroundColor: currentStyles?.tableBackgroundColor || "#ffffff",
    headerColor: currentStyles?.headerColor || "#f3f4f6",
    headerTextColor: currentStyles?.headerTextColor || "#374151",
    cellTextColor: currentStyles?.cellTextColor || "#374151",
    borderColor: currentStyles?.borderColor || "#e5e7eb",
    headerBorderStyle: currentStyles?.headerBorderStyle || "solid",
    cellBorderStyle: currentStyles?.cellBorderStyle || "solid",
    alternateRowColors: currentStyles?.alternateRowColors || false,
    alternateRowColor: currentStyles?.alternateRowColor || "#f9fafb",
    cellBorderColor: currentStyles?.cellBorderColor || "#e5e7eb",
    mainSectionGradientStart: currentStyles?.mainSectionGradientStart || "#E2E8F0",
    mainSectionGradientEnd: currentStyles?.mainSectionGradientEnd || "#FFFFFF",
  });

  const defaultStyles: HeaderSettingsState = useMemo(() => ({
    headerColor: "#f3f4f6",
    tableBackgroundColor: "#ffffff",
    headerTextColor: "#374151",
    cellTextColor: "#374151",
    borderColor: "#e5e7eb",
    cellBorderColor: "#e5e7eb",
    headerBorderStyle: "solid" as BorderStyle,
    cellBorderStyle: "solid" as BorderStyle,
    alternateRowColors: false,
    alternateRowColor: "#f9fafb",
    mainSectionGradientStart: "#E2E8F0",
    mainSectionGradientEnd: "#FFFFFF",
  }), []);

  const borderStyles: BorderStyle[] = useMemo(() => [
    "none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"
  ], []);

  const handleHeaderLabelChange = useCallback((id: string, newLabel: string) => {
    setLocalHeaders((prev) =>
      prev.map((header) =>
        header.id === id ? { ...header, label: newLabel } : header
      )
    );
  }, []);

  const handleHeaderVisibilityChange = useCallback((id: string) => {
    setLocalHeaders((prev) =>
      prev.map((header) =>
        header.id === id ? { ...header, isVisible: !header.isVisible } : header
      )
    );
  }, []);

  const validateColor = useCallback((color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  }, []);

  const handleStyleChange = useCallback((key: keyof HeaderSettingsState, value: any) => {
    if (key.includes('Color') && !validateColor(value)) {
      console.warn('Invalid color value:', value);
      return;
    }

    setStyles((prev) => {
      const updates: Partial<HeaderSettingsState> = { [key]: value };
      if (key === 'headerColor') {
        updates.headerTextColor = calculateTextColor(value);
      }
      if (key === 'tableBackgroundColor') {
        updates.cellTextColor = calculateTextColor(value);
      }
      return { ...prev, ...updates };
    });
  }, [validateColor]);

  const handleSave = useCallback(() => {
    // First apply the header changes
    onUpdateHeaders(localHeaders);
    
    // Then apply the style changes with all required fields
    onApplyStyles({
      ...styles,
      tableBackgroundColor: styles.tableBackgroundColor || "#ffffff",
      mainSectionGradientStart: styles.mainSectionGradientStart || "#93c5fd80",
      mainSectionGradientEnd: styles.mainSectionGradientEnd || "#FFFFFF",
      alternateRowColors: styles.alternateRowColors,
      alternateRowColor: styles.alternateRowColor || "#f9fafb",
      cellTextColor: styles.cellTextColor || "#374151",
      headerColor: styles.headerColor || "#f3f4f6",
      headerTextColor: styles.headerTextColor || "#374151",
      borderColor: styles.borderColor || "#e5e7eb",
      cellBorderColor: styles.cellBorderColor || "#e5e7eb",
      headerBorderStyle: styles.headerBorderStyle || "solid",
      cellBorderStyle: styles.cellBorderStyle || "solid",
    });

    // Close the modal after applying changes
    onClose();
  }, [onApplyStyles, styles, localHeaders, onUpdateHeaders, onClose]);

  const handleReset = useCallback(() => {
    setStyles(defaultStyles);
    setLocalHeaders(headers);
  }, [defaultStyles, headers]);

  const StyleSection = React.memo(({ icon: Icon, title, children }: any) => (
    <div className="p-4 bg-gradient-to-r from-gray-50 dark:from-slate-800 to-white dark:to-slate-900 rounded-xl border border-gray-200 dark:border-gray-700     
      shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100      ">
      <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300     ">
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300        ">
          {title}
        </label>
      </div>
      {children}
    </div>
  ));

  const TabButton = React.memo(({ tab, label, icon: Icon }: { 
    tab: 'headers' | 'styles', 
    label: string, 
    icon: any 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center      justify-center gap-2 py-2 text-xs font-medium rounded-lg
            transition-all duration-200      ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-600 dark:from-blue-400 to-violet-600 dark:to-violet-400 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className={`w-4 h-4 ${activeTab === tab ? 'text-white' : 'text-gray-500 dark:text-gray-400        '}`} />
      {label}
    </button>
  ));

  const HeaderItem = React.memo(({ header }: { header: TableHeader }) => (
          <div className="group flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 dark:from-slate-800 to-white dark:to-slate-900 
      rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md 
      transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100">
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">{header.type}</span>
        <input
          type="text"
          value={header.label}
          onChange={(e) => handleHeaderLabelChange(header.id, e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md
            focus:ring-1 focus:ring-violet-500 focus:border-violet-500
            transition-all duration-200 bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800/60 dark:text-gray-100"
        />
      </div>
      <button
        onClick={() => handleHeaderVisibilityChange(header.id)}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group"
        title={header.isVisible ? "Hide Column" : "Show Column"}
      >
        {header.isVisible ? (
          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
        )}
      </button>
    </div>
  ));

  if (!isOpen) return null;

  return (
    <div 
      className="h-full flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="header-settings-title  "
    >
      <div className="px-4 pt-3 border-b bg-white dark:bg-slate-900">
        <h2 id="header-settings-title text-gray-900 dark:text-gray-100    " className="sr-only">Header Settings</h2>
        <div className="flex gap-1 mb-3 text-gray-700 dark:text-gray-300    ">
          <TabButton tab="headers" label="Headers" icon={Type} />
          <TabButton tab="styles" label="Styles" icon={Layout} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        <div className="p-4 space-y-4">
          {activeTab === 'headers' && (
            <div className="space-y-2 bg-white dark:bg-slate-900">
              {localHeaders.map((header) => (
                <HeaderItem key={header.id} header={header} />
              ))}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Eye className="w-4 h-4" />
                  <span>Toggle column visibility</span>
                </div>
              </div>
            </div>      
          )}

          {activeTab === 'styles' && (
            <div className="space-y-3">
              <StyleSection icon={Palette} title="Colors">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Header Background</label>
                    <div className="space-y-2">
                      <input
                        type="color"
                        value={styles.headerColor}
                        onChange={(e) => handleStyleChange('headerColor', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                      />
                      <div 
                        className="p-2 rounded text-center text-sm text-gray-700 dark:text-gray-300"
                        style={{ 
                          backgroundColor: styles.headerColor,
                          color: styles.headerTextColor 
                        }}
                      >
                        Sample Header Text
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Cell Background</label>
                    <div className="space-y-2">
                      <input
                        type="color"
                        value={styles.tableBackgroundColor}
                        onChange={(e) => handleStyleChange('tableBackgroundColor', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                      />
                      <div 
                        className="p-2 rounded text-center text-sm text-gray-700 dark:text-gray-300"
                        style={{ 
                          backgroundColor: styles.tableBackgroundColor,
                          color: styles.cellTextColor 
                        }}
                      >
                        Sample Cell Text
                      </div>
                    </div>
                  </div> */}
                </div>
              </StyleSection>

              <StyleSection icon={Grid} title="Borders">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Header Border Color</label>
                    <input
                      type="color"
                      value={styles.borderColor}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Cell Border Color</label>
                    <input
                      type="color"
                      value={styles.cellBorderColor}
                      onChange={(e) => handleStyleChange('cellBorderColor', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Header Border Style</label>
                    <select
                      value={styles.headerBorderStyle}
                      onChange={(e) => handleStyleChange('headerBorderStyle', e.target.value as BorderStyle)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm 
                        focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                        transition-all duration-200 bg-white/50 hover:bg-white"
                    >
                      {borderStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Cell Border Style</label>
                    <select
                      value={styles.cellBorderStyle}
                      onChange={(e) => handleStyleChange('cellBorderStyle', e.target.value as BorderStyle)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm 
                        focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                        transition-all duration-200 bg-white/50 hover:bg-white"
                    >
                      {borderStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </StyleSection>

              <StyleSection icon={Layout} title="Section Row Styling">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Main Section Gradient Start</label>
                    <input
                      type="color"
                      value={styles.mainSectionGradientStart}
                      onChange={(e) => handleStyleChange('mainSectionGradientStart', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Main Section Gradient End</label>
                    <input
                      type="color"
                      value={styles.mainSectionGradientEnd}
                      onChange={(e) => handleStyleChange('mainSectionGradientEnd', e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="alternateRows"
                      checked={styles.alternateRowColors}
                      onChange={(e) => handleStyleChange('alternateRowColors', e.target.checked)}
                      className="w-4 h-4 rounded text-violet-500 focus:ring-violet-500"
                    />
                    <label htmlFor="alternateRows" className="text-sm text-gray-700 dark:text-gray-300">
                      Alternate Main Section Row Colors
                    </label>
                  </div>
                  
                  {styles.alternateRowColors && (
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 ">Alternate Row Color</label>
                      <input
                        type="color"
                        value={styles.alternateRowColor}
                        onChange={(e) => handleStyleChange('alternateRowColor', e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer transition-transform hover:scale-105 bg-white dark:bg-slate-800/50"
                      />
                    </div>
                  )}
                </div>
              </StyleSection>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-gradient-to-r from-gray-50 to-white p-4 dark:bg-slate-900">
        <div className="flex justify-end gap-2 text-gray-700 dark:text-gray-300 ">
          {activeTab === 'styles' && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white dark:bg-slate-800/50 rounded-lg 
                border border-gray-200 hover:bg-gray-50 hover:border-gray-300 
                transition-all duration-200 flex items-center gap-1.5 button-pop"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset styles
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white dark:bg-slate-800/50  rounded-lg 
              border border-gray-200 hover:bg-gray-50 hover:border-gray-300 
              transition-all duration-200 button-pop"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r 
              from-blue-600 to-violet-600 rounded-lg hover:from-blue-700 
              hover:to-violet-700 transition-all duration-200 shadow-sm    
              hover:shadow-md button-pop dark:text-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800/60     " 
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSettingsModal;