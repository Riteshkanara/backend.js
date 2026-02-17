import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store.js';
import { authAPI } from '../../api/auth.api';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

export default function Header({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('Logout failed');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 glass border-b border-gray-800/50 z-50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 h-16">
        
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-105"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-bold shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-xl">VT</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              VideoTube
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full px-5 py-2.5 bg-dark-secondary text-white border border-gray-800 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 pl-12"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button className="absolute right-0 top-0 bottom-0 px-6 bg-dark-tertiary rounded-r-full hover:bg-primary hover:shadow-glow transition-all duration-300 border-l border-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/upload">
                <button 
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-105 group hidden sm:block"
                  aria-label="Upload video"
                >
                  <svg className="w-6 h-6 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
                  <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 border border-gray-800/50 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-800/50">
                      <p className="font-semibold text-white">{user?.fullName}</p>
                      <p className="text-sm text-gray-400">@{user?.username}</p>
                    </div>
                    
                    <Link 
                      to={`/channel/${user?.username}`} 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-200 group/item"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover/item:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Channel</span>
                    </Link>
                    
                    <Link 
                      to="/playlists" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-200 group/item"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover/item:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span>Playlists</span>
                    </Link>
                    
                    <Link 
                      to="/liked-videos" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-200 group/item"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover/item:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Liked Videos</span>
                    </Link>
                    
                    <hr className="border-gray-800/50 my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-red-500 transition-all duration-200 group/item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className="btn-primary">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 