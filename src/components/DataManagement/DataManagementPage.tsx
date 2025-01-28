import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Menu, X } from 'lucide-react';
import { 
  DataManagementItem, 
  SpeakerManagementItem, 
  RoleManagementItem, 
  GuestManagementItem, 
  DataManagementPageProps
} from '../../types/management';
import { SectionManagementItem } from '../../types/sections';

export default function ResponsiveDataManagementPage({
  setFlyoverState,
  onDeleteItem,
  data,
}: DataManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'sectionstypes' | 'speakers' | 'roles' | 'guests'>('sectionstypes');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'sectionstypes', label: 'Section Types', count: data.sectionstypes.length },
    { id: 'speakers', label: 'Speakers', count: data.speakers.length },
    { id: 'roles', label: 'Roles', count: data.roles.length },
    { id: 'guests', label: 'Guests', count: data.guests.length },
  ];

  const filteredData = data[activeTab]?.filter((item: DataManagementItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getItemDetails = (item: DataManagementItem) => {
    switch (item.type) {
      case 'speaker':
        const speaker = item as SpeakerManagementItem;
        return {
          subtitle: speaker.organization || speaker.email,
          details: [
            { label: 'Email', value: speaker.email },
            { label: 'Phone', value: speaker.phone },
            { label: 'Organization', value: speaker.organization },
            { label: 'Expertise', value: speaker.expertise?.join(', ') },
            { label: 'Availability', value: speaker.availability?.map(a => 
              `${a.start}-${a.end}`).join(', ') },
          ]
        };
      case 'role':
        const role = item as RoleManagementItem;
        return {
          subtitle: role.department,
          details: [
            { label: 'Level', value: role.level },
            { label: 'Department', value: role.department },
            { label: 'Responsibilities', value: role.responsibilities?.join(', ') },
            { label: 'Requirements', value: role.requirements?.join(', ') },
          ]
        };
      case 'guest':
        const guest = item as GuestManagementItem;
        return {
          subtitle: guest.organization || guest.email,
          details: [
            { label: 'Email', value: guest.email },
            { label: 'Phone', value: guest.phone },
            { label: 'Organization', value: guest.organization },
            { label: 'Status', value: guest.invitationStatus },
            { label: 'Access Level', value: guest.accessLevel },
            { label: 'Dietary Restrictions', value: guest.dietaryRestrictions?.join(', ') },
          ]
        };
      default:
        const section = item as SectionManagementItem;
        return {
          subtitle: section.location,
          details: [
            { label: 'Type', value: section.sectionType },
            { label: 'Location', value: section.location },
            { label: 'Max Participants', value: section.maxParticipants },
            { label: 'Time Slot', value: section.timeSlot ? 
              `${section.timeSlot.start} - ${section.timeSlot.end}` : undefined },
          ]
        };
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6 max-w-7xl bg-white/80 dark:bg-gray-900 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Mobile Menu Toggle for Tabs */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-slate-800 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Data Management</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 dark:text-slate-400    hover:text-slate-800  button-pop"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Header with Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700     ">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ">
          <h1 className="hidden md:block text-2xl font-semibold text-slate-800  bg-gradient-to-r  from-gray-900 dark:from-gray-50 to-gray-700  dark:to-gray-500 bg-clip-text text-transparent ">Data Management</h1>
          <div className="flex gap-2 w-full sm:w-auto">
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
              className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto justify-center 
                bg-gradient-to-r from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 border dark:border-gray-700     
                rounded-lg hover:from-gray-100 hover:to-gray-200 
                transition-all duration-200 shadow-sm hover:shadow-md text-sm button-pop text-gray-700 dark:text-gray-300"
            >
              <Plus className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" />
              <span>Add New {activeTab.slice(0, -1)}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation with Mobile Handling */}
        <div className={`
          ${mobileMenuOpen ? 'block' : 'hidden'} md:block
          flex flex-col md:flex-row gap-2 mt-6 border-b border-gray-200 
          overflow-x-auto
        `}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full md:w-auto px-4 py-2 -mb-px text-sm font-medium 
                transition-all duration-200 text-center md:text-left
                ${activeTab === tab.id 
                  ? 'border-b-2 border-violet-500 text-violet-600 bg-violet-50 md:bg-transparent' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hover:bg-transparent'}
              `}
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
          className="w-full px-4 py-2 pr-10 border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-500/20 
            focus:border-violet-500/30 dark:focus:border-violet-500/30 placeholder-gray-400 dark:placeholder-gray-600 
            transition-all duration-200"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-600" />
      </div>

      {/* Data Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((item: DataManagementItem) => {
          const itemDetails = getItemDetails(item);
          
          return (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-white dark:from-gray-900 to-gray-50/50 
                rounded-xl border border-gray-200 dark:border-gray-700 p-4 
                shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
                  {itemDetails.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{itemDetails.subtitle}</p>
                  )}
                </div>
                {item.color && (
                  <div 
                      className="ml-2 w-6 h-6 flex-shrink-0 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>

              <div className="space-y-2">
                {itemDetails.details.map((detail, index) => 
                  detail.value && (
                    <div key={index} className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {detail.label}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {detail.value}
                      </span>
                    </div>
                  )
                )}
                
                {item.description && (
                  <div className="flex flex-col mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300  line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 
                opacity-100 md:opacity-0 group-hover:opacity-100 
                transition-opacity">
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
                  className="p-1 text-gray-400 dark:text-gray-600 hover:text-violet-600 rounded-lg 
                    hover:bg-violet-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteItem(activeTab, item.id)}
                  className="p-1 text-gray-400 dark:text-gray-600 hover:text-red-600 rounded-lg 
                    hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}