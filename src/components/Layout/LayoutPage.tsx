import  { useState, useEffect } from 'react';
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Check,
  ChevronRight,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { TableHeader } from "../../types/ui";

interface LayoutOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'scheduler' | 'dashboard';
  features?: string[];
  recommended?: boolean;
}

const layoutOptions: LayoutOption[] = [
  // Scheduler Layouts
  {
    id: 'scheduler-timeline',
    name: 'Timeline View',
    description: 'Horizontal timeline for scheduling and event planning',
    preview: '/layouts/scheduler-timeline.png',
    category: 'scheduler',
    features: ['Time Blocks', 'Resource Allocation', 'Dependencies'],
    recommended: true
  },
  {
    id: 'scheduler-calendar',
    name: 'Calendar Grid',
    description: 'Traditional calendar layout with daily, weekly and monthly views',
    preview: '/layouts/scheduler-calendar.png',
    category: 'scheduler',
    features: ['Multiple Views', 'Event Details', 'Recurring Events']
  },
  {
    id: 'scheduler-list',
    name: 'List View',
    description: 'Compact list view for time-based scheduling',
    preview: '/layouts/scheduler-list.png',
    category: 'scheduler',
    features: ['Compact Display', 'Quick Navigation', 'Time Slots']
  },
  // Dashboard Layouts
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Data-driven dashboard with charts and metrics',
    preview: '/layouts/dashboard-analytics.png',
    category: 'dashboard',
    features: ['Real-time Updates', 'Custom Widgets', 'Export Options'],
    recommended: true
  },
  {
    id: 'dashboard-kanban',
    name: 'Kanban Board',
    description: 'Visual task management with drag-and-drop columns',
    preview: '/layouts/dashboard-kanban.png',
    category: 'dashboard',
    features: ['Drag & Drop', 'Task Categories', 'Progress Tracking']
  }
];

const LayoutCard = ({ layout, isSelected, onSelect }: {
  layout: LayoutOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <Card
      className={`
        overflow-hidden transition-all duration-200 cursor-pointer
        hover:shadow-lg group relative
        ${isSelected 
          ? 'ring-2 ring-violet-500 ring-offset-2' 
          : 'hover:ring-1 hover:ring-violet-200'
        }
      `}
      onClick={() => onSelect(layout.id)}
    >
      {/* Preview Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-black/0" />
        <img
          src={layout.preview}
          alt={layout.name}
          className="object-cover w-full h-full"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-violet-500 text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
        {layout.recommended && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Recommended
          </div>
        )}
      </div>

      {/* Layout Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {layout.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {layout.description}
        </p>
        
        {/* Features */}
        {layout.features && (
          <div className="flex flex-wrap gap-2">
            {layout.features.map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preview Button */}
      <div className="p-4 pt-0">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 
            bg-slate-100 dark:bg-slate-800 rounded-lg
            text-sm font-medium text-slate-700 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Preview Layout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

interface LayoutPageProps {
  headers: TableHeader[];
  onUpdateHeaders: (updatedHeaders: TableHeader[]) => void;
}

export default function LayoutPage({ headers, onUpdateHeaders }: LayoutPageProps) {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'scheduler' | 'dashboard'>('scheduler');

  const categories = [
    { id: 'scheduler', label: 'Scheduler Views', icon: Calendar },
    { id: 'dashboard', label: 'Dashboard Views', icon: LayoutDashboard }
  ];

  const filteredLayouts = layoutOptions.filter(layout => 
    layout.category === activeCategory
  );

  useEffect(() => {
    if (selectedLayout) {
      // Update headers based on selected layout
    //   onUpdateHeaders([...headers]);
    }
  }, [selectedLayout, headers, onUpdateHeaders]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Choose Your View
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Select between scheduler and dashboard layouts for your workspace
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              whitespace-nowrap
              ${activeCategory === category.id
                ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }
            `}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLayouts.map((layout) => (
          <LayoutCard
            key={layout.id}
            layout={layout}
            isSelected={selectedLayout === layout.id}
            onSelect={setSelectedLayout}
          />
        ))}
      </div>

      {/* Selected Layout Preview */}
      {selectedLayout && (
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Layout Preview
            </h2>
            <ScrollArea className="h-[400px] rounded-lg border">
              <div className="p-4">
                <img
                  src={layoutOptions.find(l => l.id === selectedLayout)?.preview}
                  alt="Selected Layout Preview"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
}
