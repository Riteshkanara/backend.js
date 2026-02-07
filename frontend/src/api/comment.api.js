import api from './axios.config';

export const commentAPI = {
  getVideoComments: async (videoId, params = {}) => {
    return await api.get(`/comments/${videoId}`, { params });
  },

  addComment: async (videoId, content) => {
    return await api.post(`/comments/${videoId}`, { content });
  },

  updateComment: async (commentId, content) => {
    return await api.patch(`/comments/c/${commentId}`, { content });
  },

  deleteComment: async (commentId) => {
    return await api.delete(`/comments/c/${commentId}`);
  },
};