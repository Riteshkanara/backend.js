import { useEffect, useState } from 'react';
import { likeAPI } from '../api/like.api';
import VideoCard from '../components/video/VideoCard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = async () => {
    try {
      const response = await likeAPI.getLikedVideos();
      setVideos(response.data || []);
    } catch (error) {
      console.error('Failed to load liked videos:', error);
      toast.error('Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-2xl text-gray-400 mb-2">No liked videos yet</p>
        <p className="text-gray-500">Videos you like will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((video) => {
    // Only render if video data actually exists
    if (!video) return null; 
    return <VideoCard key={video._id} video={video} />;
})}
      </div>
    </div>
  );
}