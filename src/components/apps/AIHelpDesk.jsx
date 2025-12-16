import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  MessageCircle, 
  Send, 
  Paperclip, 
  Code, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Bug, 
  GitBranch, 
  Settings, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  BarChart, 
  Activity, 
  Users, 
  Hash, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  Zap, 
  Target, 
  Compass, 
  Brain, 
  Cpu, 
  Database, 
  Globe, 
  Terminal, 
  FileCode, 
  Wrench, 
  GraduationCap, 
  Rocket, 
  Shield, 
  Smartphone, 
  Layers, 
  Eye, 
  EyeOff,
  X,
  ArrowRight,
  RefreshCw,
  ImageIcon,
  ChartNetworkIcon,
  MapIcon,
  PenToolIcon,
  ScanTextIcon,
  SparklesIcon
} from 'lucide-react';
import './AIHelpDesk.css';

const AIHelpDesk = ({ onClose, user, isAdmin = false }) => {
  const [viewMode, setViewMode] = useState('chat'); // chat, history, admin
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showCodeUpload, setShowCodeUpload] = useState(false);
  const [uploadedCode, setUploadedCode] = useState('');
  const [quickActions, setQuickActions] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your AI Help Desk assistant. I can help you with coding errors, concepts, project doubts, debugging, and learning guidance. How can I assist you today?",
        timestamp: new Date(),
        suggestions: [
          "Help me debug a React error",
          "Explain JavaScript closures",
          "How do I set up Git?",
          "Project structure best practices"
        ]
      }
    ]);

    // Sample chat history
    setChatHistory([
      {
        id: 1,
        title: "React useState Hook Help",
        preview: "How do I properly use useState in React components...",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        messageCount: 8,
        category: 'react',
        status: 'resolved'
      },
      {
        id: 2,
        title: "CSS Grid Layout Issues",
        preview: "I'm having trouble with CSS grid not aligning properly...",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        messageCount: 12,
        category: 'css',
        status: 'resolved'
      },
      {
        id: 3,
        title: "Git Merge Conflict Resolution",
        preview: "Can you help me resolve this merge conflict in my feature branch...",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        messageCount: 6,
        category: 'git',
        status: 'ongoing'
      }
    ]);

    // Sample analytics for admin
    if (isAdmin) {
      setAnalytics({
        totalQueries: 1247,
        avgResponseTime: 2.3, // seconds
        mostCommonTopics: [
          { topic: 'React Hooks', count: 156, percentage: 12.5 },
          { topic: 'JavaScript Arrays', count: 134, percentage: 10.7 },
          { topic: 'CSS Layout', count: 98, percentage: 7.9 },
          { topic: 'Git Commands', count: 87, percentage: 7.0 },
          { topic: 'Node.js', count: 76, percentage: 6.1 }
        ],
        peakUsageTimes: [
          { hour: 14, queries: 145 }, // 2 PM
          { hour: 16, queries: 132 }, // 4 PM
          { hour: 10, queries: 128 }, // 10 AM
          { hour: 15, queries: 124 }, // 3 PM
          { hour: 11, queries: 118 }  // 11 AM
        ],
        satisfactionRate: 94.2,
        resolutionRate: 87.8
      });
    }

    // Quick actions
    setQuickActions([
      { icon: Bug, label: 'Debug Error', color: '#ef4444' },
      { icon: Code, label: 'Code Review', color: '#3b82f6' },
      { icon: BookOpen, label: 'Learn Concept', color: '#10b981' },
      { icon: Wrench, label: 'Tool Help', color: '#f59e0b' }
    ]);

    // Suggested topics based on common issues
    setSuggestedTopics([
      'React State Management',
      'JavaScript Promises',
      'CSS Flexbox',
      'Git Branching',
      'API Integration',
      'Error Handling',
      'Performance Optimization',
      'Testing Strategies'
    ]);
  }, [isAdmin]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentQuery.trim() && !uploadedCode) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentQuery,
      code: uploadedCode,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setUploadedCode('');
    setShowCodeUpload(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userMessage) => {
    const responses = [
      {
        content: "I can help you with that! Based on your question, here's what I recommend:\n\n1. First, let's identify the root cause of the issue\n2. Then we'll look at the best practices for solving it\n3. Finally, I'll provide you with a code example\n\nWould you like me to elaborate on any specific part?",
        type: 'explanation',
        codeExample: `// Example solution\nconst solution = () => {\n  // Your code here\n  return result;\n};`,
        followUpQuestions: [
          "Does this solution work for your specific use case?",
          "Would you like to see an alternative approach?",
          "Do you need help implementing this in your project?"
        ]
      },
      {
        content: "Great question! This is a common issue many developers face. Let me break it down for you:\n\nThe problem you're experiencing is related to how JavaScript handles asynchronous operations. Here's what's happening and how to fix it.",
        type: 'debug',
        steps: [
          "Check your async/await syntax",
          "Verify your API endpoint is correct",
          "Add proper error handling",
          "Test with sample data"
        ],
        resources: [
          { title: "MDN Async/Await Guide", url: "#" },
          { title: "JavaScript Promises Tutorial", url: "#" }
        ]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now() + 1,
      type: 'assistant',
      ...randomResponse,
      timestamp: new Date()
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleQuickAction = (action) => {
    const queries = {
      'Debug Error': "I'm getting an error in my code. Can you help me debug it?",
      'Code Review': "Can you review my code and suggest improvements?",
      'Learn Concept': "I want to learn about a new programming concept. Can you explain it?",
      'Tool Help': "I need help using a development tool. Can you guide me?"
    };
    
    setCurrentQuery(queries[action.label]);
  };

  const handleHistorySelect = (history) => {
    setSelectedHistory(history);
    // In a real app, this would load the actual conversation
    setMessages([
      {
        id: 1,
        type: 'user',
        content: history.preview,
        timestamp: history.timestamp
      },
      {
        id: 2,
        type: 'assistant',
        content: "I understand your concern. Let me help you with this...",
        timestamp: new Date(history.timestamp.getTime() + 1000)
      }
    ]);
    setViewMode('chat');
  };

  const renderChatView = () => (
    <div className="ai-assistant-card" style={{
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '0.75rem',
      minHeight: '400px',
      maxHeight: 'none',
      maxWidth: '360px',
      width: '100%',
      boxShadow: 'none'
    }}>
      <div className="card-header">
        <div className="header-actions">
          <button onClick={() => setViewMode('history')} className="icon-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
              />
            </svg>
          </button>
          <button onClick={onClose} className="icon-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-muted-foreground"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="messages-container" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {messages.length === 0 ? (
            <div className="welcome-section" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem',
              gap: '0.75rem',
              height: '100%'
            }}>
              <div className="ai-logo" style={{ marginBottom: '0.5rem' }}>
                <div className="ai-logo-simple">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="48" height="48" rx="12" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2"/>
                    <path d="M24 12c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" fill="#667eea" opacity="0.8"/>
                    <path d="M18 24c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" fill="#764ba2" opacity="0.6"/>
                  </svg>
                </div>
              </div>

              <div className="welcome-text" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.5rem'
              }}>
                <div className="welcome-header" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <h2 className="greeting" style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    lineHeight: '1.2',
                    color: '#9ca3af',
                    margin: '0'
                  }}>Hi {user?.name || 'Student'},</h2>
                  <h3 className="welcome-message" style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    lineHeight: '1.1',
                    letterSpacing: '-0.006em',
                    color: '#ffffff',
                    margin: '0'
                  }}>Welcome back! How can I help?</h3>
                </div>
                <p className="welcome-description" style={{
                  fontSize: '0.6875rem',
                  color: '#9ca3af',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  I'm here to help you tackle your tasks. Just tell me what you need!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="message" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div className="message-bubble" style={{
                  background: message.type === 'user' ? '#667eea' : '#374151',
                  color: '#ffffff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '0.75rem',
                  lineHeight: '1.3'
                }}>
                  {message.content}
                </div>
                <div className="message-time" style={{
                  fontSize: '0.625rem',
                  color: '#6b7280',
                  alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="input-section" style={{ marginTop: 'auto' }}>
          <div className="input-container" style={{
            position: 'relative',
            marginTop: 'auto',
            borderRadius: '8px',
            border: '1px solid #374151',
            background: '#1f2937',
            overflow: 'hidden'
          }}>
            <textarea
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="message-input"
              rows={1}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.75rem',
                lineHeight: '1.3',
                resize: 'none',
                outline: 'none',
                width: '100%',
                minHeight: '32px',
                height: '32px',
                padding: '0.5rem 0.75rem 0.5rem 0.75rem',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
return renderChatView();
};

export default AIHelpDesk;
