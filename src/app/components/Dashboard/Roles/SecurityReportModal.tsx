"use client"

import React from 'react';

interface SecurityReportModalProps {
  onClose: () => void;
  users: any[];
}

const SecurityReportModal: React.FC<SecurityReportModalProps> = ({ onClose, users }) => {
  // Calculate security metrics
  const totalUsers = users.length;
  const twoFAEnabled = users.filter(user => user.twoFA).length;
  const twoFAPercentage = Math.round((twoFAEnabled / totalUsers) * 100);
  
  const securityIssues = [
    {
      severity: 'High',
      issue: 'Users without 2FA',
      count: totalUsers - twoFAEnabled,
      details: users.filter(user => !user.twoFA).map(u => u.name).join(', ')
    },
    {
      severity: 'Medium',
      issue: 'Inactive accounts still enabled',
      count: users.filter(user => user.status === 'Inactive' && user.twoFA).length,
      details: 'Inactive accounts should be either deleted or have 2FA disabled'
    },
    {
      severity: 'Low',
      issue: 'Password not changed in 60+ days',
      count: 3,
      details: 'Admin User, Sarah Johnson, Michael Chen'
    }
  ];
  
  const activityLog = [
    { user: 'Admin User', action: 'Reset 2FA for Emily Rodriguez', timestamp: '2 days ago' },
    { user: 'Admin User', action: 'Changed role for Michael Chen from Analytics User to Department Admin', timestamp: '3 days ago' },
    { user: 'Sarah Johnson', action: 'Suspended account for Emily Rodriguez', timestamp: '3 days ago' },
    { user: 'Admin User', action: 'Added new user David Kim', timestamp: '1 week ago' },
    { user: 'Admin User', action: 'Reset password for Sarah Johnson', timestamp: '2 weeks ago' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Security Report</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">2FA Adoption</h4>
            <div className="w-full bg-gray-200 rounded-full h-5 mb-3">
              <div 
                className={`h-5 rounded-full ${twoFAPercentage >= 80 ? 'bg-green-500' : twoFAPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${twoFAPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">
                {twoFAEnabled} out of {totalUsers} admin users have two-factor authentication enabled.
              </span>
              <span className="font-medium">{twoFAPercentage}%</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Security Issues</h4>
            {securityIssues.length === 0 ? (
              <p className="text-sm text-gray-600">No security issues detected.</p>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {securityIssues.map((issue, index) => (
                  <div 
                    key={index} 
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full mr-3 text-sm font-bold
                          ${issue.severity === 'High' ? 'bg-red-100 text-red-800' : 
                          issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                          {issue.severity[0]}
                        </span>
                        <span className="text-base font-medium text-gray-800">{issue.issue}</span>
                      </div>
                      <span className="text-base font-medium">{issue.count}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">{issue.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Recent Security Activity</h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {activityLog.map((activity, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600 mr-3">
                      {activity.user.split(' ')[0][0]}{activity.user.split(' ').length > 1 ? activity.user.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        By {activity.user} · {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Enforce 2FA for all admin users</li>
              <li>Implement regular password rotation</li>
              <li>Review inactive accounts</li>
              <li>Set up login attempt alerts</li>
            </ul>
          </div>
        </div>
        
        <div className="p-6">
          <button
            type="button"
            className="float-right px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 text-sm font-medium"
            onClick={onClose}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportModal;