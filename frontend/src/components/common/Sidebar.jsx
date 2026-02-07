import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Video, 
  History, 
  ThumbsUp, 
  PlaySquare,
  Users,
  Twitter
} from 'lucide-react';
import useAuthStore from '../../store/auth.store'
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-dark border-r border-gray-800 z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-1">
          {/* Main Menu */}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path) 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          {/* Authenticated Menu */}
          {isAuthenticated && (
            <>
              <div className="my-4 border-t border-gray-800"></div>
              
              {authenticatedItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}