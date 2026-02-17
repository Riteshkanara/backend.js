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
    return <Loader />;
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Video not found</div>
          <p className="text-gray-400">This video may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player - FIXED */}
          <div className="bg-black rounded-xl overflow-hidden border-2 border-gray-800 shadow-lg">
            <VideoPlayer 
              src={video.videoFile} 
              thumbnail={video.thumbnail} 
            />
          </div>

          {/* Video Title */}
          <h1 className="text-2xl font-bold leading-tight">{video.title}</h1>

          {/* Channel Info & Actions - FIXED */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-dark-secondary rounded-xl border border-gray-800">
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.owner.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar src={video.owner.avatar} alt={video.owner.fullName} size="lg" />
                <div>
                  <p className="font-medium text-lg">{video.owner.fullName}</p>
                  <p className="text-sm text-gray-400">
                    {formatViews(video.owner.subscribersCount || 0)} subscribers
                  </p>
                </div>
              </Link>

              <button className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                  ${isLiked 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'}
                `}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{formatViews(likesCount)}</span>
              </button>
            </div>
          </div>

          {/* Description - FIXED */}
          <div className="bg-dark-secondary p-4 rounded-xl border border-gray-800">
            <div className="flex gap-2 text-sm text-gray-400 mb-3">
              <span className="font-medium">{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Comments Section */}
          <CommentList videoId={videoId} />
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h2 className="font-bold text-lg mb-4">Related Videos</h2>
            <div className="space-y-3">
              {/* Related videos list will go here */}
              <p className="text-gray-400 text-sm">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}