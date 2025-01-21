import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { DataManagementItem, DataManagementPageProps } from '../../types/scheduler';

export default function DataManagementPage({
  setFlyoverState,
  onDeleteItem,
  data,
}: DataManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'sectionstypes' | 'speakers' | 'roles' | 'guests'>('sectionstypes');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'sectionstypes', label: 'Section Types', count: data.sectionstypes.length },
    { id: 'speakers', label: 'Speakers', count: data.speakers.length },
    { id: 'roles', label: 'Roles', count: data.roles.length },
    { id: 'guests', label: 'Guests', count: data.guests.length },
  ];

  const filteredData = data[activeTab]?.filter((item: DataManagementItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Data Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFlyoverState({
                isOpen: true,
                type: activeTab === 'sectionstypes' 
                  ? 'add-section-type'
                  : activeTab === 'speakers'
                  ? 'add-speaker'
                  : activeTab === 'guests'
                  ? 'add-guest'
                  : 'add-role',
                data: null,
              })}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
                text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-200 
                shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Add New {activeTab.slice(0, -1)}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 -mb-px text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'border-b-2 border-violet-500 text-violet-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/30 
            placeholder-gray-400 transition-all duration-200"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Data Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((item: DataManagementItem) => (
          <div
            key={item.id}
            className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-xl 
              border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                )}
              </div>
              {item.color && (
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setFlyoverState({
                  isOpen: true,
                  type: activeTab === 'sectionstypes' 
                    ? 'edit-section-type'
                    : activeTab === 'speakers'
                    ? 'edit-speaker'
                    : activeTab === 'guests'
                    ? 'edit-guest'
                    : 'edit-role',
                  data: item,
                })}
                className="p-1 text-gray-400 hover:text-violet-600 rounded-lg 
                  hover:bg-violet-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteItem(activeTab, item.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg 
                  hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 