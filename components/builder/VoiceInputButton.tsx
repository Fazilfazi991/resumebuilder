"use client";

import { Mic, MicOff } from "lucide-react";
import { useMemo, useState } from "react";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const languageOptions = [
  { value: "en-US", label: "EN" },
  { value: "ml-IN", label: "ML" },
  { value: "hi-IN", label: "HI" },
  { value: "ar-AE", label: "AR" },
];

export function VoiceInputButton({ onTranscript, compact = false }: { onTranscript: (text: string) => void; compact?: boolean }) {
  const [language, setLanguage] = useState("en-US");
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");

  const isSupported = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      setMessage("Voice input is not supported in this browser.");
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, index) => event.results[index][0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        onTranscript(transcript);
        setMessage("Voice added.");
      }
    };
    recognition.onerror = () => {
      setMessage("Could not capture voice.");
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    setMessage("");
    setIsRecording(true);
    recognition.start();
  };

  return (
    <span className="inline-flex items-center gap-1">
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className={`${compact ? "h-9 w-14 text-[11px]" : "h-10 w-16 text-xs"} rounded-lg border border-slate-200 bg-white px-1 font-bold text-slate-600 outline-none focus:border-teal-400`}
        aria-label="Voice input language"
        title={message || "Voice input language"}
      >
        {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <button
        type="button"
        onClick={startListening}
        className={`${compact ? "h-9 w-9" : "h-10 w-10"} inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700`}
        aria-label={isRecording ? "Listening" : "Start voice input"}
        title={message || (isSupported ? "Start voice input" : "Voice input is not supported in this browser")}
      >
        {isRecording ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
      </button>
    </span>
  );
}
