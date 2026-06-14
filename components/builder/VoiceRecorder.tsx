"use client";

import { Mic, PauseCircle, Play, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VoiceRecorderProps = {
  compact?: boolean;
  onAudioReady?: (blob: Blob, url: string) => void;
};

export function VoiceRecorder({ compact = false, onAudioReady }: VoiceRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [message, setMessage] = useState("");

  const supported = typeof window !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== "undefined";

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [audioUrl]);

  const start = async () => {
    if (!supported) {
      setMessage("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return url;
        });
        onAudioReady?.(blob, url);
        stream.getTracks().forEach((track) => track.stop());
        setMessage("Audio recorded. Transcription will be available soon.");
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setAudioUrl("");
      setMessage("");
      setSeconds(0);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    } catch (error) {
      console.error(error);
      setMessage("Microphone permission was blocked or unavailable.");
      setIsRecording(false);
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRecording(false);
  };

  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setSeconds(0);
    setMessage("");
  };

  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${compact ? "p-2" : "p-3"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={isRecording ? stop : start}
          className={`${compact ? "h-10 px-3" : "min-h-11 px-4"} inline-flex items-center justify-center gap-2 rounded-lg ${isRecording ? "bg-rose-600" : "bg-slate-900"} text-sm font-bold text-white`}
        >
          {isRecording ? <PauseCircle size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}
          {isRecording ? "Stop" : "Record"}
        </button>
        <span className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold ${isRecording ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-600"}`}>
          {isRecording ? <span className="h-2 w-2 animate-pulse rounded-full bg-rose-600" /> : null}
          {formatTime(seconds)}
        </span>
        {audioUrl ? (
          <>
            <button type="button" onClick={remove} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-600">
              <Trash2 size={15} aria-hidden="true" />
              Delete
            </button>
            <button type="button" disabled className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-400">
              <RotateCcw size={15} aria-hidden="true" />
              Transcribe audio
            </button>
          </>
        ) : null}
      </div>
      {audioUrl ? (
        <div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 p-2">
          <Play size={15} className="shrink-0 text-slate-500" aria-hidden="true" />
          <audio src={audioUrl} controls className="min-w-0 flex-1" />
        </div>
      ) : null}
      {message ? <p className="mt-2 text-xs font-semibold text-slate-600">{message}</p> : null}
      {!supported ? <p className="mt-2 text-xs font-semibold text-amber-700">Use a browser with MediaRecorder support for audio recording.</p> : null}
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
