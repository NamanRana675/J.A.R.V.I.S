import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { CenterRing } from "./CenterRing";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-jarvis-bg">
        <CenterRing />
        <div className="absolute bottom-1/4 text-jarvis-cyan font-mono animate-pulse">
           SYSTEM INITIALIZING...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-jarvis-bg relative overflow-hidden">
        {/* Background decorative */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-jarvis-cyan to-jarvis-bg pointer-events-none" />
        
        <div className="z-10 flex flex-col items-center">
            <CenterRing />
            <div className="mt-12 text-center">
               <h1 className="text-4xl font-sans tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">JARVIS</h1>
               <p className="text-jarvis-cyan font-mono text-sm tracking-widest mb-8">JUST A RATHER VERY INTELLIGENT SYSTEM</p>
               
               <button 
                 onClick={login}
                 className="px-8 py-3 bg-jarvis-panel border border-jarvis-cyan text-jarvis-cyan font-mono tracking-widest hover:bg-jarvis-cyan hover:text-black transition-all rounded"
               >
                  AUTHORIZE ACCESS
               </button>
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
