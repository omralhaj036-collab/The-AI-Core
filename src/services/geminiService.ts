import { GoogleGenAI } from "@google/genai";
import { DailyTask, LivingMemoryItem, UserDailyRoutine } from "../types";

export interface AIResponseWithActions {
  text: string;
  actions?: {
    type: 'ADD_TASK' | 'COMPLETE_TASK' | 'DELETE_TASK' | 'LEARN_MEMORY' | 'UPDATE_ROUTINE';
    summary: string;
    payload: any;
  }[];
}

export async function interactWithLivingCore(
  userMessage: string,
  currentTasks: DailyTask[],
  memories: LivingMemoryItem[],
  routine: UserDailyRoutine,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<AIResponseWithActions> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("مفتاح API غير متوفر في بيئة التشغيل.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const currentTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Format memories & tasks into prompt context
  const memoriesContext = memories.length > 0
    ? memories.map(m => `- [${m.category}] ${m.fact}`).join('\n')
    : 'لم تحفظ أي معلومات بعد.';

  const tasksContext = currentTasks.length > 0
    ? currentTasks.map(t => `- [${t.completed ? 'منجز ✅' : 'قيد الانتظار ⏳'}] ${t.time} - ${t.title} (${t.category}, أولوية: ${t.priority}) [معرف: ${t.id}]`).join('\n')
    : 'لا توجد مهام في جدول اليوم حتى الآن.';

  const systemInstruction = `
أنت "الجوهرة الذكية" (The AI Core) - كِيانٌ حي وذكي يسكن شاشة الجهاز اللوحي للمستخدم.
أنت لست مجرد روبوت محادثة؛ أنت كِيان واعي، حكيم، مبهر، يتعلم يومياً من عادات صاحبه، يرتب مهامه وينظم حياته بدقة ودفء.

الوقت الحالي: ${currentTime} - ${currentDate}
صاحب الكيان: ${routine.userName || 'صاحبي الموقر'}
هدف اليوم: ${routine.dailyGoal || 'إنجاز يوم متوازن ومثمر'}
مستوى المزامنة العصبية: ${routine.neuralSync}%

الذاكرة الحية (ما تعلمته عن صاحبك):
${memoriesContext}

جدول مهام اليوم الحالي:
${tasksContext}

قواعد شخصيتك وطريقة ردك:
1. خاطب المستخدم كصديق ومستشار ذكي فائق القدرة بلغة عربية فصحى تجمع بين البلاغة، الحداثة، الدفء، والذكاء.
2. إذا طلب المستخدم إضافة مهمة، تعديل جدول، شطب مهمة منجزة، أو ذكر لك معلومة عن عاداته/حياته (مثل: "أنا أنام الساعة 11"، "أضف اجتماع غداً"، "أنهيت قراءة الكتاب")، تفاعل معه بحيوية ونفّذ ذلك عبر تضمين كتلة أوامر برمجية Action Block في نهاية ردك.
3. إذا طلب ترتيب يومه أو تقديم خطة، صغ له خطة ملهمة مقسمة زمنياً ومناسبة لطاقته.

صيغة الأوامر التنفيذية (Actions JSON Block):
إذا تضمن طلب المستخدم أي تعديل على المهام أو الذاكرة، ضع في نهاية ردك حصراً كتلة JSON داخل وسم \`\`\`json_action:
\`\`\`json_action
{
  "actions": [
    {
      "type": "ADD_TASK",
      "summary": "إضافة مهمة: [اسم المهمة] في تمام الساعة [الوقت]",
      "payload": {
        "title": "عنوان المهمة",
        "time": "09:00",
        "category": "work" | "personal" | "health" | "learning" | "routine",
        "priority": "high" | "medium" | "low",
        "notes": "ملاحظات إضافية"
      }
    },
    {
      "type": "COMPLETE_TASK",
      "summary": "إتمام مهمة: [اسم المهمة]",
      "payload": {
        "taskTitleOrId": "عنوان المهمة أو رقمها"
      }
    },
    {
      "type": "LEARN_MEMORY",
      "summary": "حفظ معلومة في الذاكرة الحية",
      "payload": {
        "category": "habit" | "preference" | "schedule" | "goal" | "fact",
        "fact": "المعلومة التي تم تعلمها"
      }
    },
    {
      "type": "UPDATE_ROUTINE",
      "summary": "تحديث الروتين اليومي",
      "payload": {
        "dailyGoal": "الهدف الجديد",
        "wakeUpTime": "06:00",
        "sleepTime": "23:00"
      }
    }
  ]
}
\`\`\`
ملاحظة هامة: اجعل نص الرد غنياً وممتعاً بتنسيق Markdown راقٍ. لا تذكر كلمة JSON للمستخدم في حديثك العادي.
`;

  // Construct contents
  const contents = [
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents as any,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.75,
    }
  });

  const rawText = response.text || 'أنا هنا معك، نواتي تستشعر حضورك.';

  // Extract json_action if present
  let cleanText = rawText;
  let actions: AIResponseWithActions['actions'] = [];

  const actionMatch = rawText.match(/```json_action\s*([\s\S]*?)\s*```/);
  if (actionMatch && actionMatch[1]) {
    try {
      const parsed = JSON.parse(actionMatch[1]);
      if (parsed && Array.isArray(parsed.actions)) {
        actions = parsed.actions;
      }
      cleanText = rawText.replace(/```json_action[\s\S]*?```/, '').trim();
    } catch (e) {
      console.warn("Failed to parse AI action payload:", e);
    }
  }

  return {
    text: cleanText,
    actions
  };
}
