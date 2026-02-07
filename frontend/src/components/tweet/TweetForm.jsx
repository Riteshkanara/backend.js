import { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import useAuthStore from '../../store/auth.store.js';

export default function TweetForm({ onSubmit, loading }) {
  const [content, setContent] = useState('');
  const { user } = useAuthStore();
  const maxLength = 280;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-2 rounded-lg p-4">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} alt={user?.username} size="md" />
        
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-3 bg-dark rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-white placeholder-gray-500"
            rows="3"
            maxLength={maxLength}
          />
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              content.length > maxLength - 20 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {content.length} / {maxLength}
            </span>
            
            <Button
              type="submit"
              variant="primary"
              disabled={!content.trim() || content.length > maxLength}
              loading={loading}
            >
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}