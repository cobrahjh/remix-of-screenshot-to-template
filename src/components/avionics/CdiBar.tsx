import { useGtn } from "./GtnContext";

export const CdiBar = () => {
  const { obsMode, obsCourse, directToTarget, flightPlan, activeWaypointIndex } = useGtn();

  // Simulated CDI deviation values (-1 to 1, where 0 = on course)
  const lateralDev = 0.15; // slightly right of course
  const verticalDev = -0.25; // slightly below glidepath

  const activeWp = flightPlan[activeWaypointIndex];
  const courseTo = directToTarget || activeWp?.name || "---";
  const dtk = obsMode ? obsCourse : activeWp?.dtk || 0;

  const dotCount = 5;
  const dots = Array.from({ length: dotCount * 2 + 1 }, (_, i) => i - dotCount);

  return (
    <div className="flex flex-col gap-0.5 px-2 py-1 bg-avionics-panel border-t border-avionics-divider">
      {/* Lateral CDI */}
      <div className="flex items-center gap-1.5">
        <span className="text-[8px] text-avionics-label w-6">CDI</span>
        <div className="flex-1 flex items-center justify-center relative h-3">
          {/* Dot scale */}
          {dots.map((d) => (
            <div
              key={`lat-${d}`}
              className={`w-1.5 h-1.5 rounded-full mx-[3px] ${
                d === 0
                  ? "bg-avionics-white"
                  : "border border-avionics-divider"
              }`}
            />
          ))}
          {/* Needle */}
          <div
            className="absolute top-0 h-3 w-[2px] bg-avionics-magenta rounded"
            style={{
              left: `calc(50% + ${lateralDev * 45}%)`,
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <span className="font-mono text-[9px] text-avionics-magenta w-8 text-right">{dtk}°</span>
      </div>

      {/* Vertical deviation (GS / GP) */}
      <div className="flex items-center gap-1.5">
        <span className="text-[8px] text-avionics-label w-6">GS</span>
        <div className="flex-1 flex items-center justify-center relative h-3">
          {dots.map((d) => (
            <div
              key={`vert-${d}`}
              className={`w-1.5 h-1.5 rounded-full mx-[3px] ${
                d === 0
                  ? "bg-avionics-white"
                  : "border border-avionics-divider"
              }`}
            />
          ))}
          <div
            className="absolute top-0 h-3 w-[2px] bg-avionics-green rounded"
            style={{
              left: `calc(50% + ${verticalDev * 45}%)`,
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <span className="font-mono text-[9px] text-avionics-cyan w-8 text-right">{courseTo}</span>
      </div>
    </div>
  );
};
