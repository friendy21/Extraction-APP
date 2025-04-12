"use client"

import React, { useState } from 'react';
import { XIcon, PlusIcon, ChevronDown, ChevronUp, Minus, Plus, RotateCcw } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import DepartmentViewModal from './DepartmentViewModal';
import DepartmentEditModal from './DepartmentEditModal';
import DepartmentAddModal from './DepartmentAddModal';

// Define department interface
interface Department {
  id: string;
  name: string;
  head: string;
  headId: string;
  employeeCount: number;
  location: string;
  organization: string;
  status: 'Active' | 'Inactive';
  description: string;
  roles: {
    title: string;
    count: number;
  }[];
  workModel: {
    type: string;
    count: number;
  }[];
  teamMembers?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
}

// Define person interface for org chart
interface Person {
  id: string;
  name: string;
  title: string;
  avatar: string;
  children?: Person[];
}

const DepartmentsPage: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'list' | 'chart'>('list');

  // State for search term, filters and sorting - MOVED THESE UP BEFORE USING THEM
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('All Sizes');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State for departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept1',
      name: 'Engineering',
      head: 'Michael Chen',
      headId: 'user3',
      employeeCount: 67,
      location: 'San Francisco',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Engineering department is responsible for all software development, infrastructure, and technical innovation at the company. The team consists of frontend developers, backend engineers, DevOps specialists, and QA engineers working across multiple product lines.',
      roles: [
        { title: 'Software Engineers', count: 42 },
        { title: 'DevOps Engineers', count: 12 },
        { title: 'QA Engineers', count: 8 },
        { title: 'Engineering Managers', count: 5 }
      ],
      workModel: [
        { type: 'On-site', count: 24 },
        { type: 'Hybrid', count: 30 },
        { type: 'Remote', count: 13 }
      ],
      teamMembers: [
        { id: 'emp1', name: 'James Wilson', role: 'Frontend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp2', name: 'Sophia Garcia', role: 'Backend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp3', name: 'Daniel Smith', role: 'DevOps', avatar: '/api/placeholder/32/32' },
        { id: 'emp4', name: 'Amanda Lopez', role: 'QA Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp5', name: 'Alice', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp6', name: 'Bob', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp7', name: 'Charlie', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp8', name: 'Diana', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp9', name: 'Eric', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp10', name: 'Fiona', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp11', name: 'George', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp12', name: 'Hannah', role: 'Backend Developer', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept2',
      name: 'Sales',
      head: 'Alex Thompson',
      headId: 'user5',
      employeeCount: 54,
      location: 'Austin',
      organization: 'Revenue',
      status: 'Active',
      description: 'The Sales department handles all customer acquisition, relationship management, and revenue generation activities.',
      roles: [
        { title: 'Account Executives', count: 28 },
        { title: 'Sales Development Reps', count: 18 },
        { title: 'Sales Operations', count: 5 },
        { title: 'Sales Managers', count: 3 }
      ],
      workModel: [
        { type: 'On-site', count: 20 },
        { type: 'Hybrid', count: 25 },
        { type: 'Remote', count: 9 }
      ]
    },
    {
      id: 'dept3',
      name: 'Marketing',
      head: 'Sarah Johnson',
      headId: 'user2',
      employeeCount: 32,
      location: 'New York',
      organization: 'Growth',
      status: 'Active',
      description: 'The Marketing department is responsible for brand management, lead generation, digital marketing campaigns, and customer communications.',
      roles: [
        { title: 'Digital Marketers', count: 12 },
        { title: 'Content Writers', count: 8 },
        { title: 'Brand Specialists', count: 6 },
        { title: 'Marketing Analysts', count: 4 },
        { title: 'Marketing Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 10 },
        { type: 'Hybrid', count: 15 },
        { type: 'Remote', count: 7 }
      ]
    },
    {
      id: 'dept4',
      name: 'Finance',
      head: 'David Kim',
      headId: 'user6',
      employeeCount: 28,
      location: 'London',
      organization: 'Operations',
      status: 'Active',
      description: 'The Finance department manages all financial planning, accounting, budgeting, and financial reporting activities for the company.',
      roles: [
        { title: 'Financial Analysts', count: 10 },
        { title: 'Accountants', count: 12 },
        { title: 'Financial Controllers', count: 4 },
        { title: 'Finance Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 18 },
        { type: 'Hybrid', count: 8 },
        { type: 'Remote', count: 2 }
      ]
    },
    {
      id: 'dept5',
      name: 'Product',
      head: 'Emily Rodriguez',
      headId: 'user4',
      employeeCount: 26,
      location: 'Remote',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Product department oversees product strategy, roadmap planning, user experience design, and product lifecycle management.',
      roles: [
        { title: 'Product Managers', count: 10 },
        { title: 'UX Designers', count: 8 },
        { title: 'Product Analysts', count: 6 },
        { title: 'Product Directors', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 10 },
        { type: 'Remote', count: 11 }
      ]
    },
    {
      id: 'dept6',
      name: 'Customer Support',
      head: 'Robert Taylor',
      headId: 'user7',
      employeeCount: 15,
      location: 'Chicago',
      organization: 'Operations',
      status: 'Active',
      description: 'The Customer Support department provides technical assistance, product guidance, and issue resolution services to our customers.',
      roles: [
        { title: 'Support Specialists', count: 10 },
        { title: 'Technical Support Engineers', count: 3 },
        { title: 'Support Team Leads', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 5 },
        { type: 'Remote', count: 5 }
      ]
    },
    {
      id: 'dept7',
      name: 'HR',
      head: 'Jessica Lee',
      headId: 'user8',
      employeeCount: 12,
      location: 'New York',
      organization: 'People Operations',
      status: 'Active',
      description: 'The HR department manages recruitment, employee onboarding, benefits administration, performance management, and employee relations.',
      roles: [
        { title: 'HR Specialists', count: 6 },
        { title: 'Recruiters', count: 4 },
        { title: 'HR Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 8 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ]
    },
    {
      id: 'dept8',
      name: 'Legal',
      head: 'Amanda Wilson',
      headId: 'user9',
      employeeCount: 8,
      location: 'Boston',
      organization: 'Corporate',
      status: 'Active',
      description: 'The Legal department handles all legal matters including contracts, compliance, intellectual property, and corporate governance.',
      roles: [
        { title: 'Corporate Attorneys', count: 4 },
        { title: 'Legal Specialists', count: 3 },
        { title: 'General Counsel', count: 1 }
      ],
      workModel: [
        { type: 'On-site', count: 4 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ]
    }
  ]);
  
  // Calculate total pages
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  
  // Calculate departments to display on current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
  
  // Apply all filters (search term, size, location)
  const filteredDepartments = departments.filter(dept => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply size filter
    let matchesSize = true;
    if (sizeFilter !== 'All Sizes') {
      if (sizeFilter === 'Small (1-15)' && dept.employeeCount > 15) matchesSize = false;
      if (sizeFilter === 'Medium (16-50)' && (dept.employeeCount < 16 || dept.employeeCount > 50)) matchesSize = false;
      if (sizeFilter === 'Large (51+)' && dept.employeeCount < 51) matchesSize = false;
    }
    
    // Apply location filter
    const matchesLocation = locationFilter === 'All Locations' || dept.location === locationFilter;
    
    return matchesSearch && matchesSize && matchesLocation;
  });
  
  // Get departments for the current page
  const totalFilteredItems = filteredDepartments.length;
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));
  
  // Adjust current page if it exceeds the total pages after filtering
  if (currentPage > totalFilteredPages && totalFilteredPages > 0) {
    setCurrentPage(totalFilteredPages);
  }
  
  // Get departments for display on current page
  const indexOfLastFilteredItem = currentPage * itemsPerPage;
  const indexOfFirstFilteredItem = indexOfLastFilteredItem - itemsPerPage;
  const displayDepartments = filteredDepartments.slice(
    indexOfFirstFilteredItem,
    indexOfLastFilteredItem
  );
  
  // State for modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  // Org Chart states
  const [zoomLevel, setZoomLevel] = useState(100);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'ceo': true,
    'cto': true,
    'cmo': true,
    'vpsales': true,
    'frontend': true,
    'backend': true,
    'digital': true,
    'brand': true,
    'ussales': true,
    'globalsales': true,
  });

  // Create executive team structure for org chart
  const orgData: Person = {
    id: 'ceo',
    name: 'John Anderson',
    title: 'CEO',
    avatar: '/api/placeholder/40/40',
    children: [
      {
        id: 'cto',
        name: 'Michael Chen',
        title: 'CTO',
        avatar: '/api/placeholder/40/40',
        children: [
          {
            id: 'frontend',
            name: 'James Wilson',
            title: 'Frontend Lead',
            avatar: '/api/placeholder/40/40',
            children: [
              { id: 'alice', name: 'Alice', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'bob', name: 'Bob', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'charlie', name: 'Charlie', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'diana', name: 'Diana', title: 'Developer', avatar: '/api/placeholder/32/32' },
            ]
          },
          {
            id: 'backend',
            name: 'Sophia Garcia',
            title: 'Backend Lead',
            avatar: '/api/placeholder/40/40',
            children: [
              { id: 'eric', name: 'Eric', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'fiona', name: 'Fiona', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'george', name: 'George', title: 'Developer', avatar: '/api/placeholder/32/32' },
              { id: 'hannah', name: 'Hannah', title: 'Developer', avatar: '/api/placeholder/32/32' },
            ]
          }
        ]
      },
      {
        id: 'cmo',
        name: 'Sarah Johnson',
        title: 'CMO',
        avatar: '/api/placeholder/40/40',
        children: [
          {
            id: 'digital',
            name: 'Digital',
            title: 'Digital Marketing',
            avatar: ''
          },
          {
            id: 'brand',
            name: 'Brand',
            title: 'Brand Management',
            avatar: ''
          }
        ]
      },
      {
        id: 'vpsales',
        name: 'Alex Thompson',
        title: 'VP Sales',
        avatar: '/api/placeholder/40/40',
        children: [
          {
            id: 'ussales',
            name: 'US Sales',
            title: 'US Sales Team',
            avatar: ''
          },
          {
            id: 'globalsales',
            name: 'Global Sales',
            title: 'Global Sales Team',
            avatar: ''
          }
        ]
      }
    ]
  };

  // Org Chart functions
  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    
    const expandNode = (node: Person) => {
      allExpanded[node.id] = true;
      if (node.children) {
        node.children.forEach(expandNode);
      }
    };
    
    expandNode(orgData);
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    // Keep only the top level expanded
    setExpandedNodes({
      'ceo': true
    });
  };

  const zoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(prev => prev + 10);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(prev => prev - 10);
    }
  };

  const resetView = () => {
    setZoomLevel(100);
    setExpandedNodes({
      'ceo': true,
      'cto': true,
      'cmo': true,
      'vpsales': true
    });
  };

  // Recursive component to render org chart nodes
  const renderNode = (node: Person, level: number = 0) => {
    const isExpanded = expandedNodes[node.id] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    const nodeClasses = `
      relative flex flex-col items-center
      ${level === 0 ? 'pt-0' : 'pt-6'}
    `;
    
    const boxColorClass = (() => {
      if (node.id === 'ceo') return 'bg-blue-50 border-blue-200';
      if (node.id === 'cto') return 'bg-blue-50 border-blue-200';
      if (node.id === 'cmo') return 'bg-pink-50 border-pink-200';
      if (node.id === 'vpsales') return 'bg-green-50 border-green-200';
      if (node.id.includes('frontend') || node.id.includes('backend')) return 'bg-blue-50 border-blue-200';
      if (node.id.includes('digital') || node.id.includes('brand')) return 'bg-pink-50 border-pink-200';
      if (node.id.includes('sales')) return 'bg-green-50 border-green-200';
      return 'bg-gray-50 border-gray-200';
    })();
    
    const boxStyles = `
      relative flex flex-col items-center px-4 py-2 border rounded-lg ${boxColorClass}
      min-w-[160px] z-10
    `;
    
    return (
      <div key={node.id} className={nodeClasses}>
        {/* Vertical connector line from parent */}
        {level > 0 && (
          <div className="absolute top-0 w-px h-6 bg-gray-300" style={{ zIndex: 1 }}></div>
        )}
        
        <div className={boxStyles}>
          {/* Person info */}
          <div className="flex flex-col items-center w-full">
            {node.avatar && (
              <img
                src={node.avatar}
                alt={node.name}
                className="w-10 h-10 rounded-full mb-1"
              />
            )}
            <div className="font-medium text-sm">{node.name}</div>
            <div className="text-xs text-gray-500">{node.title}</div>
          </div>
          
          {/* Toggle expand/collapse button */}
          {hasChildren && (
            <button
              className="absolute -bottom-3 rounded-full bg-white border border-gray-200 w-6 h-6 flex items-center justify-center z-20"
              onClick={() => toggleExpand(node.id)}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
        
        {/* Children container */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical connector to children container */}
            <div className="w-px h-4 bg-gray-300"></div>
            
            {/* Horizontal line above children */}
            {node.children && node.children.length > 1 && (
              <div className="relative h-4">
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-300"></div>
              </div>
            )}
            
            {/* Children */}
            <div className={`flex ${node.children && node.children.length > 3 ? 'flex-wrap justify-center' : ''} gap-8`}>
              {node.children?.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical connector to each child */}
                  <div className="h-4 w-px bg-gray-300"></div>
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Handle view department details
  const handleViewDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setViewModalOpen(true);
    }
  };
  
  // Handle edit department
  const handleEditDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setEditModalOpen(true);
    }
  };
  
  // Handle save edited department
  const handleSaveEdit = (updatedDepartment: Department) => {
    setDepartments(prevDepartments => 
      prevDepartments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
    setEditModalOpen(false);
  };
  
  // Handle add new department
  const handleAddDepartment = (newDepartment: Department) => {
    setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
    setAddModalOpen(false);
  };
  
  // Handle delete department
  const handleDeleteDepartment = (departmentId: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(prevDepartments => 
        prevDepartments.filter(dept => dept.id !== departmentId)
      );
    }
  };

  // Get the admin user for the header display
  const adminUser = {
    name: 'Admin User',
    avatar: '/api/placeholder/32/32'
  };
  
  return (
    <DashboardLayout userName={adminUser.name} userAvatar={adminUser.avatar}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Department Management</h1>
        
        {/* Search and Filter Row */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search departments"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <option>All Sizes</option>
                <option>Small (1-15)</option>
                <option>Medium (16-50)</option>
                <option>Large (51+)</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option>All Locations</option>
                <option>San Francisco</option>
                <option>Austin</option>
                <option>New York</option>
                <option>London</option>
                <option>Chicago</option>
                <option>Boston</option>
                <option>Remote</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => setAddModalOpen(true)}
            >
              <PlusIcon size={16} />
              <span>Add Department</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'list' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Department List
            </button>
            <button 
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'chart' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Organizational Chart
            </button>
          </nav>
        </div>
        
        {/* Department List or Organizational Chart based on active tab */}
        {activeTab === 'list' ? (
          /* Departments Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Head
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{department.employeeCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{department.head}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{department.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDepartment(department.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditDepartment(department.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Organizational Chart */
          <div className="bg-white rounded-lg shadow p-6">
            {/* Controls */}
            <div className="flex justify-between mb-6">
              <div className="flex gap-2">
                <button 
                  onClick={expandAll}
                  className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                >
                  Expand All
                </button>
                
                <button 
                  onClick={collapseAll}
                  className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                >
                  Collapse All
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={zoomOut}
                  className="p-1 border border-gray-200 rounded hover:bg-gray-50"
                  disabled={zoomLevel <= 70}
                >
                  <Minus size={16} />
                </button>
                
                <span className="text-sm font-medium">{zoomLevel}%</span>
                
                <button 
                  onClick={zoomIn}
                  className="p-1 border border-gray-200 rounded hover:bg-gray-50"
                  disabled={zoomLevel >= 150}
                >
                  <Plus size={16} />
                </button>
                
                <button 
                  onClick={resetView}
                  className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 ml-2"
                >
                  Reset View
                </button>
              </div>
            </div>
            
            {/* Organization Chart */}
            <div className="overflow-x-auto pb-10">
              <div 
                className="flex justify-center mt-6 min-w-max" 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
              >
                {renderNode(orgData)}
              </div>
            </div>
          </div>
        )}
        
        {/* Pagination (only show for list view) */}
        {activeTab === 'list' && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {totalFilteredItems === 0 ? 0 : indexOfFirstFilteredItem + 1} to {Math.min(indexOfLastFilteredItem, totalFilteredItems)} of {totalFilteredItems} departments
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalFilteredPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalFilteredPages, currentPage + 1))}
                disabled={currentPage === totalFilteredPages}
                className={`p-2 rounded ${currentPage === totalFilteredPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* View Department Modal */}
      {viewModalOpen && currentDepartment && (
        <DepartmentViewModal
          department={currentDepartment}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setEditModalOpen(true);
          }}
        />
      )}
      
      {/* Edit Department Modal */}
      {editModalOpen && currentDepartment && (
        <DepartmentEditModal
          department={currentDepartment}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
      
      {/* Add Department Modal */}
      {addModalOpen && (
        <DepartmentAddModal
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddDepartment}
          existingDepartments={departments}
        />
      )}
    </DashboardLayout>
  );
};

export default DepartmentsPage;