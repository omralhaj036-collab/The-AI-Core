import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Plus, Trash2, ShieldCheck, Heart, Moon, Target, Lightbulb, Clock } from 'lucide-react';
import { LivingMemoryItem, MemoryCategory } from '../types';

interface LivingMemoryViewProps {
  memories: LivingMemoryItem[];
  onAddMemory: (category: MemoryCategory, fact: string) => void;
  onDeleteMemory: (memoryId: string) => void;
}

export const LivingMemoryView: React.FC<LivingMemoryViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('habit');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    onAddMemory(newCategory, newFact.trim());
    setNewFact('');
    setShowAddForm(false);
  };

  const categoryMeta: Record<MemoryCategory, { label: string; icon: any; color: string }> = {
    habit: { label: 'عادة يومية', icon: Heart, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    preference: { label: 'تفضيل شخصي', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    schedule: { label: 'مواعيد وروتين', icon: Clock, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    goal: { label: 'هدف وطموح', icon: Target, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    fact: { label: 'معلومة عامة', icon: Brain, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    work: { label: 'طبيعة العمل', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6 text-right select-none" dir="rtl">
      {/* Memory Top Banner */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Brain className="text-purple-400" size={22} />
            <h2 className="text-xl font-bold text-white">الذاكرة العصبية الحية</h2>
          </div>
          <p className="text-xs text-white/50 max-w-lg">
            هنا يتم تخزين كل ما تتعلمه الجوهرة عنك من محادثاتك وروتينك وتفضيلاتك لتصبح أكثر فهماً وقرباً منك مع كل يوم.
          </p>
        </div>

        <button
          id="add-memory-button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/25 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>علّم الجوهرة معلومة</span>
        </button>
      </div>

      {/* Add Memory Modal/Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="glass-panel p-6 rounded-3xl border-purple-500/30 flex flex-col gap-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-purple-300">تعليم الكيان معلومة أو تفضيلاً جديداً</h3>
              <span className="text-[10px] text-white/40">تستطيع أيضاً قول ذلك مباشرة بصوتك أثناء الحديث</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs text-white/60">ماذا تريد أن تتذكر الجوهرة عنك؟</label>
                <input
                  type="text"
                  required
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  placeholder="مثال: أحب شرب القهوة قبل بدء العمل / أفضّل الاجتماعات بعد الظهر"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/60">نوع المعلومة</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                  className="bg-[#12121a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="habit">عادة يومية</option>
                  <option value="preference">تفضيل شخصي</option>
                  <option value="schedule">مواعيد وروتين</option>
                  <option value="goal">هدف وطموح</option>
                  <option value="work">طبيعة عمل</option>
                  <option value="fact">معلومة عامة</option>
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
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/25"
              >
                ترسيخ في الذاكرة
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/30">
              <Sparkles size={28} />
            </div>
            <h4 className="text-base font-bold text-white">ذاكرة الجوهرة تنتظر التعرف عليك</h4>
            <p className="text-xs text-white/40 max-w-sm">
              تحدث معها بحرية، وأخبرها عن روتينك وما تحب، وسترى كيف تبدأ في حفظ وتخصيص كل رد لأجلك.
            </p>
          </div>
        ) : (
          memories.map((mem) => {
            const meta = categoryMeta[mem.category] || categoryMeta.fact;
            const Icon = meta.icon;

            return (
              <motion.div
                key={mem.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between gap-4 border-white/5 hover:border-purple-500/30 transition-all duration-300 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${meta.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-semibold text-purple-300">
                      {meta.label}
                    </span>
                  </div>

                  <button
                    id={`delete-memory-${mem.id}`}
                    onClick={() => onDeleteMemory(mem.id)}
                    className="text-white/20 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="حذف من الذاكرة"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-sm font-medium text-white/90 leading-relaxed">
                  "{mem.fact}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
                  <span>تم التعلم: {mem.learnedAt}</span>
                  <span className="text-emerald-400 font-mono">دقة الثقة: {mem.confidence}%</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
