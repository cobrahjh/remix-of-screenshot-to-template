import { useState } from "react";
import { useFlightData } from "../FlightDataContext";
import { Thermometer, Wind } from "lucide-react";

export const DaltScreen = () => {
  const { flight, weather } = useFlightData();

  const [useSensor, setUseSensor] = useState(true);
  const [manualAlt, setManualAlt] = useState(5000);
  const [manualBaro, setManualBaro] = useState(29.92);
  const [manualCas, setManualCas] = useState(120);
  const [manualTat, setManualTat] = useState(15);
  const [manualHdg, setManualHdg] = useState(360);
  const [manualTrk, setManualTrk] = useState(360);
  const [manualGS, setManualGS] = useState(120);

  // Use sensor data or manual
  const alt = useSensor ? flight.altitude : manualAlt;
  const baro = useSensor ? weather.pressure / 33.8639 : manualBaro; // hPa to inHg
  const cas = useSensor ? flight.speed : manualCas;
  const tat = useSensor ? weather.temperature : manualTat;
  const hdg = useSensor ? flight.heading : manualHdg;
  const trk = useSensor ? (flight.groundSpeed > 0 ? flight.heading : 0) : manualTrk; // simplified
  const gs = useSensor ? flight.groundSpeed : manualGS;

  // Pressure altitude = indicated alt + (29.92 - baro) × 1000
  const pressureAlt = alt + (29.92 - baro) * 1000;

  // ISA temp at pressure altitude: 15 - (pressureAlt / 1000) × 1.98
  const isaTemp = 15 - (pressureAlt / 1000) * 1.98;
  const isaDev = tat - isaTemp;

  // Density altitude = pressure alt + (120 × ISA deviation)
  const densityAlt = Math.round(pressureAlt + 120 * isaDev);

  // TAS = CAS × √(ρ₀/ρ) ≈ CAS × (1 + pressureAlt/50000) simplified
  const tasCorrection = 1 + pressureAlt / 50000;
  const tas = Math.round(cas * tasCorrection);

  // Wind calculation (simplified from hdg/trk/gs/tas)
  const windDir = weather.windDir || 0;
  const windSpd = weather.windSpeed || 0;

  // Wind components relative to heading
  const windAngle = ((windDir - hdg + 360) % 360) * (Math.PI / 180);
  const headwind = Math.round(windSpd * Math.cos(windAngle));
  const crosswind = Math.round(windSpd * Math.sin(windAngle));

  const InputRow = ({ label, value, unit, onInc, onDec }: { label: string; value: string | number; unit: string; onInc: () => void; onDec: () => void }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-avionics-divider/50">
      <span className="text-[9px] text-avionics-label font-mono uppercase">{label}</span>
      <div className="flex items-center gap-1">
        {!useSensor && (
          <button onClick={onDec} className="w-5 h-5 rounded bg-avionics-button text-avionics-white text-xs hover:bg-avionics-button-hover">−</button>
        )}
        <span className="font-mono text-xs text-avionics-cyan w-16 text-center">{value}</span>
        {!useSensor && (
          <button onClick={onInc} className="w-5 h-5 rounded bg-avionics-button text-avionics-white text-xs hover:bg-avionics-button-hover">+</button>
        )}
        <span className="text-[8px] text-avionics-label ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-avionics-divider bg-avionics-panel">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-avionics-cyan" />
          <span className="font-mono text-[10px] text-avionics-cyan tracking-wider">DALT / TAS / WINDS</span>
        </div>
        <button
          onClick={() => setUseSensor(!useSensor)}
          className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
            useSensor ? "border-avionics-green text-avionics-green" : "border-avionics-divider text-avionics-label"
          }`}
        >
          {useSensor ? "SENSOR" : "MANUAL"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {/* Inputs */}
        <div className="bg-avionics-panel rounded-lg border border-avionics-divider p-3">
          <span className="text-[9px] text-avionics-label font-mono block mb-2">INPUTS</span>
          <InputRow label="Indicated ALT" value={Math.round(alt).toLocaleString()} unit="FT" onInc={() => setManualAlt(a => a + 500)} onDec={() => setManualAlt(a => Math.max(a - 500, 0))} />
          <InputRow label="BARO" value={baro.toFixed(2)} unit="inHg" onInc={() => setManualBaro(b => Math.min(b + 0.01, 31))} onDec={() => setManualBaro(b => Math.max(b - 0.01, 28))} />
          <InputRow label="CAS" value={Math.round(cas)} unit="KT" onInc={() => setManualCas(c => c + 5)} onDec={() => setManualCas(c => Math.max(c - 5, 0))} />
          <InputRow label="TAT" value={`${Math.round(tat)}°`} unit="C" onInc={() => setManualTat(t => t + 1)} onDec={() => setManualTat(t => t - 1)} />
          <InputRow label="HDG" value={`${Math.round(hdg)}°`} unit="" onInc={() => setManualHdg(h => (h + 10) % 360)} onDec={() => setManualHdg(h => (h - 10 + 360) % 360)} />
          <InputRow label="GS" value={Math.round(gs)} unit="KT" onInc={() => setManualGS(g => g + 5)} onDec={() => setManualGS(g => Math.max(g - 5, 0))} />
        </div>

        {/* Outputs */}
        <div className="bg-avionics-panel rounded-lg border border-avionics-divider p-3">
          <span className="text-[9px] text-avionics-label font-mono block mb-2">RESULTS</span>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">PRESSURE ALT</span>
            <span className="font-mono text-sm text-avionics-white">{Math.round(pressureAlt).toLocaleString()} <span className="text-[8px] text-avionics-label">FT</span></span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">DENSITY ALT</span>
            <span className={`font-mono text-sm ${densityAlt > alt + 2000 ? "text-avionics-amber" : "text-avionics-green"}`}>
              {densityAlt.toLocaleString()} <span className="text-[8px] text-avionics-label">FT</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">ISA DEV</span>
            <span className={`font-mono text-sm ${isaDev > 0 ? "text-avionics-amber" : "text-avionics-cyan"}`}>
              {isaDev > 0 ? "+" : ""}{isaDev.toFixed(1)}°C
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">TAS</span>
            <span className="font-mono text-sm text-avionics-cyan">{tas} <span className="text-[8px] text-avionics-label">KT</span></span>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-avionics-panel rounded-lg border border-avionics-divider p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Wind className="w-3 h-3 text-avionics-green" />
            <span className="text-[9px] text-avionics-label font-mono">WIND</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">DIRECTION</span>
            <span className="font-mono text-sm text-avionics-magenta">{windDir}° / {windSpd} KT</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-avionics-divider/50">
            <span className="text-[9px] text-avionics-label font-mono">{headwind >= 0 ? "HEADWIND" : "TAILWIND"}</span>
            <span className={`font-mono text-sm ${headwind >= 0 ? "text-avionics-amber" : "text-avionics-green"}`}>
              {Math.abs(headwind)} KT
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[9px] text-avionics-label font-mono">CROSSWIND</span>
            <span className="font-mono text-sm text-avionics-white">
              {Math.abs(crosswind)} KT {crosswind > 0 ? "R" : crosswind < 0 ? "L" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end px-3 py-1 border-t border-avionics-divider">
        <span className="font-mono text-[10px] text-avionics-cyan">DALT</span>
      </div>
    </div>
  );
};
