import { useState, useRef } from "react";
import api from "@/lib/api/axios-instance";

export function useAudioRecorder(onResult: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Audio recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob);
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");
        try {
          const res = await api.post(
            "/api/interview/speech-to-text",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          const data = res.data;
          if (data.text) {
            onResult(data.text);
          }
        } catch {
          alert("Failed to upload audio");
        } finally {
          setIsUploading(false);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return {
    isRecording,
    isUploading,
    audioRef,
    startRecording,
    stopRecording,
  };
}
