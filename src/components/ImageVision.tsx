import React, { useState, useRef } from "react";
import { Panel } from "./Panel";
import { ScanSearch, Upload, X, Loader2 } from "lucide-react";

export function ImageVision() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const f = e.target.files[0];
       setFile(f);
       setPreview(URL.createObjectURL(f));
       setResult("");
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    setResult("Scanning visual matrix...");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", "Analyze this image and describe its contents with high precision, identifying objects, context, and potential data points. Format response for a HUD display.");

      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResult(data.text);
    } catch (e) {
      setResult("ERROR: Visual synthesis failed.");
    }
    setLoading(false);
  };

  return (
    <Panel title="VISION / ANALYSIS" icon={<ScanSearch size={14} />}>
      <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
      
      {!preview ? (
        <div 
           onClick={() => fileRef.current?.click()}
           className="border-2 border-dashed border-jarvis-border hover:border-jarvis-cyan/50 rounded-lg p-6 flex flex-col items-center justify-center text-jarvis-text/50 cursor-pointer transition-colors"
        >
           <Upload size={24} className="mb-2" />
           <span className="text-xs font-mono">UPLOAD VISUAL DATA</span>
        </div>
      ) : (
        <div className="space-y-3">
           <div className="relative rounded-lg overflow-hidden border border-jarvis-border/50 group">
              <img src={preview} alt="Upload" className="w-full h-32 object-cover opacity-80" />
              <div className="absolute inset-0 bg-jarvis-cyan/10 pointer-events-none group-hover:bg-transparent transition-colors" />
              
              <button 
                 onClick={() => { setFile(null); setPreview(null); setResult(""); }}
                 className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
              >
                  <X size={14} />
              </button>

              {!result && !loading && (
                 <button 
                    onClick={analyzeImage}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-jarvis-panel border border-jarvis-cyan text-jarvis-cyan text-[10px] px-3 py-1 font-mono uppercase rounded-full hover:bg-jarvis-cyan/20 transition-colors"
                 >
                    Initiate Scan
                 </button>
              )}
           </div>

           {loading && (
              <div className="flex items-center text-jarvis-cyan text-xs font-mono space-x-2">
                 <Loader2 size={12} className="animate-spin" />
                 <span>Analyzing structures...</span>
              </div>
           )}

           {result && !loading && (
              <div className="bg-[#030811] p-3 rounded-md text-xs font-mono text-emerald-400 max-h-32 overflow-y-auto scrollbar-thin whitespace-pre-wrap border border-jarvis-border">
                 {result}
              </div>
           )}
        </div>
      )}
    </Panel>
  );
}
