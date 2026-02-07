import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionAPI } from '../api/subscription.api';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import useAuthStore from '../store/auth.store.js';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getSubscribedChannels(user._id);
      setChannels(response.data.channels || []);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId) => {
    try {
      await subscriptionAPI.toggleSubscription(channelId);
      setChannels(channels.filter(c => c._id !== channelId));
      toast.success('Unsubscribed');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      toast.error('Failed to unsubscribe');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400 mb-2">No subscriptions yet</p>
        <p className="text-gray-500">Subscribe to channels to see them here</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div 
            key={channel._id}
            className="bg-dark-2 rounded-lg p-4 flex items-center gap-4"
          >
            <Link to={`/channel/${channel.username}`}>
              <Avatar 
                src={channel.avatar} 
                alt={channel.username}
                size="lg"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link 
                to={`/channel/${channel.username}`}
                className="font-semibold hover:text-primary block truncate"
              >
                {channel.fullName}
              </Link>
              <p className="text-sm text-gray-400 truncate">
                @{channel.username}
              </p>
            </div>

            <Button
              onClick={() => handleUnsubscribe(channel._id)}
              variant="secondary"
              className="text-sm"
            >
              Subscribed
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}