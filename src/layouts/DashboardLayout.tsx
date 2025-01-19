import { ReactNode, useState, useEffect, useCallback } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  Settings,
  Mail,
  X,
} from "lucide-react";
import debounce from 'lodash/debounce';

interface DashboardLayoutProps {
  children: ReactNode;
  navigationItems: Array<{
    id: string;
    label: string;
    icon: any;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export default function DashboardLayout({
  children,
  navigationItems,
  activeTab,
  setActiveTab,
  onSearch,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniSidebar, setIsMiniSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsMiniSidebar(false);
      } else if (window.innerWidth < 1280) {
        setIsMiniSidebar(true);
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(true);
        setIsMiniSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar functions
  const toggleFullSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsMiniSidebar(!isMiniSidebar);
    }
  };

  const toggleMobileSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearch = (query: string) => {
    // Implement your search logic here
    console.log('Searching for:', query);
    // You can filter your data, make API calls, etc.
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-slate-900/60 to-slate-800/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/60 transform transition-all duration-300 ease-in-out 
          ${!isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
          ${isMiniSidebar ? "w-20" : "w-72"}
          border-r border-slate-200/70 md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-5 px-6 relative border-b border-slate-100/80 bg-gradient-to-r from-slate-50/50 to-white">
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500" />

          <div className="flex items-center gap-4 overflow-hidden">
            {!isMiniSidebar && (
              <span className="font-semibold text-lg truncate bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard 3.0
              </span>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleFullSidebar}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 items-center justify-center 
              rounded-full bg-slate-50 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {!isMiniSidebar ? (
              <ChevronLeft className="h-5 w-5 text-slate-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-500" />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${isMiniSidebar ? "justify-center" : "justify-start"}
                  ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-violet-50 to-violet-100/80 text-violet-600"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0
                  ${
                    activeTab === item.id ? "text-violet-600" : "text-slate-400"
                  }`}
                />
                {!isMiniSidebar && (
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {isMiniSidebar && (
                  <div className="absolute left-16 hidden group-hover:flex items-center">
                    <div className="w-2 h-2 rotate-45 bg-slate-800 -ml-1" />
                    <div className="bg-slate-800 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap">
                      {item.label}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          {!isMiniSidebar && (
  <div className="absolute bottom-8 left-4 right-4">
    <div
      className={`p-4 rounded-xl bg-gradient-to-br from-violet-50/70 via-white to-pink-50/60 
      border border-violet-100/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center">
          <span className="text-white font-medium text-lg">DR</span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">Dheeraj R S</p>
          <p className="text-sm text-slate-500 truncate">Product Owner</p>
        </div>

        {/* Settings Button */}
        <button
          className="p-2 hover:bg-white rounded-lg transition-colors hover:shadow-sm"
          onClick={() => {
            // Add your settings click handler here
            console.log("Settings clicked");
          }}
        >
          <Settings className="h-5 w-5 text-slate-400 hover:text-violet-500 transition-colors" />
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300
        ${isSidebarOpen ? (isMiniSidebar ? "md:pl-20" : "md:pl-72") : "pl-0"}`}
      >
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="h-6 w-6 text-slate-500" />
              </button>

              <div className="flex items-center gap-6">
                <h1 className="text-xl font-semibold text-slate-800">
                  Welcome back! 👋
                </h1>
                <div className="hidden lg:block relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="w-80 pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-0 focus:ring-2 
                      focus:ring-violet-500/20 transition-all"
                  />
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        debouncedSearch('');
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                <Mail className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>
              <div className="hidden md:block w-px h-6 bg-slate-200" />
              <div className="hidden md:flex items-center gap-3 pl-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500" />
                <span className="font-medium text-slate-700">Dheeraj</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6">
          {/* Children Content */}
          <div className="bg-gradient-to-br from-slate-50/50 to-white rounded-xl border border-slate-200 p-3 min-h-[82vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
