import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, MoreVertical } from 'lucide-react';
import { videoAPI } from '../api/video.api.js';
import { likeAPI } from '../api/like.api';
import VideoPlayer from '../components/video/VideoPlayer';
import SubscribeButton from '../components/channel/SubscribeButton';
import Avatar from '../components/common/Avatar';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { formatViews } from '../utils/formatViews';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import useAuthStore from '../store/auth.store.js';
import CommentList from '../components/comment/CommentList';

export default function VideoWatch() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  const loadVideo = async () => {
    try {
      const response = await videoAPI.getVideoById(videoId);
      setVideo(response.data);
    } catch (error) {
      console.error('Failed to load video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }

    setLikeLoading(true);
    try {
      const response = await likeAPI.toggleVideoLike(videoId);
      setLiked(response.data.isLiked);
      toast.success(response.data.isLiked ? 'Liked!' : 'Unliked');
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like video');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-xl text-gray-400">Video not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <VideoPlayer url={video.videoFile} />

          {/* Video Title */}
          <h1 className="text-2xl font-bold">{video.title}</h1>

          {/* Channel Info & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.owner?.username}`}>
                <Avatar 
                  src={video.owner?.avatar} 
                  alt={video.owner?.username}
                  size="lg"
                />
              </Link>
              
              <div className="flex-1">
                <Link 
                  to={`/channel/${video.owner?.username}`}
                  className="font-semibold text-lg hover:text-primary"
                >
                  {video.owner?.fullName}
                </Link>
                <p className="text-sm text-gray-400">
                  {video.owner?.subscribersCount || 0} subscribers
                </p>
              </div>

              <SubscribeButton 
                channelId={video.owner?._id} 
                channelUsername={video.owner?.username}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleLike}
                loading={likeLoading}
                variant={liked ? 'primary' : 'secondary'}
                className="flex items-center gap-2"
              >
                <ThumbsUp size={20} />
                <span>{video.likesCount || 0}</span>
              </Button>

              <Button
                onClick={handleShare}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Share2 size={20} />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Video Description */}
          <div className="bg-dark-2 rounded-lg p-4">
            <div className="flex items-center gap-4 text-sm mb-3">
              <span className="font-semibold">
                {formatViews(video.views || 0)} views
              </span>
              <span className="text-gray-400">
                {formatDate(video.createdAt)}
              </span>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">
              {video.description}
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="text-gray-400 text-center py-8">
            <div className="mt-8">
                <CommentList videoId={videoId} />
            </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Related Videos</h3>
          <div className="text-gray-400 text-center py-8">
            Related videos coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}