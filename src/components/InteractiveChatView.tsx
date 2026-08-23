import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, MicOff, Volume2, User, Zap, Sparkles, Loader2, CheckCircle2, Brain, ArrowUpRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface InteractiveChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isAiThinking: boolean;
  isListening: boolean;
  onToggleListen: () => void;
  onSpeakMessage: (text: string) => void;
  currentTranscript?: string;
}

export const InteractiveChatView: React.FC<InteractiveChatViewProps> = ({
  messages,
  onSendMessage,
  isAiThinking,
  isListening,
  onToggleListen,
  onSpeakMessage,
  currentTranscript = ''
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking, currentTranscript]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isAiThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    { label: '✨ رتب لي برنامجي اليومي', prompt: 'أريدك أن ترتب لي برنامجي لليوم بطريقة متوازنة ومثمرة مع فترات راحة وتركيز.' },
    { label: '📌 أضف جلسة رياضة وقراءة', prompt: 'أضف لجدولي اليوم جلسة رياضة الساعة 5 مساءً وجلسة قراءة كتاب الساعة 8 مساءً.' },
    { label: '🧠 تذكر عاداتي المفضلة', prompt: 'تذكر في ذاكرتك الحية أنني أستيقظ باكراً وأفضل إنجاز المهام الصعبة في الصباح.' },
    { label: '💡 ما خطتي المتبقية لليوم؟', prompt: 'حلل لي المهام المتبقية في جدول اليوم وأعطني نصيحة ذكية لإنهائها.' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col flex-1 select-none overflow-hidden" dir="rtl">
      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar Icon */}
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user'
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-orange-500/20'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Zap size={16} />}
            </div>

            {/* Message Bubble Container */}
            <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[75%]">
              <div className={`p-4 md:p-5 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white/10 border border-white/15 text-white rounded-tr-none text-right'
                  : 'glass-panel border-orange-500/20 text-orange-50 rounded-tl-none text-right'
              }`}>
                {/* Executed Actions Badge */}
                {msg.executedActions && msg.executedActions.length > 0 && (
                  <div className="mb-3 flex flex-col gap-1.5 pb-3 border-b border-orange-500/20">
                    {msg.executedActions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                        {act.type === 'LEARN_MEMORY' ? <Brain size={14} /> : <CheckCircle2 size={14} />}
                        <span>{act.summary}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-sm max-w-none text-right leading-relaxed font-sans">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Footer timestamp & voice listen */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => onSpeakMessage(msg.content)}
                      className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer"
                      title="استمع لصوت الجوهرة"
                    >
                      <Volume2 size={13} />
                      <span>نطق بالصوت</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Live Listening Transcript Floating Bubble */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3.5 flex-row-reverse"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Mic size={16} className="animate-pulse" />
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-3xl rounded-tr-none text-sm text-amber-100 italic">
              "{currentTranscript}..."
            </div>
          </motion.div>
        )}

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-3 text-orange-400/80 text-xs font-semibold p-4 bg-white/5 rounded-2xl border border-white/10 w-fit">
            <Loader2 size={16} className="animate-spin text-orange-400" />
            <span>الجوهرة تفكر وتنسق نواتها العصبية...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-white/5 bg-[#0a0a10]/50">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(item.prompt)}
            disabled={isAiThinking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs whitespace-nowrap transition-all cursor-pointer disabled:opacity-40"
          >
            <span>{item.label}</span>
            <ArrowUpRight size={12} className="text-orange-400" />
          </button>
        ))}
      </div>

      {/* Input Bar with Speech Recognition Mic */}
      <div className="p-4 md:p-6 bg-[#0c0c14]/90 border-t border-white/10 backdrop-blur-2xl">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          {/* Main Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "الجوهرة تستمع لصوتك الآن..." : "تحدث مع الجوهرة أو اكتب ما تريد تنظيمه..."}
              className={`w-full bg-white/5 border rounded-2xl px-5 py-4 pl-12 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                isListening
                  ? 'border-amber-500/50 ring-2 ring-amber-500/20 bg-amber-500/5'
                  : 'border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
              }`}
            />

            {/* Mic Push-to-Talk inside input */}
            <button
              type="button"
              id="chat-mic-button"
              onClick={onToggleListen}
              className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40 animate-pulse'
                  : 'text-white/40 hover:text-orange-400 hover:bg-white/10'
              }`}
              title={isListening ? "إيقاف الاستماع" : "التحدث الصوتي مع الجوهرة"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            id="chat-send-button"
            disabled={!inputText.trim() || isAiThinking}
            className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shrink-0"
            title="إرسال"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
