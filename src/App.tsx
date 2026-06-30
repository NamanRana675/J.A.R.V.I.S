import { useState } from "react";
import { AuthWrapper } from "./components/AuthWrapper.tsx";
import { CenterRing } from "./components/CenterRing.tsx";
import { AgendaPanel } from "./components/AgendaPanel.tsx";
import { SystemOverview, SmartDevices } from "./components/SystemPanels.tsx";
import { ChatCore } from "./components/ChatCore.tsx";
import { ImageVision } from "./components/ImageVision.tsx";
import { DevModePrompt } from "./components/DevModePrompt.tsx";
import { Mic, MessageSquare, ListTodo, Calendar, FolderHeart, CodeXml, ScanSearch, Settings as SettingsIcon } from "lucide-react";
import { auth } from "./lib/firebase.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState("HOME");

  const sidebarLinks = [
    { name: "HOME", icon: <Mic size={20} /> },
    { name: "CHAT", icon: <MessageSquare size={20} /> },
    { name: "TASKS", icon: <ListTodo size={20} /> },
    { name: "SCHEDULE", icon: <Calendar size={20} /> },
    { name: "FILES", icon: <FolderHeart size={20} /> },
    { name: "DEV MODE", icon: <CodeXml size={20} /> },
    { name: "VISION", icon: <ScanSearch size={20} /> },
    { name: "SETTINGS", icon: <SettingsIcon size={20} /> },
  ];

  const now = new Date();



  return (
    <AuthWrapper>
      <div className="h-screen w-screen overflow-hidden flex text-jarvis-text selection:bg-jarvis-cyan/30">
         {/* Sidebar */}
         <div className="w-24 bg-jarvis-panel/50 border-r border-jarvis-border/50 flex flex-col items-center py-6 backdrop-blur-sm z-10">
            <div className="space-y-8 flex-1 w-full mt-10">
               {sidebarLinks.map((link) => (
                 <button type="button"
                   key={link.name} 
                   onClick={() => setActiveTab(link.name)}
                   className={`w-full flex flex-col items-center space-y-2 py-2 transition-colors ${activeTab === link.name ? "text-jarvis-cyan border-r-2 border-jarvis-cyan bg-jarvis-cyan/10" : "text-jarvis-text/60 hover:text-jarvis-cyan"}`}
                 >
                   {link.icon}
                   <span className="text-[10px] font-mono">{link.name}</span>
                 </button>
               ))}
            </div>
         </div>

         {/* Main Content */}
         <div className="flex-1 flex flex-col relative">
            {/* Ambient Background Grid (visual only) */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(var(--color-jarvis-border)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* Top Bar */}
            <header className="flex justify-between items-start mb-6 px-6 pt-6 z-10 w-full">
               <div>
                  <div className="text-[10px] tracking-[0.1em] uppercase text-jarvis-text-dim mb-1">
                     J.A.R.V.I.S. OS v4.2.0
                  </div>
                  <div className="text-2xl font-light text-white">
                     {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/ AM| PM/, '')} 
                     <span className="text-sm text-jarvis-text-dim ml-1">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).slice(-2)}</span>
                  </div>
               </div>
               
               <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[10px] flex items-center gap-1.5 uppercase font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                  SECURE: ENCRYPTED VOICE PROTOCOL ACTIVE
                  {auth.currentUser && (
                     <button type="button" onClick={() => auth.signOut()} className="text-[9px] text-green-400 hover:text-white ml-2 underline underline-offset-2">SIGN OUT</button>
                  )}
               </div>
            </header>

            {/* Dashboard Grid */}
            <main className="flex-1 px-6 pb-6 relative z-10 overflow-hidden">
               <div className="h-full grid grid-cols-[280px_1fr_280px] gap-6">
                  {/* Left Column */}
                  <div className="flex flex-col gap-6 h-full">
                     <AgendaPanel />
                     <DevModePrompt />
                  </div>

                  {/* Center Column */}
                  <div className="flex flex-col relative">
                     <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                        <CenterRing />
                        <div className="text-center mt-8 relative z-10">
                           <div className="text-[14px] text-jarvis-cyan tracking-[0.1em] font-mono mb-1">SYSTEM STABLE</div>
                           <div className="text-[11px] text-white/50">Awaiting your command, Sir.</div>
                        </div>
                     </div>
                     
                     {/* Chat / Voice Input inside Center bottom */}
                     <div className="mb-4">
                        <ChatCore />
                     </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-6 h-full">
                     <SystemOverview />
                     <SmartDevices />
                     <ImageVision />
                  </div>
               </div>
            </main>
         </div>
      </div>
    </AuthWrapper>
  );
}
