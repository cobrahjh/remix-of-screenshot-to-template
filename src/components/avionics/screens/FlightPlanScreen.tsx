import { useGtn, FlightPlanWaypoint } from "../GtnContext";
import { useState, useMemo } from "react";

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

/* ─── VNAV Profile SVG ─── */
const VnavProfile = ({ flightPlan, activeWaypointIndex }: { flightPlan: FlightPlanWaypoint[]; activeWaypointIndex: number }) => {
  const W = 420;
  const H = 110;
  const PAD = { top: 18, bottom: 22, left: 36, right: 12 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const data = useMemo(() => {
    // cumulative distance for x-axis
    let cumDist = 0;
    const pts = flightPlan.map((wp, i) => {
      if (i > 0) cumDist += wp.dis;
      return { ...wp, cumDist, alt: wp.alt || 0, index: i };
    });
    const maxDist = cumDist || 1;
    const alts = pts.map(p => p.alt);
    const maxAlt = Math.max(...alts, 500);
    const minAlt = Math.min(...alts, 0);
    const altRange = maxAlt - minAlt || 1;

    const toX = (d: number) => PAD.left + (d / maxDist) * plotW;
    const toY = (a: number) => PAD.top + plotH - ((a - minAlt) / altRange) * plotH;

    return { pts, maxDist, maxAlt, minAlt, altRange, toX, toY };
  }, [flightPlan]);

  const { pts, maxAlt, minAlt, toX, toY } = data;

  // Build path line
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.cumDist).toFixed(1)},${toY(p.alt).toFixed(1)}`).join(" ");

  // Fill area under path
  const fillD = `${pathD} L${toX(pts[pts.length - 1].cumDist).toFixed(1)},${(PAD.top + plotH).toFixed(1)} L${PAD.left},${(PAD.top + plotH).toFixed(1)} Z`;

  // Altitude grid lines
  const altSteps = 4;
  const altGridLines = Array.from({ length: altSteps + 1 }, (_, i) => {
    const alt = minAlt + ((maxAlt - minAlt) * i) / altSteps;
    return { alt: Math.round(alt), y: toY(alt) };
  });

  // Aircraft position (interpolated between active and next)
  const acIdx = activeWaypointIndex;
  const acPt = pts[acIdx];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block">
      {/* Grid lines */}
      {altGridLines.map((g, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={g.y} x2={W - PAD.right} y2={g.y} stroke="hsl(var(--avionics-divider))" strokeWidth="0.5" strokeDasharray="2,3" />
          <text x={PAD.left - 3} y={g.y + 3} textAnchor="end" className="fill-avionics-label" fontSize="7" fontFamily="monospace">
            {g.alt >= 1000 ? `${(g.alt / 1000).toFixed(1)}k` : g.alt}
          </text>
        </g>
      ))}

      {/* Ground baseline */}
      <line x1={PAD.left} y1={PAD.top + plotH} x2={W - PAD.right} y2={PAD.top + plotH} stroke="hsl(var(--avionics-divider))" strokeWidth="1" />

      {/* Terrain fill (simplified) */}
      <path d={fillD} fill="hsl(var(--avionics-green) / 0.06)" />

      {/* Vertical path line */}
      <path d={pathD} fill="none" stroke="hsl(var(--avionics-magenta))" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Constraint markers at each waypoint */}
      {pts.map((p, i) => {
        const x = toX(p.cumDist);
        const y = toY(p.alt);
        const isPast = i < activeWaypointIndex;
        const isActive = i === activeWaypointIndex;

        return (
          <g key={p.id}>
            {/* Vertical dashed line from point to baseline */}
            <line x1={x} y1={y} x2={x} y2={PAD.top + plotH} stroke={isPast ? "hsl(var(--avionics-divider))" : "hsl(var(--avionics-cyan) / 0.3)"} strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Constraint diamond */}
            <polygon
              points={`${x},${y - 4} ${x + 3},${y} ${x},${y + 4} ${x - 3},${y}`}
              fill={isActive ? "hsl(var(--avionics-magenta))" : isPast ? "hsl(var(--avionics-divider))" : "hsl(var(--avionics-cyan))"}
              stroke="none"
            />

            {/* Altitude label above */}
            {p.alt > 0 && !isPast && (
              <text x={x} y={y - 7} textAnchor="middle" fontSize="7" fontFamily="monospace"
                className={isActive ? "fill-avionics-magenta" : "fill-avionics-cyan"}>
                {p.alt}
              </text>
            )}

            {/* Waypoint name below baseline */}
            <text x={x} y={PAD.top + plotH + 10} textAnchor="middle" fontSize="6.5" fontFamily="monospace"
              className={isActive ? "fill-avionics-magenta" : isPast ? "fill-avionics-label" : "fill-avionics-white"}>
              {p.name}
            </text>
          </g>
        );
      })}

      {/* Aircraft symbol */}
      {acPt && (
        <g transform={`translate(${toX(acPt.cumDist)}, ${toY(acPt.alt)})`}>
          {/* Aircraft icon */}
          <polygon points="0,-5 3,3 0,1 -3,3" fill="hsl(var(--avionics-green))" />
          {/* Glow circle */}
          <circle r="6" fill="hsl(var(--avionics-green) / 0.15)" />
        </g>
      )}

      {/* VNAV label */}
      <text x={PAD.left + 2} y={PAD.top - 6} fontSize="8" fontFamily="monospace" className="fill-avionics-cyan" fontWeight="bold">
        VNAV PROFILE
      </text>
      <text x={W - PAD.right} y={PAD.top - 6} textAnchor="end" fontSize="7" fontFamily="monospace" className="fill-avionics-label">
        ALT (ft)
      </text>
    </svg>
  );
};

export const FlightPlanScreen = () => {
  const { flightPlan, activeWaypointIndex, setActiveWaypoint, navigateTo } = useGtn();
  const [selectedWp, setSelectedWp] = useState<number | null>(null);
  const [showVnav, setShowVnav] = useState(true);

  const totalDist = flightPlan.reduce((sum, wp) => sum + wp.dis, 0);
  const remainingDist = flightPlan.slice(activeWaypointIndex).reduce((sum, wp) => sum + wp.dis, 0);

  // Compute VNAV stats
  const activeAlt = flightPlan[activeWaypointIndex]?.alt || 0;
  const nextConstraintIdx = flightPlan.findIndex((wp, i) => i > activeWaypointIndex && wp.alt);
  const nextConstraint = nextConstraintIdx >= 0 ? flightPlan[nextConstraintIdx] : null;
  const vnavTargetAlt = nextConstraint?.alt || 0;
  const distToConstraint = nextConstraint
    ? flightPlan.slice(activeWaypointIndex, nextConstraintIdx + 1).reduce((s, w) => s + w.dis, 0)
    : 0;
  const requiredVs = distToConstraint > 0 && vnavTargetAlt !== activeAlt
    ? Math.round(((vnavTargetAlt - activeAlt) / distToConstraint) * 100) // rough fpm proxy
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-avionics-white">Active Flight Plan</span>
          <button
            onClick={() => setShowVnav(v => !v)}
            className={`px-2 py-0.5 rounded text-[8px] font-mono avionics-bezel transition-colors ${
              showVnav
                ? "bg-avionics-cyan/20 text-avionics-cyan border border-avionics-cyan/30"
                : "bg-avionics-button text-avionics-label hover:bg-avionics-button-hover"
            }`}
          >
            VNAV
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-avionics-label">
            DIS: <span className="text-avionics-cyan font-mono">{remainingDist} NM</span>
          </span>
          <span className="text-[9px] text-avionics-label">
            TOT: <span className="text-avionics-white font-mono">{totalDist} NM</span>
          </span>
        </div>
      </div>

      {/* VNAV Profile */}
      {showVnav && (
        <div className="border-b border-avionics-divider bg-avionics-panel-dark">
          <VnavProfile flightPlan={flightPlan} activeWaypointIndex={activeWaypointIndex} />
          {/* VNAV data strip */}
          <div className="flex items-center justify-between px-3 py-1 border-t border-avionics-divider/50 bg-avionics-panel/30">
            <div className="flex items-center gap-3">
              <span className="text-[8px] text-avionics-label font-mono">
                V/S REQ <span className="text-avionics-magenta">{requiredVs > 0 ? "+" : ""}{requiredVs} fpm</span>
              </span>
              <span className="text-[8px] text-avionics-label font-mono">
                TGT <span className="text-avionics-cyan">{vnavTargetAlt || "---"} ft</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[8px] text-avionics-label font-mono">
                DIST <span className="text-avionics-white">{distToConstraint} NM</span>
              </span>
              <span className="text-[8px] font-mono text-avionics-green">V PATH</span>
            </div>
          </div>
        </div>
      )}

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
              <div className="w-5 flex justify-center">
                {isActive && (
                  <svg width="8" height="10" viewBox="0 0 8 10" className="text-avionics-magenta">
                    <polygon points="0,0 8,5 0,10" fill="currentColor" />
                  </svg>
                )}
              </div>

              <div className="flex-1 flex items-center gap-1.5">
                <WaypointIcon type={wp.type} />
                <span className={`font-mono text-xs ${
                  isPast ? "text-avionics-label" : isActive ? "text-avionics-magenta" : "text-avionics-white"
                }`}>
                  {wp.name}
                </span>
              </div>

              <span className={`w-10 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-magenta"}`}>
                {wp.dtk}°
              </span>
              <span className={`w-10 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-white"}`}>
                {wp.dis}
              </span>
              <span className={`w-12 font-mono text-[11px] text-right ${isPast ? "text-avionics-label" : "text-avionics-cyan"}`}>
                {wp.alt || "---"}
              </span>
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
