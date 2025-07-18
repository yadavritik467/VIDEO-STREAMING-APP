import {
  Clock,
  Home,
  ThumbsUp,
  TrendingUp,
  UploadCloudIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
const Sidebar = ({ isOpen, currentPage }) => {
  const menuItems = [
    { id: "", label: "Home", icon: Home },
    { id: "upload", label: "Upload", icon: UploadCloudIcon },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "watch-later", label: "Watch Later", icon: Clock },
    { id: "liked", label: "Liked Videos", icon: ThumbsUp },
  ];

  return (
    <div
      className={`w-full h-full bg-gray-800 bg-gradient-to-b  from-red-600 to-blue-600 text-white z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 lg:translate-x-0`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={`${item.id}`}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                  currentPage === item.id ? "bg-gray-800" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
