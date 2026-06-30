import { useState, useRef, useEffect } from "react";
import { Mic, Image as ImageIcon, Send, Loader2 } from "lucide-react";

export function ChatCore() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string; mode?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"standard" | "high-thinking" | "search">("standard");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, mode })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "jarvis", text: data.text }]);
      
      // Auto-TTS for standard replies (skip if super long or just keep it simple)
      if (data.text.length < 500) {
         fetchTTS(data.text);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "jarvis", text: "SYSTEM ERROR: Processing failure." }]);
    }
    setLoading(false);
  };

  const fetchTTS = async (text: string) => {
     try {
       const res = await fetch("/api/tts", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ text })
       });
       const data = await res.json();
       if (data.audio) {
          // Play base64 audio
          setAudioUrl(`data:audio/mp3;base64,${data.audio}`);
       }
     } catch (e) {
       console.error("TTS failed", e);
     }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
       audioRef.current.play().catch(e => console.error("Auto-play blocked", e));
    }
  }, [audioUrl]);

  return (
    <div className="flex flex-col h-full bg-jarvis-panel/40 rounded-xl border border-jarvis-border/40 p-4">
      {/* Hidden audio player */}
      <audio ref={audioRef} src={audioUrl || ""} />

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-jarvis-cyan/30 flex flex-col">
          {messages.length === 0 && (
             <div className="m-auto text-jarvis-text/50 font-mono text-center space-y-2">
                 <div className="text-xl text-jarvis-cyan">JARVIS CORE ONLINE</div>
                 <div className="text-xs">Awaiting primary input...</div>
             </div>
          )}
          {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                 <div className={`p-3 rounded-lg max-w-[80%] text-sm font-sans ${m.role === "user" ? "bg-jarvis-cyan/20 border border-jarvis-cyan/30 text-white" : "bg-[#030811] border border-jarvis-border text-jarvis-text"}`}>
                    {m.text}
                 </div>
             </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="p-3 bg-[#030811] border border-jarvis-border rounded-lg text-jarvis-cyan flex items-center space-x-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs font-mono">PROCESSING...</span>
               </div>
             </div>
          )}
      </div>

      {/* Modes & Input */}
      <div className="flex items-center space-x-2 mb-2">
         <button type="button" onClick={() => setMode("standard")} className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-colors ${mode === "standard" ? "border-jarvis-cyan bg-jarvis-cyan/20 text-jarvis-cyan" : "border-jarvis-border text-jarvis-text/60"}`}>Standard</button>
         <button type="button" onClick={() => setMode("high-thinking")} className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-colors ${mode === "high-thinking" ? "border-purple-500 bg-purple-500/20 text-purple-400" : "border-jarvis-border text-jarvis-text/60"}`}>High Thinking</button>
         <button type="button" onClick={() => setMode("search")} className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-colors ${mode === "search" ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-jarvis-border text-jarvis-text/60"}`}>Network Search</button>
      </div>

      <div className="relative flex items-center bg-jarvis-panel border border-jarvis-border/50 rounded-lg p-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a command or ask something..."
          className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder-jarvis-text/40 font-sans ml-2"
        />
        <div className="flex items-center space-x-3 pr-2">
           <button type="button" title="Upload Image" className="text-jarvis-text/60 hover:text-jarvis-cyan transition-colors">
              <ImageIcon size={18} />
           </button>
           <button type="button"
             onClick={() => setIsListening(!isListening)}
             className={`transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-jarvis-text/60 hover:text-jarvis-cyan"}`}
           >
              <Mic size={18} />
           </button>
           <button type="button" onClick={sendMessage} className="text-jarvis-cyan hover:text-white transition-colors">
              <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}
