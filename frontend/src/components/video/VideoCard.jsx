import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { formatViews } from '../../utils/formatViews';
import { formatDuration } from '../../utils/formatDuration';
import { memo } from 'react';



export default function VideoCard({ video }) {
  if (!video) return null;
  

  

  return (
    <Link to={`/watch/${video._id}`} className="group">
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
          <img
  src={video.thumbnail}
  alt={video.title}
  loading="lazy" // Add this
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>
          
          {/* Duration Badge */}
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Video Info */}
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <Link 
            to={`/channel/${video.owner?.username}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar 
              src={video.owner?.avatar} 
              alt={video.owner?.username}
              size="sm"
            />
          </Link>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            
            <Link
              to={`/channel/${video.owner?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              {video.owner?.username}
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{formatViews(video.views || 0)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
  
}
