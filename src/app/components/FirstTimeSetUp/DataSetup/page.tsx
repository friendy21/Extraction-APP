"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  Merge, 
  Loader2,
  Check,
  X,
  Eye
} from "lucide-react";

// Import the new DataQualityIssues component
import DataQualityIssues, { Email, Employee, IssueStats } from './DataQualityIssues';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'default';
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
}

const DataOverviewPage: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [dataCollected, setDataCollected] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [employeesWithAliases, setEmployeesWithAliases] = useState<Employee[]>([]);
  const [employeesWithConflicts, setEmployeesWithConflicts] = useState<Employee[]>([]);
  const [employeesWithMissingData, setEmployeesWithMissingData] = useState<Employee[]>([]);
  const [isApplyingChanges, setIsApplyingChanges] = useState<boolean>(false);
  const [issueStats, setIssueStats] = useState<IssueStats>({
    aliasCount: 18,
    conflictCount: 14,
    missingCount: 23
  });
  
  const itemsPerPage: number = 10;
  const totalPages: number = 25;
  const totalEmployees: number = 242;

  // Function to generate a mock employee
  const generateMockEmployee = (id: number): Employee => {
    const nameIndex = id % 20;
    const departmentIndex = id % 5;
    const hasIssue = id % 6 === 0 || id % 7 === 0 || id % 9 === 0;
    const issueType: "alias" | "conflict" | "missing" | null = id % 9 === 0 ? 'missing' : id % 7 === 0 ? 'conflict' : 'alias';
    const multipleEmails = id % 5 === 0 || id % 7 === 0;
    
    const firstNames = ['John', 'Jane', 'Robert', 'Michael', 'Emily', 'David', 'Sarah', 'Alex', 'Jennifer', 'Jessica', 
                        'William', 'Lisa', 'James', 'Mary', 'Thomas', 'Patricia', 'Charles', 'Linda', 'Daniel', 'Barbara'];
    const lastNames = ['Smith', 'Cooper', 'Johnson', 'Chen', 'Rodriguez', 'Kim', 'Williams', 'Thompson', 'Taylor', 'Lee',
                      'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Harris', 'Clark', 'Lewis', 'Young', 'Walker'];
    const departments = ['Marketing', 'Sales', 'Engineering', 'Finance', 'Product'];
    const positions = [
      ['Marketing Manager', 'Content Strategist', 'Digital Marketing Specialist', 'Brand Manager', 'Marketing Analyst'],
      ['Sales Director', 'Account Executive', 'Sales Representative', 'VP Sales', 'Sales Analyst'],
      ['Software Engineer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Engineering Manager'],
      ['Finance Director', 'Financial Analyst', 'Accountant', 'CFO', 'Finance Manager'],
      ['Product Manager', 'Product Owner', 'UX Designer', 'Product Analyst', 'Product Marketing Manager']
    ];
    
    const firstName = firstNames[nameIndex];
    const lastName = lastNames[id % lastNames.length];
    const department = departments[departmentIndex];
    const position = positions[departmentIndex][id % 5];
    
    // Create email variations
    const mainEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    const emails: Email[] = [{ address: mainEmail, source: "Primary", isPrimary: true }];
    
    if (multipleEmails) {
      if (id % 2 === 0) {
        emails.push({ 
          address: `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@company.com`, 
          source: "Google Workspace",
          isPrimary: false
        });
      } else {
        emails.push({ 
          address: `${firstName.toLowerCase()}.${lastName.toLowerCase()[0]}@company.com`, 
          source: "Microsoft 365",
          isPrimary: false
        });
      }
      
      if (id % 10 === 0) {
        emails.push({ 
          address: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`.replace('.', '_'), 
          source: "Slack",
          isPrimary: false
        });
      }
    }
    
    // Generate communication metrics
    const base = 500 + (id * 7) % 800;
    const emailCount = base + (id * 13) % 500;
    const chatCount = base - (id * 11) % 300;
    const meetingCount = 50 + (id * 3) % 100;
    const fileAccessCount = 100 + (id * 17) % 300;
    
    // Generate inclusion status 
    const isIncluded = id % 13 !== 0;
    
    return {
      id: id.toString(),
      name: `${firstName} ${lastName}`,
      emails,
      emailCount,
      chatCount,
      meetingCount,
      fileAccessCount,
      department: hasIssue && issueType === 'missing' ? undefined : department,
      position: hasIssue && issueType === 'missing' ? undefined : position,
      hasQualityIssues: hasIssue,
      issueType: hasIssue ? issueType : null,
      isIncluded,
    };
  };

  // Generate current page data
  const generateCurrentPageData = (): Employee[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageData: Employee[] = [];
    
    for (let i = 0; i < itemsPerPage; i++) {
      const employeeId = startIndex + i + 1;
      if (employeeId <= totalEmployees) {
        pageData.push(generateMockEmployee(employeeId));
      }
    }
    
    return pageData;
  };

  // Generate sample issue data for tabs
  const generateSampleIssueData = (type: 'alias' | 'conflict' | 'missing', count: number = 3): Employee[] => {
    const result: Employee[] = [];
    let startId: number = 0;
    
    switch (type) {
      case 'alias':
        startId = 10;
        break;
      case 'conflict':
        startId = 30;
        break;
      case 'missing':
        startId = 50;
        break;
    }
    
    for (let i = 0; i < count; i++) {
      const mockEmployee = generateMockEmployee(startId + i);
      mockEmployee.hasQualityIssues = true;
      mockEmployee.issueType = type;
      
      // Ensure appropriate email configuration for the issue type
      if (type === 'alias') {
        if (mockEmployee.emails.length === 1) {
          mockEmployee.emails.push({ 
            address: mockEmployee.emails[0].address.replace('.', '_'), 
            source: "Google Workspace",
            isPrimary: false
          });
        }
      }
      
      result.push(mockEmployee);
    }
    
    return result;
  };

  // Handle data collection process
  const handleCollectData = (): void => {
    setIsCollecting(true);
    // Simulate data collection with a timeout
    setTimeout(() => {
      setIsCollecting(false);
      setDataCollected(true);
      setEmployeesData(generateCurrentPageData());
      setEmployeesWithAliases(generateSampleIssueData('alias'));
      setEmployeesWithConflicts(generateSampleIssueData('conflict'));
      setEmployeesWithMissingData(generateSampleIssueData('missing'));
    }, 2000);
  };

  // Using Next.js router for navigation
  const router = useRouter();
  
  // Navigation handlers
  const handleBack = (): void => {
    router.push('/components/FirstTimeSetUp/employees');
  };

  const handleNext = (): void => {
    router.push('/components/FirstTimeSetUp/Anonymization');
  };

  // Employee details handling
  const handleViewDetails = (employee: Employee): void => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleCloseModal = (): void => {
    setShowDetailModal(false);
  };

  // Update page data when pagination changes
  useEffect(() => {
    if (dataCollected) {
      setEmployeesData(generateCurrentPageData());
    }
  }, [currentPage, dataCollected]);

  // Handle updating employee inclusion status
  const handleUpdateInclusionStatus = (employeeId: string, newStatus: boolean): void => {
    setEmployeesData(prevData => 
      prevData.map(emp => 
        emp.id === employeeId ? {...emp, isIncluded: newStatus} : emp
      )
    );
  };

  // Handle merging emails for a specific employee
  const handleMergeEmails = (employeeId: string): void => {
    // Update employees with aliases list
    const updatedEmployeesWithAliases = employeesWithAliases.filter(
      emp => emp.id !== employeeId
    );
    
    setEmployeesWithAliases(updatedEmployeesWithAliases);
    
    // Also update the main employee data list to fix the issue
    setEmployeesData(prevData => 
      prevData.map(emp => {
        if (emp.id === employeeId) {
          // Keep only the primary email
          const primaryEmail = emp.emails.find(email => email.isPrimary) || emp.emails[0];
          return {
            ...emp,
            emails: [primaryEmail],
            hasQualityIssues: emp.issueType === 'alias' ? false : emp.hasQualityIssues,
            issueType: emp.issueType === 'alias' ? null : emp.issueType
          };
        }
        return emp;
      })
    );
    
    // Update the issue stats
    setIssueStats(prev => ({
      ...prev,
      aliasCount: prev.aliasCount - 1
    }));
  };

  // Handle merging all emails - removes all duplicate emails
  const handleMergeAllEmails = (): void => {
    setIsApplyingChanges(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Reset the list of employees with aliases
      setEmployeesWithAliases([]);
      
      // Update the main employee data to remove duplicate emails
      setEmployeesData(prevData => 
        prevData.map(employee => {
          // If employee has multiple emails, keep only the primary one
          if (employee.emails.length > 1) {
            const primaryEmail = employee.emails.find(email => email.isPrimary) || employee.emails[0];
            return {
              ...employee,
              emails: [primaryEmail],
              hasQualityIssues: employee.hasQualityIssues && employee.issueType !== 'alias' ? true : false,
              issueType: employee.issueType === 'alias' ? null : employee.issueType
            };
          }
          return employee;
        })
      );
      
      // Update issue stats
      setIssueStats(prev => ({
        ...prev,
        aliasCount: 0
      }));
      
      setIsApplyingChanges(false);
    }, 1500);
  };

  // Handle applying conflict resolutions
  const handleApplyResolutions = (): void => {
    setIsApplyingChanges(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Reset the list of employees with conflicts
      setEmployeesWithConflicts([]);
      
      // Update the main employee data to resolve conflicts
      setEmployeesData(prevData => 
        prevData.map(emp => {
          if (emp.hasQualityIssues && emp.issueType === 'conflict') {
            return {
              ...emp,
              hasQualityIssues: false,
              issueType: null
            };
          }
          return emp;
        })
      );
      
      // Update issue stats
      setIssueStats(prev => ({
        ...prev,
        conflictCount: 0
      }));
      
      setIsApplyingChanges(false);
    }, 1500);
  };

  // Handle saving missing information for an employee
  const handleSaveInformation = (employeeId: string): void => {
    // Update the list of employees with missing data
    const updatedEmployeesWithMissingData = employeesWithMissingData.filter(
      emp => emp.id !== employeeId
    );
    
    setEmployeesWithMissingData(updatedEmployeesWithMissingData);
    
    // Also update the main employee data to fix the missing information
    setEmployeesData(prevData => 
      prevData.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            department: parseInt(emp.id) % 2 === 0 ? "Engineering" : emp.department || "Sales",
            position: parseInt(emp.id) % 2 === 0 ? "Software Engineer" : emp.position || "VP Sales",
            hasQualityIssues: emp.issueType === 'missing' ? false : emp.hasQualityIssues,
            issueType: emp.issueType === 'missing' ? null : emp.issueType
          };
        }
        return emp;
      })
    );
    
    // Update the issue stats
    setIssueStats(prev => ({
      ...prev,
      missingCount: prev.missingCount - 1
    }));
  };

  // Handle fixing all issues - removes all issue indicators and red tables
  const handleFixAllIssues = (): void => {
    setIsApplyingChanges(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Reset all issue lists
      setEmployeesWithAliases([]);
      setEmployeesWithConflicts([]);
      setEmployeesWithMissingData([]);
      
      // Update the main employee data to remove all quality issues
      setEmployeesData(prevData => 
        prevData.map(employee => {
          // Keep only the primary email for employees with multiple emails
          const primaryEmail = employee.emails.find(email => email.isPrimary) || employee.emails[0];
          
          return {
            ...employee,
            emails: [primaryEmail],
            hasQualityIssues: false,
            issueType: null,
            // If department or position was missing, fill with default values
            department: employee.department || "Not Specified",
            position: employee.position || "Not Specified"
          };
        })
      );
      
      // Reset issue stats
      setIssueStats({
        aliasCount: 0,
        conflictCount: 0,
        missingCount: 0
      });
      
      setIsApplyingChanges(false);
    }, 2000);
  };

  // Pagination component
  const PaginationControl: React.FC<PaginationControlProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalEmployees)}
              </span>{" "}
              of <span className="font-medium">{totalEmployees}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Page numbers */}
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => onPageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNum
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Badge component
  const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
      </span>
    );
  };

  // Button component
  const Button: React.FC<ButtonProps> = ({ 
    onClick, 
    disabled = false, 
    className = '', 
    children, 
    variant = 'default' 
  }) => {
    let buttonClass = "inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium ";
    
    if (variant === "outline") {
      buttonClass += "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ";
    } else if (variant === "ghost") {
      buttonClass += "bg-transparent hover:bg-gray-50 text-gray-700 ";
    } else {
      buttonClass += "border border-transparent text-white bg-blue-600 hover:bg-blue-700 ";
    }
    
    if (disabled) {
      buttonClass += "opacity-50 cursor-not-allowed ";
    }
    
    if (className) {
      buttonClass += className;
    }
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={buttonClass}
      >
        {children}
      </button>
    );
  };

  // Employee Detail Modal
  const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee }) => {
    if (!employee) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Department</p>
              <p className="font-medium">{employee.department || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Position</p>
              <p className="font-medium">{employee.position || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Count</p>
              <p className="font-medium">{employee.emailCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Chat Count</p>
              <p className="font-medium">{employee.chatCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Meeting Count</p>
              <p className="font-medium">{employee.meetingCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">File Access Count</p>
              <p className="font-medium">{employee.fileAccessCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Email Addresses</h3>
            <div className="space-y-2">
              {employee.emails.map((email, index) => (
                <div key={index} className="flex items-center p-2 border rounded">
                  <div className="flex-grow">
                    {email.address}
                    {email.source && (
                      <Badge className={`ml-2 ${email.isPrimary ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                        {email.source}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <p className="text-sm text-gray-500 mr-2">Inclusion Status:</p>
            <Badge className={employee.isIncluded ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {employee.isIncluded ? "Included" : "Excluded"}
            </Badge>
          </div>
          
          <div className="flex justify-between border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                handleUpdateInclusionStatus(employee.id, !employee.isIncluded);
                handleCloseModal();
              }}
            >
              {employee.isIncluded ? "Exclude Employee" : "Include Employee"}
            </Button>
            <Button onClick={handleCloseModal}>Close</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Data Overview</h1>
      <p className="text-gray-600 mb-6">Collect and review data for all employees before analysis.</p>

      {/* Data Collection Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-blue-600">Collect Data</h2>
            <p className="text-gray-500">Run data collection to gather communication information for all employees.</p>
          </div>
          <Button 
            onClick={handleCollectData}
            disabled={isCollecting}
            className={isCollecting ? 'opacity-70' : ''}
          >
            {isCollecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Collecting Data...
              </>
            ) : (
              'Run Data Collection'
            )}
          </Button>
        </div>

        {isCollecting && (
          <div className="text-blue-600 mt-4 font-semibold flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Data collection in progress...
          </div>
        )}

        {dataCollected && !isCollecting && (
          <>
            <div className="flex items-center text-green-600 mb-6">
              <Check className="mr-2 h-5 w-5" />
              <span className="font-medium">Data collection complete! Information gathered for 242 employees.</span>
            </div>

            {/* Employee Data Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Employee Data</h2>
                <Button 
                  onClick={handleMergeAllEmails}
                  variant="outline" 
                  className="text-blue-600 border-blue-600"
                  disabled={isApplyingChanges || issueStats.aliasCount === 0}
                >
                  {isApplyingChanges ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Merge className="mr-2 h-4 w-4" />
                  )}
                  Merge All Emails
                </Button>
              </div>

              <div className="mb-2 text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalEmployees)} of {totalEmployees} employees
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chat Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Access</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employeesData.map(employee => {
                        const shouldHighlight = employee.hasQualityIssues || employee.emails.length > 1;
                        const rowClassName = shouldHighlight 
                          ? "bg-red-50 hover:bg-red-100" 
                          : "hover:bg-gray-50";
                          
                        return (
                          <tr key={employee.id} className={rowClassName}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                                {employee.hasQualityIssues && (
                                  <Badge className="ml-2 bg-amber-100 text-amber-800">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Issue
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {employee.emails[0].address}
                                {employee.emails.length > 1 && (
                                  <Badge className="ml-2 bg-amber-100 text-amber-800">
                                    +{employee.emails.length - 1} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.emailCount.toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.chatCount.toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.meetingCount.toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{employee.fileAccessCount.toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge className={employee.isIncluded ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {employee.isIncluded ? "Included" : "Excluded"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={() => handleViewDetails(employee)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <PaginationControl 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>

            {/* Data Quality Issues Section - Now using the separate component */}
            <DataQualityIssues
              employeesWithAliases={employeesWithAliases}
              employeesWithConflicts={employeesWithConflicts}
              employeesWithMissingData={employeesWithMissingData}
              issueStats={issueStats}
              isApplyingChanges={isApplyingChanges}
              handleMergeEmails={handleMergeEmails}
              handleApplyResolutions={handleApplyResolutions}
              handleSaveInformation={handleSaveInformation}
              handleFixAllIssues={handleFixAllIssues}
              handleMergeAllEmails={handleMergeAllEmails}
            />
          </>
        )}
      </div>

      {/* Back and Next Buttons*/}
      <div className="flex justify-between mt-6 mb-6">
        <Button 
          onClick={handleBack} 
          variant="outline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button 
          onClick={handleNext}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && showDetailModal && (
        <EmployeeDetailModal employee={selectedEmployee} />
      )}
    </div>
  );
};

export default DataOverviewPage;