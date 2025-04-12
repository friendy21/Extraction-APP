"use client"

import React, { useState, useEffect } from 'react';

interface EditAdminUserModalProps {
  user: any;
  onClose: () => void;
  onSave: (user: any) => void;
}

const EditAdminUserModal: React.FC<EditAdminUserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: '',
    twoFA: false,
    lastPasswordChange: '2 months ago',
    activeSessions: 0
  });

  useEffect(() => {
    // Split name into first and last name
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    setFormData({
      firstName,
      lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      twoFA: user.twoFA,
      lastPasswordChange: '2 months ago',
      activeSessions: user.activeSessions
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      twoFA: formData.twoFA
    });
  };

  const handleResetPassword = () => {
    alert('Password reset requested');
  };

  const handleReset2FA = () => {
    alert('2FA reset requested');
  };

  const handleTerminateAllSessions = () => {
    alert('All sessions terminated');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Admin User</h3>
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
        
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Basic Information</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <h4 className="text-sm font-medium text-gray-700 mt-6 mb-4">Role Settings</h4>
            
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role Type
              </label>
              <select
                name="role"
                id="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="System Admin">System Admin</option>
                <option value="Department Admin">Department Admin</option>
                <option value="Analytics User">Analytics User</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department Access
              </label>
              <select
                name="department"
                id="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.department}
                onChange={handleChange}
                disabled={formData.role === "System Admin"}
              >
                {formData.role === "System Admin" ? (
                  <option value="All Departments">All Departments</option>
                ) : (
                  <>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Account Status
              </label>
              <select
                name="status"
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="mb-6 border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    User has {formData.twoFA ? "2FA enabled" : "2FA disabled"}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
                  onClick={handleReset2FA}
                >
                  Reset 2FA
                </button>
              </div>
            </div>
            
            <div className="mb-6 border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Password Management</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Last changed: {formData.lastPasswordChange}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
                  onClick={handleResetPassword}
                >
                  Force Reset
                </button>
              </div>
            </div>
            
            <div className="mb-6 border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Active Sessions</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.activeSessions} active session{formData.activeSessions !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  onClick={handleTerminateAllSessions}
                  disabled={formData.activeSessions === 0}
                >
                  Terminate All
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminUserModal;