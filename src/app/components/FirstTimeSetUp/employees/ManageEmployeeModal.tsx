"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Employee } from '../../../lib/types';
import { employeeService } from '../../../lib/services/employeeService';
import EmployeeDetailModal from './employeeDetailModal';
import AddEmployeeModal from './AddEmployeeModal';

interface ManageEmployeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeStatusChange: () => void;
}

const ManageEmployeesModal: React.FC<ManageEmployeesModalProps> = ({ 
    isOpen, 
    onClose,
    onEmployeeStatusChange
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    
    // Filters
    const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
    const [locationFilter, setLocationFilter] = useState<string>('All Locations');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    
    const employeesPerPage = 6;
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    // Load employees when modal opens
    useEffect(() => {
        const loadEmployees = async () => {
            if (isOpen) {
                setIsLoading(true);
                try {
                    const loadedEmployees = await employeeService.getEmployees();
                    setEmployees(loadedEmployees);
                    setFilteredEmployees(loadedEmployees);
                } catch (error) {
                    console.error("Error loading employees:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        loadEmployees();
    }, [isOpen]);

    // Filter employees whenever filters change
    useEffect(() => {
        if (employees.length === 0) return;
        
        let result = [...employees];
        
        // Apply department filter
        if (departmentFilter !== 'All Departments') {
            result = result.filter(emp => emp.department === departmentFilter);
        }
        
        // Apply location filter
        if (locationFilter !== 'All Locations') {
            result = result.filter(emp => emp.location === locationFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'All Status') {
            result = result.filter(emp => emp.status === statusFilter);
        }
        
        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(emp => 
                emp.name.toLowerCase().includes(term) || 
                emp.email.toLowerCase().includes(term) ||
                emp.position.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term)
            );
        }
        
        setFilteredEmployees(result);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [employees, departmentFilter, locationFilter, statusFilter, searchTerm]);

    // Handle clicking outside the modal to close it - FIXED
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Ensure we're not closing when interaction is inside the modal
            // or if other modals are open
            if (isEmployeeDetailOpen || isAddEmployeeModalOpen) {
                return;
            }
            
            // Only close if clicking on the overlay background, not on any content
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal-overlay') && 
                modalRef.current && 
                !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, isEmployeeDetailOpen, isAddEmployeeModalOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            // Don't close the parent modal if a child modal is open
            if (isEmployeeDetailOpen || isAddEmployeeModalOpen) {
                return;
            }
            
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, isEmployeeDetailOpen, isAddEmployeeModalOpen]);

    const handleStatusChange = async (employeeId: number) => {
        await employeeService.toggleEmployeeStatus(employeeId);
        
        // Refresh the employee list
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        
        // Notify parent component
        onEmployeeStatusChange();
    };

    const handleToggleAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all rows on current page
            const currentPageEmployees = getCurrentPageEmployees();
            setSelectedRows(currentPageEmployees.map(emp => emp.id));
        } else {
            // Deselect all
            setSelectedRows([]);
        }
    };

    const handleToggleRow = (employeeId: number) => {
        if (selectedRows.includes(employeeId)) {
            setSelectedRows(selectedRows.filter(id => id !== employeeId));
        } else {
            setSelectedRows([...selectedRows, employeeId]);
        }
    };

    const handleEmployeeAdded = async () => {
        // Refresh employees after adding a new one
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        onEmployeeStatusChange();
        setIsAddEmployeeModalOpen(false);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleViewDetails = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEmployeeDetailOpen(true);
    };

    const handleEmployeeDetailsClose = async () => {
        setSelectedEmployee(null);
        setIsEmployeeDetailOpen(false);
        
        // Refresh employee list after closing details modal
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        onEmployeeStatusChange();
    };

    // Get employees for current page
    const getCurrentPageEmployees = () => {
        const startIndex = (currentPage - 1) * employeesPerPage;
        return filteredEmployees.slice(startIndex, startIndex + employeesPerPage);
    };

    // Get unique departments for filter
    const getDepartments = () => {
        const departments = new Set<string>();
        employees.forEach(emp => departments.add(emp.department));
        return Array.from(departments).sort();
    };

    // Get unique locations for filter
    const getLocations = () => {
        const locations = new Set<string>();
        employees.forEach(emp => {
            if (emp.location) {
                locations.add(emp.location);
            }
        });
        return Array.from(locations).sort();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 modal-overlay">
                <div 
                    ref={modalRef}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl h-auto max-h-[90vh] flex flex-col animate-fadeIn"
                    onClick={(e) => e.stopPropagation()} // Prevent events from bubbling up
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Employees</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input 
                                type="search" 
                                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="Search employees"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Departments">All Departments</option>
                                {getDepartments().map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Locations">All Locations</option>
                                {getLocations().map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Status">All Status</option>
                                <option value="Included">Included</option>
                                <option value="Excluded">Excluded</option>
                            </select>
                            
                            <button
                                onClick={() => setIsAddEmployeeModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                                Add Employee
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto flex-grow overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input 
                                                id="checkbox-all" 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={handleToggleAllRows}
                                                checked={selectedRows.length > 0 && getCurrentPageEmployees().every(emp => selectedRows.includes(emp.id))}
                                            />
                                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">NAME</th>
                                    <th scope="col" className="px-6 py-3">EMAIL</th>
                                    <th scope="col" className="px-6 py-3">DEPARTMENT</th>
                                    <th scope="col" className="px-6 py-3">POSITION</th>
                                    <th scope="col" className="px-6 py-3">LOCATION</th>
                                    <th scope="col" className="px-6 py-3">STATUS</th>
                                    <th scope="col" className="px-6 py-3">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">Loading employees...</td>
                                    </tr>
                                ) : getCurrentPageEmployees().length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">No employees found.</td>
                                    </tr>
                                ) : (
                                    getCurrentPageEmployees().map((employee) => (
                                        <tr key={employee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input 
                                                        id={`checkbox-${employee.id}`} 
                                                        type="checkbox" 
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        checked={selectedRows.includes(employee.id)}
                                                        onChange={() => handleToggleRow(employee.id)}
                                                    />
                                                    <label htmlFor={`checkbox-${employee.id}`} className="sr-only">checkbox</label>
                                                </div>
                                            </td>
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                {employee.profilePicture ? (
                                                    <img className="w-10 h-10 rounded-full" src={employee.profilePicture} alt={employee.name} />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold text-gray-900 dark:text-white">{employee.name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">{employee.email}</td>
                                            <td className="px-6 py-4">{employee.department}</td>
                                            <td className="px-6 py-4">{employee.position}</td>
                                            <td className="px-6 py-4">{employee.location || "Not specified"}</td>
                                            <td className="px-6 py-4">
                                                <span 
                                                    className={`px-2 py-1 rounded text-xs cursor-pointer ${
                                                        employee.status === 'Included' 
                                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                                                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                                    }`}
                                                    onClick={() => handleStatusChange(employee.id)}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleViewDetails(employee)}
                                                    className="text-blue-600 hover:underline font-medium dark:text-blue-500"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            Showing {filteredEmployees.length > 0 ? ((currentPage - 1) * employeesPerPage) + 1 : 0} to {Math.min(currentPage * employeesPerPage, filteredEmployees.length)} of {filteredEmployees.length} results
                        </div>
                        
                        <div className="inline-flex">
                            <button 
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Show pages around current page
                                let pageToShow;
                                if (totalPages <= 5) {
                                    pageToShow = i + 1;
                                } else if (currentPage <= 3) {
                                    pageToShow = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageToShow = totalPages - 4 + i;
                                } else {
                                    pageToShow = currentPage - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageToShow}
                                        onClick={() => setCurrentPage(pageToShow)}
                                        className={`px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 ${
                                            currentPage === pageToShow
                                                ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white'
                                                : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {pageToShow}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <>
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                        ...
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Employee Detail Modal */}
            {selectedEmployee && isEmployeeDetailOpen && (
                <EmployeeDetailModal
                    isOpen={true}
                    onClose={handleEmployeeDetailsClose}
                    employee={selectedEmployee}
                    onStatusChange={onEmployeeStatusChange}
                />
            )}
            
            {/* Add Employee Modal */}
            {isAddEmployeeModalOpen && (
                <AddEmployeeModal
                    isOpen={true}
                    onClose={() => setIsAddEmployeeModalOpen(false)}
                    onEmployeeAdded={handleEmployeeAdded}
                />
            )}
        </>
    );
};

export default ManageEmployeesModal;