import api from './axios.config';

export const tweetAPI = {
  createTweet: async (content) => {
    return await api.post('/tweets', { content });
  },

  getUserTweets: async (params = {}) => {
    return await api.get('/tweets', { params });
  },

  updateTweet: async (tweetId, content) => {
    return await api.patch(`/tweets/${tweetId}`, { content });
  },

  deleteTweet: async (tweetId) => {
    return await api.delete(`/tweets/${tweetId}`);
  },
};