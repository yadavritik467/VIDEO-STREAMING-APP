import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  Calendar,
  ThumbsUp,
  Share2,
  Download,
  MoreHorizontal,
  Play,
} from "lucide-react";
import VideoPlayer from "../component/VideoPlayer";
import VideoCard from "../component/VideoCard";
import { videosData } from "../data/video";

// Home Component
const Home = ({ videos, searchQuery, onVideoSelect, currentPage }) => {
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPageTitle = () => {
    switch (currentPage) {
      case "trending":
        return "Trending Videos";
      case "watch-later":
        return "Watch Later";
      case "liked":
        return "Liked Videos";
      default:
        return searchQuery
          ? `Search Results for "${searchQuery}"`
          : "Recommended Videos";
    }
  };

  return (
    <div className=" overflow-auto lg:ml-64 p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{getPageTitle()}</h1>

        {/* Featured Video Section */}
        {!searchQuery && currentPage === "home" && (
          <div className="mb-12">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-yellow-600 to-blue-600 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Featured Today
                  </h2>
                  <h3 className="text-xl text-white mb-4">
                    {filteredVideos[0]?.title}
                  </h3>
                  <p className="text-gray-200 mb-6">
                    {filteredVideos[0]?.description?.substring(0, 120)}...
                  </p>
                  <button
                    onClick={() => onVideoSelect(filteredVideos[0]?.id)}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Now</span>
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={filteredVideos[0]?.thumbnail}
                    alt={filteredVideos[0]?.title}
                    className="w-full h-64 object-cover rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onVideoSelect={onVideoSelect}
            />
          ))}
        </div>

        {filteredVideos.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg mb-2">
              No videos found for "{searchQuery}"
            </p>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const VideoPage = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleVideoSelect = (id) => {
    setSelectedVideoId(id);
  };

  const handleGoBack = () => {
    setSelectedVideoId(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedVideoId(null);
    setSidebarOpen(false);
  };

  if (selectedVideoId) {
    return (
      <VideoPlayer
        videoId={selectedVideoId}
        onGoBack={handleGoBack}
        onVideoSelect={handleVideoSelect}
      />
    );
  }

  return (
    <Home
      videos={videosData}
      searchQuery={searchQuery}
      onVideoSelect={handleVideoSelect}
      currentPage={currentPage}
    />
  );
};

export default VideoPage;
