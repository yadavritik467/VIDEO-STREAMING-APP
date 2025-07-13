import { ArrowLeft, Calendar, Download, Eye, MoreHorizontal, Play, Share2, ThumbsUp } from 'lucide-react';

const VideoPlayer = ({ videoId, onGoBack, onVideoSelect }) => {
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const video = videosData.find((v) => v.id === videoId);

  if (!video) {
    return (
      <div className="pt-20 lg:ml-64 p-6 bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">📹</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Video not found
          </h1>
          <p className="text-gray-400 mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onGoBack}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const relatedVideos = videosData.filter((v) => v.id !== video.id).slice(0, 6);

  return (
    <div className="pt-20 lg:ml-64 p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onGoBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden mb-6 relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors cursor-pointer">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {video.title}
              </h1>

              {/* Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4 text-gray-400">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {video.uploadDate}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      liked
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{video.likes}</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Save</span>
                  </button>

                  <button className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={video.channelAvatar}
                      alt={video.channel}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {video.channel}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {video.subscribers} subscribers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubscribed(!subscribed)}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                      subscribed
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {subscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                {/* Description */}
                <div className="text-gray-300">
                  <p className={`${showFullDescription ? "" : "line-clamp-3"}`}>
                    {video.description}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-gray-400 hover:text-white text-sm mt-2 transition-colors"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onVideoSelect(relatedVideo.id)}
                >
                  <div className="flex">
                    <div className="relative">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-40 h-24 object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div className="p-3 flex-1">
                      <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-gray-400 text-xs mb-1">
                        {relatedVideo.channel}
                      </p>
                      <div className="flex items-center text-gray-400 text-xs space-x-1">
                        <span>{relatedVideo.views} views</span>
                        <span>•</span>
                        <span>{relatedVideo.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
