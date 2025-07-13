import { Calendar, Eye } from 'lucide-react';

const VideoCard = ({ video, onVideoSelect }) => {
  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => onVideoSelect(video.id)}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm mb-1">{video.channel}</p>
        <div className="flex items-center text-gray-400 text-sm space-x-2">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {video.views}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {video.uploadDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
