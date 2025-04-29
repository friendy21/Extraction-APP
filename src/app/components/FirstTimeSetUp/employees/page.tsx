"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, Building, MapPin, Home, Search, Filter, CheckSquare, XSquare } from 'lucide-react';
import { Employee, DepartmentDistribution } from '../../../lib/types';
import { employeeService } from '../../../lib/services/employeeService';
import { useStep } from '../StepContext';
import { Button } from "../../../components/ui/button";
import EmployeeDetailModal from './employeeDetailModal';
import ManageEmployeesModal from './ManageEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';

const BREAKPOINT = 768;
const EMPLOYEES_PER_PAGE = 5;

// Sub-Components (unchanged implementations for brevity, see original code for details)
const MetricCard: React.FC<{ icon: React.ReactNode; value: number | string; label: string }> = ({ icon, value, label }) => (
  <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center">
    <div className="bg-[#2563EB] text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2">{icon}</div>
    <div className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-gray-100">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const EmployeeMetrics: React.FC<{ employees: Employee[]; departmentDistribution: DepartmentDistribution[]; locationCount: number; remoteWorkers: number }> = ({ employees, departmentDistribution, locationCount, remoteWorkers }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fadeIn">
    <MetricCard icon={<Users className="w-5 h-5 md:w-6 md:h-6" />} value={employees.length} label="Total Employees" />
    <MetricCard icon={<Building className="w-5 h-5 md:w-6 md:h-6" />} value={departmentDistribution.length} label="Departments" />
    <MetricCard icon={<MapPin className="w-5 h-5 md:w-6 md:h-6" />} value={locationCount} label="Locations" />
    <MetricCard icon={<Home className="w-5 h-5 md:w-6 md:h-6" />} value={remoteWorkers} label="Remote Workers" />
  </div>
);

const DepartmentDistributionSection: React.FC<{ departmentDistribution: DepartmentDistribution[]; totalEmployees: number }> = ({ departmentDistribution, totalEmployees }) => (
  <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 mb-6 animate-fadeIn">
    <h2 className="text-xl font-semibold text-[#2563EB] dark:text-[#60A5FA] mb-4">Department Distribution</h2>
    {totalEmployees > 0 && departmentDistribution.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentDistribution.map((dept) => (
          <div key={dept.name} className="flex flex-col group relative">
            <div className="flex justify-between items-center mb-2">
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate pr-2" title={dept.name}>{dept.name}</div>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">{dept.count} employee{dept.count !== 1 ? 's' : ''}</div>
            </div>
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
              <div className="h-6 bg-[#2563EB] rounded transition-all duration-500 ease-out" style={{ width: `${(dept.count / totalEmployees) * 100}%` }} title={`${((dept.count / totalEmployees) * 100).toFixed(1)}%`} />
              <div className="absolute invisible group-hover:visible bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                {((dept.count / totalEmployees) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">No department data available yet.</p>
    )}
  </div>
);

const SearchAndFilterBar: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void; selectedDepartment: string; setSelectedDepartment: (dept: string) => void; selectedStatus: string; setSelectedStatus: (status: string) => void; departments: string[] }> = ({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, selectedStatus, setSelectedStatus, departments }) => (
  <div className="flex flex-col md:flex-row gap-2 mb-4">
    <div className="relative flex-grow">
      <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
      <input type="text" placeholder="Search by name, email, position..." className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search employees" />
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <select className="appearance-none pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} aria-label="Filter by department">
          {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
        </select>
        <Filter className="absolute inset-y-0 right-0 pr-3 h-4 w-4 text-gray-400" />
      </div>
      <div className="relative flex-1">
        <select className="appearance-none pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} aria-label="Filter by status">
          <option value="All">All Status</option>
          <option value="Included">Included</option>
          <option value="Excluded">Excluded</option>
        </select>
        <Filter className="absolute inset-y-0 right-0 pr-3 h-4 w-4 text-gray-400" />
      </div>
    </div>
  </div>
);

const BulkActions: React.FC<{ selectedCount: number; handleBulkInclude: () => void; handleBulkExclude: () => void }> = ({ selectedCount, handleBulkInclude, handleBulkExclude }) => (
  selectedCount > 0 ? (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
      <div className="text-blue-700 dark:text-blue-100 font-medium">{selectedCount} employee{selectedCount > 1 ? 's' : ''} selected</div>
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={handleBulkInclude} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center text-sm transition-colors"><CheckSquare className="h-4 w-4 mr-1" /> Include Selected</button>
        <button onClick={handleBulkExclude} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center text-sm transition-colors"><XSquare className="h-4 w-4 mr-1" /> Exclude Selected</button>
      </div>
    </div>
  ) : null
);

const PaginationControls: React.FC<{ currentPage: number; totalPages: number; handlePreviousPage: () => void; handleNextPage: () => void; startEntry: number; endEntry: number; totalFilteredEntries: number }> = ({ currentPage, totalPages, handlePreviousPage, handleNextPage, startEntry, endEntry, totalFilteredEntries }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
    <div className="text-sm text-gray-500 dark:text-gray-400">{totalFilteredEntries > 0 ? `Showing ${startEntry} to ${endEntry} of ${totalFilteredEntries} entries` : 'No entries to show'}</div>
    <div className="flex items-center space-x-2">
      <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`border border-[#2563EB] text-[#2563EB] px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label="Previous page">Previous</button>
      <span className="text-gray-600 dark:text-gray-400 font-medium px-2" aria-live="polite">Page {currentPage} of {totalPages || 1}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className={`bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label="Next page">Next</button>
    </div>
  </div>
);

interface EmployeeTableProps {
  employees: Employee[];
  isMobile: boolean;
  selectedEmployees: number[];
  onToggleSelection: (employeeId: number) => void;
  onToggleStatus: (employeeId: number) => void;
  onViewDetails: (employee: Employee) => void;
  selectAll: boolean;
  onSelectAllChange: (checked: boolean) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, isMobile, selectedEmployees, onToggleSelection, onToggleStatus, onViewDetails, selectAll, onSelectAllChange }) => (
  <div className="overflow-x-auto shadow-inner rounded-lg border border-gray-200 dark:border-gray-700">
    <table className={`w-full ${isMobile ? 'min-w-[450px]' : ''}`}>
      <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
        <tr>
          <th className="p-2 md:p-3 w-12 text-center"><input type="checkbox" checked={selectAll} onChange={(e) => onSelectAllChange(e.target.checked)} className="form-checkbox h-4 w-4 text-blue-600" aria-label="Select all on page" /></th>
          <th className="p-2 md:p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Name</th>
          {!isMobile && <th className="p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Email</th>}
          {!isMobile && <th className="p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Department</th>}
          {!isMobile && <th className="p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Position</th>}
          {isMobile && <th className="p-2 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Dept. & Pos.</th>}
          <th className="p-2 md:p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Status</th>
          {!isMobile && <th className="p-3 text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {employees.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <td className="p-2 md:p-3 text-center align-middle"><input type="checkbox" checked={selectedEmployees.includes(employee.id)} onChange={() => onToggleSelection(employee.id)} className="form-checkbox h-4 w-4 text-blue-600" /></td>
            <td className="p-2 md:p-3 align-middle">
              <div className="flex items-center space-x-2 md:space-x-3">
                {employee.profilePicture ? <img src={employee.profilePicture} alt={`${employee.name}'s profile`} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} /> : <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0">{employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}</div>}
                <div className="flex flex-col overflow-hidden">
                  <button onClick={() => onViewDetails(employee)} className="hover:underline text-left font-medium text-sm text-gray-900 dark:text-gray-100 truncate" title={employee.name}>{employee.name || 'N/A'}</button>
                  {isMobile && <span className="text-xs text-gray-500 dark:text-gray-400 truncate" title={employee.email}>{employee.email || 'No Email'}</span>}
                </div>
              </div>
            </td>
            {!isMobile && (
              <>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] align-middle" title={employee.email}>{employee.email || '-'}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] align-middle" title={employee.department}>{employee.department || '-'}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] align-middle" title={employee.position}>{employee.position || '-'}</td>
              </>
            )}
            {isMobile && (
              <td className="p-2 align-middle">
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate" title={employee.department}>{employee.department || 'No Dept.'}</span>
                  <span className="font-medium text-xs text-gray-800 dark:text-gray-200 truncate" title={employee.position}>{employee.position || 'No Pos.'}</span>
                </div>
              </td>
            )}
            <td className="p-2 md:p-3 align-middle">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${employee.status === 'Included' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} onClick={() => onToggleStatus(employee.id)} title={`Click to toggle to ${employee.status === 'Included' ? 'Excluded' : 'Included'}`} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleStatus(employee.id); }}>{employee.status}</span>
            </td>
            {!isMobile && <td className="p-3 align-middle"><button onClick={() => onViewDetails(employee)} className="text-[#2563EB] hover:text-[#1D4ED8] font-medium text-sm">View Details</button></td>}
          </tr>
        ))}
      </tbody>
    </table>
    {employees.length === 0 && <div className="p-4 text-center text-gray-500 dark:text-gray-400">No employees found.</div>}
  </div>
);

// Main Component
const EmployeePage: React.FC = () => {
  const router = useRouter();
  const { setCurrentStep } = useStep();

  // State
  const [isDiscoveryComplete, setIsDiscoveryComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDiscoveredEmployees, setTotalDiscoveredEmployees] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<DepartmentDistribution[]>([]);
  const [locationCount, setLocationCount] = useState(0);
  const [remoteWorkers, setRemoteWorkers] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized Values
  const departments = useMemo(() => ['All', ...Array.from(new Set(employees.map(emp => emp.department).filter(Boolean))).sort()], [employees]);
  const filteredEmployees = useMemo(() => employees.filter(emp =>
    (searchTerm === '' || [emp.name, emp.email, emp.position].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedDepartment === 'All' || emp.department === selectedDepartment) &&
    (selectedStatus === 'All' || emp.status === selectedStatus)
  ), [employees, searchTerm, selectedDepartment, selectedStatus]);
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const paginatedEmployees = useMemo(() => filteredEmployees.slice((currentPage - 1) * EMPLOYEES_PER_PAGE, currentPage * EMPLOYEES_PER_PAGE), [filteredEmployees, currentPage]);
  const startEntry = filteredEmployees.length > 0 ? (currentPage - 1) * EMPLOYEES_PER_PAGE + 1 : 0;
  const endEntry = Math.min(currentPage * EMPLOYEES_PER_PAGE, filteredEmployees.length);

  // Effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!isDiscoveryComplete || totalDiscoveredEmployees === 0) {
        if (isDiscoveryComplete) setEmployees([]);
        return;
      }
      try {
        const [emps, dist, loc, rem] = await Promise.all([
          employeeService.getEmployees(),
          employeeService.getDepartmentDistribution(),
          employeeService.getLocationCount(),
          employeeService.getRemoteWorkersCount()
        ]);
        setEmployees(emps);
        setDepartmentDistribution(dist);
        setLocationCount(loc);
        setRemoteWorkers(rem);
      } catch (error) {
        setErrorMessage('Failed to load employee data. Please try again.');
        console.error(error);
      }
    };
    loadData();
  }, [isDiscoveryComplete, totalDiscoveredEmployees]);

  useEffect(() => setCurrentPage(1), [searchTerm, selectedDepartment, selectedStatus]);
  useEffect(() => { setSelectedEmployees([]); setSelectAllOnPage(false); }, [filteredEmployees]);
  useEffect(() => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectAllOnPage(pageIds.length > 0 && pageIds.every(id => selectedEmployees.includes(id)));
  }, [selectedEmployees, paginatedEmployees]);

  // Callbacks
  const handleNavigation = useCallback((step: number, path: string) => { setCurrentStep(step); router.push(path); }, [setCurrentStep, router]);
  const handleBack = useCallback(() => handleNavigation(1, '/components/FirstTimeSetUp/ConnectionSetup'), [handleNavigation]);
  const handleNext = useCallback(() => handleNavigation(3, '/components/FirstTimeSetUp/DataSetup'), [handleNavigation]);
  const handlePreviousPage = useCallback(() => setCurrentPage(prev => Math.max(prev - 1, 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage(prev => Math.min(prev + 1, totalPages)), [totalPages]);

  const runDiscovery = useCallback(async () => {
    setIsLoading(true);
    setIsDiscoveryComplete(false);
    setErrorMessage(null);
    setEmployees([]);
    try {
      const count = await employeeService.runDiscovery();
      setTotalDiscoveredEmployees(count);
      setIsDiscoveryComplete(true);
    } catch (error) {
      setErrorMessage('Discovery failed. Check your connections and try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEmployeeData = useCallback(async () => {
    try {
      const [emps, dist, loc, rem] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getDepartmentDistribution(),
        employeeService.getLocationCount(),
        employeeService.getRemoteWorkersCount()
      ]);
      setEmployees(emps);
      setDepartmentDistribution(dist);
      setLocationCount(loc);
      setRemoteWorkers(rem);
      setTotalDiscoveredEmployees(emps.length);
    } catch (error) {
      setErrorMessage('Failed to refresh data.');
      console.error(error);
    }
  }, []);

  const handleToggleSelection = useCallback((id: number) => setSelectedEmployees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);
  const handleSelectAllOnPage = useCallback((checked: boolean) => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectedEmployees(prev => checked ? [...new Set([...prev, ...pageIds])] : prev.filter(id => !pageIds.includes(id)));
  }, [paginatedEmployees]);
  const handleToggleStatus = useCallback(async (id: number) => {
    const emp = employees.find(e => e.id === id);
    const newStatus = emp?.status === 'Included' ? 'Excluded' : 'Included';
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    try {
      await employeeService.toggleEmployeeStatus(id);
    } catch (error) {
      setErrorMessage('Failed to update status.');
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: emp?.status } : e));
      console.error(error);
    }
  }, [employees]);
  const performBulkUpdate = useCallback(async (status: 'Included' | 'Excluded') => {
    const original = [...employees];
    setEmployees(prev => prev.map(emp => selectedEmployees.includes(emp.id) ? { ...emp, status } : emp));
    try {
      await Promise.all(selectedEmployees.map(id => employeeService.updateEmployeeStatus(id, status)));
      setSelectedEmployees([]);
    } catch (error) {
      setErrorMessage(`Failed to bulk update to ${status}.`);
      setEmployees(original);
      console.error(error);
    }
  }, [selectedEmployees, employees]);
  const handleBulkInclude = useCallback(() => performBulkUpdate('Included'), [performBulkUpdate]);
  const handleBulkExclude = useCallback(() => performBulkUpdate('Excluded'), [performBulkUpdate]);

  // Render
  return (
    <>
      {selectedEmployee && <EmployeeDetailModal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} onStatusChange={refreshEmployeeData} />}
      {isManageModalOpen && <ManageEmployeesModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} onEmployeeStatusChange={refreshEmployeeData} />}
      {isAddEmployeeModalOpen && <AddEmployeeModal isOpen={isAddEmployeeModalOpen} onClose={() => setIsAddEmployeeModalOpen(false)} onEmployeeAdded={refreshEmployeeData} />}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-[#2563EB] dark:text-[#93c5fd]">Employee Discovery</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Discover employees from connected platforms or add them manually.</p>
        {errorMessage && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200" role="alert"><p className="font-semibold">Error</p><p>{errorMessage}</p></div>}
        <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2563EB] dark:text-[#60A5FA]">Discover Employees</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Run discovery to fetch employees from connected platforms.</p>
            </div>
            <button onClick={runDiscovery} disabled={isLoading} className={`bg-[#2563EB] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1D4ED8]'}`}>
              {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Running...</> : 'Run Discovery'}
            </button>
          </div>
          {isLoading && <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-100 flex items-center animate-pulse"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Discovery in progress...</div>}
          {isDiscoveryComplete && !isLoading && (
            <div className={`mt-4 p-3 rounded-lg flex items-center text-sm ${totalDiscoveredEmployees > 0 ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100' : 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100'}`}>
              {totalDiscoveredEmployees > 0 ? <><CheckSquare className="w-5 h-5 mr-2" />Discovery complete! Found {totalDiscoveredEmployees} employee{totalDiscoveredEmployees !== 1 ? 's' : ''}.</> : <><Users className="w-5 h-5 mr-2" />No employees found. Add manually below.</>}
            </div>
          )}
        </div>
        {isDiscoveryComplete && !isLoading && (
          <>
            {employees.length > 0 && (
              <>
                <EmployeeMetrics employees={employees} departmentDistribution={departmentDistribution} locationCount={locationCount} remoteWorkers={remoteWorkers} />
                <DepartmentDistributionSection departmentDistribution={departmentDistribution} totalEmployees={employees.length} />
              </>
            )}
            <div className="mt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
                <h2 className="text-xl md:text-2xl font-semibold text-[#2563EB] dark:text-[#60A5FA]">Manage Employee List</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button className="bg-white border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-sm" onClick={() => setIsManageModalOpen(true)}><Users className="w-4 h-4" />Manage All</button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm" onClick={() => setIsAddEmployeeModalOpen(true)}><Users className="w-4 h-4" />Add Employee</button>
                </div>
              </div>
              <div className="bg-card border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 md:p-6">
                <SearchAndFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} departments={departments} />
                <BulkActions selectedCount={selectedEmployees.length} handleBulkInclude={handleBulkInclude} handleBulkExclude={handleBulkExclude} />
                <EmployeeTable employees={paginatedEmployees} isMobile={isMobile} selectedEmployees={selectedEmployees} onToggleSelection={handleToggleSelection} onToggleStatus={handleToggleStatus} onViewDetails={setSelectedEmployee} selectAll={selectAllOnPage} onSelectAllChange={handleSelectAllOnPage} />
                <PaginationControls currentPage={currentPage} totalPages={totalPages} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} startEntry={startEntry} endEntry={endEntry} totalFilteredEntries={filteredEmployees.length} />
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between mt-8 mb-6">
          <Button onClick={handleBack} variant="outline" className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 py-2 px-6 rounded-md">Previous</Button>
          <Button onClick={handleNext} disabled={!isDiscoveryComplete} title={!isDiscoveryComplete ? "Run discovery first" : "Proceed to Data Setup"} className={`py-2 px-6 rounded-md ${isDiscoveryComplete ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Next</Button>
        </div>
      </div>
    </>
  );
};

export default EmployeePage;