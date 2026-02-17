import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import useAuthStore from './store/auth.store';
import { authAPI } from './api/auth.api';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Upload from './pages/Upload';
import LikedVideos from './pages/LikedVideos';
import VideoWatch from './pages/VideoWatch';
import Tweets from './pages/Tweets';
import Channel from './pages/Channel';
import Playlists from './pages/Playlists';
import Subscriptions from './pages/Subscriptions';

// Layout
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Loader from './components/common/Loader';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [setUser]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white">
        <Routes>
          {/* Auth Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App Routes (With Layout) */}
          <Route
            path="/*"
            element={
              <>
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex pt-16">
                  <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                  />
                  <main className="flex-1 lg:ml-64 p-6">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/watch/:videoId" element={<VideoWatch />} />
                      <Route path="/tweets" element={<Tweets />} />
                      <Route path="/channel/:username" element={<Channel />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/upload" 
                        element={
                          <ProtectedRoute>
                            <Upload />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/liked-videos" 
                        element={
                          <ProtectedRoute>
                            <LikedVideos />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/playlists" 
                        element={
                          <ProtectedRoute>
                            <Playlists />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/subscriptions" 
                        element={
                          <ProtectedRoute>
                            <Subscriptions />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Fallback */}
                      <Route path="*" element={<div className="text-center py-12">404 - Page Not Found</div>} />
                    </Routes>
                  </main>
                </div>
              </>
            }
          />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#212121',
              color: '#fff',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
// ```

// **Changes made:**
// - ✅ Removed duplicate routes
// - ✅ Fixed `import Tweets from './pages/Tweets'` (was lowercase)
// - ✅ Organized routes cleanly
// - ✅ Removed `isAuthenticated` from destructuring (unused)

// ---

// ## 📄 **Now Share index.html**

// The polygon background is likely in `index.html`. Please share:
// ```
// index.html (in the root of frontend folder)