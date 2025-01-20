import { useState, useRef } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { SectionCalendarFilterProps } from '../../types/scheduler';
import { createPortal } from 'react-dom';

export default function SectionCalendarFilter({ 
  sections, 
  onFilterChange,
  activeFilter 
}: SectionCalendarFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'time' | 'day' | 'month'>(activeFilter?.type || 'time');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get unique times and days from sections
  const times = [...new Set(sections.flatMap(section => [
    section.timeSlot.start,
    section.timeSlot.end
  ]))].sort();

  const days = [...new Set(sections.map(section => {
    const [hours] = section.timeSlot.start.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), 0, 0, 0);
    return date.toLocaleString('en-US', { weekday: 'long' });
  }))].sort();

  const months = [...new Set(sections.map(section => {
    const [hours] = section.timeSlot.start.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), 0, 0, 0);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort((a, b) => b.localeCompare(a));

  const getFilterLabel = () => {
    if (!activeFilter) return 'Filter Sections';
    
    if (activeFilter.type === 'time') {
      return `Time: ${activeFilter.value.start}`;
    }
    
    if (activeFilter.type === 'day') {
      return `Day: ${activeFilter.value.day}`;
    }
    
    if (activeFilter.type === 'month') {
      const [year, monthNum] = activeFilter.value.month!.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    
    return 'Filter Sections';
  };

  return (
    <div className="relative z-[100]">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2.5 bg-white rounded-lg shadow-sm border 
          ${activeFilter ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'} 
          hover:bg-gray-50 transition-colors duration-200
          relative pr-8
        `}
      >
        {filterType === 'time' ? (
          <Clock className={`w-4 h-4 ${activeFilter ? 'text-blue-600' : 'text-gray-400'}`} />
        ) : filterType === 'day' ? (
          <Calendar className={`w-4 h-4 ${activeFilter ? 'text-blue-600' : 'text-gray-400'}`} />
        ) : (
          <Calendar className={`w-4 h-4 ${activeFilter ? 'text-blue-600' : 'text-gray-400'}`} />
        )}
        <span className={`text-sm ${activeFilter ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
          {getFilterLabel()}
        </span>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {activeFilter && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange(null);
                setIsOpen(false);
              }}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </button>

      {isOpen && buttonRef.current && createPortal(
        <div 
          className="absolute top-full right-0 w-full min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          style={{
            top: buttonRef.current.getBoundingClientRect().bottom + 8,
            left: buttonRef.current.getBoundingClientRect().left,
            width: '20rem'
          }}
        >
          {/* Filter Type Selection */}
          <div className="flex gap-2 p-2 border-b">
            <button
              onClick={() => setFilterType('time')}
              className={`flex-1 px-3 py-1.5 text-nowrap rounded-md text-sm font-medium transition-colors duration-200 ${
                filterType === 'time'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              By Time
            </button>
            <button
              onClick={() => setFilterType('day')}
              className={`flex-1 px-3 py-1.5 text-nowrap rounded-md text-sm font-medium transition-colors duration-200 ${
                filterType === 'day'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              By Day
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`flex-1 px-3 py-1.5 text-nowrap rounded-md text-sm font-medium transition-colors duration-200 ${
                filterType === 'month'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              By Month
            </button>
          </div>

          {/* Filter Options */}
          <div className="space-y-1 max-h-60 overflow-y-auto p-2">
            {filterType === 'time' ? (
              times.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    onFilterChange({ type: 'time', value: { start: time } });
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2  text-left text-sm rounded-md transition-colors duration-200 flex items-center justify-between ${
                    activeFilter?.type === 'time' && activeFilter.value.start === time
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{time}</span>
                  {activeFilter?.type === 'time' && activeFilter.value.start === time && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                </button>
              ))
            ) : filterType === 'day' ? (
              days.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    onFilterChange({ type: 'day', value: { day } });
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm rounded-md transition-colors duration-200 flex items-center justify-between ${
                    activeFilter?.type === 'day' && activeFilter.value.day === day
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{day}</span>
                  {activeFilter?.type === 'day' && activeFilter.value.day === day && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                </button>
              ))
            ) : (
              months.map((month) => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return (
                  <button
                    key={month}
                    onClick={() => {
                      onFilterChange({ type: 'month', value: { month } });
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-sm rounded-md transition-colors duration-200 flex items-center justify-between ${
                      activeFilter?.type === 'month' && activeFilter.value.month === month
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>
                      {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    {activeFilter?.type === 'month' && activeFilter.value.month === month && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 