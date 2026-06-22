import React from "react";
import { cn } from "../lib/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Panel({ className, title, icon, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-jarvis-border bg-jarvis-panel p-4 backdrop-blur-md relative overflow-hidden flex flex-col",
        className
      )}
      {...props}
    >
      {title && (
        <div className="flex items-center space-x-2 text-jarvis-cyan text-[11px] uppercase tracking-wider mb-3 w-full after:content-[''] after:h-px after:flex-grow after:bg-jarvis-border after:ml-3">
          {icon && <span className="opacity-80">{icon}</span>}
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
