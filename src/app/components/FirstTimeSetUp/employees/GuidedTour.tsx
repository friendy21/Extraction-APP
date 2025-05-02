"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  const tourSteps: TourStep[] = [
    {
      target: '.employee-metrics',
      title: 'Employee Overview',
      content: 'These cards show a summary of your employee data, including total count, departments, locations, and remote workers.',
      placement: 'bottom'
    },
    {
      target: '.department-chart',
      title: 'Department Distribution',
      content: 'This interactive chart shows how your employees are distributed across departments. Hover over sections to see more details.',
      placement: 'right'
    },
    {
      target: '.search-filter-bar',
      title: 'Search & Filter',
      content: 'Quickly find employees by searching for their name, email, or position. Filter by department or inclusion status.',
      placement: 'bottom'
    },
    {
      target: '.employee-table',
      title: 'Employee List',
      content: 'View and manage all your employees here. Click on an employee to see their details or change their inclusion status.',
      placement: 'top'
    },
    {
      target: '.bulk-actions',
      title: 'Bulk Actions',
      content: 'Select multiple employees to include or exclude them all at once.',
      placement: 'bottom'
    },
    {
      target: '.pagination-controls',
      title: 'Navigation',
      content: 'Navigate between pages of employees using these controls.',
      placement: 'top'
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    
    const positionTooltip = () => {
      const step = tourSteps[currentStep];
      const targetElement = document.querySelector(step.target);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const placement = step.placement || 'bottom';
        
        let top = 0;
        let left = 0;
        
        switch (placement) {
          case 'top':
            top = rect.top - 10 - 150; // height of tooltip
            left = rect.left + rect.width / 2 - 150; // half width of tooltip
            break;
          case 'right':
            top = rect.top + rect.height / 2 - 75; // half height of tooltip
            left = rect.right + 10;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - 150; // half width of tooltip
            break;
          case 'left':
            top = rect.top + rect.height / 2 - 75; // half height of tooltip
            left = rect.left - 10 - 300; // width of tooltip
            break;
        }
        
        // Adjust for scroll position
        top += window.scrollY;
        left += window.scrollX;
        
        // Ensure tooltip stays within viewport
        if (left < 10) left = 10;
        if (left > window.innerWidth - 310) left = window.innerWidth - 310;
        if (top < 10) top = 10;
        if (top > window.innerHeight + window.scrollY - 160) top = window.innerHeight + window.scrollY - 160;
        
        setTooltipPosition({ top, left });
        
        // Highlight the target element
        targetElement.classList.add('tour-highlight');
        
        // Scroll element into view if needed
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return () => targetElement.classList.remove('tour-highlight');
      }
    };
    
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip);
    
    return () => {
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip);
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    };
  }, [isOpen, currentStep, tourSteps]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      <div 
        className="fixed z-50 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-fade-in"
        style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
      >
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X size={16} />
        </button>
        
        <div className="mb-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
          Step {currentStep + 1} of {tourSteps.length}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {tourSteps[currentStep].title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {tourSteps[currentStep].content}
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          
          {currentStep < tourSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(tourSteps.length - 1, prev + 1))}
              className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
            >
              Finish Tour
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const TourButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-30 animate-bounce-subtle"
    aria-label="Start guided tour"
  >
    <HelpCircle size={24} />
  </button>
);

export default GuidedTour;