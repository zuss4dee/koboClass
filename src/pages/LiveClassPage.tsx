import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Heart, 
  ThumbsUp, 
  Flame, 
  Laugh, 
  Hand,
  LogOut,
  Flag,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Maximize,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isHost?: boolean;
}

interface Reaction {
  id: string;
  type: 'heart' | 'thumbs' | 'fire' | 'laugh';
  x: number;
  y: number;
  timestamp: Date;
}

const LiveClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock class data
  const classData = {
    id: classId,
    title: "Master Professional Makeup Artistry",
    hostName: "Chioma Okeke",
    hostImage: "https://images.pexels.com/photos/3184334/pexels-photo-3184334.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    studentsCount: 45,
    duration: "90 mins",
    category: "Creative"
  };

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Chioma Okeke',
      message: 'Welcome everyone! Ready to learn some amazing makeup techniques?',
      timestamp: new Date(Date.now() - 300000),
      isHost: true
    },
    {
      id: '2',
      user: 'Temi A.',
      message: 'So excited to be here! 🎉',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: '3',
      user: 'Samuel O.',
      message: 'Can you show us the contouring technique again?',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '4',
      user: 'Fatima H.',
      message: 'This is amazing! Thank you for sharing these tips',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);

  const reactionTypes = [
    { type: 'heart' as const, icon: Heart, color: 'text-red-500', emoji: '❤️' },
    { type: 'thumbs' as const, icon: ThumbsUp, color: 'text-blue-500', emoji: '👍' },
    { type: 'fire' as const, icon: Flame, color: 'text-orange-500', emoji: '🔥' },
    { type: 'laugh' as const, icon: Laugh, color: 'text-yellow-500', emoji: '😂' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleReaction = (type: 'heart' | 'thumbs' | 'fire' | 'laugh') => {
    const newReaction: Reaction = {
      id: Date.now().toString(),
      type,
      x: Math.random() * 80 + 10, // 10-90% from left
      y: Math.random() * 60 + 20, // 20-80% from top
      timestamp: new Date()
    };

    setReactions(prev => [...prev, newReaction]);

    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  const handleLeaveClass = () => {
    if (window.confirm('Are you sure you want to leave this class?')) {
      // Navigate to rating page after leaving class
      navigate(`/class/${classId}/rating`);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-charcoal-black text-creamy-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-charcoal-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-creamy-white hover:text-golden-yellow transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              <img
                src={classData.hostImage}
                alt={classData.hostName}
                className="w-10 h-10 rounded-full border-2 border-golden-yellow"
              />
              <div>
                <h1 className="text-lg font-bold">{classData.title}</h1>
                <p className="text-sm text-light-sand">with {classData.hostName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-charcoal-black/60 backdrop-blur-sm rounded-full px-3 py-1">
              <Users className="w-4 h-4 text-forest-green" />
              <span className="text-sm font-medium">{classData.studentsCount}</span>
            </div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              🔴 LIVE
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Video Area */}
        <div className={cn(
          "relative transition-all duration-300",
          isChatOpen ? "flex-1" : "w-full"
        )}>
          {/* Mock Video Player */}
          <div className="w-full h-full bg-gradient-to-br from-charcoal-black via-warm-gray/20 to-charcoal-black flex items-center justify-center relative">
            {/* Video Placeholder */}
            <div className="text-center">
              <div className="w-32 h-32 bg-deep-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-16 h-16 text-creamy-white" />
              </div>
              <p className="text-xl font-semibold mb-2">Live Video Stream</p>
              <p className="text-light-sand">Video player would be embedded here (Agora/Daily)</p>
            </div>

            {/* Floating Reactions */}
            {reactions.map((reaction) => {
              const ReactionType = reactionTypes.find(r => r.type === reaction.type);
              return (
                <div
                  key={reaction.id}
                  className="absolute animate-bounce"
                  style={{
                    left: `${reaction.x}%`,
                    top: `${reaction.y}%`,
                    animationDuration: '3s',
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-4xl opacity-90">
                    {ReactionType?.emoji}
                  </span>
                </div>
              );
            })}

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                      isMuted ? "bg-brick-red" : "bg-charcoal-black/60 backdrop-blur-sm hover:bg-deep-orange"
                    )}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                      isVideoOff ? "bg-brick-red" : "bg-charcoal-black/60 backdrop-blur-sm hover:bg-deep-orange"
                    )}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <div className="flex items-center gap-2 bg-charcoal-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                    <button onClick={() => setVolume(volume === 0 ? 80 : 0)}>
                      {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-20 h-1 bg-warm-gray rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="w-12 h-12 rounded-full bg-charcoal-black/60 backdrop-blur-sm hover:bg-deep-orange flex items-center justify-center transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                  
                  <button className="w-12 h-12 rounded-full bg-charcoal-black/60 backdrop-blur-sm hover:bg-deep-orange flex items-center justify-center transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction Buttons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
            {reactionTypes.map((reaction) => {
              const Icon = reaction.icon;
              return (
                <button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  className={cn(
                    "w-12 h-12 rounded-full bg-charcoal-black/60 backdrop-blur-sm hover:scale-110 flex items-center justify-center transition-all duration-300 group",
                    reaction.color
                  )}
                >
                  <Icon className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-3">
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                isHandRaised 
                  ? "bg-golden-yellow text-charcoal-black animate-pulse" 
                  : "bg-charcoal-black/60 backdrop-blur-sm hover:bg-golden-yellow hover:text-charcoal-black"
              )}
            >
              <Hand className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="w-12 h-12 rounded-full bg-charcoal-black/60 backdrop-blur-sm hover:bg-brick-red flex items-center justify-center transition-colors"
            >
              <Flag className="w-5 h-5" />
            </button>

            <button
              onClick={handleLeaveClass}
              className="w-12 h-12 rounded-full bg-brick-red hover:bg-brick-red/80 flex items-center justify-center transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-80 bg-creamy-white text-charcoal-black flex flex-col border-l border-light-sand">
            {/* Chat Header */}
            <div className="p-4 border-b border-light-sand bg-light-sand">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-deep-orange" />
                  Live Chat
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-warm-gray hover:text-charcoal-black transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium",
                      message.isHost ? "text-deep-orange" : "text-charcoal-black"
                    )}>
                      {message.user}
                      {message.isHost && (
                        <span className="ml-1 bg-deep-orange text-creamy-white px-2 py-0.5 rounded-full text-xs">
                          Host
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-warm-gray">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-black bg-light-sand rounded-lg px-3 py-2">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-light-sand">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-light-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-orange focus:border-deep-orange"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="bg-deep-orange text-creamy-white px-4 py-2 rounded-lg hover:bg-brick-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Toggle Button (when closed) */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-deep-orange text-creamy-white rounded-full flex items-center justify-center hover:bg-brick-red transition-colors z-40"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-charcoal-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-creamy-white text-charcoal-black rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-brick-red" />
              Report Class
            </h3>
            <p className="text-warm-gray mb-4">
              Help us keep KoboClass safe. What's wrong with this class?
            </p>
            <div className="space-y-2 mb-6">
              {[
                'Inappropriate content',
                'Spam or misleading',
                'Harassment or bullying',
                'Copyright violation',
                'Other'
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="report" className="text-deep-orange" />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-light-sand rounded-lg hover:bg-light-sand transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  // Handle report submission
                }}
                className="flex-1 bg-brick-red text-creamy-white px-4 py-2 rounded-lg hover:bg-brick-red/80 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #D9572B;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(217, 87, 43, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #D9572B;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(217, 87, 43, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LiveClassPage;