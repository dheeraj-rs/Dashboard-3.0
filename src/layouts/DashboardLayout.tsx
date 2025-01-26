import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  Settings,
  Mail,
  X,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";
import debounce from 'lodash/debounce';
import { DashboardLayoutProps } from "../types/common";

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsSidebarOpen(false);
        setIsMiniSidebar(false);
      } else if (width < 1280) {
        setIsSidebarOpen(true);
        setIsMiniSidebar(true);
      } else {
        setIsSidebarOpen(true);
        setIsMiniSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  // Add after your other useEffect hooks:
  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedMode ? JSON.parse(savedMode) : false;
    document.documentElement.classList.toggle('dark', initialDarkMode);
  }, []);

  // Add after other useEffect hooks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileElement = document.getElementById('profile-section');
      if (profileElement && !profileElement.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800
      transition-all duration-300 ease-in-out
      ${isSidebarOpen 
        ? (isMiniSidebar ? 'pl-20' : 'pl-72') 
        : 'pl-0'
      }
      pt-20
    `}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-slate-900/60 to-slate-800/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-gradient-to-br from-slate-50/80 via-white to-slate-50/60 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60
          transform transition-all duration-300 ease-in-out
          border-r border-slate-200/70 dark:border-slate-700/70
          ${!isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMiniSidebar ? 'w-20' : 'w-72'}
          ${window.innerWidth >= 768 ? 'translate-x-0' : ''}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-5 px-6 relative border-b border-slate-100/80 dark:border-slate-700/80 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
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
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleFullSidebar}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 items-center justify-center 
              rounded-full bg-slate-50 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {!isMiniSidebar ? (
              <ChevronLeft className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-500 dark:text-slate-400" />
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
                      ? "bg-gradient-to-r from-violet-50 to-violet-100/80 dark:from-violet-800/50 dark:to-violet-900/80 text-violet-600 dark:text-violet-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50 dark:hover:from-slate-800/50 dark:hover:to-slate-900/50"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0
                  ${
                    activeTab === item.id ? "text-violet-600 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                {!isMiniSidebar && (
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {isMiniSidebar && (
                  <div className="absolute left-16 hidden group-hover:flex items-center">
                    <div className="w-2 h-2 rotate-45 bg-slate-800 dark:bg-slate-200 -ml-1" />
                    <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-sm py-2 px-3 rounded-lg whitespace-nowrap">
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
                className={`p-4 rounded-xl bg-gradient-to-br from-violet-50/70 via-white to-pink-50/60 dark:from-violet-800/70 dark:via-slate-900 dark:to-pink-800/60 
                border border-violet-100/40 dark:border-violet-700/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow 
                cursor-pointer relative`}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">DR</span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">Dheeraj R S</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Product Owner</p>
                  </div>

                  {/* Settings Button */}
                  <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors hover:shadow-sm">
                    <Settings className="h-5 w-5 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors" />
                  </button>
                </div>

                {/* Profile Popup */}
                {isProfileOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-medium text-xl">DR</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Dheeraj R S</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">dheeraj@example.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <User className="h-4 w-4" />
                        View Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div>
        {/* Header */}
        <header className={`
          fixed top-0 z-30 h-20 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700
          transition-all duration-300 ease-in-out
          ${isSidebarOpen 
            ? (isMiniSidebar ? 'left-20 right-0' : 'left-72 right-0')
            : 'left-0 right-0'
          }
        `}>
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </button>

              <div className="flex items-center gap-6">
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Welcome back! 👋
                </h1>
                <div className="hidden lg:block relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="w-80 pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 
                      focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all"
                  />
                  <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        debouncedSearch('');
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>
              <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <div className="hidden md:flex items-center gap-3 pl-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500" />
                <span className="font-medium text-slate-700 dark:text-slate-200">Dheeraj</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6">
          {/* Children Content */}
          <div className="bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 min-h-[82vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}