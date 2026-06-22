import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Panel } from "./Panel";
import { Calendar, Plus, Trash2 } from "lucide-react";

export function AgendaPanel() {
  const [tasks, setTasks] = useState<{ id: string; title: string; time: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/agenda`), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
       const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
       setTasks(docs);
       setLoading(false);
    });
    return unsub;
  }, []);

  const addTask = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!newTask.trim() || !auth.currentUser) return;
     try {
       await addDoc(collection(db, `users/${auth.currentUser.uid}/agenda`), {
          title: newTask,
          time: newTime || "TBD",
          createdAt: serverTimestamp()
       });
       setNewTask("");
       setNewTime("");
     } catch (e) {
       console.error("Error adding task", e);
     }
  };

  return (
    <Panel title="TODAY'S AGENDA" icon={<Calendar size={14} />} className="row-span-2">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin">
           {loading ? (
             <div className="text-xs font-mono text-jarvis-text/50">Syncing...</div>
           ) : tasks.length === 0 ? (
             <div className="text-xs font-mono text-jarvis-text/50">No events scheduled.</div>
           ) : (
             tasks.map(t => (
               <div key={t.id} className="mb-3">
                  <div className="text-[10px] text-jarvis-text-dim font-mono">{t.time}</div>
                  <div className="text-[13px] font-medium text-white">{t.title}</div>
               </div>
             ))
           )}
        </div>

        <form onSubmit={addTask} className="border-t border-jarvis-border pt-3 space-y-2">
           <div className="flex space-x-2">
              <input 
                 type="text" 
                 value={newTime} 
                 onChange={e => setNewTime(e.target.value)} 
                 placeholder="00:00"
                 className="w-16 bg-[#030811] text-xs font-mono border border-jarvis-border rounded px-2 py-1 text-jarvis-text outline-none focus:border-jarvis-cyan"
              />
              <input 
                 type="text" 
                 value={newTask} 
                 onChange={e => setNewTask(e.target.value)} 
                 placeholder="New entry..."
                 className="flex-1 bg-[#030811] text-xs font-mono border border-jarvis-border rounded px-2 py-1 text-jarvis-text outline-none focus:border-jarvis-cyan"
              />
              <button 
                 type="submit"
                 className="bg-jarvis-cyan/20 border border-jarvis-cyan text-jarvis-cyan rounded p-1 hover:bg-jarvis-cyan hover:text-black transition-colors"
              >
                 <Plus size={14} />
              </button>
           </div>
        </form>
      </div>
    </Panel>
  );
}
