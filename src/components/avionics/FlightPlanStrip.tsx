interface Waypoint {
  name: string;
  icon: string | null;
  active?: boolean;
  color?: "magenta";
}

export const FlightPlanStrip = () => {
  const waypoints: Waypoint[] = [
    { name: "GIPVY", icon: "●", active: true },
    { name: "→", icon: null },
    { name: "RW31", icon: "●", color: "magenta" },
    { name: "D▶", icon: null },
    { name: "MAP", icon: null },
  ];

  return (
    <div className="bg-avionics-panel border-y border-avionics-divider">
      {/* Play Back button */}
      <div className="flex items-center border-b border-avionics-divider">
        <button className="px-3 py-1 text-[10px] text-avionics-white hover:bg-avionics-button-hover transition-colors border-r border-avionics-divider">
          Play Back
        </button>
        <div className="flex items-center gap-3 px-3 py-1 flex-1">
          {waypoints.map((wp, i) => (
            <span
              key={i}
              className={`font-mono text-xs ${
                wp.color === "magenta"
                  ? "text-avionics-magenta"
                  : wp.active
                  ? "text-avionics-green"
                  : "text-avionics-white"
              }`}
            >
              {wp.icon && <span className="mr-0.5">{wp.icon}</span>}
              {wp.name}
            </span>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 px-3 py-1">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < 2 ? "bg-avionics-green" : "bg-avionics-divider"
            }`}
          />
        ))}
        <div className="ml-auto">
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-avionics-amber">
            <polygon points="6,1 11,11 1,11" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
