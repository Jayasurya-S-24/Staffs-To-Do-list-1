import React from 'react';
import { GraduationCap, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileEditForm } from './ProfileEditForm';

export function Header() {
  const [showProfileEdit, setShowProfileEdit] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Academic Task Manager</h1>
              <p className="text-sm text-gray-600">Professional Task Organization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.department}</p>
            </div>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition duration-200"
              title="Edit Profile"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition duration-200"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {showProfileEdit && (
        <ProfileEditForm onClose={() => setShowProfileEdit(false)} />
      )}
    </header>
  );
}