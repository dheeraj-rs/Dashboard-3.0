import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface SectionCalendarFilterProps {
  sections: Array<{
    timeSlot: {
      start: string;
      end: string;
    };
  }>;
  onFilterChange: (filter: {
    type: 'time' | 'day' | 'month';
    value: { 
      start?: string; 
      day?: string; 
      month?: string;
    };
  } | null) => void;
  activeFilter?: {
    type: 'time' | 'day' | 'month';
    value: { 
      start?: string; 
      day?: string; 
      month?: string;
    };
  } | null;
}

export default function SectionCalendarFilter({ 
  sections, 
  onFilterChange,
  activeFilter 
}: SectionCalendarFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'time' | 'day' | 'month'>(activeFilter?.type || 'time');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized unique values with optimized extraction
  const extractUniqueValues = useCallback((extractor: (section: any) => string) => 
    [...new Set(sections.map(extractor))].sort(), [sections]);

  const times = useMemo(() => 
    extractUniqueValues(section => section.timeSlot.start)
    .concat(extractUniqueValues(section => section.timeSlot.end)), [extractUniqueValues]);

  const days = useMemo(() => 
    extractUniqueValues(section => {
      const [hours] = section.timeSlot.start.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), 0, 0, 0);
      return date.toLocaleString('en-US', { weekday: 'long' });
    }), [extractUniqueValues]);

  const months = useMemo(() => 
    extractUniqueValues(section => {
      const [hours] = section.timeSlot.start.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), 0, 0, 0);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }).sort((a, b) => b.localeCompare(a)), [extractUniqueValues]);

  // Optimized outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        dropdownRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized filter label generation
  const getFilterLabel = useCallback(() => {
    if (!activeFilter) return 'Filter Sections';
    
    switch (activeFilter.type) {
      case 'time':
        return `Time: ${activeFilter.value.start}`;
      case 'day':
        return `Day: ${activeFilter.value.day}`;
      case 'month': {
        const [year, monthNum] = activeFilter.value.month!.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      }
      default:
        return 'Filter Sections';
    }
  }, [activeFilter]);

  // Handlers with event prevention
  const handleFilterTypeChange = (type: 'time' | 'day' | 'month') => {
    setFilterType(type);
  };

  const handleFilterSelection = (type: 'time' | 'day' | 'month', value: string) => {
    onFilterChange({ 
      type, 
      value: type === 'time' 
        ? { start: value } 
        : type === 'day' 
        ? { day: value } 
        : { month: value } 
    });
    setIsOpen(false);
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFilterChange(null);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full sm:max-w-[10rem] z-20"
    >  

      {/* Desktop Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full items-center justify-between px-4 py-2.5 
          bg-white rounded-lg shadow-sm border 
          ${activeFilter ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'} 
          hover:bg-gray-50 transition-colors duration-200
        `}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {filterType === 'time' ? (
            <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeFilter ? 'text-blue-600' : 'text-gray-400'}`} />
          ) : (
            <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeFilter ? 'text-blue-600' : 'text-gray-400'}`} />
          )}
          <span className={`text-xs sm:text-sm truncate ${activeFilter ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
            {getFilterLabel()}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {activeFilter && (
            <button
              onClick={handleClearFilter}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
         
        </div>
      </button>

      {/* Dropdown Filter */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 w-full sm:w-full mt-2 bg-white rounded-lg shadow-lg 
            border border-gray-200 z-30 min-w-[13rem] sm:min-w-[16rem]"
        >
          <div className="flex gap-1 p-1.5 sm:p-2 border-b">
            {(['time', 'day', 'month'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterTypeChange(type)}
                className={`flex-1 px-2 sm:px-3 py-1 sm:py-1.5 text-nowrap rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  filterType === type
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type === 'time' ? 'By Time' : type === 'day' ? 'By Day' : 'By Month'}
              </button>
            ))}
          </div>

          <div className="max-h-48 sm:max-h-60 overflow-y-auto p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
            {filterType === 'time' && times.map((time) => (
              <button
                key={time}
                onClick={() => handleFilterSelection('time', time)}
                className={`
                  w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm rounded-md 
                  transition-colors duration-200 flex items-center justify-between
                  ${activeFilter?.type === 'time' && activeFilter.value.start === time
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <span>{time}</span>
                {activeFilter?.type === 'time' && activeFilter.value.start === time && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </button>
            ))}

            {filterType === 'day' && days.map((day) => (
              <button
                key={day}
                onClick={() => handleFilterSelection('day', day)}
                className={`
                  w-full px-4 py-2 text-left text-sm rounded-md 
                  transition-colors duration-200 flex items-center justify-between
                  ${activeFilter?.type === 'day' && activeFilter.value.day === day
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <span>{day}</span>
                {activeFilter?.type === 'day' && activeFilter.value.day === day && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </button>
            ))}

            {filterType === 'month' && months.map((month) => {
              const [year, monthNum] = month.split('-');
              const date = new Date(parseInt(year), parseInt(monthNum) - 1);
              return (
                <button
                  key={month}
                  onClick={() => handleFilterSelection('month', month)}
                  className={`
                    w-full px-4 py-2 text-left text-sm rounded-md 
                    transition-colors duration-200 flex items-center justify-between
                    ${activeFilter?.type === 'month' && activeFilter.value.month === month
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>
                    {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  {activeFilter?.type === 'month' && activeFilter.value.month === month && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}