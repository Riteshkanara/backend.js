import { useState, useEffect } from 'react';
import { subscriptionAPI } from '../../api/subscription.api';
import useAuthStore from '../../store/auth.store.js';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SubscribeButton({ channelId, channelUsername }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Don't show button if it's your own channel
  if (user?._id === channelId) {
    return null;
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await subscriptionAPI.toggleSubscription(channelId);
      setSubscribed(response.data.subscribed);
      toast.success(response.data.subscribed ? 'Subscribed!' : 'Unsubscribed');
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      loading={loading}
      variant={subscribed ? 'secondary' : 'primary'}
      className="font-semibold"
    >
      {subscribed ? 'Subscribed' : 'Subscribe'}
    </Button>
  );
}