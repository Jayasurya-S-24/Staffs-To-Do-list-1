import React, { useState } from 'react';
import { Library, Calendar, Clock, AlertCircle, CheckCircle2, Search, Filter, ArrowUpDown, BookOpen, CalendarRange } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

export function TaskLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'important' | 'normal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilterType, setDateFilterType] = useState<'dueDate' | 'createdDate'>('dueDate');
  const [sortBy, setSortBy] = useState<'dueDate' | 'created' | 'priority' | 'alphabetical'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { tasks } = useTasks();

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'pending' && !task.completed) ||
                           (filterStatus === 'completed' && task.completed);
      
      // Date range filtering
      let matchesDateRange = true;
      if (startDate || endDate) {
        const taskDate = new Date(dateFilterType === 'dueDate' ? task.dueDate : task.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
          matchesDateRange = taskDate >= start && taskDate <= end;
        } else if (start) {
          matchesDateRange = taskDate >= start;
        } else if (end) {
          matchesDateRange = taskDate <= end;
        }
      }
      
      return matchesSearch && matchesPriority && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          comparison = a.priority === 'important' ? -1 : 1;
          break;
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const important = tasks.filter(t => t.priority === 'important').length;
    const overdue = tasks.filter(t => {
      if (t.completed) return false;
      const dueDate = new Date(t.dueDate);
      const now = new Date();
      return dueDate < now;
    }).length;

    return { total, completed, pending, important, overdue };
  };

  const stats = getTaskStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      weekday: 'short'
    });
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };
  return (
    <div className="space-y-6">
      {/* Library Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 rounded-lg p-2">
            <Library className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Library</h2>
            <p className="text-gray-600">Complete archive of all your academic tasks</p>
          </div>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-blue-700">Total Tasks</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-xs text-orange-700">Pending</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-green-700">Completed</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{stats.important}</p>
            <p className="text-xs text-red-700">Important</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Calendar className="h-5 w-5 text-gray-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-600">{stats.overdue}</p>
            <p className="text-xs text-gray-700">Overdue</p>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <CalendarRange className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Time Period</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Type
            </label>
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value as 'dueDate' | 'createdDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="dueDate">By Due Date</option>
              <option value="createdDate">By Creation Date</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearDateFilter}
              className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Clear Dates
            </button>
          </div>
        </div>
        
        {(startDate || endDate) && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800 text-sm">
              Filtering tasks by {dateFilterType === 'dueDate' ? 'due date' : 'creation date'}
              {startDate && endDate && ` from ${startDate} to ${endDate}`}
              {startDate && !endDate && ` from ${startDate} onwards`}
              {!startDate && endDate && ` up to ${endDate}`}
            </p>
          </div>
        )}
      </div>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="created">Sort by Created Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="alphabetical">Sort Alphabetically</option>
              </select>
              <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`px-4 py-3 rounded-lg border transition duration-200 ${
                sortOrder === 'asc' 
                  ? 'bg-purple-100 border-purple-300 text-purple-700' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 transition duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 transition duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm || filterPriority !== 'all' || filterStatus !== 'all' || startDate || endDate ? (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800">
            Showing <span className="font-semibold">{filteredTasks.length}</span> of <span className="font-semibold">{tasks.length}</span> tasks
            {searchTerm && ` matching "${searchTerm}"`}
            {filterPriority !== 'all' && ` with ${filterPriority} priority`}
            {filterStatus !== 'all' && ` that are ${filterStatus}`}
            {(startDate || endDate) && ` within the selected time period`}
          </p>
        </div>
      ) : null}

      {/* Tasks Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'important' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority === 'important' ? 'Important' : 'Normal'}
                    </span>
                    {task.completed && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Due: {formatDate(task.dueDate)}</span>
                    <span>Created: {formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Library className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {tasks.length === 0 
              ? "Your task library is empty. Create your first task to get started!"
              : "Try adjusting your search or filter criteria to find tasks."
            }
          </p>
          {(searchTerm || filterPriority !== 'all' || filterStatus !== 'all' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('all');
                setFilterStatus('all');
                clearDateFilter();
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}