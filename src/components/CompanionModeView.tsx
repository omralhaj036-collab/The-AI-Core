import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mic, Calendar, Brain, ArrowLeft, Zap, Target, Activity, CheckCircle2, Clock } from 'lucide-react';
import { LivingCoreOrb } from './LivingCoreOrb';
import { AICoreState, DailyTask, LivingMemoryItem, TabletTab, UserDailyRoutine } from '../types';

interface CompanionModeViewProps {
  aiState: AICoreState;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListen: () => void;
  tasks: DailyTask[];
  memories: LivingMemoryItem[];
  routine: UserDailyRoutine;
  onNavigateTab: (tab: TabletTab) => void;
  onQuickCommand: (command: string) => void;
  isAiThinking: boolean;
  onOpenInstall: () => void;
}

export const CompanionModeView: React.FC<CompanionModeViewProps> = ({
  aiState,
  isListening,
  isSpeaking,
  onToggleListen,
  tasks,
  memories,
  routine,
  onNavigateTab,
  onQuickCommand,
  isAiThinking,
  onOpenInstall
}) => {
  const nextTask = tasks.find(t => !t.completed);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 max-w-5xl mx-auto select-none overflow-y-auto" dir="rtl">
      
      {/* Top Welcome & Insights Strip */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Card 1: Today's Focus */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3.5 border-white/5">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Target size={18} />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">الهدف والتركيز</span>
            <p className="text-xs font-semibold text-white truncate">{routine.dailyGoal || 'إنجاز يوم مثمر بصفاء ذهني'}</p>
          </div>
        </div>

        {/* Card 2: Next Action Task */}
        <div 
          onClick={() => onNavigateTab('schedule')}
          className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-3 border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock size={18} />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">المهمة القادمة</span>
              <p className="text-xs font-semibold text-white truncate">
                {nextTask ? `${nextTask.time} • ${nextTask.title}` : 'لا توجد مهام معلقة'}
              </p>
            </div>
          </div>
          <ArrowLeft size={14} className="text-white/30 group-hover:text-orange-400 transition-colors" />
        </div>

        {/* Card 3: Living Memory Status */}
        <div 
          onClick={() => onNavigateTab('memory')}
          className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-3 border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Brain size={18} />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">الذاكرة الحية</span>
              <p className="text-xs font-semibold text-emerald-300">
                {memories.length} حقائق وعادات متعلمة
              </p>
            </div>
          </div>
          <ArrowLeft size={14} className="text-white/30 group-hover:text-purple-400 transition-colors" />
        </div>
      </motion.div>

      {/* Main Living Centerpiece */}
      <div className="my-6 md:my-10 flex flex-col items-center justify-center">
        <LivingCoreOrb
          state={aiState}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onToggleListen={onToggleListen}
          size="hero"
          pulseSubtitle={
            isListening
              ? "استمع لصوتك بدقة... تحدث بما في خاطرك"
              : isSpeaking
              ? "الجوهرة تخاطبك بصوتها الذكي"
              : isAiThinking
              ? "تنسيق النبضات العصبية ومعالجة البيانات..."
              : "المس الجوهرة للتحدث معها بصوتك في أي وقت"
          }
        />
      </div>

      {/* Bottom Quick Commands Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-white/40 tracking-wider">إيعازات سريعة للكيان</span>
          <span className="text-[11px] text-orange-400/80 font-medium">جاهزة للتنفيذ الفوري</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            id="quick-voice-talk-btn"
            onClick={onToggleListen}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/10 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
              <Mic size={20} />
            </div>
            <span className="text-xs font-bold text-white">تحدث بالصوت</span>
            <span className="text-[10px] text-white/40">حوار صوتي مباشر</span>
          </button>

          <button
            id="quick-plan-day-btn"
            onClick={() => onQuickCommand('رتب لي برنامجي لليوم واقترح مهام متوازنة')}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <span className="text-xs font-bold text-white">رتب برنامجي</span>
            <span className="text-[10px] text-white/40">تخطيط ذكي لليوم</span>
          </button>

          <button
            id="quick-teach-memory-btn"
            onClick={() => onNavigateTab('memory')}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Brain size={20} />
            </div>
            <span className="text-xs font-bold text-white">الذاكرة والعادات</span>
            <span className="text-[10px] text-white/40">تعليم الكيان عنك</span>
          </button>

          <button
            id="quick-open-schedule-btn"
            onClick={() => onNavigateTab('schedule')}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-white">قائمة المهام</span>
            <span className="text-[10px] text-white/40">{completedCount}/{tasks.length} منجز</span>
          </button>
        </div>

        {/* Standalone App Icon Installation Banner */}
        <div 
          onClick={onOpenInstall}
          className="mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-rose-500/10 border border-orange-500/30 flex items-center justify-between gap-4 cursor-pointer hover:border-orange-500 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 shadow-md shadow-orange-500/30 shrink-0">
              <div className="w-full h-full bg-[#08080c] rounded-[10px] flex items-center justify-center">
                <Sparkles size={18} className="text-orange-400" />
              </div>
            </div>
            <div className="text-right">
              <h4 className="text-xs font-bold text-white">اجعل الجوهرة أيقونة مستقلة على سطح جهازك</h4>
              <p className="text-[11px] text-white/50">تفتح بدون أشرطة المتصفح وتعمل كتطبيق حقيقي على شاشتك</p>
            </div>
          </div>
          <button 
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 shrink-0"
          >
            تثبيت الأيقونة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
