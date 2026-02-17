import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { playlistAPI } from '../api/playlist.api.js';
import PlaylistCard from '../components/playlist/PlaylistCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import useAuthStore from '../store/auth.store.js';
import toast from 'react-hot-toast';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    try {
      const response = await playlistAPI.getUserPlaylists(user._id);
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to load playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await playlistAPI.createPlaylist(formData);
      setPlaylists([response.data, ...playlists]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      toast.success('Playlist created!');
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast.error(error.message || 'Failed to create playlist');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Playlists</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Playlist</span>
        </Button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-2">No playlists yet</p>
          <p className="text-gray-500">Create your first playlist!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-2 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Playlist name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your playlist"
                  className="w-full p-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitLoading}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}