"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Employee, DepartmentDistribution } from '../../../lib/types';
import { Loader2, Users, Building, MapPin, Home, Search, Filter, CheckSquare, XSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStep } from '../StepContext';
import { Button } from "../../../components/ui/button";
import { employeeService } from '../../../lib/services/employeeService';
import EmployeeDetailModal from './employeeDetailModal';
import ManageEmployeesModal from './ManageEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';

const breakpoint = 768;

const EmployeePage: React.FC = () => {
  const [isDiscoveryComplete, setIsDiscoveryComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [departmentDistribution, setDepartmentDistribution] = useState<DepartmentDistribution[]>([]);
  const [locationCount, setLocationCount] = useState(0);
  const [remoteWorkers, setRemoteWorkers] = useState(0);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  
  // New state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Create a filtered list of employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Department filter
      const matchesDepartment = selectedDepartment === 'All' || 
        employee.department === selectedDepartment;
      
      // Status filter
      const matchesStatus = selectedStatus === 'All' || 
        employee.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Calculate statistics
  const includedEmployees = employees.filter(emp => emp.status === 'Included').length;
  const excludedEmployees = employees.filter(emp => emp.status === 'Excluded').length;

  // Reset selected employees when page changes
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectAll(false);
  }, [currentPage]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedEmployees(paginatedEmployees.map(emp => emp.id));
    } else if (selectedEmployees.length === paginatedEmployees.length) {
      // If all were selected and then select all was unchecked
      setSelectedEmployees([]);
    }
  }, [selectAll]);

  // Check if all employees on current page are selected
  useEffect(() => {
    if (paginatedEmployees.length > 0 && 
        selectedEmployees.length === paginatedEmployees.length &&
        paginatedEmployees.every(emp => selectedEmployees.includes(emp.id))) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedEmployees, paginatedEmployees]);

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId: number) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  // Handle bulk actions
  const handleBulkInclude = async () => {
    if (selectedEmployees.length === 0) return;
    
    try {
      await Promise.all(
        selectedEmployees.map(id => 
          employeeService.updateEmployeeStatus(id, 'Included')
        )
      );
      await refreshEmployeeData();
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error performing bulk include:", error);
    }
  };

  const handleBulkExclude = async () => {
    if (selectedEmployees.length === 0) return;
    
    try {
      await Promise.all(
        selectedEmployees.map(id => 
          employeeService.updateEmployeeStatus(id, 'Excluded')
        )
      );
      await refreshEmployeeData();
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error performing bulk exclude:", error);
    }
  };

  // Load employees from service
  useEffect(() => {
    const loadEmployees = async () => {
      if (isDiscoveryComplete) {
        const loadedEmployees = await employeeService.getEmployees();
        setEmployees(loadedEmployees);
        
        const distribution = await employeeService.getDepartmentDistribution();
        setDepartmentDistribution(distribution);
        
        const locCount = await employeeService.getLocationCount();
        setLocationCount(locCount);
        
        const remoteCount = await employeeService.getRemoteWorkersCount();
        setRemoteWorkers(remoteCount);
      }
    };
    
    loadEmployees();
  }, [isDiscoveryComplete]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const router = useRouter();
  const { setCurrentStep } = useStep();

  const handleBack = () => {
    setCurrentStep(1);
    router.push('/components/FirstTimeSetUp/ConnectionSetup');
  };

  const handleNext = () => {
    setCurrentStep(3);
    router.push('/components/FirstTimeSetUp/DataSetup');
  };

  // Enhanced runDiscovery function with improved state handling
  const runDiscovery = async () => {
    setIsLoading(true);
    try {
      const totalCount = await employeeService.runDiscovery();
      setTotalEmployees(totalCount);
      // Only mark discovery as complete if employees were actually found
      setIsDiscoveryComplete(totalCount > 0);
    } catch (error) {
      console.error("Error during discovery:", error);
      setIsDiscoveryComplete(false); // Ensure it's false on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (employeeId: number) => {
    const updated = await employeeService.toggleEmployeeStatus(employeeId);
    if (updated) {
      const updatedEmployees = await employeeService.getEmployees();
      setEmployees(updatedEmployees);
    }
  };

  const refreshEmployeeData = async () => {
    const loadedEmployees = await employeeService.getEmployees();
    setEmployees(loadedEmployees);
    
    const distribution = await employeeService.getDepartmentDistribution();
    setDepartmentDistribution(distribution);
  };

  // Get unique departments for the filter dropdown
  const departments = useMemo(() => {
    const uniqueDepartments = new Set(employees.map(emp => emp.department));
    return ['All', ...Array.from(uniqueDepartments)];
  }, [employees]);

  return (
    <>
      {selectedEmployee && (
        <EmployeeDetailModal 
          isOpen={true} 
          onClose={() => setSelectedEmployee(null)} 
          employee={selectedEmployee}
          onStatusChange={refreshEmployeeData}
        />
      )}
      
      {isManageModalOpen && (
        <ManageEmployeesModal
          isOpen={true}
          onClose={() => setIsManageModalOpen(false)}
          onEmployeeStatusChange={refreshEmployeeData}
        />
      )}
      
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          isOpen={true}
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onEmployeeAdded={refreshEmployeeData}
        />
      )}
      
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-4 text-[#2563EB]">Employee Discovery</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Discover employees from connected platforms or import manually.</p>

        {/* Discover Employees Section */}
        <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-[#2563EB] dark:text-[#60A5FA]">Discover Employees</h2>
              <p className="text-gray-600 dark:text-gray-400">Run discovery to find employees from your connected platforms.</p>
            </div>
            <button 
              onClick={runDiscovery}
              disabled={isLoading}
              className={`bg-[#2563EB] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition-all w-full md:w-auto flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running Discovery...
                </>
              ) : (
                'Run Discovery'
              )}
            </button>
          </div>
          {isLoading && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-100 font-semibold flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Discovery in progress...
            </div>
          )}
          {isDiscoveryComplete && !isLoading && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-100 font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Discovery complete! {totalEmployees} employees found.
            </div>
          )}
        </div>

        {/* Show additional content after discovery */}
        {isDiscoveryComplete && !isLoading && employees.length > 0 && (
          <>
            {/* Metrics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center">
                <div className="bg-[#2563EB] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">{employees.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Employees</div>
              </div>
              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center">
                <div className="bg-[#2563EB] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Building className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">{departmentDistribution.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Departments</div>
              </div>
              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center">
                <div className="bg-[#2563EB] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">{locationCount}</div>
                <div className="text-gray-600 dark:text-gray-400">Locations</div>
              </div>
              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center">
                <div className="bg-[#2563EB] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Home className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">{remoteWorkers}</div>
                <div className="text-gray-600 dark:text-gray-400">Remote Workers</div>
              </div>
            </div>

            {/* Department Distribution Section */}
            <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 mb-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-[#2563EB] dark:text-[#60A5FA] mb-4">Department Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departmentDistribution.map((dept) => (
                  <div key={dept.name} className="flex flex-col group relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-base font-semibold text-gray-800 dark:text-gray-200 text-left">{dept.name}</div>
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm font-semibold px-2 py-1 rounded-full">
                        {dept.count} employees
                      </div>
                    </div>
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded relative">
                      <div className="h-6 bg-[#2563EB] rounded" style={{ width: `${(dept.count / employees.length) * 100}%` }}></div>
                      <div className="absolute invisible group-hover:visible bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                        {((dept.count / employees.length) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee List Section */}
            <div className="animate-fadeIn">
              <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-4 px-4 mt-4">
                <h2 className="text-lg font-semibold text-[#2563EB] dark:text-[#60A5FA] mb-3 md:mb-0">Employee List</h2>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <button 
                    className="bg-[#2563EB] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1D4ED8] transition-all"
                    onClick={() => setIsManageModalOpen(true)}
                  >
                    Manage Employees
                  </button>
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                    onClick={() => setIsAddEmployeeModalOpen(true)}
                  >
                    Add Employee
                  </button>
                </div>
              </div>

              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 md:p-6">
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="bg-card border rounded p-4 text-center">
                      <div className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">{employees.length}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Discovered</div>
                    </div>
                    <div className="bg-card border rounded p-4 text-center">
                      <div className="font-extrabold text-2xl text-green-600 dark:text-green-400">{includedEmployees}</div>
                      <div className="text-gray-600 dark:text-gray-400">Included in Analysis</div>
                    </div>
                    <div className="bg-card border rounded p-4 text-center">
                      <div className="font-extrabold text-2xl text-red-600 dark:text-red-400">{excludedEmployees}</div>
                      <div className="text-gray-600 dark:text-gray-400">Excluded from Analysis</div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                      <select
                        className="appearance-none pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <select
                        className="appearance-none pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Included">Included</option>
                        <option value="Excluded">Excluded</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedEmployees.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg flex flex-col md:flex-row justify-between items-center">
                    <div className="text-blue-700 dark:text-blue-100 mb-2 md:mb-0">
                      {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleBulkInclude}
                        className="bg-green-600 text-white px-3 py-1 rounded flex items-center text-sm"
                      >
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Include Selected
                      </button>
                      <button
                        onClick={handleBulkExclude}
                        className="bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm"
                      >
                        <XSquare className="h-4 w-4 mr-1" />
                        Exclude Selected
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-gray-600 dark:text-gray-400 mb-4">
                  Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
                </div>

                {isMobile ? (
                  <div className="overflow-x-auto shadow-inner">
                    <table className="w-full min-w-[400px]">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="p-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selectAll}
                              onChange={() => setSelectAll(!selectAll)}
                            />
                          </th>
                          <th className="p-2 text-left text-gray-700 dark:text-gray-300 font-semibold">NAME</th>
                          <th className="p-2 text-left text-gray-700 dark:text-gray-300 font-semibold">STATUS</th>
                          <th className="p-2 text-left text-gray-700 dark:text-gray-300 font-semibold">DEPT. & POS.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEmployees.length > 0 ? (
                          paginatedEmployees.map((employee) => (
                            <tr key={employee.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <td className="p-2">
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-blue-600"
                                  checked={selectedEmployees.includes(employee.id)}
                                  onChange={() => toggleEmployeeSelection(employee.id)}
                                />
                              </td>
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white mr-2 flex items-center justify-center font-bold text-xs">
                                    {employee.name.split(' ').map((n) => n[0]).join('')}
                                  </div>
                                  <div className="flex flex-col">
                                    <button 
                                      onClick={() => setSelectedEmployee(employee)}
                                      className="hover:underline cursor-pointer text-left"
                                    >
                                      <span className="font-bold text-sm block text-gray-900 dark:text-gray-100">{employee.name}</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400 block">{employee.email}</span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">
                                <span 
                                  className={`px-2 py-1 rounded text-xs ${
                                    employee.status === 'Included' 
                                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                  }`}
                                  onClick={() => handleToggleStatus(employee.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {employee.status}
                                </span>
                              </td>
                              <td className="p-2">
                                <div className="flex flex-col text-left">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">{employee.department}</span>
                                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{employee.position}</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No employees found matching the current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="p-3">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            checked={selectAll}
                            onChange={() => setSelectAll(!selectAll)}
                          />
                        </th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">NAME</th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">EMAIL</th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">DEPARTMENT</th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">POSITION</th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">STATUS</th>
                        <th className="p-3 text-left text-gray-700 dark:text-gray-300 font-semibold">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.length > 0 ? (
                        paginatedEmployees.map((employee) => (
                          <tr key={employee.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600"
                                checked={selectedEmployees.includes(employee.id)}
                                onChange={() => toggleEmployeeSelection(employee.id)}
                              />
                            </td>
                            <td className="p-3 flex items-center">
                              {employee.profilePicture ? (
                                <img src={employee.profilePicture} alt={employee.name} className="w-10 h-10 rounded-full mr-3" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white mr-3 flex items-center justify-center font-bold text-sm">
                                  {employee.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                              )}
                              <span className="font-bold text-gray-900 dark:text-gray-100">{employee.name}</span>
                            </td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{employee.email}</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{employee.department}</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{employee.position}</td>
                            <td className="p-3">
                              <span 
                                className={`px-2 py-1 rounded cursor-pointer ${
                                  employee.status === 'Included' 
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                }`}
                                onClick={() => handleToggleStatus(employee.id)}
                              >
                                {employee.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <button 
                                onClick={() => setSelectedEmployee(employee)}
                                className="text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#3B82F6] font-semibold"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No employees found matching the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`border border-[#2563EB] text-[#2563EB] px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Next
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredEmployees.length > 0 
                      ? `Showing ${(currentPage - 1) * employeesPerPage + 1} to ${Math.min(currentPage * employeesPerPage, filteredEmployees.length)} of ${filteredEmployees.length} entries`
                      : 'No entries to show'
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Helper Message when Discovery hasn't been run */}
        {!isDiscoveryComplete && !isLoading && (
          <div className="text-sm text-gray-500 text-center mt-2 mb-4">
            Please run discovery to find employees before proceeding
          </div>
        )}
        
        {/* Navigation Buttons - Fixed version with proper disabling */}
        <div className="flex justify-between mt-6 mb-6">
          <Button 
            onClick={handleBack} 
            variant="outline"
            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-md"
          >
            Previous
          </Button>
          
          {/* Enhanced Next button with stronger disabled state */}
          {isDiscoveryComplete ? (
            <Button 
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Next
            </Button>
          ) : (
            <Button 
              disabled={true}
              aria-disabled="true"
              title="Run discovery first to enable this button"
              className="bg-gray-300 text-gray-500 cursor-not-allowed font-medium py-2 px-6 rounded-md"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeePage;