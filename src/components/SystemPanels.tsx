import React from "react";
import { Panel } from "./Panel";
import { Activity, Power, Thermometer, ShieldAlert, Wifi, Cpu, Database } from "lucide-react";

export function SystemOverview() {
  const stats = [
    { label: "Power Level", value: "100%", icon: <Power size={14} />, status: "border-emerald-500" },
    { label: "Core Temp", value: "36°C", icon: <Thermometer size={14} />, status: "border-jarvis-cyan" },
    { label: "Security", value: "Secure", icon: <ShieldAlert size={14} />, status: "border-jarvis-cyan" },
    { label: "AI Matrix", value: "Active", icon: <Cpu size={14} />, status: "border-jarvis-cyan" },
    { label: "Connection", value: "Strong", icon: <Wifi size={14} />, status: "border-jarvis-cyan" },
  ];

  return (
    <Panel title="SYSTEM STATUS" icon={<Activity size={14} />} className="row-span-1">
      <div className="space-y-3">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-jarvis-text/80">
              <span className="text-jarvis-cyan">{s.icon}</span>
              <span className="text-xs font-mono">{s.label}</span>
            </div>
            <div className={`text-xs font-mono text-white px-2 py-0.5 border-l-2 ${s.status} bg-[#030811]`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function SmartDevices() {
  const devices = [
    { name: "Living Room Light", state: "ON", isOn: true },
    { name: "Bedroom AC", state: "24°C", isOn: true },
    { name: "Security System", state: "Armed", isOn: true, color: "text-emerald-400" },
    { name: "Media System", state: "ON", isOn: true },
  ];

  return (
    <Panel title="SMART DEVICES" icon={<Database size={14} />} className="row-span-1">
      <div className="flex flex-col gap-2">
        {devices.map((d, i) => (
          <div key={i} className="flex justify-between items-center text-[12px] p-2 bg-white/5 rounded">
            <span className="text-jarvis-text font-sans">{d.name}</span>
            <div className="flex items-center space-x-3">
               <span className={`${d.color || "text-jarvis-text"} font-mono text-[10px] opacity-80`}>{d.state}</span>
               {/* Tiny toggle indicator */}
               <div className={`w-1.5 h-1.5 rounded-full ${d.isOn ? 'bg-jarvis-cyan shadow-[0_0_8px_var(--color-jarvis-cyan)]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
