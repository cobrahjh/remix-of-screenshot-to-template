import { useGtn, FlightPlanWaypoint } from "../GtnContext";
import { useState } from "react";

const WaypointIcon = ({ type }: { type: FlightPlanWaypoint["type"] }) => {
  switch (type) {
    case "airport":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-avionics-cyan shrink-0">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "vor":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-avionics-cyan shrink-0">
          <polygon points="7,1 13,13 1,13" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" className="text-avionics-cyan shrink-0">
          <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
};

export const FlightPlanScreen = () => {
  const { flightPlan, activeWaypointIndex, setActiveWaypoint, navigateTo } = useGtn();
  const [selectedWp, setSelectedWp] = useState<number | null>(null);

  const totalDist = flightPlan.reduce((sum, wp) => sum + wp.dis, 0);
  const remainingDist = flightPlan.slice(activeWaypointIndex).reduce((sum, wp) => sum + wp.dis, 0);

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <span className="font-mono text-xs text-avionics-white">Active Flight Plan</span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-avionics-label">
            DIS: <span className="text-avionics-cyan font-mono">{remainingDist} NM</span>
          </span>
          <span className="text-[9px] text-avionics-label">
            TOT: <span className="text-avionics-white font-mono">{totalDist} NM</span>
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center px-3 py-1 bg-avionics-panel/50 border-b border-avionics-divider/50 gap-2">
        <span className="w-5 text-[8px] text-avionics-label" />
        <span className="flex-1 text-[8px] text-avionics-label">Waypoint</span>
        <span className="w-10 text-[8px] text-avionics-label text-right">DTK</span>
        <span className="w-10 text-[8px] text-avionics-label text-right">DIS</span>
        <span className="w-12 text-[8px] text-avionics-label text-right">ALT</span>
        <span className="w-12 text-[8px] text-avionics-label text-right">ETE</span>
      </div>

      {/* Waypoint list */}
      <div className="flex-1 overflow-y-auto">
        {flightPlan.map((wp, i) => {
          const isActive = i === activeWaypointIndex;
          const isPast = i < activeWaypointIndex;
          const isSelected = i === selectedWp;

          return (
            <button
              key={wp.id}
              onClick={() => setSelectedWp(isSelected ? null : i)}
              className={`w-full flex items-center px-3 py-2 gap-2 border-b border-avionics-divider/30 transition-colors ${
                isSelected ? "bg-avionics-button-active" : isActive ? "bg-avionics-green/5" : "hover:bg-avionics-button-hover/50"
              }`}
            >
              {/* Active indicator */}
              <div className="w-5 flex justify-center">
                {isActive && (
                  <svg width="8" height="10" viewBox="0 0 8 10" className="text-avionics-magenta">
                    <polygon points="0,0 8,5 0,10" fill="currentColor" />
                  </svg>
                )}
              </div>

              {/* Waypoint name */}
              <div className="flex-1 flex items-center gap-1.5">
                <WaypointIcon type={wp.type} />
                <span className={`font-mono text-xs ${
                  isPast ? "text-avionics-label" : isActive ? "text-avionics-magenta" : "text-avionics-white"
                }`}>
                  {wp.name}
                </span>
              </div>

              {/* DTK */}
              <span className={`w-10 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-magenta"}`}>
                {wp.dtk}°
              </span>

              {/* DIS */}
              <span className={`w-10 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-white"}`}>
                {wp.dis}
              </span>

              {/* ALT */}
              <span className={`w-12 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-cyan"}`}>
                {wp.alt || "---"}
              </span>

              {/* ETE */}
              <span className={`w-12 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-white"}`}>
                {wp.ete}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected waypoint options */}
      {selectedWp !== null && (
        <div className="flex items-stretch border-t border-avionics-divider bg-avionics-panel">
          <button
            onClick={() => { setActiveWaypoint(selectedWp); setSelectedWp(null); }}
            className="flex-1 py-2 text-center font-mono text-[10px] text-avionics-green hover:bg-avionics-button-hover border-r border-avionics-divider transition-colors"
          >
            Activate Leg
          </button>
          <button
            onClick={() => { navigateTo("directto"); }}
            className="flex-1 py-2 text-center font-mono text-[10px] text-avionics-cyan hover:bg-avionics-button-hover border-r border-avionics-divider transition-colors"
          >
            Direct To →
          </button>
          <button
            className="flex-1 py-2 text-center font-mono text-[10px] text-avionics-amber hover:bg-avionics-button-hover transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Bottom info */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-avionics-divider bg-avionics-panel">
        <span className="font-mono text-[9px] text-avionics-label">
          {flightPlan[0]?.name} → {flightPlan[flightPlan.length - 1]?.name}
        </span>
        <span className="font-mono text-[9px] text-avionics-green">GPS</span>
      </div>
    </div>
  );
};
