import api from './axios.config';

export const videoAPI = {
  getAllVideos: async (params = {}) => {
    return await api.get('/videos', { params });
  },

  getVideoById: async (videoId) => {
    return await api.get(`/videos/${videoId}`);
  },

  uploadVideo: async (formData) => {
    return await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateVideo: async (videoId, data) => {
    return await api.patch(`/videos/${videoId}`, data);
  },

  deleteVideo: async (videoId) => {
    return await api.delete(`/videos/${videoId}`);
  },
};