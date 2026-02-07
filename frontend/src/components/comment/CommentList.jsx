import { useEffect, useState } from 'react';
import { commentAPI } from '../../api/comment.api';
import { likeAPI } from '../../api/like.api';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

export default function CommentList({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  const loadComments = async () => {
    try {
      const response = await commentAPI.getVideoComments(videoId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    setSubmitLoading(true);
    try {
      const response = await commentAPI.addComment(videoId, content);
      setComments([response.data, ...comments]);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await commentAPI.updateComment(commentId, content);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, content } : c
      ));
      toast.success('Comment updated!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeAPI.toggleCommentLike(commentId);
      // Optionally update like count in UI
      toast.success('Comment liked!');
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {comments.length} Comments
        </h2>
        <CommentForm onSubmit={handleAddComment} loading={submitLoading} />
      </div>

      {loading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}