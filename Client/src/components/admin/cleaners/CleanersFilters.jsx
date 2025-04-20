import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

function CleanersFilters({ filters, onFilterChange }) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActiveDropdown, setShowActiveDropdown] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Label */}
        <div className="font-medium text-gray-700 flex items-center">
          <Filter size={16} className="mr-2 text-blue-500" />
          Filters:
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between min-w-40"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <span className="text-gray-700">
              {filters.status === 'true' ? 'Active' : filters.status === 'false' ? 'Inactive' : 'All Status'}
            </span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>

          {showStatusDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'all' });
                    setShowStatusDropdown(false);
                  }}
                >
                  All Status
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'true' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Active
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'false' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Inactive
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {filters.status !== 'all' && (
          <button
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            onClick={() => {
              onFilterChange({ status: 'all' });
            }}
          >
            <X size={16} className="mr-1" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default CleanersFilters;