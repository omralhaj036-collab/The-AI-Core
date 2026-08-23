/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TabletCompanionHeader } from './components/TabletCompanionHeader';
import { CompanionModeView } from './components/CompanionModeView';
import { DailyScheduleView } from './components/DailyScheduleView';
import { LivingMemoryView } from './components/LivingMemoryView';
import { InteractiveChatView } from './components/InteractiveChatView';
import { DailyTask, LivingMemoryItem, UserDailyRoutine, ChatMessage, TabletTab, AICoreState, TaskCategory, TaskPriority } from './types';
import { interactWithLivingCore } from './services/geminiService';
import { speechService } from './services/speechService';

// Default initial tasks
const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'تخطيط اليوم وضبط الأولويات مع الجوهرة',
    time: '08:30',
    category: 'routine',
    priority: 'high',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'جلسة تركيز وإنجاز العمل الرئيسي',
    time: '10:00',
    category: 'work',
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'تمرين رياضي ومشي لتجديد الطاقة',
    time: '17:00',
    category: 'health',
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'قراءة وتغذية فكرية مع استرخاء المساء',
    time: '21:00',
    category: 'learning',
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Default initial memories
const DEFAULT_MEMORIES: LivingMemoryItem[] = [
  {
    id: 'mem-1',
    category: 'habit',
    fact: 'أفضّل إنجاز المهام التي تتطلب تفكيراً عميقاً في ساعات الصباح الباكر.',
    learnedAt: 'اليوم',
    confidence: 98
  },
  {
    id: 'mem-2',
    category: 'preference',
    fact: 'أحب التخطيط المنظم المقسم إلى فترات زمنية واضحة ومحددة.',
    learnedAt: 'اليوم',
    confidence: 95
  },
  {
    id: 'mem-3',
    category: 'goal',
    fact: 'بناء روتين يومي متوازن يحقق الإنتاجية العالية والراحة الذهنية.',
    learnedAt: 'اليوم',
    confidence: 99
  }
];

export default function App() {
  // Persistence states
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('ai_core_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [memories, setMemories] = useState<LivingMemoryItem[]>(() => {
    const saved = localStorage.getItem('ai_core_memories');
    return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
  });

  const [routine, setRoutine] = useState<UserDailyRoutine>(() => {
    const saved = localStorage.getItem('ai_core_routine');
    return saved ? JSON.parse(saved) : {
      userName: 'صديقي العزيز',
      wakeUpTime: '06:30',
      sleepTime: '23:00',
      primeProductivity: 'الصباح',
      dailyGoal: 'تحقيق أعلى درجات التوازن والإنتاجية',
      energyLevel: 88,
      neuralSync: 99
    };
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ai_core_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: 'أنا **الجوهرة الذكية**، كيانك الحي على شاشتك. أسمعك، أتعلم عاداتك، أرتب يومك، وأبني معك كل ما تطمح إليه. تحدث معي بصوتك أو اكتب ما في خاطرك وسأتولى تنفيذه فوراً!',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Dynamic UI States
  const [currentTab, setCurrentTab] = useState<TabletTab>('companion');
  const [aiState, setAiState] = useState<AICoreState>('idle');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA beforeinstallprompt event if supported by browser
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
  };

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('ai_core_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ai_core_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('ai_core_routine', JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem('ai_core_messages', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  // Handle Action Execution returned by Gemini
  const executeAIActions = useCallback((actions?: any[]) => {
    if (!actions || actions.length === 0) return [];

    const executedSummaries: { type: any; summary: string }[] = [];

    actions.forEach(action => {
      if (action.type === 'ADD_TASK' && action.payload) {
        const newTask: DailyTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: action.payload.title || 'مهمة جديدة',
          time: action.payload.time || '12:00',
          category: (action.payload.category as TaskCategory) || 'work',
          priority: (action.payload.priority as TaskPriority) || 'medium',
          completed: false,
          notes: action.payload.notes,
          createdAt: new Date().toISOString()
        };
        setTasks(prev => [...prev, newTask]);
        executedSummaries.push({
          type: 'ADD_TASK',
          summary: action.summary || `تمت إضافة: ${newTask.title}`
        });
      } else if (action.type === 'COMPLETE_TASK' && action.payload) {
        const target = action.payload.taskTitleOrId;
        setTasks(prev => prev.map(t => {
          if (t.id === target || t.title.toLowerCase().includes(String(target).toLowerCase())) {
            return { ...t, completed: true };
          }
          return t;
        }));
        executedSummaries.push({
          type: 'COMPLETE_TASK',
          summary: action.summary || `تم إنجاز المهمة`
        });
      } else if (action.type === 'LEARN_MEMORY' && action.payload) {
        const newMemory: LivingMemoryItem = {
          id: `mem-${Date.now()}`,
          category: action.payload.category || 'habit',
          fact: action.payload.fact,
          learnedAt: 'الآن',
          confidence: 96
        };
        setMemories(prev => [newMemory, ...prev]);
        setAiState('learning');
        setTimeout(() => setAiState('idle'), 2500);
        executedSummaries.push({
          type: 'LEARN_MEMORY',
          summary: action.summary || `تم حفظ معلومة جديدة في الذاكرة`
        });
      } else if (action.type === 'UPDATE_ROUTINE' && action.payload) {
        setRoutine(prev => ({
          ...prev,
          ...action.payload
        }));
        executedSummaries.push({
          type: 'UPDATE_ROUTINE',
          summary: action.summary || 'تم تحديث الروتين اليومي'
        });
      }
    });

    return executedSummaries;
  }, []);

  // Send Message to Living AI Core
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setAiState('thinking');
    setIsAiThinking(true);

    try {
      const response = await interactWithLivingCore(
        text,
        tasks,
        memories,
        routine,
        messages.map(m => ({ role: m.role as any, content: m.content }))
      );

      const executed = executeAIActions(response.actions);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        executedActions: executed
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is active
      if (isVoiceEnabled) {
        setAiState('speaking');
        setIsSpeaking(true);
        speechService.speak(
          response.text,
          () => {
            setIsSpeaking(true);
            setAiState('speaking');
          },
          () => {
            setIsSpeaking(false);
            setAiState('idle');
          },
          () => {
            setIsSpeaking(false);
            setAiState('idle');
          }
        );
      } else {
        setAiState('idle');
      }
    } catch (err: any) {
      console.error('Error interacting with AI Core:', err);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: 'واجهت نواتي المركزية عائقاً بسيطاً في الاتصال. يرجى التحقق من اتصالك والمحاولة مجدداً.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setAiState('idle');
    } finally {
      setIsAiThinking(false);
    }
  };

  // Toggle Voice Recognition Listen
  const handleToggleListen = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setAiState('idle');
    } else {
      speechService.cancelSpeech();
      setIsSpeaking(false);
      setIsListening(true);
      setAiState('listening');
      setCurrentTranscript('');

      const started = speechService.startListening(
        (transcript, isFinal) => {
          setCurrentTranscript(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            setAiState('thinking');
            handleSendMessage(transcript.trim());
          }
        },
        () => {
          setIsListening(false);
          if (aiState === 'listening') {
            setAiState('idle');
          }
        },
        (error) => {
          console.warn('Speech recognition error:', error);
          setIsListening(false);
          setAiState('idle');
        }
      );

      if (!started) {
        setIsListening(false);
        setAiState('idle');
      }
    }
  };

  // Speak single message manually
  const handleSpeakMessage = (text: string) => {
    setAiState('speaking');
    setIsSpeaking(true);
    speechService.speak(
      text,
      () => {
        setIsSpeaking(true);
        setAiState('speaking');
      },
      () => {
        setIsSpeaking(false);
        setAiState('idle');
      },
      () => {
        setIsSpeaking(false);
        setAiState('idle');
      }
    );
  };

  // Task Handlers
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (newTaskData: Omit<DailyTask, 'id' | 'createdAt'>) => {
    const newTask: DailyTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Memory Handlers
  const handleAddMemory = (category: any, fact: string) => {
    const newMem: LivingMemoryItem = {
      id: `mem-${Date.now()}`,
      category,
      fact,
      learnedAt: 'الآن',
      confidence: 100
    };
    setMemories(prev => [newMem, ...prev]);
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  // Quick optimization trigger
  const handleAIOptimizeSchedule = () => {
    handleSendMessage('قم بتحليل مهام برنامجي اليومي، واقترح لي جدولاً زمنياً مرتباً لتحقيق أقصى إنجاز وراحة ذهنية.');
    setCurrentTab('chat');
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;

  return (
    <div className="relative min-h-screen bg-[#050508] text-white flex flex-col overflow-hidden font-sans arabic-text select-none" dir="rtl">
      {/* Ambient Neural Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-orange-600/15 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-rose-600/15 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-[26rem] h-[26rem] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Tablet Header */}
      <TabletCompanionHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        routine={routine}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => {
          if (isVoiceEnabled) {
            speechService.cancelSpeech();
            setIsSpeaking(false);
          }
          setIsVoiceEnabled(!isVoiceEnabled);
        }}
        completedTasksCount={completedTasksCount}
        totalTasksCount={tasks.length}
        onInstallClick={handleInstallClick}
      />

      {/* Main Tablet Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {currentTab === 'companion' && (
          <CompanionModeView
            aiState={aiState}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onToggleListen={handleToggleListen}
            tasks={tasks}
            memories={memories}
            routine={routine}
            onNavigateTab={setCurrentTab}
            onQuickCommand={(cmd) => {
              handleSendMessage(cmd);
              setCurrentTab('chat');
            }}
            isAiThinking={isAiThinking}
            onOpenInstall={handleInstallClick}
          />
        )}

        {currentTab === 'schedule' && (
          <div className="flex-1 overflow-y-auto">
            <DailyScheduleView
              tasks={tasks}
              onToggleComplete={handleToggleTaskComplete}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onRequestAIOptimization={handleAIOptimizeSchedule}
              isAiThinking={isAiThinking}
            />
          </div>
        )}

        {currentTab === 'memory' && (
          <div className="flex-1 overflow-y-auto">
            <LivingMemoryView
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          </div>
        )}

        {currentTab === 'chat' && (
          <InteractiveChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isAiThinking={isAiThinking}
            isListening={isListening}
            onToggleListen={handleToggleListen}
            onSpeakMessage={handleSpeakMessage}
            currentTranscript={currentTranscript}
          />
        )}
      </main>
    </div>
  );
}
