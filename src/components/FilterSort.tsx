import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterSortProps {
  filterPriority: 'all' | 'important' | 'normal';
  setFilterPriority: (value: 'all' | 'important' | 'normal') => void;
  filterStatus: 'all' | 'pending' | 'completed';
  setFilterStatus: (value: 'all' | 'pending' | 'completed') => void;
  sortBy: 'dueDate' | 'created' | 'priority';
  setSortBy: (value: 'dueDate' | 'created' | 'priority') => void;
}

export function FilterSort({
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: FilterSortProps) {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="important">Important</option>
          <option value="normal">Normal</option>
        </select>
        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="created">Sort by Created</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}