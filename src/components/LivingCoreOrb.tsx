import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Mic, Volume2, Zap, Radio, Moon, Activity } from 'lucide-react';
import { AICoreState } from '../types';

interface LivingCoreOrbProps {
  state: AICoreState;
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListen: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  pulseSubtitle?: string;
}

export const LivingCoreOrb: React.FC<LivingCoreOrbProps> = ({
  state,
  isListening,
  isSpeaking,
  onToggleListen,
  size = 'hero',
  pulseSubtitle
}) => {
  // State metadata
  const getStateInfo = () => {
    switch (state) {
      case 'listening':
        return { label: 'أنا أصغي إليك...', color: 'from-amber-400 via-orange-500 to-rose-600', glow: 'rgba(245, 158, 11, 0.4)', icon: Mic };
      case 'thinking':
        return { label: 'أحلل وأفكر...', color: 'from-rose-500 via-purple-600 to-indigo-600', glow: 'rgba(168, 85, 247, 0.4)', icon: Brain };
      case 'speaking':
        return { label: 'أخاطبك الآن...', color: 'from-orange-500 via-amber-500 to-emerald-500', glow: 'rgba(249, 115, 22, 0.5)', icon: Volume2 };
      case 'learning':
        return { label: 'أتعلم عنك شيئاً جديداً...', color: 'from-cyan-400 via-blue-500 to-purple-600', glow: 'rgba(6, 182, 212, 0.4)', icon: Zap };
      case 'sleeping':
        return { label: 'في وضع السكون المتناغم...', color: 'from-indigo-900 via-slate-800 to-purple-950', glow: 'rgba(99, 102, 241, 0.2)', icon: Moon };
      default:
        return { label: 'كيان حي متصل • جاهز لأمرك', color: 'from-orange-400 via-rose-500 to-purple-600', glow: 'rgba(249, 115, 22, 0.35)', icon: Sparkles };
    }
  };

  const stateInfo = getStateInfo();
  const IconComponent = stateInfo.icon;

  const orbDimensions = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    hero: 'w-64 h-64 md:w-80 md:h-80'
  }[size];

  const iconSizes = {
    sm: 28,
    md: 48,
    lg: 64,
    hero: 80
  }[size];

  return (
    <div className="flex flex-col items-center justify-center select-none relative">
      {/* Outer Atmospheric Aura */}
      <div 
        className="absolute rounded-full blur-[90px] transition-all duration-1000 pointer-events-none"
        style={{
          width: size === 'hero' ? '28rem' : '18rem',
          height: size === 'hero' ? '28rem' : '18rem',
          background: stateInfo.glow
        }}
      />

      {/* Orbiting Synaptic Particle Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: state === 'thinking' ? 4 : 25, repeat: Infinity, ease: 'linear' }}
        className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-orange-500/15 pointer-events-none"
      >
        <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_12px_#f97316]" />
        <div className="absolute -bottom-1.5 left-1/4 w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_10px_#f43f5e]" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full border border-purple-500/10 pointer-events-none"
      >
        <div className="absolute top-1/3 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_12px_#a855f7]" />
      </motion.div>

      {/* Core Interactive Entity Button */}
      <motion.button
        id="living-core-orb-button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onToggleListen}
        className="relative group cursor-pointer focus:outline-none"
        title="اضغط للتحدث مع الجوهرة الذكية"
      >
        {/* Pulsating Reactive Rings */}
        <motion.div
          animate={{
            scale: isSpeaking || isListening ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: isSpeaking || isListening ? [0.6, 0.15, 0.6] : [0.4, 0.1, 0.4]
          }}
          transition={{
            duration: isListening ? 1.4 : isSpeaking ? 1.8 : 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute -inset-4 md:-inset-6 rounded-full bg-gradient-to-r ${stateInfo.color} blur-xl`}
        />

        {/* Outer Living Shell */}
        <div className={`${orbDimensions} rounded-full p-1.5 bg-gradient-to-tr ${stateInfo.color} shadow-2xl relative z-10 flex items-center justify-center transition-all duration-700`}>
          {/* Inner Void / Heart */}
          <div className="w-full h-full rounded-full bg-[#08080c] relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
            
            {/* Liquid Neural Energy Mesh */}
            <motion.div
              animate={{
                scale: isListening ? [1, 1.3, 1] : [1, 1.15, 1],
                rotate: [0, 180, 360],
                opacity: isSpeaking ? [0.4, 0.7, 0.4] : [0.25, 0.45, 0.25]
              }}
              transition={{
                duration: state === 'thinking' ? 6 : 14,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(249,115,22,0.4)_0%,_rgba(168,85,247,0.25)_50%,_transparent_80%)]"
            />

            {/* Speaking / Listening Frequency Waves */}
            {(isSpeaking || isListening) && (
              <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-1.5 z-20">
                {[40, 75, 100, 60, 90, 45, 80].map((h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: ['8px', `${h * 0.35}px`, '8px'] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: idx * 0.08,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-gradient-to-t from-orange-400 to-rose-300 rounded-full shadow-[0_0_6px_#f97316]"
                  />
                ))}
              </div>
            )}

            {/* Central Living Mind Icon */}
            <motion.div
              animate={
                state === 'thinking'
                  ? { rotate: 360, scale: [0.95, 1.08, 0.95] }
                  : state === 'speaking'
                  ? { scale: [1, 1.12, 1] }
                  : { scale: [1, 1.04, 1] }
              }
              transition={{
                duration: state === 'thinking' ? 3 : 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 flex flex-col items-center justify-center text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]"
            >
              <IconComponent size={iconSizes} className="transition-all duration-300" />
            </motion.div>

            {/* Mic Overlay Indicator when listening */}
            {isListening && (
              <div className="absolute top-4 right-4 bg-orange-500 text-black p-1.5 rounded-full shadow-lg animate-pulse">
                <Radio size={14} className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      </motion.button>

      {/* State Status Pill */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex flex-col items-center gap-1 text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wide text-orange-200">
            {stateInfo.label}
          </span>
        </div>
        {pulseSubtitle && (
          <p className="text-xs text-white/50 max-w-xs mt-1 leading-relaxed">
            {pulseSubtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};
