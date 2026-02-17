import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  History, 
  ThumbsUp, 
  PlaySquare,
  Users,
  Twitter
} from 'lucide-react';
import useAuthStore from '../../store/auth.store';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Twitter, label: 'Tweets', path: '/tweets' },
  ];

  const authenticatedItems = [
    { icon: History, label: 'History', path: '/history' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked-videos' },
    { icon: PlaySquare, label: 'Playlists', path: '/playlists' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 bottom-0 w-64 glass border-r border-gray-800/50 z-40
          transform transition-all duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full custom-scrollbar">
          {/* Main Menu */}
          <div className="space-y-1 animate-slide-down">
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive(item.path) 
                    ? 'bg-gradient-primary text-white shadow-glow-sm' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <item.icon 
                  size={20} 
                  className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          {isAuthenticated && (
            <div className="my-4 border-t border-gray-800/50" />
          )}

          {/* Authenticated Menu */}
          {isAuthenticated && (
            <div className="space-y-1 animate-slide-down" style={{ animationDelay: '150ms' }}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Library
              </div>
              {authenticatedItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive(item.path) 
                      ? 'bg-gradient-primary text-white shadow-glow-sm' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon 
                    size={20} 
                    className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-800/50">
            <div className="px-4 text-xs text-gray-500 space-y-1">
              <p>© 2024 VideoTube</p>
              <p>Made with ❤️</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}