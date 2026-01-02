import React, { useState } from 'react';
import { Plus, LogOut, Bell, Filter, Search, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useNotifications } from '../context/NotificationContext';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { Header } from './Header';
import { FilterSort } from './FilterSort';
import { TaskLibrary } from './TaskLibrary';

export function Dashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'important' | 'normal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'created' | 'priority'>('dueDate');

  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { requestPermission } = useNotifications();

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'pending' && !task.completed) ||
                           (filterStatus === 'completed' && task.completed);
      
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          return a.priority === 'important' ? -1 : 1;
        default:
          return 0;
      }
    });

  const upcomingTasks = tasks.filter(task => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff >= 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">{user?.department} Department</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 flex items-center gap-2 ${
                  activeTab === 'library'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Library className="h-4 w-4" />
                Library
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {tasks.filter(t => !t.completed).length}
                    </p>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-3">
                    <Bell className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {tasks.filter(t => t.completed).length}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Soon</p>
                    <p className="text-2xl font-bold text-red-600">{upcomingTasks.length}</p>
                  </div>
                  <div className="bg-red-100 rounded-lg p-3">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <FilterSort
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                Add Task
              </button>
            </div>

            {/* Notification Permission */}
            {'Notification' in window && Notification.permission === 'default' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Enable Notifications</p>
                      <p className="text-sm text-blue-700">Get reminders for upcoming task deadlines</p>
                    </div>
                  </div>
                  <button
                    onClick={requestPermission}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                  >
                    Enable
                  </button>
                </div>
              </div>
            )}

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No tasks found</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                >
                  Create Your First Task
                </button>
              </div>
            )}
          </>
        ) : (
          <TaskLibrary />
        )}
      </main>

      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}