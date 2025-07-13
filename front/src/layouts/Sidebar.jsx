import { Clock, Home, ThumbsUp, TrendingUp } from 'lucide-react';
const Sidebar= ({ isOpen, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'watch-later', label: 'Watch Later', icon: Clock },
    { id: 'liked', label: 'Liked Videos', icon: ThumbsUp },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 bg-gradient-to-b  from-red-600 to-blue-600 text-white z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0`}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                  currentPage === item.id ? 'bg-gray-800' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar