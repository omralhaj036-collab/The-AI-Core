export type AICoreState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'organizing' | 'learning' | 'sleeping';

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'routine';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface DailyTask {
  id: string;
  title: string;
  time: string; // e.g. "08:30"
  period?: 'morning' | 'afternoon' | 'evening' | 'night';
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export type MemoryCategory = 'habit' | 'preference' | 'schedule' | 'goal' | 'fact' | 'work';

export interface LivingMemoryItem {
  id: string;
  category: MemoryCategory;
  fact: string;
  learnedAt: string;
  confidence: number;
}

export interface UserDailyRoutine {
  userName: string;
  wakeUpTime: string;
  sleepTime: string;
  primeProductivity: string;
  dailyGoal: string;
  energyLevel: number; // 0 to 100
  neuralSync: number; // 0 to 100
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  executedActions?: {
    type: 'ADD_TASK' | 'COMPLETE_TASK' | 'DELETE_TASK' | 'LEARN_MEMORY' | 'UPDATE_ROUTINE';
    summary: string;
  }[];
}

export type TabletTab = 'companion' | 'schedule' | 'memory' | 'chat';
