"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Employee } from '../../../lib/types';
import { X } from 'lucide-react';
import { employeeService } from '../../../lib/services/employeeService';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee;
    onStatusChange?: () => void;
}

const EmployeeDetailModal: React.FC<ModalProps> = ({ isOpen, onClose, employee, onStatusChange }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setCurrentEmployee(employee);
    }, [employee]);

    // Handle clicks outside modal and ESC key
    useEffect(() => {
        const checkAndClose = () => {
            if (hasChanges) {
                if (window.confirm("You have unsaved changes. Are you sure you want to close?")) onClose();
            } else {
                onClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) checkAndClose();
        };

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') checkAndClose();
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, hasChanges]);

    const handleToggleStatus = async () => {
        try {
            await employeeService.toggleEmployeeStatus(currentEmployee.id);
            setCurrentEmployee({
                ...currentEmployee,
                status: currentEmployee.status === 'Included' ? 'Excluded' : 'Included'
            });
            setHasChanges(true);
        } catch (error) {
            console.error("Error toggling employee status:", error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (onStatusChange) onStatusChange();
            onClose();
        } catch (error) {
            console.error("Error saving employee changes:", error);
        }
    };

    if (!isOpen) return null;

    // Info section renderer to reduce repetition
    const InfoItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
        <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm text-gray-900 dark:text-white">{value || "Not specified"}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        {currentEmployee.profilePicture ? (
                            <img 
                                src={currentEmployee.profilePicture} 
                                alt={currentEmployee.name}
                                className="w-10 h-10 rounded-full mr-3" 
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white mr-3 flex items-center justify-center font-bold">
                                {currentEmployee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{currentEmployee.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{currentEmployee.position}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            if (hasChanges) {
                                if (window.confirm("You have unsaved changes. Are you sure you want to close?")) onClose();
                            } else {
                                onClose();
                            }
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Basic Information</h3>
                            <InfoItem label="Full Name" value={currentEmployee.name} />
                            <InfoItem label="Email" value={currentEmployee.email} />
                            <InfoItem label="Department" value={currentEmployee.department} />
                            <InfoItem label="Position" value={currentEmployee.position} />
                            <InfoItem label="Location" value={currentEmployee.location} />
                            <InfoItem label="Work Model" value={currentEmployee.workModel} />
                        </div>
                        
                        {/* Demographics */}
                        <div>
                            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Demographics</h3>
                            <InfoItem label="Age" value={currentEmployee.age} />
                            <InfoItem label="Gender" value={currentEmployee.gender} />
                            <InfoItem label="Race/Ethnicity" value={currentEmployee.ethnicity} />
                            <InfoItem label="Time Zone" value={currentEmployee.timeZone} />
                            <InfoItem label="Tenure" value={currentEmployee.tenure} />
                            <InfoItem label="Language" value={currentEmployee.language} />
                        </div>
                    </div>
                    
                    {/* Work Activity Section - Condensed */}
                    {currentEmployee.workActivity && (
                        <div className="mt-4">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Work Activity</h3>
                            
                            {/* Average Work Hours */}
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Hours: {currentEmployee.workActivity.avgHours.toFixed(1)} hrs/week</p>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${(currentEmployee.workActivity.avgHours - 30) / 20 * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>30h</span>
                                    <span>40h</span>
                                    <span>50h</span>
                                </div>
                            </div>
                            
                            {/* Weekly Work Pattern - Condensed */}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Weekly Pattern</p>
                                <div className="grid grid-cols-7 gap-1">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                        <div key={day} className="text-center">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{day}</p>
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded p-1">
                                                <div 
                                                    className="bg-blue-600 rounded w-full transition-all"
                                                    style={{ 
                                                        height: `${(currentEmployee.workActivity.weeklyHours[index] / 12) * 60}px`, 
                                                        opacity: currentEmployee.workActivity.weeklyHours[index] ? 1 : 0.2
                                                    }}
                                                ></div>
                                                <p className="text-xs mt-1 text-gray-900 dark:text-white">
                                                    {currentEmployee.workActivity.weeklyHours[index]?.toFixed(1) || 0}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analysis Inclusion Toggle */}
                    <div className="mt-4 border-t pt-3 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Analysis Inclusion</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Include in workplace analysis?</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 text-xs ${currentEmployee.status === 'Excluded' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Exclude</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={currentEmployee.status === 'Included'}
                                        onChange={handleToggleStatus}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <span className={`ml-2 text-xs ${currentEmployee.status === 'Included' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Include</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-end space-x-2">
                    <button 
                        onClick={() => {
                            if (hasChanges) {
                                if (window.confirm("You have unsaved changes. Are you sure you want to close?")) onClose();
                            } else {
                                onClose();
                            }
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleSaveChanges}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailModal;