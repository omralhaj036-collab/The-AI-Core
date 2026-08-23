import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Activity, Zap, Volume2, VolumeX, Mic, Compass, CheckSquare, Brain, MessageSquare, Download, X, Smartphone, Monitor, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabletTab, UserDailyRoutine } from '../types';

interface TabletCompanionHeaderProps {
  currentTab: TabletTab;
  onTabChange: (tab: TabletTab) => void;
  routine: UserDailyRoutine;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
  onInstallClick: () => void;
}

export const TabletCompanionHeader: React.FC<TabletCompanionHeaderProps> = ({
  currentTab,
  onTabChange,
  routine,
  isVoiceEnabled,
  onToggleVoice,
  completedTasksCount,
  totalTasksCount,
  onInstallClick
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleOpenInstall = () => {
    onInstallClick();
    setShowInstallModal(true);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' }));

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('صباح الإشراق والهمة');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('طاب يومك وإنجازك');
      } else if (hour >= 17 && hour < 22) {
        setGreeting('مساء النور والسكينة');
      } else {
        setGreeting('سكون الليل والصفاء');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <>
      <header className="w-full bg-[#0d0d14]/80 backdrop-blur-2xl border-b border-white/10 px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 select-none z-30">
        {/* Left: Entity Identity & Greeting */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0a10] rounded-[14px] flex items-center justify-center">
                <Sparkles size={20} className="text-orange-400 animate-pulse" />
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">الجوهرة الذكية</h1>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30">
                  Core v3
                </span>
              </div>
              <p className="text-xs text-white/50">{greeting}، {routine.userName || 'صاحبي'}</p>
            </div>
          </div>

          {/* Install as App Icon button on header */}
          <button
            id="install-guide-button-mobile"
            onClick={handleOpenInstall}
            className="md:hidden flex items-center gap-1.5 text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <Download size={13} />
            <span>تثبيت الأيقونة</span>
          </button>
        </div>

        {/* Center: Tablet Navigation Tabs */}
        <nav className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner w-full md:w-auto justify-around md:justify-center">
          <TabButton
            id="tab-companion"
            active={currentTab === 'companion'}
            onClick={() => onTabChange('companion')}
            icon={<Compass size={16} />}
            label="الكيان الحي"
          />
          <TabButton
            id="tab-schedule"
            active={currentTab === 'schedule'}
            onClick={() => onTabChange('schedule')}
            icon={<CheckSquare size={16} />}
            label="برنامج اليوم"
            badge={totalTasksCount > 0 ? `${completedTasksCount}/${totalTasksCount}` : undefined}
          />
          <TabButton
            id="tab-memory"
            active={currentTab === 'memory'}
            onClick={() => onTabChange('memory')}
            icon={<Brain size={16} />}
            label="الذاكرة الحية"
          />
          <TabButton
            id="tab-chat"
            active={currentTab === 'chat'}
            onClick={() => onTabChange('chat')}
            icon={<MessageSquare size={16} />}
            label="الحوار المباشر"
          />
        </nav>

        {/* Right: Metrics, Live Time & Voice Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Install button */}
          <button
            id="install-guide-button-desktop"
            onClick={handleOpenInstall}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-orange-500/15 to-purple-500/15 hover:from-orange-500/25 hover:to-purple-500/25 text-orange-300 border border-orange-500/30 px-3 py-2 rounded-xl transition-all cursor-pointer font-medium"
            title="كيف تجعل الجوهرة أيقونة مستقلة على سطح جهازك"
          >
            <Download size={14} className="text-orange-400" />
            <span>أيقونة على الشاشة</span>
          </button>

          {/* Progress & Sync Pill */}
          <div className="flex items-center gap-3 bg-white/5 px-3.5 py-1.5 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Activity size={14} />
              <span className="font-bold">{routine.neuralSync}%</span>
              <span className="text-[10px] text-white/40">تزامن</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-orange-400">
              <Zap size={14} />
              <span className="font-bold">{progressPercent}%</span>
              <span className="text-[10px] text-white/40">إنجاز</span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-white font-mono font-bold text-sm">
              <Clock size={13} className="text-orange-400" />
              <span>{timeStr}</span>
            </div>
            <span className="text-[10px] text-white/40">{dateStr}</span>
          </div>

          {/* Voice Speech Toggle */}
          <button
            id="voice-toggle-button"
            onClick={onToggleVoice}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isVoiceEnabled
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-md shadow-orange-500/20'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
            }`}
            title={isVoiceEnabled ? 'الصوت مفعل (الجوهرة تنطق بالردود)' : 'الصوت مكتوم'}
          >
            {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* Standalone Installation Guide Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-lg p-6 md:p-8 rounded-3xl border-orange-500/30 shadow-2xl relative flex flex-col gap-6"
            >
              <button
                onClick={() => setShowInstallModal(false)}
                className="absolute left-6 top-6 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <div className="w-full h-full bg-[#0a0a10] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="text-orange-400" size={24} />
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-white">تثبيت الجوهرة كأيقونة حية مستقلة</h3>
                  <p className="text-xs text-white/50">خطوات بسيطة لتصبح تطبيقاً مستقلاً على شاشة جهازك</p>
                </div>
              </div>

              {/* Steps Guide for iPad/iPhone */}
              <div className="flex flex-col gap-4 text-right">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                    <Smartphone size={16} />
                    <span>على الآيباد أو الآيفون (Safari):</span>
                  </div>
                  <ol className="text-xs text-white/80 space-y-1.5 list-decimal list-inside pr-1">
                    <li>اضغط على زر المشاركة <span className="text-orange-300 font-bold">Share <Share size={12} className="inline" /></span> في أعلى أو أسفل المتصفح.</li>
                    <li>اختر من القائمة <span className="text-orange-300 font-bold">"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</span>.</li>
                    <li>اضغط على <span className="text-orange-300 font-bold">"إضافة" (Add)</span>. ستظهر الجوهرة الذكية كأيقونة تطبيق كامل بدون شريط المتصفح!</li>
                  </ol>
                </div>

                {/* Steps Guide for Android Tablet / Chrome */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <Smartphone size={16} />
                    <span>على أجهزة أندرويد اللوحية (Chrome):</span>
                  </div>
                  <ol className="text-xs text-white/80 space-y-1.5 list-decimal list-inside pr-1">
                    <li>اضغط على قائمة النقاط الثلاث <span className="text-purple-300 font-bold">⋮</span> في أعلى المتصفح.</li>
                    <li>اختر <span className="text-purple-300 font-bold">"تثبيت التطبيق" (Install app)</span> أو <span className="text-purple-300 font-bold">"إضافة إلى الشاشة الرئيسية"</span>.</li>
                  </ol>
                </div>

                {/* Steps Guide for PC / Mac */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <Monitor size={16} />
                    <span>على الكمبيوتر أو الماك (Chrome / Edge):</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    اضغط على أيقونة التثبيت <span className="text-blue-300 font-bold">(Install ⊕)</span> الموجودة في أقصى يمين شريط العنوان بالمتصفح ليتم فتحها في نافذة تطبيق مستقلة على سطح المكتب.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                فهمت، شكراً لك!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ id, active, onClick, icon, label, badge }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
        active
          ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/30 font-bold'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
          active ? 'bg-black/30 text-white' : 'bg-orange-500/20 text-orange-300'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};
