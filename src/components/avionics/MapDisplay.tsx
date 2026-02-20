export const MapDisplay = () => {
  return (
    <div className="flex-1 relative bg-avionics-inset avionics-inset-shadow overflow-hidden">
      {/* Compass rose simulation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[280px] h-[280px] rounded-full border border-avionics-divider/40 relative">
          {/* Compass ring */}
          <div className="absolute inset-2 rounded-full border border-avionics-divider/30" />
          <div className="absolute inset-8 rounded-full border border-avionics-divider/20" />

          {/* Cardinal directions */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-avionics-white">N</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-avionics-white">S</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-mono text-[10px] text-avionics-white">W</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[10px] text-avionics-white">E</span>

          {/* Center aircraft symbol */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-avionics-white">
              <path d="M12 2L12 22M12 2L8 8M12 2L16 8M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Course line */}
          <div className="absolute top-1/2 left-1/2 w-[2px] h-[120px] bg-avionics-magenta/70 -translate-x-1/2 -translate-y-full origin-bottom rotate-[-45deg]" />
        </div>
      </div>

      {/* Waypoints */}
      <div className="absolute top-[35%] right-[25%] flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-avionics-cyan">
          <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="font-mono text-[10px] text-avionics-cyan">GIRVY</span>
      </div>
      <div className="absolute top-[55%] right-[22%] flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-avionics-cyan">
          <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="font-mono text-[10px] text-avionics-cyan">JELCO</span>
      </div>
      <div className="absolute top-[65%] right-[20%] flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-avionics-cyan">
          <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="font-mono text-[10px] text-avionics-cyan">SISGY</span>
      </div>

      {/* Range ring label */}
      <div className="absolute top-[40%] left-[20%]">
        <span className="font-mono text-[9px] text-avionics-label">20 NM</span>
      </div>

      {/* Terrain-like gradient overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 70% 60%, hsl(120 40% 25%) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 40%, hsl(35 50% 30%) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 30%, hsl(35 50% 30%) 0%, transparent 30%),
            radial-gradient(ellipse at 50% 80%, hsl(200 40% 25%) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
};
