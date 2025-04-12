"use client"

import React from 'react';
import { useState, useEffect } from "react";
import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { CheckCircle2, Cloud, Cog, ExternalLink, Plus, RefreshCw, Settings, X, Eye, EyeOff } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStep } from '../StepContext'
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"

// Define a type for the connection status
type ConnectionStatus = {
  microsoft365: boolean;
  googleWorkspace: boolean;
  dropbox: boolean;
  slack: boolean;
  zoom: boolean;
};

// Define type for custom APIs
type CustomAPI = {
  id: string;
  name: string;
  isConnected: boolean;
  apiUrl: string;
  apiKey: string;
  headers: string;
  authType: string;
};

// Define configuration form data types
type Microsoft365Config = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
};

type GoogleWorkspaceConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
};

type DropboxConfig = {
  appKey: string;
  appSecret: string;
  redirectUri: string;
};

type SlackConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
};

type ZoomConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

// Modal component for configuration forms
const ConfigModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Password input component with show/hide toggle
const PasswordInput: React.FC<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}> = ({ id, value, onChange, required = false, placeholder = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input 
        id={id} 
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="pr-10"
      />
      <Button 
        type="button"
        variant="ghost" 
        size="sm" 
        className="absolute right-0 top-0 h-full px-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

// Custom API card component
const CustomAPICard: React.FC<{
  api: CustomAPI;
  onConnect: () => void;
  onDisconnect: () => void;
  onSettings: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}> = ({ api, onConnect, onDisconnect, onSettings, onRename, onDelete }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(api.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => {
    onRename(newName);
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#0061D5]">
          <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white"/>
            <circle cx="50" cy="50" r="40" fill="#ede9fe"/>
            <polyline points="40,40 30,50 40,60" stroke="#7c3aed" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="60,40 70,50 60,60" stroke="#7c3aed" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="45" y1="65" x2="55" y2="35" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <div className="flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="py-1 text-sm"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleRename}>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsRenaming(false)}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <CardTitle className="cursor-pointer flex items-center" onClick={() => setIsRenaming(true)}>
              {api.name}
              <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </CardTitle>
          )}
        </div>
        <Badge 
          className="ml-auto w-28 text-center"
          variant={api.isConnected ? "green" : "customGray"}
        >
          {api.isConnected ? "Connected" : "Not Connected"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Custom API endpoint for {api.name}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {api.isConnected ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 cursor-pointer"
              onClick={onSettings}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
              onClick={onConnect}
            >
              Connect
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              {showDeleteConfirm ? "Confirm" : "Delete"}
            </Button>
          </>
        )}
      </CardFooter>
      {showDeleteConfirm && (
        <div className="px-6 pb-4 text-center">
          <p className="text-sm text-red-600 mb-2">Are you sure you want to delete this API?</p>
          <div className="flex justify-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const ConnectionPage: React.FC = () => {
  // State to manage connection status
  const [connections, setConnections] = useState<ConnectionStatus>({
    microsoft365: false,
    googleWorkspace: false,
    dropbox: false,
    slack: false,
    zoom: false,
  });

  // State for custom APIs
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([
    {
      id: "api1",
      name: "Custom API",
      isConnected: false,
      apiUrl: '',
      apiKey: '',
      headers: '{"Content-Type": "application/json"}',
      authType: 'Bearer',
    }
  ]);

  // State to track which modal is visible
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // State to track which API is being edited
  const [editingApiId, setEditingApiId] = useState<string | null>(null);

  // Form data states
  const [microsoft365Form, setMicrosoft365Form] = useState<Microsoft365Config>({
    clientId: '',
    clientSecret: '',
    tenantId: '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/microsoft/callback' : '',
  });

  const [googleWorkspaceForm, setGoogleWorkspaceForm] = useState<GoogleWorkspaceConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/google/callback' : '',
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly',
  });

  const [dropboxForm, setDropboxForm] = useState<DropboxConfig>({
    appKey: '',
    appSecret: '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/dropbox/callback' : '',
  });

  const [slackForm, setSlackForm] = useState<SlackConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/slack/callback' : '',
    scopes: 'channels:read channels:history users:read',
  });

  const [zoomForm, setZoomForm] = useState<ZoomConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/zoom/callback' : '',
  });

  const [customAPIForm, setCustomAPIForm] = useState<Omit<CustomAPI, 'id' | 'name' | 'isConnected'>>({
    apiUrl: '',
    apiKey: '',
    headers: '{"Content-Type": "application/json"}',
    authType: 'Bearer',
  });

  // Initialize window location for redirect URIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMicrosoft365Form(prev => ({
        ...prev,
        redirectUri: window.location.origin + '/auth/microsoft/callback'
      }));
      setGoogleWorkspaceForm(prev => ({
        ...prev,
        redirectUri: window.location.origin + '/auth/google/callback'
      }));
      setDropboxForm(prev => ({
        ...prev,
        redirectUri: window.location.origin + '/auth/dropbox/callback'
      }));
      setSlackForm(prev => ({
        ...prev,
        redirectUri: window.location.origin + '/auth/slack/callback'
      }));
      setZoomForm(prev => ({
        ...prev,
        redirectUri: window.location.origin + '/auth/zoom/callback'
      }));
    }
  }, []);

  const router = useRouter();
  const { setCurrentStep } = useStep();

  // Show modal for service configuration
  const showConfigModal = (service: string) => {
    setActiveModal(service);
  };

  // Show settings modal for a service
  const showSettingsModal = (service: string) => {
    setActiveModal(`${service}_settings`);
  };

  // Show settings modal for a custom API
  const showCustomAPISettingsModal = (apiId: string) => {
    setEditingApiId(apiId);
    setActiveModal('customAPI_settings');
    
    // Find the API being edited and populate the form
    const api = customAPIs.find(api => api.id === apiId);
    if (api) {
      setCustomAPIForm({
        apiUrl: api.apiUrl,
        apiKey: api.apiKey,
        headers: api.headers,
        authType: api.authType,
      });
    }
  };

  // Helper function for form submission
  const handleFormSubmit = (service: keyof ConnectionStatus) => {
    // Here you would typically make API calls to authenticate with the service
    setConnections(prev => ({
      ...prev,
      [service]: true
    }));
    setActiveModal(null); // Close the modal after submission
  };

  // Function to connect a service without configuration
  const connectService = (service: keyof ConnectionStatus) => {
    // For a real implementation, this would show the auth flow first
    // For demo purposes, we'll just open the config modal
    showConfigModal(service);
  };

  // Function to disconnect a service
  const disconnectService = (service: keyof ConnectionStatus) => {
    // Here you would typically make API calls to revoke access
    setConnections(prev => ({
      ...prev,
      [service]: false
    }));
  };

  // Function to handle custom API connection
  const connectCustomAPI = (apiId: string) => {
    setEditingApiId(apiId);
    showConfigModal('customAPI');
  };

  // Function to handle custom API disconnection
  const disconnectCustomAPI = (apiId: string) => {
    setCustomAPIs(prevAPIs => 
      prevAPIs.map(api => 
        api.id === apiId 
          ? { ...api, isConnected: false } 
          : api
      )
    );
  };

  // Function to add a new custom API
  const addCustomAPI = () => {
    const newId = `api${customAPIs.length + 1}`;
    setCustomAPIs(prevAPIs => [
      ...prevAPIs,
      {
        id: newId,
        name: `Custom API ${customAPIs.length + 1}`,
        isConnected: false,
        apiUrl: '',
        apiKey: '',
        headers: '{"Content-Type": "application/json"}',
        authType: 'Bearer',
      }
    ]);
  };
  
  // Function to delete a custom API
  const deleteCustomAPI = (apiId: string) => {
    setCustomAPIs(prevAPIs => prevAPIs.filter(api => api.id !== apiId));
  };

  // Function to rename a custom API
  const renameCustomAPI = (apiId: string, newName: string) => {
    setCustomAPIs(prevAPIs => 
      prevAPIs.map(api => 
        api.id === apiId 
          ? { ...api, name: newName } 
          : api
      )
    );
  };

  // Function to handle custom API form submission
  const handleCustomAPIFormSubmit = () => {
    if (!editingApiId) return;

    setCustomAPIs(prevAPIs => 
      prevAPIs.map(api => 
        api.id === editingApiId 
          ? { 
              ...api, 
              isConnected: true,
              apiUrl: customAPIForm.apiUrl,
              apiKey: customAPIForm.apiKey,
              headers: customAPIForm.headers,
              authType: customAPIForm.authType,
            } 
          : api
      )
    );
    setActiveModal(null);
    setEditingApiId(null);
  };

  // Function to update custom API settings
  const updateCustomAPISettings = () => {
    if (!editingApiId) return;

    setCustomAPIs(prevAPIs => 
      prevAPIs.map(api => 
        api.id === editingApiId 
          ? { 
              ...api,
              apiUrl: customAPIForm.apiUrl,
              apiKey: customAPIForm.apiKey,
              headers: customAPIForm.headers,
              authType: customAPIForm.authType,
            } 
          : api
      )
    );
    setActiveModal(null);
    setEditingApiId(null);
  };

  const isAnyConnected = Object.values(connections).some(Boolean) || 
                         customAPIs.some(api => api.isConnected); // Check if any service is connected

  const handleBack = () => {
    setCurrentStep(0); // Move back to Organization step
    router.push('/components/FirstTimeSetUp/OrganizationSetup');
  };

  const handleNext = () => {
    setCurrentStep(2); // Move to Employees step
    router.push('/components/FirstTimeSetUp/employees');
  };

  // Render a platform card
  const renderPlatformCard = (
    name: string, 
    icon: React.ReactNode, 
    description: string, 
    connectionKey: keyof ConnectionStatus,
    serviceName: string
  ) => {
    const isConnected = connections[connectionKey];
    
    return (
      <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-md">
            {icon}
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
          </div>
          <Badge 
            variant={isConnected ? "green" : "customGray"}
            className="ml-auto w-28 text-center"
          >
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>{description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isConnected ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                onClick={() => disconnectService(connectionKey)}
              >
                Disconnect
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 cursor-pointer"
                onClick={() => showSettingsModal(serviceName)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => connectService(connectionKey)}
            >
              Connect
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container px-4 py-6 md:px-6 md:py-12 lg:py-16">
        <div className="flex flex-col gap-8">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Data Source Connection</h2>
            <p className="text-muted-foreground mt-2">
              Connect to your workplace platforms to collect data for analysis.
            </p>
          </div>

          {/* Integration Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Microsoft 365 */}
            {renderPlatformCard(
              "Microsoft 365",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 23 23" className="bg-[#f3f2f1]">
                <path fill="#F25022" d="M1 1h9v9H1z" />
                <path fill="#80BA01" d="M13 1h9v9h-9z" />
                <path fill="#02A4EF" d="M1 13h9v9H1z" />
                <path fill="#FFB902" d="M13 13h9v9h-9z" />
              </svg>,
              "Connect to access emails, calendar, SharePoint, and Teams data.",
              "microsoft365",
              "microsoft365"
            )}

            {/* Google Workspace */}
            {renderPlatformCard(
              "Google Workspace",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="bg-white">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>,
              "Connect to access Gmail, Calendar, Drive, and Google Chat data.",
              "googleWorkspace",
              "googleWorkspace"
            )}

            {/* Dropbox */}
            {renderPlatformCard(
              "Dropbox",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#0061ff]">
                <path d="M12 14.56l4.07-3.32 4.43 2.94-4.43 2.94L12 14.56zm-8.5-0.38l4.43-2.94 4.07 3.32-4.07 2.56L3.5 14.18zm8.5-7.37l4.07 3.32-4.07 2.56-4.07-2.56L12 6.81zm-4.07 5.88L3.5 9.75l4.43-2.94 4.07 2.56-4.07 3.32z" />
              </svg>,
              "Connect to access Dropbox files and sharing activities.",
              "dropbox",
              "dropbox"
            )}

            {/* Slack */}
            {renderPlatformCard(
              "Slack",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#4A154B]">
                <path d="M6 15a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>,
              "Connect to access Slack messages and activity data.",
              "slack",
              "slack"
            )}

            {/* Zoom */}
            {renderPlatformCard(
              "Zoom",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#2D8CFF]">
                <path d="M16 8v8H8V8h8m0-2H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm4 2v8h-1V8h1m0-2h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM5 8v8H4V8h1m0-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
              </svg>,
              "Connect to access Zoom meeting and participant data.",
              "zoom",
              "zoom"
            )}

            {/* Custom API Cards */}
            {customAPIs.map(api => (
              <CustomAPICard
                key={api.id}
                api={api}
                onConnect={() => connectCustomAPI(api.id)}
                onDisconnect={() => disconnectCustomAPI(api.id)}
                onSettings={() => showCustomAPISettingsModal(api.id)}
                onRename={(newName) => renameCustomAPI(api.id, newName)}
                onDelete={() => deleteCustomAPI(api.id)}
              />
            ))}

            {/* Add New API Card */}
            <Card 
              className="bg-white border border-dashed border-gray-300 shadow-sm hover:shadow-md rounded-lg transition-all duration-300 cursor-pointer"
              onClick={addCustomAPI}
            >
              <div className="flex flex-col items-center justify-center p-6 h-full">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-center text-gray-500 font-medium">Add New API Connection</p>
              </div>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button 
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ${isAnyConnected ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isAnyConnected}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Configuration Modals */}
      
      {/* Microsoft 365 Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'microsoft365'}
        onClose={() => setActiveModal(null)}
        title="Microsoft 365 Configuration"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit('microsoft365');
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ms-client-id">Client ID</Label>
              <Input 
                id="ms-client-id" 
                value={microsoft365Form.clientId}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-client-secret">Client Secret</Label>
              <PasswordInput 
                id="ms-client-secret" 
                value={microsoft365Form.clientSecret}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-tenant-id">Tenant ID</Label>
              <Input 
                id="ms-tenant-id" 
                value={microsoft365Form.tenantId}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, tenantId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-redirect-uri">Redirect URI</Label>
              <Input 
                id="ms-redirect-uri" 
                value={microsoft365Form.redirectUri}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, redirectUri: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500 mt-1">This URI needs to be registered in your Azure AD app.</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Microsoft 365 Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'microsoft365_settings'}
        onClose={() => setActiveModal(null)}
        title="Microsoft 365 Settings"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ms-client-id-settings">Client ID</Label>
              <Input 
                id="ms-client-id-settings" 
                value={microsoft365Form.clientId}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-client-secret-settings">Client Secret</Label>
              <PasswordInput
                id="ms-client-secret-settings" 
                value={microsoft365Form.clientSecret}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-tenant-id-settings">Tenant ID</Label>
              <Input 
                id="ms-tenant-id-settings" 
                value={microsoft365Form.tenantId}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, tenantId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="ms-redirect-uri-settings">Redirect URI</Label>
              <Input 
                id="ms-redirect-uri-settings" 
                value={microsoft365Form.redirectUri}
                onChange={(e) => setMicrosoft365Form({...microsoft365Form, redirectUri: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Google Workspace Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'googleWorkspace'}
        onClose={() => setActiveModal(null)}
        title="Google Workspace Configuration"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit('googleWorkspace');
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="google-client-id">Client ID</Label>
              <Input 
                id="google-client-id" 
                value={googleWorkspaceForm.clientId}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-client-secret">Client Secret</Label>
              <PasswordInput
                id="google-client-secret" 
                value={googleWorkspaceForm.clientSecret}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-redirect-uri">Redirect URI</Label>
              <Input 
                id="google-redirect-uri" 
                value={googleWorkspaceForm.redirectUri}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-scopes">API Scopes</Label>
              <Textarea 
                id="google-scopes" 
                value={googleWorkspaceForm.scope}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, scope: e.target.value})}
                className="min-h-20"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Space-separated list of OAuth scopes needed for your integration.</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Google Workspace Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'googleWorkspace_settings'}
        onClose={() => setActiveModal(null)}
        title="Google Workspace Settings"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            {/* Same fields as configuration but for settings */}
            <div>
              <Label htmlFor="google-client-id-settings">Client ID</Label>
              <Input 
                id="google-client-id-settings" 
                value={googleWorkspaceForm.clientId}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-client-secret-settings">Client Secret</Label>
              <PasswordInput
                id="google-client-secret-settings" 
                value={googleWorkspaceForm.clientSecret}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-redirect-uri-settings">Redirect URI</Label>
              <Input 
                id="google-redirect-uri-settings" 
                value={googleWorkspaceForm.redirectUri}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="google-scopes-settings">API Scopes</Label>
              <Textarea 
                id="google-scopes-settings" 
                value={googleWorkspaceForm.scope}
                onChange={(e) => setGoogleWorkspaceForm({...googleWorkspaceForm, scope: e.target.value})}
                className="min-h-20"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Dropbox Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'dropbox'}
        onClose={() => setActiveModal(null)}
        title="Dropbox Configuration"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit('dropbox');
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dropbox-app-key">App Key</Label>
              <Input 
                id="dropbox-app-key" 
                value={dropboxForm.appKey}
                onChange={(e) => setDropboxForm({...dropboxForm, appKey: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="dropbox-app-secret">App Secret</Label>
              <PasswordInput
                id="dropbox-app-secret" 
                value={dropboxForm.appSecret}
                onChange={(e) => setDropboxForm({...dropboxForm, appSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="dropbox-redirect-uri">Redirect URI</Label>
              <Input 
                id="dropbox-redirect-uri" 
                value={dropboxForm.redirectUri}
                onChange={(e) => setDropboxForm({...dropboxForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Dropbox Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'dropbox_settings'}
        onClose={() => setActiveModal(null)}
        title="Dropbox Settings"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dropbox-app-key-settings">App Key</Label>
              <Input 
                id="dropbox-app-key-settings" 
                value={dropboxForm.appKey}
                onChange={(e) => setDropboxForm({...dropboxForm, appKey: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="dropbox-app-secret-settings">App Secret</Label>
              <PasswordInput
                id="dropbox-app-secret-settings" 
                value={dropboxForm.appSecret}
                onChange={(e) => setDropboxForm({...dropboxForm, appSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="dropbox-redirect-uri-settings">Redirect URI</Label>
              <Input 
                id="dropbox-redirect-uri-settings" 
                value={dropboxForm.redirectUri}
                onChange={(e) => setDropboxForm({...dropboxForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Slack Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'slack'}
        onClose={() => setActiveModal(null)}
        title="Slack Configuration"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit('slack');
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="slack-client-id">Client ID</Label>
              <Input 
                id="slack-client-id" 
                value={slackForm.clientId}
                onChange={(e) => setSlackForm({...slackForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-client-secret">Client Secret</Label>
              <PasswordInput
                id="slack-client-secret" 
                value={slackForm.clientSecret}
                onChange={(e) => setSlackForm({...slackForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-redirect-uri">Redirect URI</Label>
              <Input 
                id="slack-redirect-uri" 
                value={slackForm.redirectUri}
                onChange={(e) => setSlackForm({...slackForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-scopes">API Scopes</Label>
              <Input 
                id="slack-scopes" 
                value={slackForm.scopes}
                onChange={(e) => setSlackForm({...slackForm, scopes: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Space-separated list of scopes needed for your integration.</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Slack Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'slack_settings'}
        onClose={() => setActiveModal(null)}
        title="Slack Settings"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="slack-client-id-settings">Client ID</Label>
              <Input 
                id="slack-client-id-settings" 
                value={slackForm.clientId}
                onChange={(e) => setSlackForm({...slackForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-client-secret-settings">Client Secret</Label>
              <PasswordInput
                id="slack-client-secret-settings" 
                value={slackForm.clientSecret}
                onChange={(e) => setSlackForm({...slackForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-redirect-uri-settings">Redirect URI</Label>
              <Input 
                id="slack-redirect-uri-settings" 
                value={slackForm.redirectUri}
                onChange={(e) => setSlackForm({...slackForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="slack-scopes-settings">API Scopes</Label>
              <Input 
                id="slack-scopes-settings" 
                value={slackForm.scopes}
                onChange={(e) => setSlackForm({...slackForm, scopes: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Zoom Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'zoom'}
        onClose={() => setActiveModal(null)}
        title="Zoom Configuration"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit('zoom');
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zoom-client-id">Client ID</Label>
              <Input 
                id="zoom-client-id" 
                value={zoomForm.clientId}
                onChange={(e) => setZoomForm({...zoomForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="zoom-client-secret">Client Secret</Label>
              <PasswordInput
                id="zoom-client-secret" 
                value={zoomForm.clientSecret}
                onChange={(e) => setZoomForm({...zoomForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="zoom-redirect-uri">Redirect URI</Label>
              <Input 
                id="zoom-redirect-uri" 
                value={zoomForm.redirectUri}
                onChange={(e) => setZoomForm({...zoomForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Zoom Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'zoom_settings'}
        onClose={() => setActiveModal(null)}
        title="Zoom Settings"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zoom-client-id-settings">Client ID</Label>
              <Input 
                id="zoom-client-id-settings" 
                value={zoomForm.clientId}
                onChange={(e) => setZoomForm({...zoomForm, clientId: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="zoom-client-secret-settings">Client Secret</Label>
              <PasswordInput
                id="zoom-client-secret-settings" 
                value={zoomForm.clientSecret}
                onChange={(e) => setZoomForm({...zoomForm, clientSecret: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="zoom-redirect-uri-settings">Redirect URI</Label>
              <Input 
                id="zoom-redirect-uri-settings" 
                value={zoomForm.redirectUri}
                onChange={(e) => setZoomForm({...zoomForm, redirectUri: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Custom API Config Modal */}
      <ConfigModal
        isOpen={activeModal === 'customAPI'}
        onClose={() => setActiveModal(null)}
        title={`${editingApiId ? customAPIs.find(api => api.id === editingApiId)?.name || 'Custom API' : 'Custom API'} Configuration`}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCustomAPIFormSubmit();
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-url">API Endpoint URL</Label>
              <Input 
                id="api-url" 
                value={customAPIForm.apiUrl}
                onChange={(e) => setCustomAPIForm({...customAPIForm, apiUrl: e.target.value})}
                placeholder="https://api.example.com/data"
                required
              />
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <PasswordInput
                id="api-key" 
                value={customAPIForm.apiKey}
                onChange={(e) => setCustomAPIForm({...customAPIForm, apiKey: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="auth-type">Authentication Type</Label>
              <select 
                id="auth-type" 
                value={customAPIForm.authType}
                onChange={(e) => setCustomAPIForm({...customAPIForm, authType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Bearer">Bearer Token</option>
                <option value="Basic">Basic Auth</option>
                <option value="ApiKey">API Key in Header</option>
                <option value="None">No Auth</option>
              </select>
            </div>
            <div>
              <Label htmlFor="headers">Custom Headers (JSON format)</Label>
              <Textarea 
                id="headers" 
                value={customAPIForm.headers}
                onChange={(e) => setCustomAPIForm({...customAPIForm, headers: e.target.value})}
                className="font-mono text-sm min-h-20"
                placeholder='{"Content-Type": "application/json", "X-Custom-Header": "value"}'
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Connect</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {/* Custom API Settings Modal */}
      <ConfigModal
        isOpen={activeModal === 'customAPI_settings'}
        onClose={() => setActiveModal(null)}
        title={`${editingApiId ? customAPIs.find(api => api.id === editingApiId)?.name || 'Custom API' : 'Custom API'} Settings`}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          updateCustomAPISettings();
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-url-settings">API Endpoint URL</Label>
              <Input 
                id="api-url-settings" 
                value={customAPIForm.apiUrl}
                onChange={(e) => setCustomAPIForm({...customAPIForm, apiUrl: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="api-key-settings">API Key</Label>
              <PasswordInput
                id="api-key-settings" 
                value={customAPIForm.apiKey}
                onChange={(e) => setCustomAPIForm({...customAPIForm, apiKey: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="auth-type-settings">Authentication Type</Label>
              <select 
                id="auth-type-settings" 
                value={customAPIForm.authType}
                onChange={(e) => setCustomAPIForm({...customAPIForm, authType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Bearer">Bearer Token</option>
                <option value="Basic">Basic Auth</option>
                <option value="ApiKey">API Key in Header</option>
                <option value="None">No Auth</option>
              </select>
            </div>
            <div>
              <Label htmlFor="headers-settings">Custom Headers (JSON format)</Label>
              <Textarea 
                id="headers-settings" 
                value={customAPIForm.headers}
                onChange={(e) => setCustomAPIForm({...customAPIForm, headers: e.target.value})}
                className="font-mono text-sm min-h-20"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>
    </main>
  )
}

export default ConnectionPage;