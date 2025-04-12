"use client"

import React, { useState } from 'react';

interface ActivityItemProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  time: string;
  iconBg: string;
  details?: string;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  id, 
  icon, 
  title, 
  time, 
  iconBg, 
  details, 
  expandedId, 
  onToggleExpand 
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex items-center p-4">
        <div className={`${iconBg} rounded-full p-2 mr-4 flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {title}
            </p>
            <p className="text-sm text-gray-500">
              {time}
            </p>
          </div>
          {details && (
            <button 
              onClick={() => onToggleExpand(id)}
              className="mt-1 text-xs text-blue-600 hover:text-blue-800"
            >
              {expandedId === id ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      
      {/* Expanded details section */}
      {expandedId === id && details && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 ml-10 mr-4 mb-4 rounded-md">
          <p className="text-sm text-gray-700">{details}</p>
        </div>
      )}
    </div>
  );
};

const RecentActivity: React.FC = () => {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    if (expandedActivity === id) {
      setExpandedActivity(null);
    } else {
      setExpandedActivity(id);
    }
  };
  
  const activities = [
    {
      id: 'act1',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      ),
      title: "Added new employee: Sarah Johnson",
      time: "10 minutes ago",
      iconBg: "bg-blue-100",
      details: "Sarah Johnson has been added to the system with Department Admin role for Marketing. User account was automatically created and welcome email has been sent."
    },
    {
      id: 'act2',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      ),
      title: "Data sync completed",
      time: "1 hour ago",
      iconBg: "bg-green-100",
      details: "Full data synchronization completed successfully. Processed 45,324 records across all connected services. No errors or warnings encountered during the sync process."
    },
    {
      id: 'act3',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      title: "Department structure updated",
      time: "3 hours ago",
      iconBg: "bg-purple-100",
      details: "Engineering department has been restructured with 3 new sub-departments: Frontend, Backend, and DevOps. 12 employees have been reassigned to new departments. Permission models have been updated accordingly."
    },
    {
      id: 'act4',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" clipRule="evenodd" />
        </svg>
      ),
      title: "Security audit completed",
      time: "1 day ago",
      iconBg: "bg-yellow-100",
      details: "Quarterly security audit completed with no critical findings. 3 medium-priority recommendations were made and have been added to the security backlog. Full audit report is available in the compliance section."
    },
    {
      id: 'act5',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      title: "Data anonymization processed",
      time: "2 days ago",
      iconBg: "bg-gray-100",
      details: "Data anonymization process has been executed on historical data older than 24 months. 283,651 records were anonymized according to data retention policy. Process completed in 47 minutes."
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {activities.map(activity => (
        <ActivityItem 
          key={activity.id}
          id={activity.id}
          icon={activity.icon}
          title={activity.title}
          time={activity.time}
          iconBg={activity.iconBg}
          details={activity.details}
          expandedId={expandedActivity}
          onToggleExpand={toggleExpand}
        />
      ))}
      
      <div className="px-4 py-3 bg-gray-50 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;