import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Plus, Trash2, Tag, Zap, Sparkles, Filter, Calendar, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyTask, TaskCategory, TaskPriority } from '../types';

interface DailyScheduleViewProps {
  tasks: DailyTask[];
  onToggleComplete: (taskId: string) => void;
  onAddTask: (task: Omit<DailyTask, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onRequestAIOptimization: () => void;
  isAiThinking?: boolean;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  tasks,
  onToggleComplete,
  onAddTask,
  onDeleteTask,
  onRequestAIOptimization,
  isAiThinking = false
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState<TaskCategory>('work');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newNotes, setNewNotes] = useState('');

  const handleToggle = (taskId: string, wasCompleted: boolean) => {
    onToggleComplete(taskId);
    if (!wasCompleted) {
      // Trigger festive celebratory confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f97316', '#fbbf24', '#ec4899', '#a855f7']
        });
      } catch {
        // fallback
      }
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      time: newTime || '10:00',
      category: newCategory,
      priority: newPriority,
      completed: false,
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  // Sort tasks by time
  const sortedTasks = [...filteredTasks].sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categoryLabels: Record<TaskCategory, { label: string; color: string }> = {
    work: { label: 'عمل وإنتاج', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    personal: { label: 'شخصي', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    health: { label: 'صحة ورياضة', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    learning: { label: 'تعلّم وثقافة', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    routine: { label: 'روتين يومي', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
  };

  const priorityBadges: Record<TaskPriority, { label: string; dotColor: string }> = {
    high: { label: 'أولوية قصوى', dotColor: 'bg-rose-500 ring-rose-500/30' },
    medium: { label: 'متوسطة', dotColor: 'bg-amber-500 ring-amber-500/30' },
    low: { label: 'مرنة', dotColor: 'bg-blue-500 ring-blue-500/30' }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6 text-right select-none" dir="rtl">
      {/* Top Banner: Progress & Actions */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="text-orange-400" size={20} />
            <h2 className="text-xl font-bold text-white">برنامجك اليومي الحي</h2>
          </div>
          <p className="text-xs text-white/50">
            الجوهرة تتابع إنجازاتك وترتب مهامك خطوة بخطوة. ({completedCount} من {tasks.length} مهام منجزة)
          </p>

          {/* Progress Bar */}
          <div className="w-full md:w-80 h-2.5 bg-white/10 rounded-full overflow-hidden mt-2 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full shadow-[0_0_10px_#f97316]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            id="ai-optimize-schedule-button"
            onClick={onRequestAIOptimization}
            disabled={isAiThinking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-orange-600/30 hover:from-purple-600/40 hover:to-orange-600/40 text-orange-200 border border-orange-500/30 text-xs font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className={isAiThinking ? "animate-spin text-orange-400" : "text-orange-400"} />
            <span>{isAiThinking ? "الجوهرة تفكر..." : "تحليل وترتيب الجدول"}</span>
          </button>

          <button
            id="add-task-modal-button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
          >
            <Plus size={16} />
            <span>إضافة مهمة</span>
          </button>
        </div>
      </div>

      {/* Add Task Form Collapsible */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="glass-panel p-6 rounded-3xl border-orange-500/30 flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-orange-300">إضافة مهمة جديدة للجدول</h3>
              <span className="text-[10px] text-white/40">يمكنك أيضاً طلب ذلك صوتياً من الجوهرة مباشرة</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs text-white/60">عنوان المهمة</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: جلسة قراءة 30 دقيقة / اجتماع فريق العمل"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/60">الوقت المحدد</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 text-center font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/60">التصنيف</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                  className="bg-[#12121a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="work">عمل وإنتاج</option>
                  <option value="personal">شخصي</option>
                  <option value="health">صحة ورياضة</option>
                  <option value="learning">تعلّم وثقافة</option>
                  <option value="routine">روتين يومي</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/60">الأولوية</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="bg-[#12121a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="high">أولوية قصوى</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">مرنة</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs text-white/50 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/25"
              >
                حفظ المهمة في البرنامج
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
          }`}
        >
          الكل ({tasks.length})
        </button>
        {Object.entries(categoryLabels).map(([catKey, info]) => {
          const count = tasks.filter(t => t.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === catKey
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Task List Timeline */}
      <div className="flex flex-col gap-3">
        {sortedTasks.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/30">
              <Calendar size={28} />
            </div>
            <h4 className="text-base font-bold text-white">لا توجد مهام مسجلة هنا</h4>
            <p className="text-xs text-white/40 max-w-sm">
              أخبر الجوهرة بصوتك أو اضغط على "إضافة مهمة" لتنظيم ساعات يومك بكل سهولة.
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const cat = categoryLabels[task.category] || categoryLabels.work;
            const priority = priorityBadges[task.priority] || priorityBadges.medium;

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel p-4 md:p-5 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 ${
                  task.completed ? 'opacity-50 border-white/5 bg-white/[0.02]' : 'hover:border-orange-500/30'
                }`}
              >
                {/* Right: Checkbox & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <button
                    id={`task-toggle-${task.id}`}
                    onClick={() => handleToggle(task.id, task.completed)}
                    className="text-orange-400 hover:text-orange-300 transition-transform active:scale-90 cursor-pointer shrink-0"
                    title={task.completed ? 'إلغاء الإنجاز' : 'تم الإنجاز'}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    ) : (
                      <Circle size={24} className="text-white/30 hover:text-orange-400" />
                    )}
                  </button>

                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-semibold transition-all ${
                      task.completed ? 'line-through text-white/40 font-normal' : 'text-white'
                    }`}>
                      {task.title}
                    </span>

                    <div className="flex items-center gap-3 text-[11px] text-white/40 flex-wrap">
                      {/* Time Tag */}
                      <span className="flex items-center gap-1 font-mono text-orange-300/80 bg-white/5 px-2 py-0.5 rounded-md">
                        <Clock size={11} />
                        <span>{task.time}</span>
                      </span>

                      {/* Category Chip */}
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] ${cat.color}`}>
                        {cat.label}
                      </span>

                      {/* Priority Dot */}
                      <span className="flex items-center gap-1 text-[10px] text-white/50">
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dotColor}`} />
                        <span>{priority.label}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Left: Delete Action */}
                <button
                  id={`delete-task-${task.id}`}
                  onClick={() => onDeleteTask(task.id)}
                  className="text-white/20 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="حذف المهمة"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
