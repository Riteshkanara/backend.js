import { useEffect, useState } from 'react';
import { tweetAPI } from '../api/tweet.api';
import { likeAPI } from '../api/like.api';
import TweetCard from '../components/tweet/TweetCard';
import TweetForm from '../components/tweet/TweetForm';
import Loader from '../components/common/Loader';
import useAuthStore from '../store/auth.store.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTweets();
  }, []);

  const loadTweets = async () => {
    try {
      const response = await tweetAPI.getUserTweets();
      setTweets(response.data || []);
    } catch (error) {
      console.error('Failed to load tweets:', error);
      toast.error('Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTweet = async (content) => {
    if (!isAuthenticated) {
      toast.error('Please login to tweet');
      navigate('/login');
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await tweetAPI.createTweet(content);
      setTweets([response.data, ...tweets]);
      toast.success('Tweet posted!');
    } catch (error) {
      console.error('Failed to create tweet:', error);
      toast.error(error.message || 'Failed to post tweet');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTweet = async (tweetId, content) => {
    try {
      await tweetAPI.updateTweet(tweetId, content);
      setTweets(tweets.map(t => 
        t._id === tweetId ? { ...t, content } : t
      ));
      toast.success('Tweet updated!');
    } catch (error) {
      console.error('Failed to update tweet:', error);
      toast.error('Failed to update tweet');
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await tweetAPI.deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
      toast.success('Tweet deleted!');
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      toast.error('Failed to delete tweet');
    }
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      await likeAPI.toggleTweetLike(tweetId);
    } catch (error) {
      console.error('Failed to like tweet:', error);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Tweets</h1>

      {isAuthenticated && (
        <TweetForm onSubmit={handleCreateTweet} loading={submitLoading} />
      )}

      {tweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-2">No tweets yet</p>
          <p className="text-gray-500">
            {isAuthenticated 
              ? 'Be the first to tweet!' 
              : 'Login to see tweets'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onEdit={handleEditTweet}
              onDelete={handleDeleteTweet}
              onLike={handleLikeTweet}
            />
          ))}
        </div>
      )}
    </div>
  );
}