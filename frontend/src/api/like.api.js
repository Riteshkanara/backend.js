import api from './axios.config';

export const likeAPI = {
  toggleVideoLike: async (videoId) => {
    return await api.post(`/likes/toggle/v/${videoId}`);
  },

  toggleCommentLike: async (commentId) => {
    return await api.post(`/likes/toggle/c/${commentId}`);
  },

  toggleTweetLike: async (tweetId) => {
    return await api.post(`/likes/toggle/t/${tweetId}`);
  },

  getLikedVideos: async () => {
    return await api.get('/likes/videos');
  },
};

