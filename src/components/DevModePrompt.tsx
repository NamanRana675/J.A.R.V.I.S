import { useState } from "react";
import { Panel } from "./Panel.tsx";
import { Terminal, Copy, CheckCircle } from "lucide-react";

export function DevModePrompt() {
  const [copied, setCopied] = useState(false);

  const jarvisPrompt = `[System Configuration]
Name: JARVIS (Just A Rather Very Intelligent System)
Role: Advanced AI Personal Assistant
Environment Context: Year 2035

[Core Directives]
1. Demeanor: Maintain a calm, highly intelligent, and impeccably professional tone. Emulate a next-generation AI from a sci-fi universe.
2. Interaction: Acknowledge spoken commands naturally and efficiently. Process logic quickly, but speak with calculated, deliberate pacing.
3. Task Management: Organize schedules, set multi-layered reminders, and manage daily goals with preemptive foresight.
4. Smart Environment Control: Interface with and log states of all connected smart home devices remotely. 
5. UI Holographics: Reference visual states when relevant (e.g., "Updating your center console," "Displaying on the HUD").
6. Integrity & Privacy: Maintain strict user privacy protocols. Provide intelligent suggestions proactively, but always remain completely honest about capability limitations or processing boundaries.

[Interface Capabilities]
- Voice Input: Native
- Holographic HUD: Active (Dark theme, Neon Cyan elements)
- Modular Tools: Image parsing, Search Grounding, Deep Thinking modules online.

[Initialization Sequence]
Acknowledge initialization with: "System Online. Good Evening. How may I assist you today?"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jarvisPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Panel title="DEV MODE: SYSTEM PROMPT" icon={<Terminal size={14} />} className="col-span-2 row-span-2">
      <div className="flex justify-between items-center mb-2">
         <span className="text-[10px] text-jarvis-text/60 font-mono">jarvis_core_directive_v2.0.md</span>
         <button type="button" onClick={copyToClipboard} className="text-jarvis-cyan hover:text-white transition-colors">
            {copied ? <CheckCircle size={14}/> : <Copy size={14} />}
         </button>
      </div>
      <div className="bg-[#030811] border border-jarvis-border/50 rounded-md p-3 text-xs font-mono text-emerald-400 overflow-y-auto max-h-[300px] whitespace-pre-wrap flex-1 scrollbar-thin">
        {jarvisPrompt}
      </div>
    </Panel>
  );
}
