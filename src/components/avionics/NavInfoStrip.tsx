export const NavInfoStrip = () => {
  return (
    <div className="flex items-center bg-avionics-panel border-b border-avionics-divider px-3 py-1.5 gap-4">
      {/* DTK */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-avionics-label">DTK</span>
        <span className="font-mono text-lg text-avionics-magenta avionics-glow-magenta font-bold">
          315°
        </span>
      </div>

      {/* Distance / ETE */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-avionics-green avionics-glow-green">42</span>
        <div className="flex flex-col">
          <span className="font-mono text-xs text-avionics-cyan">3000<span className="text-[9px] text-avionics-label ml-0.5">FT</span></span>
          <span className="font-mono text-xs text-avionics-white">KMRY</span>
        </div>
      </div>

      {/* Bearing info */}
      <div className="flex items-center gap-1">
        <span className="font-mono text-sm text-avionics-green">15</span>
      </div>

      {/* TRK UP label */}
      <div className="ml-auto">
        <span className="text-[10px] text-avionics-label">TRK UP</span>
      </div>
    </div>
  );
};
