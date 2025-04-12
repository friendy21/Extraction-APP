"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from './ImportantAlerts';

// User and Session types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  ipAddress: string;
}

interface Session {
  id: string;
  role: string;
  department: string;
  ipAddress: string;
  status: string;
  duration: string;
}

// Props for SystemOverview component
interface SystemOverviewProps {
  activeUserCount: number;
  users: User[];
  sessions: Session[];
  onTerminateSession: (sessionId: string) => void;
  onTerminateAllSessions: () => void;
  addAlert: (alert: Alert) => void;
}

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// System Health Modal Content
const SystemHealthContent: React.FC<{ 
  onHealthCheck: () => void;
  addAlert: (alert: Alert) => void;
}> = ({ onHealthCheck, addAlert }) => {
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  
  const runHealthCheck = () => {
    setIsCheckingHealth(true);
    
    // Simulate health check
    setTimeout(() => {
      setIsCheckingHealth(false);
      onHealthCheck();
      
      // Add alert about health check
      addAlert({
        id: `health-check-${Date.now()}`,
        type: 'success',
        title: 'System health check completed',
        description: 'All systems are operating normally',
        action: { 
          text: "View Details", 
          onClick: () => console.log('View health check details') 
        },
        details: 'A comprehensive system health check has been completed. All components are functioning properly: Core API (123ms), Database (215ms), Analytics Engine (789ms), Authentication Service (65ms).'
      });
    }, 2000);
  };
  
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">Current status and health metrics for all Glynac system components.</p>
      
      <div className="bg-green-50 p-4 rounded-lg flex items-center mb-6">
        <div className="bg-green-500 rounded-full p-2 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">All Systems Operational</h3>
          <p className="text-sm text-gray-600">Last checked: Today at 11:42 AM</p>
        </div>
        <button 
          onClick={runHealthCheck}
          disabled={isCheckingHealth}
          className={`px-3 py-1 rounded-md text-sm ${
            isCheckingHealth 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isCheckingHealth ? 'Checking...' : 'Run Health Check'}
        </button>
      </div>
      
      <h3 className="font-medium mb-4">Component Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Core API</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Operational</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Response Time</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-500 h-2.5 rounded-full w-1/5"></div>
          </div>
          <p className="text-xs text-gray-500 text-right">123ms</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Database</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Operational</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Query Performance</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-500 h-2.5 rounded-full w-1/4"></div>
          </div>
          <p className="text-xs text-gray-500 text-right">215ms</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Analytics Engine</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Operational</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Processing Speed</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-500 h-2.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-gray-500 text-right">789ms</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Authentication Service</h4>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Operational</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Response Time</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-500 h-2.5 rounded-full w-1/6"></div>
          </div>
          <p className="text-xs text-gray-500 text-right">65ms</p>
        </div>
      </div>
      
      <h3 className="font-medium mb-4">System Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-2">CPU Usage</h4>
          <p className="text-2xl font-semibold mb-2">32%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full w-1/3"></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-2">Memory Usage</h4>
          <p className="text-2xl font-semibold mb-2">48%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full w-1/2"></div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-2">Disk Usage</h4>
          <p className="text-2xl font-semibold mb-2">75%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Sync History Modal Content
const DataSyncContent: React.FC<{
  addAlert: (alert: Alert) => void;
}> = ({ addAlert }) => {
  // Initial data
  const allSyncData = [
    {
      id: '1',
      date: 'Today at 10:23 AM',
      source: 'Google Workspace',
      sourceIcon: '/api/placeholder/24/24',
      records: 12456,
      duration: '3m 42s',
      status: 'Success'
    },
    {
      id: '2',
      date: 'Today at 9:41 AM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 31872,
      duration: '6m 15s',
      status: 'Success'
    },
    {
      id: '3',
      date: 'Today at 8:17 AM',
      source: 'Slack',
      sourceIcon: '/api/placeholder/24/24',
      records: 5428,
      duration: '2m 08s',
      status: 'Success'
    },
    {
      id: '4',
      date: 'Yesterday at 11:35 PM',
      source: 'Zoom',
      sourceIcon: '/api/placeholder/24/24',
      records: 456,
      duration: '1m 35s',
      status: 'Failed'
    },
    {
      id: '5',
      date: 'Yesterday at 6:14 PM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 28945,
      duration: '5m 52s',
      status: 'Partial'
    }
  ];
  
  // State for filters
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // State for sync running
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Apply filters and get filtered data
  const getFilteredData = useCallback(() => {
    return allSyncData.filter(item => {
      // Source filter
      if (sourceFilter !== 'All Sources' && item.source !== sourceFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'All Status' && item.status !== statusFilter) {
        return false;
      }
      
      // Date filter - simplified for demo
      if (dateFilter && !item.date.toLowerCase().includes(dateFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [sourceFilter, statusFilter, dateFilter]);
  
  // Get filtered data
  const filteredData = getFilteredData();
  
  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  
  // Get total pages
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Always show first page
    pageNumbers.push(1);
    
    // Add current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      // Add ellipsis if there's a gap
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        pageNumbers.push(-1); // Use -1 to represent ellipsis
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Function to run manual sync
  const runManualSync = () => {
    setIsSyncing(true);

    // Simulate sync operation
    setTimeout(() => {
      setIsSyncing(false);

      // Add alert about successful sync
      addAlert({
        id: `sync-${Date.now()}`,
        type: 'success',
        title: 'Manual data sync completed',
        description: 'All data sources synced successfully',
        action: { 
          text: "View", 
          onClick: () => console.log('View sync details') 
        },
        details: 'Manual data synchronization from all sources has completed. 48,624 records were processed across 4 connected platforms.'
      });
    }, 3000);
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, dateFilter]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">View the history of data synchronizations from connected platforms.</p>
        <button 
          onClick={runManualSync}
          disabled={isSyncing}
          className={`px-3 py-1 rounded-md text-sm ${
            isSyncing 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSyncing ? 'Syncing...' : 'Run Manual Sync'}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option>All Sources</option>
            <option>Microsoft 365</option>
            <option>Google Workspace</option>
            <option>Slack</option>
            <option>Zoom</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Partial</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="mm/dd/yyyy" 
            className="w-full border rounded-md py-2 px-3" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={() => setCurrentPage(1)} // Reset to first page when applying filters
        >
          Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records Processed
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getPaginatedData().map(item => (
              <tr key={item.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.date}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-6 w-6 mr-2" src={item.sourceIcon} alt={item.source} />
                    <span className="text-sm">{item.source}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.records.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.duration}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Success' ? 'bg-green-100 text-green-800' :
                    item.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => {
                      if (item.status === 'Failed' || item.status === 'Partial') {
                        addAlert({
                          id: `retry-sync-${item.id}-${Date.now()}`,
                          type: 'info',
                          title: `Retrying ${item.source} sync`,
                          description: `Attempting to resync data from ${item.source}`,
                          action: { 
                            text: "View", 
                            onClick: () => console.log('View sync progress') 
                          }
                        });
                      } else {
                        addAlert({
                          id: `view-sync-${item.id}-${Date.now()}`,
                          type: 'info',
                          title: `${item.source} sync details`,
                          description: `Viewing details for ${item.source} sync from ${item.date}`,
                          action: { 
                            text: "View", 
                            onClick: () => console.log('View full sync details') 
                          },
                          details: `Full details for ${item.source} synchronization: ${item.records.toLocaleString()} records processed in ${item.duration}. Status: ${item.status}`
                        });
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {item.status === 'Failed' || item.status === 'Partial' ? 'Retry' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
            
            {getPaginatedData().length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </div>
        
        <div className="flex">
          <button 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`border rounded-l px-3 py-1 text-sm ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === -1 ? (
              <span key={`ellipsis-${index}`} className="border-t border-b border-r px-3 py-1 text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`border-t border-b border-r px-3 py-1 text-sm ${
                  currentPage === page ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`border-t border-b border-r rounded-r px-3 py-1 text-sm ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

// Active Sessions Modal Content with props from parent
const ActiveSessionsContent: React.FC<{
  users: User[];
  sessions: Session[];
  onTerminateSession: (id: string) => void;
  onTerminateAllSessions: () => void;
  onClose: () => void;
  addAlert: (alert: Alert) => void;
}> = ({ 
  users, 
  sessions, 
  onTerminateSession, 
  onTerminateAllSessions, 
  onClose,
  addAlert
}) => {
  const [viewType, setViewType] = useState('users'); // 'users' or 'sessions'
  
  // Get role style class
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'System Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Department Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Analytics User':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status style class
  const getStatusStyle = (status: string) => {
    if (status.startsWith('Active')) {
      return 'bg-green-100 text-green-800';
    } else if (status.startsWith('Idle')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle termination with confirmation
  const handleTerminate = (sessionId: string) => {
    // Find user info for better alert
    const sessionToTerminate = sessions.find(s => s.id === sessionId);
    const userToTerminate = users.find(u => u.ipAddress === sessionToTerminate?.ipAddress);
    
    // Call the parent function to terminate
    onTerminateSession(sessionId);
  };
  
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">Admin users currently logged in to the Glynac Analytics platform.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Active Sessions</h3>
          <p className="text-2xl font-semibold mb-1">{users.length}</p>
          <p className="text-xs text-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {users.length > 0 ? `${Math.round((users.length / 8) * 100)}% of admin users` : '0% of admin users'}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Role Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">System Admin:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'System Admin').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Department Admin:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'Department Admin').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Analytics User:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'Analytics User').length}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Avg. Session Duration</h3>
          <p className="text-2xl font-semibold mb-1">38m</p>
          <p className="text-xs text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            5% from yesterday
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${viewType === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setViewType('users')}
          >
            User View
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${viewType === 'sessions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setViewType('sessions')}
          >
            Session View
          </button>
        </div>
      </div>
      
      {viewType === 'users' ? (
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full mr-3" src={user.avatar} alt={user.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.ipAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => {
                          // Find matching session by IP and terminate it
                          const sessionId = sessions.find(s => s.ipAddress === user.ipAddress)?.id;
                          if (sessionId) handleTerminate(sessionId);
                        }} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-white border rounded-lg">
              <p className="text-gray-500">No active users</p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {sessions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map(session => (
                  <tr key={session.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(session.role)}`}>
                        {session.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.ipAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(session.status)}`}>
                          {session.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">Duration: {session.duration}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleTerminate(session.id)} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-white border rounded-lg">
              <p className="text-gray-500">No active sessions</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <button 
          onClick={onTerminateAllSessions}
          disabled={users.length === 0}
          className={`${
            users.length === 0 
              ? 'bg-red-300 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white font-medium py-2 px-4 rounded`}
        >
          Terminate All Sessions
        </button>
        
        <button 
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  onClick: () => void;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, value, onClick, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start mb-6">
        <div className={`rounded-lg p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        View {title.toLowerCase()}
      </button>
    </div>
  );
};

// Main SystemOverview component with props
const SystemOverview: React.FC<SystemOverviewProps> = ({
  activeUserCount,
  users,
  sessions,
  onTerminateSession,
  onTerminateAllSessions,
  addAlert
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  // Handle health check completion
  const handleHealthCheckComplete = () => {
    // Update timestamp in the UI
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Other health check logic...
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          title="System Status"
          value="Operational"
          onClick={() => openModal('systemHealth')}
          color="bg-emerald-500"
        />
        
        <StatusCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Data Freshness"
          value="1 hour ago"
          onClick={() => openModal('dataSync')}
          color="bg-blue-500"
        />
        
        <StatusCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          title="Active Users"
          value={activeUserCount.toString()}
          onClick={() => openModal('activeSessions')}
          color="bg-purple-500"
        />
      </div>
      
      {/* System Health Modal */}
      <Modal 
        isOpen={activeModal === 'systemHealth'} 
        onClose={closeModal}
        title="System Health"
      >
        <SystemHealthContent 
          onHealthCheck={handleHealthCheckComplete} 
          addAlert={addAlert}
        />
      </Modal>
      
      {/* Data Sync History Modal */}
      <Modal 
        isOpen={activeModal === 'dataSync'} 
        onClose={closeModal}
        title="Data Sync History"
      >
        <DataSyncContent addAlert={addAlert} />
      </Modal>
      
      {/* Active Sessions Modal */}
      <Modal 
        isOpen={activeModal === 'activeSessions'} 
        onClose={closeModal}
        title="Active Sessions"
      >
        <ActiveSessionsContent 
          users={users}
          sessions={sessions}
          onTerminateSession={onTerminateSession}
          onTerminateAllSessions={onTerminateAllSessions}
          onClose={closeModal}
          addAlert={addAlert}
        />
      </Modal>
    </div>
  );
};

export default SystemOverview;