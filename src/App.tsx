import React, { useState } from 'react';
import { Bell, MessageCircle, Settings, FileText, Shield, Activity, LogIn, User, Video, Heart, Share, Bookmark, MoreHorizontal, Home, Plus, X } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Story {
  id: string;
  imageUrl: string;
  user: string;
  viewed: boolean;
}

interface Keyword {
  id: string;
  text: string;
  response: string;
}

interface Log {
  id: string;
  type: 'error' | 'info';
  message: string;
  timestamp: Date;
}

interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  isAutoReply?: boolean;
}

type Reel = {
  id: string;
  videoUrl: string;
  user: string;
  userAvatar: string;
  caption: string;
  likes: number;
  comments: string[];
  shares: number;
  saved: boolean;
  liked: boolean;
  following: boolean;
  messages: Message[];
};

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  isAutoReply?: boolean;
}

function App() {
  const [keywords, setKeywords] = useState<Keyword[]>([
    {
      id: '1',
      text: 'price',
      response: 'Thank you for your interest! Please DM for pricing details.'
    },
    {
      id: '2',
      text: 'available',
      response: 'Yes, this item is currently available! Feel free to DM for more details.'
    }
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [currentPage, setCurrentPage] = useState('login');
  const [logs, setLogs] = useState<Log[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [stories] = useState<Story[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop',
      user: 'travel_buddy',
      viewed: false
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
      user: 'fashion_icon',
      viewed: false
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop',
      user: 'food_lover',
      viewed: false
    }
  ]);

  const [reels, setReels] = useState<Reel[]>([
    {
      id: '1',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-times-square-new-york-city-41663-large.mp4',
      user: 'city_vibes',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      caption: '✨ NYC nights #fashion #citylife',
      likes: 15420,
      comments: [],
      shares: 892,
      saved: false,
      liked: false,
      following: false,
      messages: []
    },
    {
      id: '2',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
      user: 'urban_shots',
      userAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150',
      caption: '🌃 City lights never sleep #urban #nightlife',
      likes: 21034,
      comments: [],
      shares: 1562,
      saved: false,
      liked: false,
      following: false,
      messages: []
    },
    {
      id: '3',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
      user: 'ocean_dreams',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      caption: '🌊 Ocean vibes #beach #nature',
      likes: 32671,
      comments: [],
      shares: 2451,
      saved: false,
      liked: false,
      following: false,
      messages: []
    },
    {
      id: '4',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
      user: 'nature_love',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      caption: '🌸 Spring is here #nature #flowers',
      likes: 45218,
      comments: [],
      shares: 3129,
      saved: false,
      liked: false,
      following: false,
      messages: []
    }
  ]);

  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const [activityData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Auto Replies',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Comments',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Activity Overview'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const handleLike = (reelId: string) => {
    setReels(prevReels => prevReels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          liked: !reel.liked,
          likes: reel.liked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleSave = (reelId: string) => {
    setReels(prevReels => prevReels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          saved: !reel.saved
        };
      }
      return reel;
    }));
  };

  const handleShare = (reelId: string) => {
    setReels(prevReels => prevReels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          shares: reel.shares + 1
        };
      }
      return reel;
    }));
  };

  const handleFollow = (reelId: string) => {
    setReels(prevReels => prevReels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          following: !reel.following
        };
      }
      return reel;
    }));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsAuthenticated(true);
      setCurrentPage('home');
      addLog('info', `Successfully ${isLogin ? 'logged in' : 'signed up'}`);
    }
  };

  const handleMessage = (reelId: string, message: string) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        user: 'User',
        timestamp: new Date()
      };

      setReels(prevReels => prevReels.map(reel => {
        if (reel.id === reelId) {
          const updatedMessages = [...reel.messages, newMessage];
          
          // Check for keyword matches
          const matchingKeyword = keywords.find(k => 
            message.toLowerCase().includes(k.text.toLowerCase())
          );

          if (matchingKeyword) {
            const autoReply: Message = {
              id: Date.now().toString() + '-reply',
              text: matchingKeyword.response,
              user: reel.user,
              timestamp: new Date(),
              isAutoReply: true
            };
            updatedMessages.push(autoReply);
            addLog('info', `Auto-reply sent to ${reel.user}`);
          }

          return {
            ...reel,
            messages: updatedMessages
          };
        }
        return reel;
      }));
      
      setNewMessage('');
    }
  };

  const addKeyword = () => {
    if (newKeyword && newResponse) {
      setKeywords([
        ...keywords,
        {
          id: Date.now().toString(),
          text: newKeyword,
          response: newResponse
        }
      ]);
      setNewKeyword('');
      setNewResponse('');
      addLog('info', 'New keyword rule added');
      setShowKeywordModal(false);
    }
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
    addLog('info', 'Keyword rule removed');
  };

  const addLog = (type: 'error' | 'info', message: string) => {
    setLogs(prev => [{
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    }, ...prev]);
  };

  const renderAuth = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join our community'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStories = () => (
    <div className="mb-8 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-6 rounded-xl">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        <div className="flex-shrink-0">
          <button className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[2px] hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-700" />
            </div>
          </button>
          <p className="text-xs text-center mt-2 font-medium">Add Story</p>
        </div>
        {stories.map(story => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex-shrink-0 group"
          >
            <div className={`w-20 h-20 rounded-full ${
              story.viewed 
                ? 'border-2 border-gray-300' 
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[2px]'
            }`}>
              <img
                src={story.imageUrl}
                alt={story.user}
                className="w-full h-full object-cover rounded-full border-2 border-white group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-xs text-center mt-2 font-medium">{story.user}</p>
          </button>
        ))}
      </div>

      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 text-white z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedStory.imageUrl}
              alt={selectedStory.user}
              className="w-full h-[80vh] object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-lg">
              <p className="text-white font-semibold text-lg">{selectedStory.user}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderKeywordModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Keyword Rule</h3>
          <button
            onClick={() => setShowKeywordModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyword
            </label>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., price, available"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-Reply Message
            </label>
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your auto-reply message..."
              rows={3}
            />
          </div>
          <button
            onClick={addKeyword}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Analytics Dashboard</h3>
          <button
            onClick={() => setShowAnalytics(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Activity Overview</h4>
            <Line options={chartOptions} data={activityData} />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Recent Activity Logs</h4>
            <div className="space-y-3">
              {logs.slice(0, 5).map(log => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg ${
                    log.type === 'error' ? 'bg-red-50' : 'bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      log.type === 'error' ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {log.message}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Keyword Rules</h4>
          <div className="space-y-3">
            {keywords.map(keyword => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{keyword.text}</p>
                  <p className="text-sm text-gray-600">{keyword.response}</p>
                </div>
                <button
                  onClick={() => removeKeyword(keyword.id)}
                  className="p-2 hover:bg-red-100 rounded-full text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReels = () => (
    <div className="max-w-lg mx-auto space-y-8">
      {reels.map(reel => (
        <div key={reel.id} className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="relative pb-[177.77%]">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={reel.videoUrl}
              controls
              loop
              playsInline
            />
            
            <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
              <button
                onClick={() => handleLike(reel.id)}
                className="flex flex-col items-center group"
              >
                <div className={`p-3 rounded-full bg-gradient-to-r ${
                  reel.liked 
                    ? 'from-red-500 to-pink-500 text-white' 
                    : 'from-black/50 to-black/50 text-white hover:from-red-500 hover:to-pink-500'
                } transition-all`}>
                  <Heart className={`w-7 h-7 ${reel.liked ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                </div>
                <span className="text-white text-sm mt-1 font-medium drop-shadow-lg">{formatNumber(reel.likes)}</span>
              </button>

              <button 
                onClick={() => setSelectedReel(selectedReel === reel.id ? null : reel.id)}
                className="flex flex-col items-center group"
              >
                <div className={`p-3 rounded-full ${
                  selectedReel === reel.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-black/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500'
                } transition-all text-white`}>
                  <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-white text-sm mt-1 font-medium drop-shadow-lg">{formatNumber(reel.messages.length)}</span>
              </button>

              <button
                onClick={() => handleShare(reel.id)}
                className="flex flex-col items-center group"
              >
                <div className="p-3 rounded-full bg-black/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all text-white">
                  <Share className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-white text-sm mt-1 font-medium drop-shadow-lg">{formatNumber(reel.shares)}</span>
              </button>

              <button
                onClick={() => handleSave(reel.id)}
                className="flex flex-col items-center group"
              >
                <div className={`p-3 rounded-full ${
                  reel.saved 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-black/50 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 text-white'
                } transition-all`}>
                  <Bookmark className={`w-7 h-7 ${reel.saved ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                </div>
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={reel.userAvatar}
                    alt={reel.user}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="text-white font-semibold">{reel.user}</p>
                    <p className="text-white/80 text-sm">Original audio</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(reel.id)}
                  className={`px-4 py-1 rounded-full ${
                    reel.following
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  } text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  {reel.following ? 'Following' : 'Follow'}
                </button>
              </div>
              <p className="text-white text-sm">{reel.caption}</p>

              {selectedReel === reel.id && (
                <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <div className="space-y-4 max-h-40 overflow-y-auto mb-4">
                    {reel.messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.user === 'User' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-xl ${
                          message.user === 'User'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white/20 text-white'
                        } ${message.isAutoReply ? 'border-2 border-green-400' : ''}`}>
                          <p className="text-sm">{message.text}</p>
                          {message.isAutoReply && (
                            <span className="text-xs text-green-300 mt-1 block">Auto-reply</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleMessage(reel.id, newMessage);
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleMessage(reel.id, newMessage)}
                      className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h- screen bg-gray-50">
      {!isAuthenticated ? (
        renderAuth()
      ) : (
        <div>
          <nav className="bg-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Home className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setShowAnalytics(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Activity className="w-6 h-6 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowKeywordModal(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="w-6 h-6 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <MessageCircle className="w-6 h-6 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-8">
            {renderStories()}
            {renderReels()}
            {showKeywordModal && renderKeywordModal()}
            {showAnalytics && renderAnalytics()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;