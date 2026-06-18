"use client";

import { AppButton } from "@/components/app/AppButton";
import type { ResumeData } from "@/types/resume";
import { Bot, ChevronLeft, ChevronRight, RotateCcw, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type AssistantQuestion = {
  key: "summary" | "experience" | "skills" | "projects" | "education";
  question: string;
  quickReplies: string[];
};

const questions: AssistantQuestion[] = [
  {
    key: "summary",
    question: "What role are you targeting, and what is your strongest professional value?",
    quickReplies: ["Product manager with SaaS growth experience", "Fresh graduate ready for an entry-level role", "Sales professional focused on revenue growth"],
  },
  {
    key: "experience",
    question: "Share one recent role, responsibility, or result you want highlighted.",
    quickReplies: ["Led a team project", "Improved a workflow", "Increased sales or conversions"],
  },
  {
    key: "skills",
    question: "List the skills you want recruiters to notice first.",
    quickReplies: ["Communication, Excel, CRM, teamwork", "React, TypeScript, Node.js, SQL", "Sales, negotiation, lead generation"],
  },
  {
    key: "projects",
    question: "Mention one project, portfolio item, or academic work that proves your ability.",
    quickReplies: ["Built a dashboard", "Completed a capstone project", "Launched a campaign"],
  },
  {
    key: "education",
    question: "Add an education highlight, certification, or training detail.",
    quickReplies: ["Bachelor degree with project work", "Google certification", "Diploma with internship"],
  },
];

export function ResumeAssistant({
  data,
  setData,
  onPreview,
}: {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onPreview?: () => void;
}) {
  const [mode, setMode] = useState<"chat" | "guided">("chat");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: "hello", role: "assistant", content: "Tell me what you want to improve. I can collect the details here and apply them to your resume draft." },
  ]);
  const [status, setStatus] = useState("");

  const currentQuestion = questions[step];
  const progress = useMemo(() => Math.round(((step + 1) / questions.length) * 100), [step]);

  const addAnswer = (value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue) {
      return;
    }
    setAnswers((current) => ({ ...current, [currentQuestion.key]: cleanValue }));
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: cleanValue },
      { id: `assistant-${Date.now()}`, role: "assistant", content: step < questions.length - 1 ? questions[step + 1].question : "Nice. I can apply these details to the resume draft now." },
    ]);
    setInput("");
    setStatus("");
    setStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const applyAnswers = () => {
    setData((current) => {
      const skillNames = splitList(answers.skills);
      return {
        ...current,
        summary: answers.summary || current.summary,
        experience: answers.experience
          ? current.experience.map((item, index) => index === 0 ? { ...item, description: answers.experience, bullets: [answers.experience, ...item.bullets.filter(Boolean)].slice(0, 4) } : item)
          : current.experience,
        projects: answers.projects
          ? current.projects.map((item, index) => index === 0 ? { ...item, description: answers.projects, bullets: [answers.projects, ...item.bullets.filter(Boolean)].slice(0, 3) } : item)
          : current.projects,
        education: answers.education
          ? current.education.map((item, index) => index === 0 ? { ...item, description: answers.education } : item)
          : current.education,
        skills: skillNames.length
          ? skillNames.map((name, index) => ({ id: `assistant-skill-${index}`, name, level: "Intermediate" }))
          : current.skills,
      };
    });
    setStatus("Applied to resume.");
    onPreview?.();
  };

  const restart = () => {
    setStep(0);
    setInput("");
    setAnswers({});
    setStatus("");
    setMessages([{ id: "hello", role: "assistant", content: questions[0].question }]);
  };

  return (
    <section className="flex h-full min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Bot size={20} aria-hidden="true" /></span>
            <div>
              <h2 className="font-bold text-slate-950">Resume Assistant</h2>
              <p className="text-xs font-semibold text-slate-500">Draft helper, no AI API yet</p>
            </div>
          </div>
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-xs font-bold">
            {(["chat", "guided"] as const).map((option) => (
              <button key={option} onClick={() => setMode(option)} className={`rounded-md px-3 py-2 capitalize ${mode === option ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"}`}>{option}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {mode === "chat" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${message.role === "assistant" ? "bg-slate-100 text-slate-700" : "ml-auto bg-teal-700 text-white"}`}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{currentQuestion.question}</p>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {currentQuestion.quickReplies.map((reply) => (
                <button key={reply} onClick={() => addAnswer(reply)} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">{reply}</button>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type an answer" className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-400" />
              <button onClick={() => addAnswer(input)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white"><Send size={16} />Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">Question {step + 1} of {questions.length}</p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{currentQuestion.question}</h3>
          </div>
          <label className="mt-4 block flex-1">
            <span className="mb-2 block text-sm font-bold text-slate-700">Your answer</span>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={8} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-teal-400" />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-slate-200 text-sm font-bold text-slate-600"><ChevronLeft size={16} />Back</button>
            <button onClick={() => { setInput(""); setStep((current) => Math.min(questions.length - 1, current + 1)); }} className="min-h-11 rounded-lg border border-slate-200 text-sm font-bold text-slate-600">Skip</button>
            <button onClick={() => addAnswer(input)} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-teal-200 bg-teal-50 text-sm font-bold text-teal-700">Next<ChevronRight size={16} /></button>
            <button onClick={applyAnswers} className="min-h-11 rounded-lg bg-teal-700 text-sm font-bold text-white">Apply</button>
          </div>
        </div>
      )}

      <div className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto]">
        <p className="flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600"><Sparkles size={16} className="text-teal-700" />{status || `${Object.keys(answers).length} answers collected`}</p>
        <AppButton variant="secondary" onClick={restart}><RotateCcw size={16} />Restart</AppButton>
        <AppButton onClick={applyAnswers}>Apply to Resume</AppButton>
      </div>
    </section>
  );
}

function splitList(value = "") {
  return value.split(/,|\n/).map((item) => item.trim()).filter(Boolean);
}
