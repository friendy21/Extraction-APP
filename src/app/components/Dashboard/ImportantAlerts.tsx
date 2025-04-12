"use client"

import React, { useState, useEffect } from 'react';

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
  service?: 'microsoft365' | 'googleworkspace' | 'slack' | 'zoom' | 'dropbox' | 'storage';
}

interface AlertProps {
  alert: Alert;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertItem: React.FC<AlertProps> = ({ 
  alert, 
  expandedId, 
  onToggleExpand,
  onDismiss
}) => {
  let iconColor;
  let iconBg;
  
  switch (alert.type) {
    case 'warning':
      iconColor = 'text-amber-600';
      iconBg = 'bg-amber-100';
      break;
    case 'error':
      iconColor = 'text-red-600';
      iconBg = 'bg-red-100';
      break;
    case 'info':
      iconColor = 'text-blue-600';
      iconBg = 'bg-blue-100';
      break;
    case 'success':
      iconColor = 'text-green-600';
      iconBg = 'bg-green-100';
      break;
  }
  
  // Service Icons
  const renderServiceIcon = () => {
    if (!alert.service) {
      // Fallback to default type icons if no service specified
      switch (alert.type) {
        case 'warning':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          );
        case 'error':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          );
        case 'info':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          );
        case 'success':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          );
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
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        // Default alert type icon as fallback
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="flex items-center flex-1">
          <div className={`${iconBg} rounded-full p-2 mr-4 flex-shrink-0`}>
            {renderServiceIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{alert.title}</h3>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">{alert.description}</p>
              {alert.timestamp && (
                <span className="text-xs text-gray-500 ml-2">{alert.timestamp}</span>
              )}
            </div>
            {alert.details && (
              <button 
                onClick={() => onToggleExpand(alert.id)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                {expandedId === alert.id ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={alert.action.onClick}
            className={`px-3 py-1 text-sm font-medium rounded ${
              alert.type === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
              alert.type === 'warning' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 
              alert.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {alert.action.text}
          </button>
          
          <button 
            onClick={() => onDismiss(alert.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Expanded details section */}
      {expandedId === alert.id && alert.details && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-700">{alert.details}</p>
          <div className="mt-3 flex justify-end space-x-3">
            <button 
              onClick={() => onDismiss(alert.id)}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
            >
              Dismiss
            </button>
            <button 
              onClick={alert.action.onClick}
              className="px-3 py-1 text-xs bg-blue-600 border border-transparent rounded-md shadow-sm text-white hover:bg-blue-700"
            >
              {alert.action.text}
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
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert1',
      type: 'warning',
      title: 'Google Workspace API limit approaching',
      description: '80% of daily quota used. Consider increasing limits.',
      action: { text: "View", onClick: () => console.log('View Google Workspace limit details') },
      details: 'Your Google Workspace API is currently at 80% of its daily limit. If the limit is reached, data synchronization will be paused until the quota resets at midnight UTC. To prevent disruption, consider upgrading your API tier or optimizing your API usage patterns.',
      timestamp: '15 minutes ago',
      service: 'googleworkspace'
    },
    {
      id: 'alert2',
      type: 'error',
      title: 'Slack token needs reauthorization',
      description: 'Token will expire in 2 days. Please reauthorize.',
      action: { text: "Fix Now", onClick: () => console.log('Fix Slack token') },
      details: 'Your Slack integration token is set to expire in 2 days. Once expired, the system will no longer be able to retrieve data from Slack. Please reauthorize the connection to generate a new token. This requires admin access to your Slack workspace.',
      timestamp: '30 minutes ago',
      service: 'slack'
    },
    {
      id: 'alert3',
      type: 'info',
      title: 'Storage usage at 75%',
      description: 'Consider archiving older data or upgrading storage.',
      action: { text: "Manage", onClick: () => console.log('Manage storage') },
      details: 'Your system storage utilization has reached 75% of allocated capacity. At current growth rates, you have approximately 45 days before reaching capacity. Consider archiving older data or increasing your storage allocation to prevent potential data loss.',
      timestamp: '1 hour ago',
      service: 'storage'
    },
    {
      id: 'alert4',
      type: 'warning',
      title: 'Microsoft 365 subscription expiring',
      description: 'Your subscription will expire in 14 days.',
      action: { text: "Renew", onClick: () => console.log('Renew Microsoft 365 subscription') },
      details: 'Your Microsoft 365 Business subscription is set to expire in 14 days. To avoid service interruption, please renew your subscription before the expiration date.',
      timestamp: '2 hours ago',
      service: 'microsoft365'
    },
    {
      id: 'alert5',
      type: 'info',
      title: 'Dropbox storage near capacity',
      description: 'You have used 90% of your Dropbox storage.',
      action: { text: "Upgrade", onClick: () => console.log('Upgrade Dropbox storage') },
      details: 'Your Dropbox storage is almost full. To continue syncing your files without interruption, consider upgrading your plan or freeing up space by removing unnecessary files.',
      timestamp: '3 hours ago',
      service: 'dropbox'
    },
    {
      id: 'alert6',
      type: 'warning',
      title: 'Zoom meeting recording storage full',
      description: 'Unable to save new meeting recordings.',
      action: { text: "Manage", onClick: () => console.log('Manage Zoom storage') },
      details: 'Your Zoom cloud recording storage has reached its capacity. New meetings will not be recorded until you free up space or upgrade your storage plan.',
      timestamp: '4 hours ago',
      service: 'zoom'
    }
  ]);

  // Add timestamp to alerts if not present
  const addTimestamp = (alert: Alert): Alert => {
    if (!alert.timestamp) {
      return { ...alert, timestamp: 'Just now' };
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
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {alerts.length > 0 ? alerts.map(alert => (
        <AlertItem 
          key={alert.id}
          alert={alert}
          expandedId={expandedAlert}
          onToggleExpand={toggleExpand}
          onDismiss={dismissAlert}
        />
      )) : (
        <div className="py-8 px-4 text-center">
          <div className="bg-green-100 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-md font-medium text-gray-900 mb-1">All systems normal</h3>
          <p className="text-sm text-gray-500">There are no active alerts at this time.</p>
        </div>
      )}
    </div>
  );
};

export default ImportantAlerts;