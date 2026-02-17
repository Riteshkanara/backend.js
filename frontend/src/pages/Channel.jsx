import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { videoAPI } from '../api/video.api';
import { tweetAPI } from '../api/tweet.api';
import { subscriptionAPI } from '../api/subscription.api';
import VideoCard from '../components/video/VideoCard';
import TweetCard from '../components/tweet/TweetCard';
import SubscribeButton from '../components/channel/SubscribeButton';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function Channel() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('videos');
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [stats, setStats] = useState({ subscribers: 0, videos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      loadChannelData();
    }
  }, [username]);

  const loadChannelData = async () => {
    try {
      // In a real app, you'd have a getUserByUsername API
      // For now, we'll load videos and get user from first video
      
      //q11111
      const videosResponse = await videoAPI.getAllVideos({ 
        owner: username 
      });
      
      const userVideos = videosResponse.data || [];
      setVideos(userVideos);
      
      if (userVideos.length > 0) {
        setChannel(userVideos[0].owner);
        setStats({
          subscribers: userVideos[0].owner?.subscribersCount || 0,
          videos: userVideos.length,
        });
      }
    } catch (error) {
      console.error('Failed to load channel:', error);
      toast.error('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const loadTweets = async () => {
    try {
      const response = await tweetAPI.getUserTweets();
      setTweets(response.data || []);
    } catch (error) {
      console.error('Failed to load tweets:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'tweets') {
      loadTweets();
    }
  }, [activeTab]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Channel Header */}
      <div className="mb-8">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4">
          {channel.coverImage && (
            <img 
              src={channel.coverImage} 
              alt="Cover"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Channel Info */}
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-dark -mt-16 flex-shrink-0">
            {channel.avatar ? (
              <img 
                src={channel.avatar} 
                alt={channel.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{channel.fullName}</h1>
            <p className="text-gray-400 mb-2">@{channel.username}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
              <span>{stats.subscribers} subscribers</span>
              <span>{stats.videos} videos</span>
            </div>
            <SubscribeButton 
              channelId={channel._id}
              channelUsername={channel.username}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-primary text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('tweets')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'tweets'
                ? 'border-primary text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Tweets
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-primary text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No videos uploaded yet
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tweets' && (
          <div className="max-w-2xl">
            {tweets.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No tweets yet
              </p>
            ) : (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onLike={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl bg-dark-2 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>Username:</strong> @{channel.username}</p>
              <p><strong>Full Name:</strong> {channel.fullName}</p>
              <p><strong>Email:</strong> {channel.email}</p>
              <p><strong>Subscribers:</strong> {stats.subscribers}</p>
              <p><strong>Total Videos:</strong> {stats.videos}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}