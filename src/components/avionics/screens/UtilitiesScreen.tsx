import { useState, useEffect, useCallback } from "react";

export const UtilitiesScreen = () => {
  const [departureTimer, setDepartureTimer] = useState(0);
  const [tripTimer, setTripTimer] = useState(0);
  const [genericTimer, setGenericTimer] = useState(0);
  const [activeTimer, setActiveTimer] = useState<"departure" | "trip" | "generic" | null>(null);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!activeTimer) return;
    const interval = setInterval(() => {
      if (activeTimer === "departure") setDepartureTimer(t => t + 1);
      else if (activeTimer === "trip") setTripTimer(t => t + 1);
      else if (activeTimer === "generic") setGenericTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const toggleTimer = useCallback((timer: "departure" | "trip" | "generic") => {
    setActiveTimer(prev => prev === timer ? null : timer);
  }, []);

  const resetTimer = useCallback((timer: "departure" | "trip" | "generic") => {
    if (timer === "departure") setDepartureTimer(0);
    else if (timer === "trip") setTripTimer(0);
    else setGenericTimer(0);
    if (activeTimer === timer) setActiveTimer(null);
  }, [activeTimer]);

  const timers = [
    { id: "departure" as const, label: "Departure", value: departureTimer },
    { id: "trip" as const, label: "Trip", value: tripTimer },
    { id: "generic" as const, label: "Generic", value: genericTimer },
  ];

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      <div className="flex items-center px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <span className="font-mono text-xs text-avionics-white">Utilities</span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Flight Timers */}
        <div className="px-3 py-2 border-b border-avionics-divider">
          <span className="text-[10px] text-avionics-label">Flight Timers</span>
        </div>

        {timers.map(({ id, label, value }) => (
          <div key={id} className="flex items-center justify-between px-3 py-3 border-b border-avionics-divider/50">
            <span className="text-[10px] text-avionics-white w-20">{label}</span>
            <span className={`font-mono text-lg font-bold ${activeTimer === id ? "text-avionics-green avionics-glow-green" : "text-avionics-white"}`}>
              {formatTime(value)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTimer(id)}
                className={`px-3 py-1 rounded text-[9px] font-mono avionics-bezel transition-colors ${
                  activeTimer === id
                    ? "bg-avionics-green/20 text-avionics-green"
                    : "bg-avionics-button text-avionics-cyan hover:bg-avionics-button-hover"
                }`}
              >
                {activeTimer === id ? "Stop" : "Start"}
              </button>
              <button
                onClick={() => resetTimer(id)}
                className="px-3 py-1 rounded text-[9px] font-mono bg-avionics-button text-avionics-amber avionics-bezel hover:bg-avionics-button-hover transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        ))}

        {/* Scheduled Messages */}
        <div className="px-3 py-2 border-b border-avionics-divider mt-2">
          <span className="text-[10px] text-avionics-label">Scheduled Messages</span>
        </div>
        <div className="flex items-center justify-center py-6">
          <span className="font-mono text-[10px] text-avionics-divider">No Messages Configured</span>
        </div>
      </div>
    </div>
  );
};
