import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchOrder: (prompt: string) => Promise<void>;
  isLoading: boolean;
  lastAgentSummary?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onDispatchOrder,
  isLoading,
  lastAgentSummary
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Presiona el micrófono para hablar con Curto\'s AI');
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-MX'; // Mexican / Latin American Spanish for tec.mx user

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Escuchando... Háblale a Curto\'s AI');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setStatusMessage(`Micrófono: ${event.error === 'not-allowed' ? 'Permiso denegado' : 'Sin señal de audio'}. Puedes escribir abajo.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
      setStatusMessage('Reconocimiento de voz no soportado por este navegador. Usa el teclado.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Text-To-Speech function
  const speakResponse = (text: string) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis warning:', e);
    }
  };

  useEffect(() => {
    if (lastAgentSummary && !isLoading && !isVoiceMuted) {
      speakResponse(lastAgentSummary);
    }
  }, [lastAgentSummary, isLoading, isVoiceMuted]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Error starting speech:', err);
      }
    }
  };

  const handleSendVoiceOrder = async () => {
    if (!transcript.trim() || isLoading) return;
    const command = transcript.trim();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    await onDispatchOrder(command);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curto's Neural Voice Engine • 2026</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Asistente de Voz Neuronal
          </h2>
          <p className="text-xs text-slate-400">
            Controla tu ordenador, gestiona tus correos y lanza tareas hablándole naturalmente a Curto's AI.
          </p>
        </div>

        {/* Pulsing Audio Waveform Visualizer */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={toggleListening}
            disabled={!speechSupported || isLoading}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition shadow-2xl cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 scale-110 shadow-rose-500/50'
                : 'bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 hover:scale-105 shadow-indigo-500/30'
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-75" />
            )}
            <Mic className={`w-10 h-10 text-white ${isListening ? 'animate-bounce' : ''}`} />
          </button>

          {/* Soundwave bars */}
          <div className="flex items-center gap-1 h-8">
            {[40, 70, 95, 60, 85, 100, 75, 50, 80, 45, 90, 65].map((height, idx) => (
              <span
                key={idx}
                style={{ height: isListening ? `${height}%` : '20%' }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isListening ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-medium text-slate-300">{statusMessage}</p>
        </div>

        {/* Live Transcript Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Transcripción en directo:</span>
            <button
              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isVoiceMuted ? 'Voz silenciada' : 'Voz activa'}</span>
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Lo que digas aparecerá aquí... (o escribe directamente si prefieres)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none resize-none h-20"
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleSendVoiceOrder}
              disabled={isLoading || !transcript.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg transition disabled:opacity-40 cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Ejecutando...' : 'Ejecutar Orden por Voz'}</span>
            </button>
          </div>
        </div>

        {/* Last Audio Response pill */}
        {lastAgentSummary && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-left text-xs text-slate-300 flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Última Respuesta de Curto's AI:</span>
              <span className="text-slate-300 text-[11px] line-clamp-2">{lastAgentSummary}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
