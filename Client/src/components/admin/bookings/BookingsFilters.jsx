import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar as CalendarIcon, X } from 'lucide-react';

function BookingsFilters({ filters, onFilterChange }) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
              {filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Statuses'}
            </span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>

          {showStatusDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: '' });
                    setShowStatusDropdown(false);
                  }}
                >
                  All Statuses
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'pending' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Pending
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'confirmed' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Confirmed
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'completed' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Completed
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onFilterChange({ ...filters, status: 'canceled' });
                    setShowStatusDropdown(false);
                  }}
                >
                  Canceled
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <button
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between min-w-56"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarIcon size={16} className="mr-2 text-blue-500" />
            <span className="text-gray-700">
              {filters.dateRange && filters.dateRange[0] && filters.dateRange[1]
                ? `${filters.dateRange[0]} - ${filters.dateRange[1]}`
                : 'Select Date Range'}
            </span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>

          {showDatePicker && (
            <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 w-64">
              {/* Example: two inputs for start/end date */}
              <div className="flex flex-col space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-200 rounded"
                    value={filters.dateRange?.[0] || ''}
                    onChange={(e) => {
                      const newRange = [e.target.value, filters.dateRange?.[1] || ''];
                      onFilterChange({ ...filters, dateRange: newRange });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-200 rounded"
                    value={filters.dateRange?.[1] || ''}
                    onChange={(e) => {
                      const newRange = [filters.dateRange?.[0] || '', e.target.value];
                      onFilterChange({ ...filters, dateRange: newRange });
                    }}
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    onClick={() => {
                      onFilterChange({ ...filters, dateRange: null });
                      setShowDatePicker(false);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      // Close date picker
                      setShowDatePicker(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(filters.status || (filters.dateRange && filters.dateRange[0] && filters.dateRange[1])) && (
          <button
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            onClick={() => {
              onFilterChange({ status: '', dateRange: null });
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

export default BookingsFilters;
