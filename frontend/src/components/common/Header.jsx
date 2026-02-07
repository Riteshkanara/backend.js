import { Link, useNavigate } from 'react-router-dom';
import { Search, Upload, Bell, Menu, LogOut, User, Settings, } from 'lucide-react';
import Button from './Button';
import { useState } from 'react';
import useAuthStore from '../../store/auth.store';
import Avatar from './Avatar';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/auth.api';

export default function Header({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Logout anyway
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-white hover:text-primary"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              YourTube
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 bg-dark-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-700 rounded-full">
              <Search size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/upload"
                className="p-2 hover:bg-gray-800 rounded-full hidden sm:block"
                title="Upload"
              >
                <Upload size={24} className="text-white" />
              </Link>

              <button 
                className="p-2 hover:bg-gray-800 rounded-full hidden sm:block"
                title="Notifications"
              >
                <Bell size={24} className="text-white" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center"
                >
                  <Avatar src={user?.avatar} alt={user?.username} size="sm" />
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-56 bg-dark-2 rounded-lg shadow-lg border border-gray-700 z-20">
                      <div className="p-4 border-b border-gray-700">
                        <p className="font-semibold text-white">{user?.fullName}</p>
                        <p className="text-sm text-gray-400">@{user?.username}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          to={`/channel/${user?.username}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 text-white"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={20} />
                          <span>Your Channel</span>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 text-white"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Settings size={20} />
                          <span>Settings</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 text-red-500 w-full"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="primary" className="text-sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}