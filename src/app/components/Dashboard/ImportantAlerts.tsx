"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, ChevronUp, X, Check, Filter, Clock, Eye, ExternalLink, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description: string;
  action: {
    text: string;
    onClick: () => void;
  };
  details?: string;
  timestamp?: string;
  timestampDate?: Date; // For real-time relative timestamps
  service?: 'microsoft365' | 'googleworkspace' | 'slack' | 'zoom' | 'dropbox' | 'storage' | 'asana' | 'twilio' | 'github';
  isRead?: boolean;
}

interface AlertProps {
  alert: Alert;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  showTimeAgo: boolean;
  currentTime: Date;
}

const AlertItem: React.FC<AlertProps> = ({ 
  alert, 
  expandedId, 
  onToggleExpand,
  onDismiss,
  onMarkAsRead,
  showTimeAgo,
  currentTime
}) => {
  let iconColor;
  let iconBg;
  let borderColor;
  
  // Determine colors based on alert type
  switch (alert.type) {
    case 'warning':
      iconColor = 'text-amber-600';
      iconBg = 'bg-amber-50';
      borderColor = 'border-l-amber-500';
      break;
    case 'error':
      iconColor = 'text-red-600';
      iconBg = 'bg-red-50';
      borderColor = 'border-l-red-500';
      break;
    case 'info':
      iconColor = 'text-blue-600';
      iconBg = 'bg-blue-50';
      borderColor = 'border-l-blue-500';
      break;
    case 'success':
      iconColor = 'text-green-600';
      iconBg = 'bg-green-50';
      borderColor = 'border-l-green-500';
      break;
  }

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    if (!date) return '';
    
    const seconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);
    
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };
  
  // Service Icons
  const renderServiceIcon = () => {
    if (!alert.service) {
      // Default type icons if no service specified
      switch (alert.type) {
        case 'warning':
          return <AlertTriangle className={`h-5 w-5 ${iconColor}`} />;
        case 'error':
          return <AlertCircle className={`h-5 w-5 ${iconColor}`} />;
        case 'info':
          return <Info className={`h-5 w-5 ${iconColor}`} />;
        case 'success':
          return <CheckCircle className={`h-5 w-5 ${iconColor}`} />;
      }
    }

    switch (alert.service) {
      case 'microsoft365':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 11V0H0V11H11Z" fill="#F25022"/>
            <path d="M24 11V0H13V11H24Z" fill="#7FBA00"/>
            <path d="M11 24V13H0V24H11Z" fill="#00A4EF"/>
            <path d="M24 24V13H13V24H24Z" fill="#FFB900"/>
          </svg>
        );
      case 'googleworkspace':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
          </svg>
        );
      case 'slack':
        return (
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
        );
      case 'zoom':
        return (
          <svg className="h-5 w-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#2D8CFF" />
            <path
              d="M352 228.3v55.4c0 10.6-11.6 17-20.6 11.2l-45.4-27.7v22.8c0 11.1-9 20.1-20.1 20.1H160.1c-11.1 0-20.1-9-20.1-20.1v-76.4c0-11.1 9-20.1 20.1-20.1h106.8c11.1 0 20.1 9 20.1 20.1v22.8l45.4-27.7c9.1-5.6 20.6 0.6 20.6 11.2z"
              fill="#fff"
            />
          </svg>
        );
      case 'dropbox':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2 1.5L0 6.6L5.1 10.95L12.3 6.15L7.2 1.5Z" fill="#0061FF"/>
            <path d="M0 15.3L7.2 20.4L12.3 15.75L5.1 10.95L0 15.3Z" fill="#0061FF"/>
            <path d="M12.3 15.75L17.4 20.4L24.6 15.3L19.5 10.95L12.3 15.75Z" fill="#0061FF"/>
            <path d="M24.6 6.6L17.4 1.5L12.3 6.15L19.5 10.95L24.6 6.6Z" fill="#0061FF"/>
            <path d="M12.3262 16.7963L7.2 21.4963L5.1 20.0963V21.8963L12.3262 25.4963L19.5 21.8963V20.0963L17.4 21.4963L12.3262 16.7963Z" fill="#0061FF"/>
          </svg>
        );
      case 'storage':
        return <Icon type="storage" className={`h-5 w-5 ${iconColor}`} />;
      case 'asana':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.3625 0 0 5.3625 0 12C0 18.6375 5.3625 24 12 24C18.6375 24 24 18.6375 24 12C24 5.3625 18.6375 0 12 0Z" fill="#F06A6A"/>
            <path d="M17.4094 12.1406C15.9469 12.1406 14.7656 13.3219 14.7656 14.7844C14.7656 16.2469 15.9469 17.4281 17.4094 17.4281C18.8719 17.4281 20.0531 16.2469 20.0531 14.7844C20.0625 13.3219 18.8719 12.1406 17.4094 12.1406Z" fill="white"/>
            <path d="M6.59062 12.1406C5.12812 12.1406 3.94688 13.3219 3.94688 14.7844C3.94688 16.2469 5.12812 17.4281 6.59062 17.4281C8.05312 17.4281 9.23438 16.2469 9.23438 14.7844C9.23438 13.3219 8.05312 12.1406 6.59062 12.1406Z" fill="white"/>
            <path d="M12 6.5625C10.5375 6.5625 9.35625 7.74375 9.35625 9.20625C9.35625 10.6688 10.5375 11.85 12 11.85C13.4625 11.85 14.6438 10.6688 14.6438 9.20625C14.6438 7.74375 13.4625 6.5625 12 6.5625Z" fill="white"/>
          </svg>
        );
      case 'twilio':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#F22F46"/>
            <path d="M14.6866 14.6861C14.3268 15.0454 13.7454 15.0454 13.3861 14.6861C13.0268 14.3268 13.0268 13.7454 13.3861 13.3861C13.7454 13.0268 14.3268 13.0268 14.6866 13.3861C15.0454 13.7454 15.0454 14.3268 14.6866 14.6861ZM14.6866 10.6139C14.3268 10.9732 13.7454 10.9732 13.3861 10.6139C13.0268 10.2546 13.0268 9.67324 13.3861 9.31345C13.7454 8.95417 14.3268 8.95417 14.6866 9.31345C15.0454 9.67324 15.0454 10.2546 14.6866 10.6139ZM10.6139 14.6861C10.2546 15.0454 9.67324 15.0454 9.31345 14.6861C8.95417 14.3268 8.95417 13.7454 9.31345 13.3861C9.67324 13.0268 10.2546 13.0268 10.6139 13.3861C10.9732 13.7454 10.9732 14.3268 10.6139 14.6861ZM10.6139 10.6139C10.2546 10.9732 9.67324 10.9732 9.31345 10.6139C8.95417 10.2546 8.95417 9.67324 9.31345 9.31345C9.67324 8.95417 10.2546 8.95417 10.6139 9.31345C10.9732 9.67324 10.9732 10.2546 10.6139 10.6139Z" fill="white"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="#1B1F23"/>
          </svg>
        );
      default:
        // Default alert type icon as fallback
        return <Info className={`h-5 w-5 ${iconColor}`} />;
    }
  };

  // Custom Icon component
  const Icon = ({ type, className }: { type: string, className: string }) => {
    switch (type) {
      case 'storage':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <Info className={className} />;
    }
  };
  
  // Create a timestamp date if it doesn't exist
  const getTimestampDate = () => {
    if (alert.timestampDate) return alert.timestampDate;
    
    // Parse from timestamp string if available
    if (alert.timestamp && alert.timestamp.includes('minute')) {
      const minutes = parseInt(alert.timestamp);
      if (!isNaN(minutes)) {
        const date = new Date();
        date.setMinutes(date.getMinutes() - minutes);
        return date;
      }
    }
    
    if (alert.timestamp && alert.timestamp.includes('hour')) {
      const hours = parseInt(alert.timestamp);
      if (!isNaN(hours)) {
        const date = new Date();
        date.setHours(date.getHours() - hours);
        return date;
      }
    }
    
    // Default to recent alert
    return new Date(Date.now() - 1000 * 60 * 15); // 15 minutes ago
  };
  
  const timestampDate = getTimestampDate();
  const isExpanded = expandedId === alert.id;
  
  return (
    <div className={`border-b border-gray-200 last:border-b-0 transition-colors duration-200 ${!alert.isRead ? 'bg-gray-50' : ''} border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between py-4 px-4">
        <div className="flex items-center flex-1">
          <div className={`${iconBg} rounded-full p-2 mr-4 flex-shrink-0`}>
            {renderServiceIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium">{alert.title}</h3>
              {!alert.isRead && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">New</span>
              )}
            </div>
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600 pr-4">{alert.description}</p>
              {alert.timestamp && (
                <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                  <Clock className="h-3 w-3 mr-1" />
                  {showTimeAgo ? formatTimeAgo(timestampDate) : alert.timestamp}
                </div>
              )}
            </div>
            {alert.details && (
              <button 
                onClick={() => onToggleExpand(alert.id)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          {!alert.isRead && (
            <button 
              onClick={() => onMarkAsRead(alert.id)}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              title="Mark as read"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        
          <button 
            onClick={alert.action.onClick}
            className={`px-3 py-1 text-sm font-medium rounded flex items-center ${
              alert.type === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
              alert.type === 'warning' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 
              alert.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {alert.action.text}
            <ExternalLink className="h-3 w-3 ml-1" />
          </button>
          
          <button 
            onClick={() => onDismiss(alert.id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Expanded details section */}
      {isExpanded && alert.details && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 animate-fadeIn">
          <p className="text-sm text-gray-700 leading-relaxed">{alert.details}</p>
          <div className="mt-3 flex justify-end space-x-3">
            <button 
              onClick={() => onDismiss(alert.id)}
              className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Dismiss
            </button>
            <button 
              onClick={alert.action.onClick}
              className="px-3 py-1.5 text-xs bg-blue-600 border border-transparent rounded-md shadow-sm text-white hover:bg-blue-700 flex items-center"
            >
              {alert.action.text}
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export interface ImportantAlertsProps {
  externalAlerts?: Alert[];
}

const ImportantAlerts: React.FC<ImportantAlertsProps> = ({ externalAlerts = [] }) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [showTimeAgo, setShowTimeAgo] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const alertContainerRef = useRef<HTMLDivElement>(null);
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert1',
      type: 'warning',
      title: 'Google Workspace API limit approaching',
      description: '80% of daily quota used. Consider increasing limits.',
      action: { text: "View", onClick: () => console.log('View Google Workspace limit details') },
      details: 'Your Google Workspace API is currently at 80% of its daily limit. If the limit is reached, data synchronization will be paused until the quota resets at midnight UTC. To prevent disruption, consider upgrading your API tier or optimizing your API usage patterns.',
      timestamp: '15 minutes ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      service: 'googleworkspace',
      isRead: false
    },
    {
      id: 'alert2',
      type: 'error',
      title: 'Slack token needs reauthorization',
      description: 'Token will expire in 2 days. Please reauthorize.',
      action: { text: "Fix Now", onClick: () => console.log('Fix Slack token') },
      details: 'Your Slack integration token is set to expire in 2 days. Once expired, the system will no longer be able to retrieve data from Slack. Please reauthorize the connection to generate a new token. This requires admin access to your Slack workspace.',
      timestamp: '30 minutes ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      service: 'slack',
      isRead: false
    },
    {
      id: 'alert3',
      type: 'info',
      title: 'Storage usage at 75%',
      description: 'Consider archiving older data or upgrading storage.',
      action: { text: "Manage", onClick: () => console.log('Manage storage') },
      details: 'Your system storage utilization has reached 75% of allocated capacity. At current growth rates, you have approximately 45 days before reaching capacity. Consider archiving older data or increasing your storage allocation to prevent potential data loss.',
      timestamp: '1 hour ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      service: 'storage',
      isRead: true
    },
    {
      id: 'alert4',
      type: 'warning',
      title: 'Microsoft 365 subscription expiring',
      description: 'Your subscription will expire in 14 days.',
      action: { text: "Renew", onClick: () => console.log('Renew Microsoft 365 subscription') },
      details: 'Your Microsoft 365 Business subscription is set to expire in 14 days. To avoid service interruption, please renew your subscription before the expiration date.',
      timestamp: '2 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      service: 'microsoft365',
      isRead: true
    },
    {
      id: 'alert5',
      type: 'info',
      title: 'Dropbox storage near capacity',
      description: 'You have used 90% of your Dropbox storage.',
      action: { text: "Upgrade", onClick: () => console.log('Upgrade Dropbox storage') },
      details: 'Your Dropbox storage is almost full. To continue syncing your files without interruption, consider upgrading your plan or freeing up space by removing unnecessary files.',
      timestamp: '3 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      service: 'dropbox',
      isRead: false
    },
    {
      id: 'alert6',
      type: 'warning',
      title: 'Zoom meeting recording storage full',
      description: 'Unable to save new meeting recordings.',
      action: { text: "Manage", onClick: () => console.log('Manage Zoom storage') },
      details: 'Your Zoom cloud recording storage has reached its capacity. New meetings will not be recorded until you free up space or upgrade your storage plan.',
      timestamp: '4 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      service: 'zoom',
      isRead: true
    }
  ]);

  // Update current time every minute for "time ago" display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Add timestamp to alerts if not present
  const addTimestamp = (alert: Alert): Alert => {
    if (!alert.timestamp) {
      return { 
        ...alert, 
        timestamp: 'Just now',
        timestampDate: new Date(),
        isRead: false
      };
    }
    return alert;
  };

  // Handle external alerts
  useEffect(() => {
    if (externalAlerts.length > 0) {
      const timestampedAlerts = externalAlerts.map(addTimestamp);
      setAlerts(prev => [...timestampedAlerts, ...prev]);
    }
  }, [externalAlerts]);

  // Function to add a new alert
  const addAlert = (alert: Alert) => {
    setAlerts(prev => [addTimestamp(alert), ...prev]);
  };

  const toggleExpand = (id: string) => {
    if (expandedAlert === id) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(id);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };
  
  const dismissAll = () => {
    setAlerts([]);
  };
  
  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType;
    const serviceMatch = filterService === 'all' || alert.service === filterService;
    return typeMatch && serviceMatch;
  });
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  
  // Get unique services for filter dropdown
  const services = [...new Set(alerts.map(alert => alert.service))].filter(Boolean) as string[];
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Important Alerts
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 px-2 py-1"
              onClick={() => setShowTimeAgo(!showTimeAgo)}
            >
              <Clock className="h-4 w-4 mr-1" />
              {showTimeAgo ? "Show timestamp" : "Show time ago"}
            </button>
            
            <button
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand alerts" : "Collapse alerts"}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 flex items-center w-full sm:w-auto">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Filter className="h-4 w-4" />
              </div>
              <select
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All types</option>
                <option value="warning">Warnings</option>
                <option value="error">Errors</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
            </div>
            
            {services.length > 0 && (
              <div className="relative flex-1 w-full sm:w-auto">
                <select
                  className="pl-3 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                >
                  <option value="all">All services</option>
                  {services.map(service => (
                    <option key={service} value={service}>
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex space-x-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
              {unreadCount > 0 && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              
              {alerts.length > 0 && (
                <button
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={dismissAll}
                >
                  Dismiss all
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Alerts list with scroll area */}
      {!isCollapsed && (
        <div 
          className="max-h-96 overflow-y-auto scroll-smooth" 
          style={{ scrollbarWidth: 'thin' }}
          ref={alertContainerRef}
        >
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
            <AlertItem 
              key={alert.id}
              alert={alert}
              expandedId={expandedAlert}
              onToggleExpand={toggleExpand}
              onDismiss={dismissAlert}
              onMarkAsRead={markAsRead}
              showTimeAgo={showTimeAgo}
              currentTime={currentTime}
            />
          )) : (
            <div className="py-10 px-4 text-center">
              <div className="bg-green-100 rounded-full p-3 mx-auto w-14 h-14 flex items-center justify-center mb-4">
                <Check className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-1">All systems normal</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {filterType !== 'all' || filterService !== 'all' 
                  ? 'No alerts match your current filters.' 
                  : 'There are no active alerts at this time.'}
              </p>
              
              {(filterType !== 'all' || filterService !== 'all') && alerts.length > 0 && (
                <button 
                  onClick={() => {
                    setFilterType('all');
                    setFilterService('all');
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {isCollapsed && alerts.length > 0 && (
        <div className="p-4 text-center text-sm text-gray-600">
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''} {unreadCount > 0 ? `(${unreadCount} new)` : ''}
        </div>
      )}
      
      {/* Footer with stats */}
      {!isCollapsed && filteredAlerts.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
          <div>
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} displayed
            {filterType !== 'all' || filterService !== 'all' 
              ? ` (filtered from ${alerts.length})` 
              : ''}
          </div>
          <div className="flex space-x-6">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              {alerts.filter(a => a.type === 'error').length} error{alerts.filter(a => a.type === 'error').length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
              {alerts.filter(a => a.type === 'warning').length} warning{alerts.filter(a => a.type === 'warning').length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImportantAlerts;