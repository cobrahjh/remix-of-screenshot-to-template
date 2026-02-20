import { useState } from "react";

type WxTab = "radar" | "metar" | "winds" | "sigmet" | "icing";

const metarData = [
  { id: "KMRY", text: "KMRY 201856Z 31012G18KT 10SM FEW025 SCT040 16/08 A3012 RMK AO2 SLP198", cat: "VFR" },
  { id: "KSNS", text: "KSNS 201856Z 28008KT 10SM CLR 18/06 A3014 RMK AO2 SLP204", cat: "VFR" },
  { id: "KSJC", text: "KSJC 201856Z 32015KT 6SM HZ BKN015 OVC025 14/10 A3008 RMK AO2", cat: "MVFR" },
  { id: "KSFO", text: "KSFO 201856Z 28020G28KT 3SM BR OVC008 12/10 A3006 RMK AO2", cat: "IFR" },
  { id: "KOAK", text: "KOAK 201856Z 30012KT 7SM SCT018 BKN025 15/09 A3010", cat: "MVFR" },
];

const sigmetData = [
  { id: "WS1", type: "SIGMET", text: "SIGMET CHARLIE 3 VALID UNTIL 202100 — MOD TURB BLW FL200 WI AREA BOUNDED BY SFO-SAC-FAT-SBA-SFO" },
  { id: "WA1", type: "AIRMET", text: "AIRMET SIERRA — IFR CIG BLW 010/VIS BLW 3SM BR. NRN CA CSTL AREAS. CONDS CONTG BYD 2100Z" },
];

const windsData = [
  { alt: "3000", dir: 310, speed: 15, temp: "+12" },
  { alt: "6000", dir: 300, speed: 22, temp: "+06" },
  { alt: "9000", dir: 290, speed: 30, temp: "-01" },
  { alt: "12000", dir: 280, speed: 38, temp: "-08" },
  { alt: "18000", dir: 270, speed: 52, temp: "-18" },
  { alt: "24000", dir: 265, speed: 68, temp: "-30" },
];

const catColor: Record<string, string> = {
  VFR: "text-avionics-green",
  MVFR: "text-avionics-cyan",
  IFR: "text-destructive",
  LIFR: "text-avionics-magenta",
};

export const WeatherDetailScreen = () => {
  const [activeTab, setActiveTab] = useState<WxTab>("radar");

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      <div className="flex items-center px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <span className="font-mono text-xs text-avionics-white">Weather</span>
        <span className="ml-auto font-mono text-[9px] text-avionics-green">NXRD:CMP</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-avionics-panel border-b border-avionics-divider overflow-x-auto">
        {([["radar", "Radar"], ["metar", "METAR"], ["winds", "Winds"], ["sigmet", "SIGMET"], ["icing", "Icing"]] as [WxTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 text-[10px] font-mono whitespace-nowrap border-b-2 transition-colors ${
              activeTab === key ? "text-avionics-cyan border-avionics-cyan" : "text-avionics-label border-transparent hover:text-avionics-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "radar" && (
          <div className="flex-1 relative h-full min-h-[200px]">
            <div className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 55% 40%, hsl(120 80% 40% / 0.6) 0%, transparent 15%),
                  radial-gradient(ellipse at 60% 35%, hsl(60 80% 50% / 0.5) 0%, transparent 10%),
                  radial-gradient(ellipse at 58% 38%, hsl(0 80% 50% / 0.4) 0%, transparent 5%),
                  radial-gradient(ellipse at 30% 60%, hsl(120 80% 40% / 0.4) 0%, transparent 20%),
                  radial-gradient(ellipse at 75% 70%, hsl(120 60% 35% / 0.3) 0%, transparent 18%),
                  hsl(220 20% 6%)
                `
              }}
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10">
              {[["hsl(120_80%_40%)", "Light"], ["hsl(60_80%_50%)", "Mod"], ["hsl(0_80%_50%)", "Heavy"], ["hsl(300_60%_50%)", "Extreme"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-0.5">
                  <div className="w-3 h-2" style={{ background: color.replace(/_/g, " ") }} />
                  <span className="text-[7px] text-avionics-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-2 right-2 font-mono text-[9px] text-avionics-label z-10">Age: 2min</div>
          </div>
        )}

        {activeTab === "metar" && (
          <div>
            {metarData.map(m => (
              <div key={m.id} className="px-3 py-2.5 border-b border-avionics-divider/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-avionics-white">{m.id}</span>
                  <span className={`font-mono text-[10px] font-bold ${catColor[m.cat]}`}>{m.cat}</span>
                </div>
                <p className="font-mono text-[9px] text-avionics-label leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "winds" && (
          <div>
            <div className="flex items-center px-3 py-1 bg-avionics-panel/50 border-b border-avionics-divider/50">
              <span className="w-16 text-[8px] text-avionics-label">Altitude</span>
              <span className="w-12 text-[8px] text-avionics-label text-right">Dir</span>
              <span className="w-12 text-[8px] text-avionics-label text-right">Speed</span>
              <span className="w-12 text-[8px] text-avionics-label text-right">Temp</span>
            </div>
            {windsData.map(w => (
              <div key={w.alt} className="flex items-center px-3 py-2 border-b border-avionics-divider/30">
                <span className="w-16 font-mono text-xs text-avionics-cyan">{w.alt} ft</span>
                <span className="w-12 font-mono text-xs text-avionics-magenta text-right">{w.dir}°</span>
                <span className="w-12 font-mono text-xs text-avionics-green text-right">{w.speed} kt</span>
                <span className="w-12 font-mono text-xs text-avionics-white text-right">{w.temp}°C</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sigmet" && (
          <div>
            {sigmetData.map(s => (
              <div key={s.id} className="px-3 py-2.5 border-b border-avionics-divider/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    s.type === "SIGMET" ? "bg-destructive/20 text-destructive" : "bg-avionics-amber/20 text-avionics-amber"
                  }`}>
                    {s.type}
                  </span>
                </div>
                <p className="font-mono text-[9px] text-avionics-label leading-relaxed">{s.text}</p>
              </div>
            ))}
            <div className="px-3 py-4 text-center">
              <span className="font-mono text-[9px] text-avionics-divider">No additional advisories</span>
            </div>
          </div>
        )}

        {activeTab === "icing" && (
          <div className="flex-1 relative min-h-[200px]">
            <div className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 40% 35%, hsl(200 80% 60% / 0.3) 0%, transparent 25%),
                  radial-gradient(ellipse at 65% 55%, hsl(200 80% 60% / 0.2) 0%, transparent 20%),
                  radial-gradient(ellipse at 50% 70%, hsl(200 80% 60% / 0.15) 0%, transparent 30%),
                  hsl(220 20% 6%)
                `
              }}
            />
            <div className="absolute top-3 left-3 z-10">
              <span className="font-mono text-[9px] text-avionics-label">Icing Forecast — FL060-FL120</span>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10">
              {[["hsl(200_60%_70%)", "Light"], ["hsl(200_80%_50%)", "Mod"], ["hsl(200_90%_35%)", "Severe"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-0.5">
                  <div className="w-3 h-2" style={{ background: color.replace(/_/g, " ") }} />
                  <span className="text-[7px] text-avionics-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
