import { useState, useEffect, useCallback, useRef } from "react";

type TimerId = "flight" | "elapsed" | "countdown";

const formatTime = (seconds: number) => {
  const neg = seconds < 0;
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  return `${neg ? "-" : ""}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const CountdownSetter = ({ onSet }: { onSet: (seconds: number) => void }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setHours(h => Math.min(h + 1, 23))}
          className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono bg-avionics-button text-avionics-cyan avionics-bezel hover:bg-avionics-button-hover"
        >▲</button>
        <span className="font-mono text-sm text-avionics-white w-6 text-center">{hours.toString().padStart(2, "0")}</span>
        <button
          onClick={() => setHours(h => Math.max(h - 1, 0))}
          className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono bg-avionics-button text-avionics-cyan avionics-bezel hover:bg-avionics-button-hover"
        >▼</button>
      </div>
      <span className="text-avionics-white font-mono text-sm">:</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setMinutes(m => Math.min(m + 1, 59))}
          className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono bg-avionics-button text-avionics-cyan avionics-bezel hover:bg-avionics-button-hover"
        >▲</button>
        <span className="font-mono text-sm text-avionics-white w-6 text-center">{minutes.toString().padStart(2, "0")}</span>
        <button
          onClick={() => setMinutes(m => Math.max(m - 1, 0))}
          className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono bg-avionics-button text-avionics-cyan avionics-bezel hover:bg-avionics-button-hover"
        >▼</button>
      </div>
      <button
        onClick={() => onSet(hours * 3600 + minutes * 60)}
        className="px-2 py-1 rounded text-[9px] font-mono bg-avionics-green/20 text-avionics-green avionics-bezel hover:bg-avionics-green/30 transition-colors ml-1"
      >
        Set
      </button>
    </div>
  );
};

export const UtilitiesScreen = () => {
  const [flightTime, setFlightTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [countdownTime, setCountdownTime] = useState(600); // 10 min default
  const [countdownInitial, setCountdownInitial] = useState(600);
  const [running, setRunning] = useState<Record<TimerId, boolean>>({ flight: false, elapsed: false, countdown: false });
  const [showCountdownSet, setShowCountdownSet] = useState(false);
  const [countdownExpired, setCountdownExpired] = useState(false);
  const flashRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (running.flight) setFlightTime(t => t + 1);
      if (running.elapsed) setElapsedTime(t => t + 1);
      if (running.countdown) {
        setCountdownTime(t => {
          const next = t - 1;
          if (next === 0) setCountdownExpired(true);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Flash effect for expired countdown
  useEffect(() => {
    if (!countdownExpired) return;
    const interval = setInterval(() => {
      flashRef.current = !flashRef.current;
    }, 500);
    return () => clearInterval(interval);
  }, [countdownExpired]);

  const toggle = useCallback((id: TimerId) => {
    if (id === "countdown" && countdownExpired) {
      setCountdownExpired(false);
    }
    setRunning(prev => ({ ...prev, [id]: !prev[id] }));
  }, [countdownExpired]);

  const reset = useCallback((id: TimerId) => {
    setRunning(prev => ({ ...prev, [id]: false }));
    if (id === "flight") setFlightTime(0);
    else if (id === "elapsed") setElapsedTime(0);
    else {
      setCountdownTime(countdownInitial);
      setCountdownExpired(false);
    }
  }, [countdownInitial]);

  const handleCountdownSet = useCallback((seconds: number) => {
    setCountdownInitial(seconds);
    setCountdownTime(seconds);
    setCountdownExpired(false);
    setRunning(prev => ({ ...prev, countdown: false }));
    setShowCountdownSet(false);
  }, []);

  const timers: { id: TimerId; label: string; sublabel: string; value: number }[] = [
    { id: "flight", label: "FLT", sublabel: "Flight Time", value: flightTime },
    { id: "elapsed", label: "ETE", sublabel: "Elapsed Time", value: elapsedTime },
    { id: "countdown", label: "CDT", sublabel: "Countdown", value: countdownTime },
  ];

  const countdownProgress = countdownInitial > 0
    ? Math.max(0, Math.min(1, countdownTime / countdownInitial))
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <span className="font-mono text-xs text-avionics-white">Timers / Utilities</span>
        <span className="font-mono text-[9px] text-avionics-label">
          UTC {new Date().toISOString().slice(11, 19)}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Section label */}
        <div className="px-3 py-1.5 border-b border-avionics-divider">
          <span className="text-[10px] text-avionics-cyan font-mono">FLIGHT TIMERS</span>
        </div>

        {timers.map(({ id, label, sublabel, value }) => {
          const isRunning = running[id];
          const isCountdown = id === "countdown";
          const isExpired = isCountdown && countdownExpired;
          const isNegative = isCountdown && value < 0;

          return (
            <div key={id} className="border-b border-avionics-divider/50">
              <div className="flex items-center justify-between px-3 py-2.5">
                {/* Label */}
                <div className="flex flex-col w-16">
                  <span className="font-mono text-[11px] text-avionics-cyan font-bold">{label}</span>
                  <span className="text-[8px] text-avionics-label">{sublabel}</span>
                </div>

                {/* Time display */}
                <div className="flex items-center gap-1">
                  {isRunning && (
                    <span className="w-1.5 h-1.5 rounded-full bg-avionics-green animate-pulse" />
                  )}
                  <span
                    className={`font-mono text-xl font-bold tracking-wider ${
                      isExpired
                        ? "text-avionics-amber avionics-glow-amber animate-pulse"
                        : isNegative
                        ? "text-avionics-amber"
                        : isRunning
                        ? "text-avionics-green avionics-glow-green"
                        : "text-avionics-white"
                    }`}
                  >
                    {formatTime(value)}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toggle(id)}
                    className={`px-3 py-1 rounded text-[9px] font-mono avionics-bezel transition-colors ${
                      isRunning
                        ? "bg-avionics-green/20 text-avionics-green border border-avionics-green/30"
                        : "bg-avionics-button text-avionics-cyan hover:bg-avionics-button-hover"
                    }`}
                  >
                    {isRunning ? "STOP" : "START"}
                  </button>
                  <button
                    onClick={() => reset(id)}
                    className="px-3 py-1 rounded text-[9px] font-mono bg-avionics-button text-avionics-amber avionics-bezel hover:bg-avionics-button-hover transition-colors"
                  >
                    RST
                  </button>
                  {isCountdown && (
                    <button
                      onClick={() => setShowCountdownSet(prev => !prev)}
                      className={`px-2 py-1 rounded text-[9px] font-mono avionics-bezel transition-colors ${
                        showCountdownSet
                          ? "bg-avionics-cyan/20 text-avionics-cyan border border-avionics-cyan/30"
                          : "bg-avionics-button text-avionics-white hover:bg-avionics-button-hover"
                      }`}
                    >
                      SET
                    </button>
                  )}
                </div>
              </div>

              {/* Countdown progress bar */}
              {isCountdown && (
                <div className="px-3 pb-1.5">
                  <div className="h-1 bg-avionics-divider rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isExpired ? "bg-avionics-amber" : "bg-avionics-green"
                      }`}
                      style={{ width: `${countdownProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Countdown setter */}
              {isCountdown && showCountdownSet && (
                <div className="px-3 pb-2 flex items-center gap-2">
                  <span className="text-[9px] text-avionics-label font-mono">SET TIME:</span>
                  <CountdownSetter onSet={handleCountdownSet} />
                </div>
              )}
            </div>
          );
        })}

        {/* Scheduled Messages */}
        <div className="px-3 py-1.5 border-b border-avionics-divider mt-1">
          <span className="text-[10px] text-avionics-cyan font-mono">SCHEDULED MESSAGES</span>
        </div>
        <div className="flex items-center justify-center py-4">
          <span className="font-mono text-[10px] text-avionics-divider">No Messages Configured</span>
        </div>
      </div>
    </div>
  );
};
