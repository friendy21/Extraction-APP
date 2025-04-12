"use client"

import React, { useState } from 'react';

interface DataSourceProps {
  icon: React.ReactNode;
  name: string;
  syncInfo: string;
  isConnected: boolean;
  id: string;
  onConfigSaved: (id: string, config: any) => void;
}

const DataSource: React.FC<DataSourceProps & { 
  showSettings: string | null; 
  onToggleSettings: (id: string) => void;
  onConfigSaved: (id: string, config: any) => void;
}> = ({ 
  icon, 
  name, 
  syncInfo, 
  isConnected, 
  id, 
  showSettings, 
  onToggleSettings,
  onConfigSaved
}) => {
  // State for form values
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState('Every hour');
  const [dataTypes, setDataTypes] = useState({
    emails: true,
    files: true,
    calendar: true
  });
  const [connectionOptions, setConnectionOptions] = useState({
    forceRefresh: false,
    debugMode: false
  });
  
  // For new connection
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiSecret, setNewApiSecret] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // Handle saving config changes
  const handleSaveChanges = () => {
    // Collect settings data
    const configData = {
      apiKey: apiKey,
      syncFrequency: syncFrequency,
      dataTypes: dataTypes,
      connectionOptions: connectionOptions
    };
    
    // Call parent's function to handle the save
    onConfigSaved(id, configData);
    
    // Close the settings panel
    onToggleSettings(id);
  };

  // Handle connecting new source
  const handleConnect = () => {
    // Collect connection data
    const connectionData = {
      apiKey: newApiKey,
      apiSecret: newApiSecret,
      webhookUrl: webhookUrl
    };
    
    // Call parent's function to handle the connection
    onConfigSaved(id, connectionData);
    
    // Close the settings panel
    onToggleSettings(id);
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
    if (!isApiKeyVisible) {
      setApiKey('ak_' + Math.random().toString(36).substring(2, 15));
    } else {
      setApiKey('••••••••••••••••');
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="mr-4">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-600">{syncInfo}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs rounded-full ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button 
            onClick={() => onToggleSettings(id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isConnected ? 'Settings' : 'Connect'}
          </button>
        </div>
      </div>
      
      {/* Settings Panel (Expanded when showSettings matches this source's id) */}
      {showSettings === id && isConnected && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-md font-medium mb-3">{name} Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex">
                <input 
                  type={isApiKeyVisible ? "text" : "password"} 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 border rounded-l-md py-2 px-3 text-sm"
                />
                <button 
                  onClick={toggleApiKeyVisibility}
                  className="bg-blue-100 text-blue-700 px-3 py-2 text-sm rounded-r-md"
                >
                  {isApiKeyVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sync Frequency
              </label>
              <select 
                className="border rounded-md py-2 px-3 w-full text-sm"
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
              >
                <option>Every hour</option>
                <option>Every 6 hours</option>
                <option>Every 12 hours</option>
                <option>Daily</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Types
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id={`${id}-emails`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600" 
                    checked={dataTypes.emails}
                    onChange={(e) => setDataTypes({...dataTypes, emails: e.target.checked})}
                  />
                  <label htmlFor={`${id}-emails`} className="ml-2 text-sm text-gray-700">Emails</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-files`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600" 
                    checked={dataTypes.files}
                    onChange={(e) => setDataTypes({...dataTypes, files: e.target.checked})}
                  />
                  <label htmlFor={`${id}-files`} className="ml-2 text-sm text-gray-700">Files</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-calendar`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600" 
                    checked={dataTypes.calendar}
                    onChange={(e) => setDataTypes({...dataTypes, calendar: e.target.checked})}
                  />
                  <label htmlFor={`${id}-calendar`} className="ml-2 text-sm text-gray-700">Calendar</label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id={`${id}-force-refresh`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600" 
                    checked={connectionOptions.forceRefresh}
                    onChange={(e) => setConnectionOptions({...connectionOptions, forceRefresh: e.target.checked})}
                  />
                  <label htmlFor={`${id}-force-refresh`} className="ml-2 text-sm text-gray-700">Force refresh token</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-debug`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600" 
                    checked={connectionOptions.debugMode}
                    onChange={(e) => setConnectionOptions({...connectionOptions, debugMode: e.target.checked})}
                  />
                  <label htmlFor={`${id}-debug`} className="ml-2 text-sm text-gray-700">Enable debug mode</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => onToggleSettings(id)} 
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      
      {/* Connect Panel (when not connected) */}
      {showSettings === id && !isConnected && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-md font-medium mb-3">Connect to {name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-4">
                Connect to your {name} account to import data and set up automated synchronization.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input 
                type="text" 
                placeholder="Enter your API key" 
                className="border rounded-md py-2 px-3 w-full text-sm"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Secret
              </label>
              <input 
                type="password" 
                placeholder="Enter your API secret" 
                className="border rounded-md py-2 px-3 w-full text-sm"
                value={newApiSecret}
                onChange={(e) => setNewApiSecret(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL (Optional)
              </label>
              <input 
                type="text" 
                placeholder="https://..." 
                className="border rounded-md py-2 px-3 w-full text-sm"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide a webhook URL to receive real-time updates from {name}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => onToggleSettings(id)} 
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              disabled={!newApiKey || !newApiSecret}
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface DataSourceConfig {
  id: string;
  config: any;
}

interface DataSourceStatus {
  addAlert: (alert: any) => void;
}

const DataSourceStatus: React.FC<DataSourceStatus> = ({ addAlert }) => {
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<DataSourceConfig[]>([]);
  
  const toggleSettings = (id: string) => {
    if (activeSettings === id) {
      setActiveSettings(null);
    } else {
      setActiveSettings(id);
    }
  };

  // Handle saving configuration
  const handleConfigSaved = (id: string, config: any) => {
    // Update saved configs
    const existingIndex = savedConfigs.findIndex(item => item.id === id);
    if (existingIndex >= 0) {
      const updatedConfigs = [...savedConfigs];
      updatedConfigs[existingIndex] = { id, config };
      setSavedConfigs(updatedConfigs);
    } else {
      setSavedConfigs([...savedConfigs, { id, config }]);
    }

    // Find data source name
    const source = dataSources.find(source => source.id === id);
    const sourceName = source ? source.name : id;

    // Create alert for this action
    if (source?.isConnected) {
      // Settings saved
      addAlert({
        id: `alert-${id}-${Date.now()}`,
        type: 'info',
        title: `${sourceName} settings updated`,
        description: `Configuration changes for ${sourceName} have been saved.`,
        action: { 
          text: "View", 
          onClick: () => toggleSettings(id) 
        },
        details: `Updated settings include sync frequency (${config.syncFrequency}), data types, and connection options.`
      });
    } else {
      // New connection
      addAlert({
        id: `alert-${id}-${Date.now()}`,
        type: 'success',
        title: `${sourceName} connected successfully`,
        description: `${sourceName} has been connected to your account.`,
        action: { 
          text: "View", 
          onClick: () => toggleSettings(id) 
        },
        details: `Connection established with API key ${config.apiKey.slice(0, 3)}...${config.apiKey.slice(-3)}. Initial data sync will begin shortly.`
      });

      // Update the data source to be connected
      dataSources = dataSources.map(source => 
        source.id === id 
          ? { ...source, isConnected: true, syncInfo: "Last synced: Just now" } 
          : source
      );
    }
  };
  
  let dataSources = [
    {
      id: 'microsoft365',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 11V0H0V11H11Z" fill="#F25022"/>
            <path d="M24 11V0H13V11H24Z" fill="#7FBA00"/>
            <path d="M11 24V13H0V24H11Z" fill="#00A4EF"/>
            <path d="M24 24V13H13V24H24Z" fill="#FFB900"/>
          </svg>
        </div>
      ),
      name: "Microsoft 365",
      syncInfo: "Last synced: Today at 9:41 AM",
      isConnected: true
    },
    {
      id: 'googleworkspace',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
          </svg>
        </div>
      ),
      name: "Google Workspace",
      syncInfo: "Last synced: Today at 10:23 AM",
      isConnected: true
    },
    {
      id: 'slack',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.07 15.77C9.07 16.88 8.17 17.78 7.06 17.78C5.95 17.78 5.05 16.88 5.05 15.77C5.05 14.66 5.95 13.76 7.06 13.76H9.07V15.77Z" fill="#E01E5A"/>
            <path d="M10.08 15.77C10.08 14.66 10.98 13.76 12.09 13.76C13.2 13.76 14.1 14.66 14.1 15.77V20.79C14.1 21.9 13.2 22.8 12.09 22.8C10.98 22.8 10.08 21.9 10.08 20.79V15.77Z" fill="#E01E5A"/>
            <path d="M12.09 9.05C10.98 9.05 10.08 8.15 10.08 7.04C10.08 5.93 10.98 5.03 12.09 5.03C13.2 5.03 14.1 5.93 14.1 7.04V9.05H12.09Z" fill="#36C5F0"/>
            <path d="M12.09 10.06C13.2 10.06 14.1 10.96 14.1 12.07C14.1 13.18 13.2 14.08 12.09 14.08H7.07C5.96 14.08 5.06 13.18 5.06 12.07C5.06 10.96 5.96 10.06 7.07 10.06H12.09Z" fill="#36C5F0"/>
            <path d="M18.81 12.07C18.81 10.96 19.71 10.06 20.82 10.06C21.93 10.06 22.83 10.96 22.83 12.07C22.83 13.18 21.93 14.08 20.82 14.08H18.81V12.07Z" fill="#2EB67D"/>
            <path d="M17.8 12.07C17.8 13.18 16.9 14.08 15.79 14.08C14.68 14.08 13.78 13.18 13.78 12.07V7.05C13.78 5.94 14.68 5.04 15.79 5.04C16.9 5.04 17.8 5.94 17.8 7.05V12.07Z" fill="#2EB67D"/>
            <path d="M15.79 18.79C16.9 18.79 17.8 19.69 17.8 20.8C17.8 21.91 16.9 22.81 15.79 22.81C14.68 22.81 13.78 21.91 13.78 20.8V18.79H15.79Z" fill="#ECB22E"/>
            <path d="M15.79 17.78C14.68 17.78 13.78 16.88 13.78 15.77C13.78 14.66 14.68 13.76 15.79 13.76H20.81C21.92 13.76 22.82 14.66 22.82 15.77C22.82 16.88 21.92 17.78 20.81 17.78H15.79Z" fill="#ECB22E"/>
          </svg>
        </div>
      ),
      name: "Slack",
      syncInfo: "Last synced: Today at 8:17 AM",
      isConnected: true
    },
    {
      id: 'zoom',
      icon: (
        <div className="p-2 bg-blue-100 rounded-md">
          <svg className="h-5 w-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#2D8CFF" />
            <path
              d="M352 228.3v55.4c0 10.6-11.6 17-20.6 11.2l-45.4-27.7v22.8c0 11.1-9 20.1-20.1 20.1H160.1c-11.1 0-20.1-9-20.1-20.1v-76.4c0-11.1 9-20.1 20.1-20.1h106.8c11.1 0 20.1 9 20.1 20.1v22.8l45.4-27.7c9.1-5.6 20.6 0.6 20.6 11.2z"
              fill="#fff"
            />
          </svg>
        </div>
      ),
      name: "Zoom",
      syncInfo: "Last synced: Today at 7:52 AM",
      isConnected: true
    },
    {
      id: 'dropbox',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2 1.5L0 6.6L5.1 10.95L12.3 6.15L7.2 1.5Z" fill="#0061FF"/>
            <path d="M0 15.3L7.2 20.4L12.3 15.75L5.1 10.95L0 15.3Z" fill="#0061FF"/>
            <path d="M12.3 15.75L17.4 20.4L24.6 15.3L19.5 10.95L12.3 15.75Z" fill="#0061FF"/>
            <path d="M24.6 6.6L17.4 1.5L12.3 6.15L19.5 10.95L24.6 6.6Z" fill="#0061FF"/>
            <path d="M12.3262 16.7963L7.2 21.4963L5.1 20.0963V21.8963L12.3262 25.4963L19.5 21.8963V20.0963L17.4 21.4963L12.3262 16.7963Z" fill="#0061FF"/>
          </svg>
        </div>
      ),
      name: "Dropbox",
      syncInfo: "Last synced: Today at 6:45 AM",
      isConnected: true
    },
  ];
  
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {dataSources.map(source => (
        <DataSource 
          key={source.id}
          id={source.id}
          icon={source.icon}
          name={source.name}
          syncInfo={source.syncInfo}
          isConnected={source.isConnected}
          showSettings={activeSettings}
          onToggleSettings={toggleSettings}
          onConfigSaved={handleConfigSaved}
        />
      ))}
    </div>
  );
};

export default DataSourceStatus;