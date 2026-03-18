import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, 
    Mic, 
    Plus, 
    MoreHorizontal, 
    Search, 
    Sparkles, 
    Droplets, 
    Zap, 
    Flame,
    Target,
    ArrowRight
} from 'lucide-react';
import api from '../services/api';
import './AiBuddyPage.css';

const AiBuddyPage = () => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            type: 'ai', 
            text: "Hello John! I've analyzed your breakfast log from this morning. You're tracking well on protein today (32g so far). Ready to log your lunch?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [macros, setMacros] = useState({
        calories: 1420,
        goal: 2200,
        protein: 75,
        carbs: 40,
        fats: 55
    });
    
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchData();
        scrollToBottom();
    }, [messages]);

    const fetchData = async () => {
        try {
            const recs = await api.getAiRecommendations();
            setRecommendations(recs);
        } catch (error) {
            console.error("Error fetching AI data:", error);
        }
    };

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        try {
            const response = await api.aiBuddyChat(input);
            
            // Add fake delay for realism
            setTimeout(() => {
                const aiMsg = {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: response.reply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    data: response.data
                };
                setMessages(prev => [...prev, aiMsg]);
                setTyping(false);

                // If specialized data, trigger effects
                if (response.data?.type === 'protein_tip') {
                    // Could update macros here for mock effect
                }
            }, 1500);

        } catch (error) {
            console.error("Chat error:", error);
            setTyping(false);
        }
    };

    const handleAnalyzeLastMeal = async () => {
        setTyping(true);
        try {
            const response = await api.analyzeAiMeal();
            setTimeout(() => {
                const aiMsg = {
                    id: Date.now(),
                    type: 'ai',
                    text: response.message,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    analysis: response
                };
                setMessages(prev => [...prev, aiMsg]);
                setTyping(false);
            }, 2000);
        } catch (error) {
            setTyping(false);
        }
    };

    return (
        <div className="ai-buddy-container animate-fade-in">
            <div className="chat-main">
                {/* Chat Header */}
                <header className="chat-header">
                    <div className="header-info">
                        <div className="ai-avatar-status">
                            <div className="ai-avatar">
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <div className="status-indicator"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-black">AI Buddy Chat</h2>
                            <p className="status-text">Online & Ready</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={handleAnalyzeLastMeal} className="analyze-shortcut-btn clay-button-primary mr-4">
                            Analyze Last Meal
                        </button>
                        <button className="icon-btn"><Search size={22} /></button>
                        <button className="icon-btn"><MoreHorizontal size={22} /></button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="messages-area custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.type}`}>
                            {msg.type === 'ai' && (
                                <div className="ai-bubble-avatar">
                                    <Sparkles size={16} />
                                </div>
                            )}
                            <div className="message-content">
                                <div className={`bubble ${msg.type === 'ai' ? 'clay-card-dark' : 'user-bubble'}`}>
                                    <p>{msg.text}</p>
                                    {msg.image && (
                                        <div className="analysis-media">
                                            <img src={msg.image} alt="Analyzed meal" className="rounded-2xl mt-4 border border-white/10" />
                                        </div>
                                    )}
                                </div>
                                <span className="timestamp">{msg.timestamp}</span>
                            </div>
                            {msg.type === 'user' && (
                                <div className="user-bubble-avatar">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                                </div>
                            )}
                        </div>
                    ))}
                    {typing && (
                        <div className="message-wrapper ai">
                            <div className="ai-bubble-avatar neon-pulse">
                                <Sparkles size={16} />
                            </div>
                            <div className="bubble ai typing clay-card-dark">
                                <div className="typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form className="input-area" onSubmit={handleSend}>
                    <div className="input-wrapper clay-inset">
                        <button type="button" className="add-btn"><Plus size={20} /></button>
                        <input 
                            type="text" 
                            placeholder="Ask AI Buddy about your nutrition..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="button" className="mic-btn"><Mic size={20} /></button>
                        <button type="submit" className={`send-btn ${input.trim() ? 'active' : ''}`}>
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Sidebar Widgets */}
            <aside className="ai-sidebar">
                <div className="widget-section">
                    <h3 className="widget-title">
                        <Target size={18} className="text-primary" />
                        Daily Macro Tracking
                    </h3>
                    
                    <div className="macro-card-detailed clay-card-dark">
                        <div className="calorie-summary">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Calories</p>
                                    <h4 className="text-3xl font-black">{macros.calories} <span className="text-sm font-bold text-slate-500">/ {macros.goal}</span></h4>
                                </div>
                                <span className="percentage text-primary font-black">{Math.round((macros.calories/macros.goal)*100)}%</span>
                            </div>
                            <div className="progress-bar-bg h-3 rounded-full overflow-hidden">
                                <div className="progress-fill h-full bg-primary shadow-neon" style={{ width: `${(macros.calories/macros.goal)*100}%` }}></div>
                            </div>
                        </div>

                        <div className="macro-rings-grid mt-6">
                            {[
                                { label: 'Protein', val: macros.protein, color: 'text-blue-400', border: 'border-blue-400/20' },
                                { label: 'Carbs', val: macros.carbs, color: 'text-amber-400', border: 'border-amber-400/20' },
                                { label: 'Fats', val: macros.fats, color: 'text-rose-400', border: 'border-rose-400/20' }
                            ].map((m, i) => (
                                <div key={i} className={`macro-mini-ring ${m.border} clay-inset`}>
                                    <div className="val-circle">
                                        <span className={`text-sm font-black ${m.color}`}>{m.val}%</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-500 mt-2">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="widget-section mt-8">
                    <h3 className="widget-title">
                        <Sparkles size={18} className="text-primary" />
                        AI Recommendations
                    </h3>
                    <div className="recommendations-stack">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="rec-card clay-card-dark border-l-4 border-primary/50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-primary">{rec.title}</h4>
                                    {rec.type === 'hydration' && <Droplets size={14} className="text-blue-400" />}
                                    {rec.type === 'insight' && <Zap size={14} className="text-amber-400" />}
                                    {rec.type === 'supplement' && <Flame size={14} className="text-rose-400" />}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{rec.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="full-analysis-btn clay-button-dark mt-auto">
                    View Full Analysis
                    <ArrowRight size={18} />
                </button>
            </aside>
        </div>
    );
};

export default AiBuddyPage;
