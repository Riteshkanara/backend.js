import api from './axios.config';

export const subscriptionAPI = {
  toggleSubscription: async (channelId) => {
    return await api.post(`/subscriptions/c/${channelId}`);
  },

  getUserChannelSubscribers: async (channelId) => {
    return await api.get(`/subscriptions/c/${channelId}`);
  },

  getSubscribedChannels: async (subscriberId) => {
    return await api.get(`/subscriptions/u/${subscriberId}`);
  },
};