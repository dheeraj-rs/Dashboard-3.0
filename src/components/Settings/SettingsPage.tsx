import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Moon,
  Sun
} from 'lucide-react';

interface SettingsState {
  profile: {
    name: string;
    email: string;
    bio: string;
    avatar?: string;
  };
  account: {
    username: string;
    password: string;
    twoFactor: boolean;
    language: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    color: string;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    compactMode: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
    mentions: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
    activityStatus: boolean;
    searchVisibility: boolean;
  };
}

interface SettingsPageProps {
  onUpdateSettings: (settings: any) => void;
}

export default function SettingsPage({ onUpdateSettings }: SettingsPageProps) {
  const [settings, setSettings] = useState<SettingsState>({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      bio: '',
      avatar: undefined
    },
    account: {
      username: 'johndoe',
      password: '',
      twoFactor: false,
      language: 'en'
    },
    appearance: {
      theme: 'system',
      color: '#6366f1',
      fontSize: 'medium',
      reducedMotion: false,
      compactMode: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      mentions: true,
      updates: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      activityStatus: true,
      searchVisibility: true
    }
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (
    category: keyof SettingsState,
    field: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpdateSettings(settings);
    setIsDirty(false);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-900 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white dark:text-white " />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white   ">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 ">Manage your account preferences and settings</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 
                ${isDirty 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-500 dark:to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600' 
                  : 'bg-gray-100 text-gray-400 dark:text-gray-600 dark:bg-gray-800 cursor-not-allowed'}
              `}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-200 dark:border-white dark:text-white border-t-transparent rounded-full" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 text-gray-900 dark:text-white" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <User className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Bio</label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <Palette className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white ">Appearance</h2>
              </div>  
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-3 dark:bg-gray-900 backdrop-blur-sm">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('appearance', 'theme', theme.toLowerCase())}
                      className={`
                        flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                        ${settings.appearance.theme === theme.toLowerCase()
                          ? 'bg-indigo-500 text-white dark:bg-indigo-500 dark:text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}
                        transition-all duration-200
                      `}
                    >
                      {theme === 'Light' && <Sun className="h-4 w-4" />}
                      {theme === 'Dark' && <Moon className="h-4 w-4" />}
                      {theme === 'System' && <Settings className="h-4 w-4" />}
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 backdrop-blur-sm dark:text-gray-400 mb-3">Accent Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.appearance.color}
                    onChange={(e) => handleSettingChange('appearance', 'color', e.target.value)}
                    className="h-10 w-20 rounded-none cursor-pointer bg-white/80 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500"
                  />
                  <div className="flex-1 ">
                    <div 
                      className="h-10 rounded-lg"
                      style={{ backgroundColor: settings.appearance.color }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-400 mb-3 dark:bg-gray-900 backdrop-blur-sm">Preferences</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white ">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reduced Motion</span>
                    <button
                      onClick={() => handleSettingChange('appearance', 'reducedMotion', !settings.appearance.reducedMotion)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        transition-colors duration-200
                        ${settings.appearance.reducedMotion ? 'bg-indigo-500 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 rounded-full bg-gray-900 dark:bg-white
                          transition-transform duration-200
                          ${settings.appearance.reducedMotion ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </label>
                  
                  <label className="flex items-center justify-between dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Compact Mode</span>
                    <button
                      onClick={() => handleSettingChange('appearance', 'compactMode', !settings.appearance.compactMode)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        transition-colors duration-200
                        ${settings.appearance.compactMode ? 'bg-indigo-500 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 rounded-full bg-gray-900 dark:bg-white
                          transition-transform duration-200
                          ${settings.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <Bell className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white">
                    <div>
                      <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 capitalize">
                        {key === 'sms' ? 'SMS' : key} Notifications
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-200/50 ">
                        Receive notifications via {key === 'sms' ? 'SMS' : key}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSettingChange('notifications', key, !value)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        transition-colors duration-200
                        ${value ? 'bg-indigo-500 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900
                          transition-transform duration-200
                          ${value ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/80 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white dark:border-gray-700 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.privacy)
                  .filter(([key]) => key !== 'profileVisibility')
                  .map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-white">
                      <div>
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-200/50">
                          {key === 'dataSharing' 
                            ? 'Allow sharing your data with third parties'
                            : key === 'activityStatus'
                            ? 'Show when you are active'
                            : 'Allow others to find you in search'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSettingChange('privacy', key, !value)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors duration-200
                          ${value ? 'bg-indigo-500 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 rounded-full bg-gray-900 dark:bg-white
                            transition-transform duration-200
                            ${value ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 