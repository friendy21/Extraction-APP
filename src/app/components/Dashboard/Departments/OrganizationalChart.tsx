"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, Minus, Plus, RotateCcw, Users } from "lucide-react";

// Define department types with their specific colors
type DepartmentType = "director" | "assistant" | "admin" | "dep-a" | "dep-b" | "dep-c" | "dep-d" | "dep-e";

interface OrganizationalNode {
  id: string;
  name: string;
  title?: string;
  type: DepartmentType;
  avatar?: string;
  children?: OrganizationalNode[];
}

interface OrgChartProps {
  data: OrganizationalNode;
  onViewDepartment?: (departmentId: string) => void;
}

// Constants for zoom functionality
const ZOOM_INCREMENT = 10;
const MIN_ZOOM = 50;
const MAX_ZOOM = 150;
const RESIZE_DEBOUNCE = 200;

// Department colors based on the CSS provided
const DEPARTMENT_COLORS = {
  "director": { bg: "bg-blue-100", border: "border-blue-300", hover: "hover:border-blue-400" },
  "assistant": { bg: "bg-blue-50", border: "border-blue-200", hover: "hover:border-blue-300" },
  "admin": { bg: "bg-gray-100", border: "border-gray-300", hover: "hover:border-gray-400" },
  "dep-a": { bg: "bg-yellow-100", border: "border-yellow-300", hover: "hover:border-yellow-400" },
  "dep-b": { bg: "bg-blue-100", border: "border-blue-300", hover: "hover:border-blue-400" },
  "dep-c": { bg: "bg-pink-100", border: "border-pink-300", hover: "hover:border-pink-400" },
  "dep-d": { bg: "bg-gray-300", border: "border-gray-400", hover: "hover:border-gray-500" },
  "dep-e": { bg: "bg-gray-50", border: "border-gray-200", hover: "hover:border-gray-300" }
};

const OrganizationalChart: React.FC<OrgChartProps> = ({ data, onViewDepartment = () => {} }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();
  const resizeTimeout = useRef<NodeJS.Timeout>();

  const findNode = useCallback(
    (root: OrganizationalNode, id: string): OrganizationalNode | undefined => {
      if (root.id === id) return root;
      if (root.children) {
        for (const child of root.children) {
          const found = findNode(child, id);
          if (found) return found;
        }
      }
      return undefined;
    },
    []
  );

  const adjustZoom = useCallback(() => {
    if (!containerRef.current || !chartRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const chartRect = chartRef.current.getBoundingClientRect();

    const widthRatio = containerRect.width / chartRect.width;
    const heightRatio = containerRect.height / chartRect.height;
    const newZoom = Math.min(widthRatio, heightRatio, 1) * 100;

    setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom)));
  }, []);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(() => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(adjustZoom, RESIZE_DEBOUNCE);
    });

    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      clearTimeout(resizeTimeout.current);
    };
  }, [adjustZoom]);

  const toggleNodeExpansion = useCallback(
    (nodeId: string) => {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          const collapseChildren = (id: string) => {
            next.delete(id);
            const node = findNode(data, id);
            node?.children?.forEach(child => collapseChildren(child.id));
          };
          collapseChildren(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
      setTimeout(adjustZoom, 300);
    },
    [data, findNode, adjustZoom]
  );

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + ZOOM_INCREMENT, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - ZOOM_INCREMENT, MIN_ZOOM));
  }, []);

  const resetView = useCallback(() => {
    setExpandedNodes(new Set([data.id]));
    setZoomLevel(100);
  }, [data.id]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100">
      <ChartControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={resetView}
      />
      
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-gray-50/50 p-8"
        role="application"
        aria-label="Professional Organizational Chart"
      >
        <div
          ref={chartRef}
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <div className="flex justify-center">
            <OrgChart
              node={data}
              expandedNodes={expandedNodes}
              onToggle={toggleNodeExpansion}
              onViewDepartment={onViewDepartment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrgChartProps {
  node: OrganizationalNode;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onViewDepartment: (departmentId: string) => void;
}

const OrgChart = memo(({ node, expandedNodes, onToggle, onViewDepartment }: OrgChartProps) => {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  
  // Group children by their type
  const assistantDirector = node.children?.find(child => child.type === "assistant");
  const administration = node.children?.find(child => child.type === "admin");
  const departments = node.children?.filter(
    child => ["dep-a", "dep-b", "dep-c", "dep-d", "dep-e"].includes(child.type)
  );

  return (
    <div className="org-chart">
      {/* Administration Level */}
      <ul className="administration flex flex-col items-center">
        <li>
          {/* Director Level */}
          <ul className="director flex flex-col items-center">
            <li className="mb-8">
              <div className="relative">
                <NodeButton
                  node={node}
                  onViewDepartment={onViewDepartment}
                  className="min-w-[200px]"
                  expanded={isExpanded}
                />
                
                {hasChildren && (
                  <ExpansionToggle
                    isExpanded={isExpanded}
                    onToggle={() => onToggle(node.id)}
                    size="lg"
                  />
                )}
              </div>

              {isExpanded && (
                <>
                  {/* Connector Lines */}
                  <div className="h-8 w-px bg-gray-300 mx-auto mt-4"></div>
                  
                  <div className="relative">
                    {/* Assistant Director Branch */}
                    {assistantDirector && (
                      <ul className="subdirector relative flex justify-end w-full mb-8">
                        <li className="w-1/3 border-b border-l border-gray-300 pb-8 pr-4">
                          <div className="relative">
                            <NodeButton
                              node={assistantDirector}
                              onViewDepartment={onViewDepartment}
                              className="min-w-[180px]"
                              expanded={expandedNodes.has(assistantDirector.id)}
                            />
                            
                            {assistantDirector.children && assistantDirector.children.length > 0 && (
                              <ExpansionToggle
                                isExpanded={expandedNodes.has(assistantDirector.id)}
                                onToggle={() => onToggle(assistantDirector.id)}
                              />
                            )}
                            
                            {expandedNodes.has(assistantDirector.id) && assistantDirector.children && (
                              <DepartmentChildren
                                children={assistantDirector.children}
                                expandedNodes={expandedNodes}
                                onToggle={onToggle}
                                onViewDepartment={onViewDepartment}
                              />
                            )}
                          </div>
                        </li>
                      </ul>
                    )}
                    
                    {/* Departments Section */}
                    <ul className="departments relative flex justify-start flex-wrap w-full">
                      {/* Administration Department */}
                      {administration && (
                        <li className="w-1/3 border-b border-r border-gray-300 pb-8 pl-4">
                          <div className="relative">
                            <NodeButton
                              node={administration}
                              onViewDepartment={onViewDepartment}
                              className="min-w-[180px]"
                              expanded={expandedNodes.has(administration.id)}
                            />
                            
                            {administration.children && administration.children.length > 0 && (
                              <ExpansionToggle
                                isExpanded={expandedNodes.has(administration.id)}
                                onToggle={() => onToggle(administration.id)}
                              />
                            )}
                            
                            {expandedNodes.has(administration.id) && administration.children && (
                              <DepartmentChildren
                                children={administration.children}
                                expandedNodes={expandedNodes}
                                onToggle={onToggle}
                                onViewDepartment={onViewDepartment}
                              />
                            )}
                          </div>
                        </li>
                      )}
                      
                      {/* Departments A-E */}
                      <div className="w-full flex flex-wrap justify-center mt-8">
                        {departments?.map((dept, idx) => (
                          <Department
                            key={dept.id}
                            department={dept}
                            expandedNodes={expandedNodes}
                            onToggle={onToggle}
                            onViewDepartment={onViewDepartment}
                          />
                        ))}
                      </div>
                    </ul>
                  </div>
                </>
              )}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
});
OrgChart.displayName = "OrgChart";

interface DepartmentProps {
  department: OrganizationalNode;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onViewDepartment: (departmentId: string) => void;
}

const Department = memo(({ department, expandedNodes, onToggle, onViewDepartment }: DepartmentProps) => {
  const isExpanded = expandedNodes.has(department.id);
  
  return (
    <div className={`department ${department.type} w-1/5 min-w-[180px] px-2 mb-8`}>
      <div className="relative border-t border-gray-300 pt-8">
        <NodeButton
          node={department}
          onViewDepartment={onViewDepartment}
          expanded={isExpanded}
        />
        
        {department.children && department.children.length > 0 && (
          <ExpansionToggle
            isExpanded={isExpanded}
            onToggle={() => onToggle(department.id)}
          />
        )}
        
        {isExpanded && department.children && (
          <div className="sections mt-8">
            <DepartmentChildren
              children={department.children}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onViewDepartment={onViewDepartment}
            />
          </div>
        )}
      </div>
    </div>
  );
});
Department.displayName = "Department";

interface DepartmentChildrenProps {
  children: OrganizationalNode[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onViewDepartment: (departmentId: string) => void;
}

const DepartmentChildren = memo(({ children, expandedNodes, onToggle, onViewDepartment }: DepartmentChildrenProps) => {
  return (
    <ul className="flex flex-col gap-4 mt-4">
      {children.map(section => (
        <li key={section.id} className="section relative">
          <div className="h-8 w-px bg-gray-300 absolute left-1/2 -top-4 -translate-x-1/2"></div>
          <div className="relative">
            <NodeButton
              node={section}
              onViewDepartment={onViewDepartment}
              className="w-full"
              expanded={expandedNodes.has(section.id)}
              isSection
            />
            
            {section.children && section.children.length > 0 && (
              <>
                <ExpansionToggle
                  isExpanded={expandedNodes.has(section.id)}
                  onToggle={() => onToggle(section.id)}
                  size="sm"
                />
                
                {expandedNodes.has(section.id) && (
                  <ul className="pl-4 mt-4 border-l border-gray-300">
                    {section.children.map(subItem => (
                      <li key={subItem.id} className="mb-4">
                        <NodeButton
                          node={subItem}
                          onViewDepartment={onViewDepartment}
                          className="w-full"
                          isSection
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
});
DepartmentChildren.displayName = "DepartmentChildren";

interface NodeButtonProps {
  node: OrganizationalNode;
  onViewDepartment: (departmentId: string) => void;
  className?: string;
  expanded?: boolean;
  isSection?: boolean;
}

const NodeButton = memo(({ node, onViewDepartment, className = "", expanded = false, isSection = false }: NodeButtonProps) => {
  const colors = DEPARTMENT_COLORS[node.type] || DEPARTMENT_COLORS["director"];
  
  return (
    <button
      className={`flex flex-col items-center p-3 rounded-lg border transition-all
        ${colors.bg} ${colors.border} ${colors.hover} ${className}
        shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
        ${expanded ? 'ring-2 ring-blue-500' : ''}
        ${isSection ? 'py-2' : ''}`}
      onClick={() => onViewDepartment(node.id)}
      aria-label={`View ${node.name}`}
      aria-expanded={expanded}
    >
      {!isSection && node.avatar && (
        <div className="w-10 h-10 mb-2">
          <img
            src={node.avatar}
            alt=""
            className="rounded-full w-full h-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}
      
      {!isSection && !node.avatar && (
        <div className="w-10 h-10 mb-2 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center">
          <Users className="text-gray-400" size={20} />
        </div>
      )}
      
      <h3 className={`font-medium text-gray-800 ${isSection ? 'text-xs' : 'text-sm'}`}>
        {node.name}
      </h3>
      
      {node.title && (
        <p className={`text-gray-600 ${isSection ? 'text-[10px]' : 'text-xs'} line-clamp-2 mt-1`}>
          {node.title}
        </p>
      )}
    </button>
  );
});
NodeButton.displayName = "NodeButton";

interface ExpansionToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const ExpansionToggle = memo(({ isExpanded, onToggle, size = 'md' }: ExpansionToggleProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  return (
    <button
      className={`absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white border
        border-gray-200 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none
        z-10 ${sizeClasses[size]}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isExpanded ? "Collapse section" : "Expand section"}
    >
      {isExpanded ? (
        <ChevronUp className="text-gray-600 mx-auto" size={iconSizes[size]} />
      ) : (
        <ChevronDown className="text-gray-600 mx-auto" size={iconSizes[size]} />
      )}
    </button>
  );
});
ExpansionToggle.displayName = "ExpansionToggle";

interface ChartControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ChartControls = memo(({ 
  zoomLevel, 
  onZoomIn, 
  onZoomOut, 
  onReset 
}: ChartControlsProps) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-100">
    <div className="flex gap-2">
      <button
        onClick={onReset}
        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <RotateCcw size={14} />
        Reset View
      </button>
    </div>

    <div className="flex items-center bg-white border border-gray-200 rounded-lg divide-x divide-gray-200">
      <ZoomButton onClick={onZoomOut} disabled={zoomLevel <= MIN_ZOOM}>
        <Minus size={16} />
      </ZoomButton>
      <span className="px-3 text-sm font-medium text-gray-700 w-20 text-center">
        {Math.round(zoomLevel)}%
      </span>
      <ZoomButton onClick={onZoomIn} disabled={zoomLevel >= MAX_ZOOM}>
        <Plus size={16} />
      </ZoomButton>
    </div>
  </div>
));
ChartControls.displayName = "ChartControls";

const ZoomButton = memo(({ 
  children, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
    {...props}
  >
    {children}
  </button>
));
ZoomButton.displayName = "ZoomButton";

export default OrganizationalChart;