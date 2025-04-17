// Data Sync History Modal Content with Working Filters
const DataSyncContent: React.FC = () => {
  // Initial data
  const allSyncData = [
    {
      id: '1',
      date: 'Today at 10:23 AM',
      source: 'Google Workspace',
      sourceIcon: '/api/placeholder/24/24',
      records: 12456,
      duration: '3m 42s',
      status: 'Success'
    },
    {
      id: '2',
      date: 'Today at 9:41 AM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 31872,
      duration: '6m 15s',
      status: 'Success'
    },
    {
      id: '3',
      date: 'Today at 8:17 AM',
      source: 'Slack',
      sourceIcon: '/api/placeholder/24/24',
      records: 5428,
      duration: '2m 08s',
      status: 'Success'
    },
    {
      id: '4',
      date: 'Yesterday at 11:35 PM',
      source: 'Zoom',
      sourceIcon: '/api/placeholder/24/24',
      records: 456,
      duration: '1m 35s',
      status: 'Failed'
    },
    {
      id: '5',
      date: 'Yesterday at 6:14 PM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 28945,
      duration: '5m 52s',
      status: 'Partial'
    },
    {
      id: '6',
      date: 'Yesterday at 2:30 PM',
      source: 'Google Workspace',
      sourceIcon: '/api/placeholder/24/24',
      records: 9876,
      duration: '2m 45s',
      status: 'Success'
    },
    {
      id: '7',
      date: '2 days ago at 8:45 AM',
      source: 'Slack',
      sourceIcon: '/api/placeholder/24/24',
      records: 3245,
      duration: '1m 52s',
      status: 'Success'
    },
    {
      id: '8',
      date: '2 days ago at 3:12 PM',
      source: 'Zoom',
      sourceIcon: '/api/placeholder/24/24',
      records: 843,
      duration: '0m 58s',
      status: 'Failed'
    },
    {
      id: '9',
      date: '3 days ago at 11:20 AM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 24567,
      duration: '5m 12s',
      status: 'Success'
    },
    {
      id: '10',
      date: '3 days ago at 9:15 AM',
      source: 'Google Workspace',
      sourceIcon: '/api/placeholder/24/24',
      records: 10235,
      duration: '3m 18s',
      status: 'Partial'
    }
  ];
  
  // State for filters
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  
  // Apply filters and get filtered data
  const getFilteredData = useCallback(() => {
    return allSyncData.filter(item => {
      // Source filter
      if (sourceFilter !== 'All Sources' && item.source !== sourceFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'All Status' && item.status !== statusFilter) {
        return false;
      }
      
      // Date filter - simplified for demo
      if (dateFilter && !item.date.toLowerCase().includes(dateFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [sourceFilter, statusFilter, dateFilter]);
  
  // Get filtered data
  const filteredData = getFilteredData();
  
  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  
  // Get total pages
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Always show first page
    pageNumbers.push(1);
    
    // Add current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      // Add ellipsis if there's a gap
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        pageNumbers.push(-1); // Use -1 to represent ellipsis
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, dateFilter]);
  
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">View the history of data synchronizations from connected platforms.</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option>All Sources</option>
            <option>Microsoft 365</option>
            <option>Google Workspace</option>
            <option>Slack</option>
            <option>Zoom</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Partial</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="mm/dd/yyyy" 
            className="w-full border rounded-md py-2 px-3" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          onClick={() => setCurrentPage(1)} // Reset to first page when applying filters
        >
          Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records Processed
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getPaginatedData().map(item => (
              <tr key={item.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.date}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-6 w-6 mr-2" src={item.sourceIcon} alt={item.source} />
                    <span className="text-sm">{item.source}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.records.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.duration}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Success' ? 'bg-green-100 text-green-800' :
                    item.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            
            {getPaginatedData().length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {Math.min(1, filteredData.length)} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </div>
        
        <div className="flex">
          <button 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`border rounded-l px-3 py-1 text-sm ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === -1 ? (
              <span key={`ellipsis-${index}`} className="border-t border-b border-r px-3 py-1 text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`border-t border-b border-r px-3 py-1 text-sm ${
                  currentPage === page ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`border-t border-b border-r rounded-r px-3 py-1 text-sm ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};