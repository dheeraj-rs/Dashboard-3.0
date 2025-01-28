import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { CalendarFilterProps } from '../../types/tracks';

export default function CalendarFilter({ tracks, onFilterChange, activeFilter }: CalendarFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('month');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get unique years and months from tracks
  const dates = tracks.map(track => new Date(track.startDate));
  const years = [...new Set(dates.map(date => date.getFullYear()))].sort((a, b) => b - a);
  const months = [...new Set(dates.map(date => 
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  )].sort((a, b) => b.localeCompare(a));

  const getFilterLabel = () => {
    if (!activeFilter) return 'Filter by Date';
    
    if (activeFilter.type === 'month') {
      const [year, monthNum] = activeFilter.value.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    
    return `Year: ${activeFilter.value}`;
  };

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl 
          shadow-sm border transition-all duration-200
          ${activeFilter 
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' 
            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'} 
          hover:bg-gray-50 dark:hover:bg-slate-800 
          hover:border-blue-300 dark:hover:border-blue-600
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
          relative pr-8 group hover:shadow-md`}
      >
        <Calendar className={`w-4 h-4 
          ${activeFilter 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-400 dark:text-gray-500'}`} 
        />
        <span className={`text-sm 
          ${activeFilter 
            ? 'text-blue-700 dark:text-blue-300 font-medium' 
            : 'text-gray-700 dark:text-gray-300'}`}>
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
              className="p-0.5 text-gray-400 dark:text-gray-500 
                hover:text-gray-600 dark:hover:text-gray-300 
                rounded-full hover:bg-gray-100 dark:hover:bg-slate-700
                transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full mt-2 right-0 w-full min-w-48 
            bg-white dark:bg-slate-900 rounded-xl shadow-lg 
            border border-gray-200 dark:border-slate-700 z-50"
        >
          <div className="p-2 border-b border-gray-200 dark:border-slate-700">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('month')}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 
                  ${filterType === 'month' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
              >
                Month
              </button>
              <button
                onClick={() => setFilterType('year')}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 
                  ${filterType === 'year' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
              >
                Year
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin 
            scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 
            scrollbar-track-transparent">
            {filterType === 'year' ? (
              <div className="grid grid-cols-2 gap-2">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      onFilterChange({ type: 'year', value: year.toString() });
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 
                      ${activeFilter?.type === 'year' && activeFilter.value === year.toString()
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {months.map(month => {
                  const [year, monthNum] = month.split('-');
                  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                  return (
                    <button
                      key={month}
                      onClick={() => {
                        onFilterChange({ type: 'month', value: month });
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left rounded-lg transition-colors duration-200 
                        ${activeFilter?.type === 'month' && activeFilter.value === month
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                      {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 