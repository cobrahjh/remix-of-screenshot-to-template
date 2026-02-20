import { useState } from "react";
import { useFlightData } from "../FlightDataContext";
import { PlaneTakeoff } from "lucide-react";

interface RunwayData {
  id: string;
  headings: [string, string];
  cx: number;
  cy: number;
  length: number; // px
  width: number;
  angle: number; // degrees from north
  surface: "asphalt" | "concrete";
}

interface TaxiwayData {
  id: string;
  points: string; // SVG polyline points
}

interface AirportData {
  icao: string;
  name: string;
  elevation: number;
  towerFreq: string;
  atisFreq: string;
  runways: RunwayData[];
  taxiways: TaxiwayData[];
  ramp: { points: string; label: string }[];
  buildings: { x: number; y: number; w: number; h: number; label?: string }[];
  beacon: { x: number; y: number };
  viewBox: string;
}

const AIRPORTS: Record<string, AirportData> = {
  KMRY: {
    icao: "KMRY",
    name: "Monterey Regional",
    elevation: 257,
    towerFreq: "118.40",
    atisFreq: "124.90",
    viewBox: "0 0 400 350",
    runways: [
      {
        id: "10R/28L",
        headings: ["10R", "28L"],
        cx: 200, cy: 160,
        length: 280, width: 14,
        angle: 100,
        surface: "asphalt",
      },
      {
        id: "10L/28R",
        headings: ["10L", "28R"],
        cx: 200, cy: 200,
        length: 220, width: 10,
        angle: 100,
        surface: "asphalt",
      },
    ],
    taxiways: [
      { id: "A", points: "60,185 120,185 200,185 280,185 340,185" },
      { id: "B", points: "140,160 140,200" },
      { id: "C", points: "200,160 200,200" },
      { id: "D", points: "260,160 260,200" },
      { id: "E", points: "100,200 100,250" },
      { id: "F", points: "300,160 300,200 300,250" },
    ],
    ramp: [
      { points: "60,220 130,220 130,270 60,270", label: "GA RAMP" },
      { points: "280,220 340,220 340,265 280,265", label: "CARGO" },
    ],
    buildings: [
      { x: 155, y: 230, w: 50, h: 25, label: "TERMINAL" },
      { x: 70, y: 275, w: 40, h: 15, label: "FBO" },
    ],
    beacon: { x: 350, y: 130 },
  },
  KSNS: {
    icao: "KSNS",
    name: "Salinas Municipal",
    elevation: 85,
    towerFreq: "119.40",
    atisFreq: "128.65",
    viewBox: "0 0 400 350",
    runways: [
      {
        id: "8/26",
        headings: ["08", "26"],
        cx: 200, cy: 150,
        length: 260, width: 12,
        angle: 80,
        surface: "asphalt",
      },
      {
        id: "14/32",
        headings: ["14", "32"],
        cx: 230, cy: 200,
        length: 180, width: 10,
        angle: 140,
        surface: "asphalt",
      },
    ],
    taxiways: [
      { id: "A", points: "80,170 150,170 250,170 320,170" },
      { id: "B", points: "170,150 170,200" },
      { id: "C", points: "250,150 250,200" },
      { id: "D", points: "140,200 140,260" },
    ],
    ramp: [
      { points: "80,190 150,190 150,260 80,260", label: "GA RAMP" },
    ],
    buildings: [
      { x: 90, y: 265, w: 45, h: 20, label: "FBO" },
    ],
    beacon: { x: 340, y: 120 },
  },
  KSJC: {
    icao: "KSJC",
    name: "San Jose Intl (Norman Y. Mineta)",
    elevation: 62,
    towerFreq: "124.00",
    atisFreq: "114.10",
    viewBox: "0 0 400 350",
    runways: [
      {
        id: "12L/30R",
        headings: ["12L", "30R"],
        cx: 170, cy: 160,
        length: 260, width: 14,
        angle: 120,
        surface: "asphalt",
      },
      {
        id: "12R/30L",
        headings: ["12R", "30L"],
        cx: 230, cy: 190,
        length: 260, width: 14,
        angle: 120,
        surface: "concrete",
      },
    ],
    taxiways: [
      { id: "A", points: "55,200 120,200 200,200 280,200 350,200" },
      { id: "B", points: "80,160 80,200" },
      { id: "C", points: "150,160 150,200" },
      { id: "D", points: "210,160 210,200" },
      { id: "E", points: "270,160 270,200" },
      { id: "F", points: "330,190 330,240" },
      { id: "Z", points: "100,200 100,260 180,260" },
    ],
    ramp: [
      { points: "50,215 130,215 130,280 50,280", label: "GA RAMP" },
      { points: "180,215 280,215 280,270 180,270", label: "TERMINAL" },
      { points: "290,215 350,215 350,260 290,260", label: "CARGO" },
    ],
    buildings: [
      { x: 195, y: 275, w: 65, h: 20, label: "TERMINAL A/B" },
      { x: 60, y: 285, w: 40, h: 15, label: "FBO" },
    ],
    beacon: { x: 360, y: 130 },
  },
  KSFO: {
    icao: "KSFO",
    name: "San Francisco Intl",
    elevation: 13,
    towerFreq: "120.50",
    atisFreq: "118.85",
    viewBox: "0 0 420 380",
    runways: [
      {
        id: "28L/10R",
        headings: ["28L", "10R"],
        cx: 210, cy: 120,
        length: 300, width: 14,
        angle: 100,
        surface: "asphalt",
      },
      {
        id: "28R/10L",
        headings: ["28R", "10L"],
        cx: 210, cy: 160,
        length: 300, width: 14,
        angle: 100,
        surface: "asphalt",
      },
      {
        id: "01L/19R",
        headings: ["01L", "19R"],
        cx: 300, cy: 230,
        length: 240, width: 12,
        angle: 10,
        surface: "asphalt",
      },
      {
        id: "01R/19L",
        headings: ["01R", "19L"],
        cx: 340, cy: 230,
        length: 240, width: 12,
        angle: 10,
        surface: "asphalt",
      },
    ],
    taxiways: [
      { id: "A", points: "60,175 150,175 250,175 340,175" },
      { id: "B", points: "80,120 80,160" },
      { id: "C", points: "160,120 160,160" },
      { id: "D", points: "240,120 240,160" },
      { id: "E", points: "320,120 320,160 320,210" },
      { id: "F", points: "280,175 280,210" },
      { id: "K", points: "340,175 340,140" },
    ],
    ramp: [
      { points: "60,190 180,190 180,270 60,270", label: "TERMINAL 1/2" },
      { points: "185,190 270,190 270,280 185,280", label: "TERMINAL 3" },
      { points: "60,275 140,275 140,320 60,320", label: "INTL TERMINAL" },
    ],
    buildings: [
      { x: 80, y: 275, w: 55, h: 20, label: "INTL TERM" },
      { x: 90, y: 230, w: 60, h: 18, label: "TERMINAL 1" },
      { x: 200, y: 240, w: 50, h: 18, label: "TERMINAL 3" },
    ],
    beacon: { x: 380, y: 100 },
  },
  KOAK: {
    icao: "KOAK",
    name: "Oakland Intl (Metro)",
    elevation: 9,
    towerFreq: "118.30",
    atisFreq: "128.50",
    viewBox: "0 0 420 370",
    runways: [
      {
        id: "12/30",
        headings: ["12", "30"],
        cx: 180, cy: 160,
        length: 300, width: 14,
        angle: 120,
        surface: "asphalt",
      },
      {
        id: "10L/28R",
        headings: ["10L", "28R"],
        cx: 210, cy: 220,
        length: 260, width: 12,
        angle: 100,
        surface: "asphalt",
      },
      {
        id: "10R/28L",
        headings: ["10R", "28L"],
        cx: 210, cy: 260,
        length: 260, width: 12,
        angle: 100,
        surface: "asphalt",
      },
    ],
    taxiways: [
      { id: "A", points: "60,195 130,195 210,195 300,195 360,195" },
      { id: "B", points: "100,160 100,195" },
      { id: "C", points: "180,160 180,220" },
      { id: "D", points: "240,160 240,220" },
      { id: "E", points: "300,160 300,220" },
      { id: "W", points: "100,220 100,260" },
      { id: "L", points: "330,220 330,260" },
    ],
    ramp: [
      { points: "50,200 120,200 120,275 50,275", label: "NORTH FIELD" },
      { points: "140,240 260,240 260,300 140,300", label: "TERMINAL" },
      { points: "280,240 360,240 360,290 280,290", label: "CARGO" },
    ],
    buildings: [
      { x: 155, y: 305, w: 80, h: 20, label: "TERMINAL 1 / 2" },
      { x: 55, y: 280, w: 50, h: 15, label: "FBO" },
    ],
    beacon: { x: 380, y: 130 },
  },
};

const RunwaySvg = ({ runway }: { runway: RunwayData }) => {
  const rad = (runway.angle - 90) * (Math.PI / 180);
  const halfLen = runway.length / 2;
  const x1 = runway.cx - halfLen * Math.cos(rad);
  const y1 = runway.cy - halfLen * Math.sin(rad);
  const x2 = runway.cx + halfLen * Math.cos(rad);
  const y2 = runway.cy + halfLen * Math.sin(rad);

  // Threshold marks offset
  const threshOffset = 12;
  const tx1 = x1 + threshOffset * Math.cos(rad);
  const ty1 = y1 + threshOffset * Math.sin(rad);
  const tx2 = x2 - threshOffset * Math.cos(rad);
  const ty2 = y2 - threshOffset * Math.sin(rad);

  // Perpendicular for threshold marks
  const perpX = Math.sin(rad) * (runway.width / 2 - 1);
  const perpY = -Math.cos(rad) * (runway.width / 2 - 1);

  // Label positions (offset beyond runway ends)
  const labelOffset = 18;
  const lx1 = x1 - labelOffset * Math.cos(rad);
  const ly1 = y1 - labelOffset * Math.sin(rad);
  const lx2 = x2 + labelOffset * Math.cos(rad);
  const ly2 = y2 + labelOffset * Math.sin(rad);

  return (
    <g>
      {/* Runway surface */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="hsl(220 10% 35%)"
        strokeWidth={runway.width}
        strokeLinecap="butt"
      />
      {/* Centerline dashes */}
      <line
        x1={x1 + 20 * Math.cos(rad)} y1={y1 + 20 * Math.sin(rad)}
        x2={x2 - 20 * Math.cos(rad)} y2={y2 - 20 * Math.sin(rad)}
        stroke="hsl(0 0% 92%)"
        strokeWidth={0.8}
        strokeDasharray="8 6"
        opacity={0.6}
      />
      {/* Threshold marks */}
      <line x1={tx1 - perpX} y1={ty1 - perpY} x2={tx1 + perpX} y2={ty1 + perpY} stroke="hsl(0 0% 92%)" strokeWidth={1.5} opacity={0.8} />
      <line x1={tx2 - perpX} y1={ty2 - perpY} x2={tx2 + perpX} y2={ty2 + perpY} stroke="hsl(0 0% 92%)" strokeWidth={1.5} opacity={0.8} />
      {/* Runway number labels */}
      <text x={lx1} y={ly1} fill="hsl(0 0% 92%)" fontSize="9" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
        {runway.headings[0]}
      </text>
      <text x={lx2} y={ly2} fill="hsl(0 0% 92%)" fontSize="9" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
        {runway.headings[1]}
      </text>
    </g>
  );
};

const AircraftIcon = ({ x, y, heading }: { x: number; y: number; heading: number }) => (
  <g transform={`translate(${x},${y}) rotate(${heading - 90})`}>
    <polygon
      points="0,-6 -4,6 0,3 4,6"
      fill="hsl(160 100% 45%)"
      stroke="hsl(160 100% 55%)"
      strokeWidth={0.5}
    />
    {/* Range ring */}
    <circle cx={0} cy={0} r={14} fill="none" stroke="hsl(160 100% 45%)" strokeWidth={0.5} opacity={0.4} strokeDasharray="3 3" />
  </g>
);

export const SafeTaxiScreen = () => {
  const { flight } = useFlightData();
  const [selectedAirport, setSelectedAirport] = useState<string>("KMRY");

  const airport = AIRPORTS[selectedAirport];

  // Simple position mapping: place aircraft near a runway if close
  const ownshipX = 200;
  const ownshipY = 240;

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-avionics-divider bg-avionics-panel">
        <div className="flex items-center gap-1.5">
          <PlaneTakeoff className="w-3.5 h-3.5 text-avionics-cyan" />
          <span className="font-mono text-[10px] text-avionics-cyan tracking-wider">SAFETAXI</span>
        </div>
        <div className="flex gap-1">
          {Object.keys(AIRPORTS).map((icao) => (
            <button
              key={icao}
              onClick={() => setSelectedAirport(icao)}
              className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-colors ${
                selectedAirport === icao
                  ? "border-avionics-cyan text-avionics-cyan bg-avionics-button"
                  : "border-avionics-divider text-avionics-label hover:text-avionics-white"
              }`}
            >
              {icao}
            </button>
          ))}
        </div>
      </div>

      {/* Airport info strip */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-avionics-divider/50 bg-avionics-panel">
        <span className="font-mono text-[9px] text-avionics-white">{airport.name}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] text-avionics-label">ELEV <span className="text-avionics-amber">{airport.elevation}</span> FT</span>
          <span className="font-mono text-[8px] text-avionics-label">TWR <span className="text-avionics-green">{airport.towerFreq}</span></span>
          <span className="font-mono text-[8px] text-avionics-label">ATIS <span className="text-avionics-cyan">{airport.atisFreq}</span></span>
        </div>
      </div>

      {/* SVG Airport Diagram */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          viewBox={airport.viewBox}
          className="w-full h-full"
          style={{ background: "hsl(220 20% 6%)" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`vg${i}`} x1={(i + 1) * 40} y1={0} x2={(i + 1) * 40} y2={350} stroke="hsl(220 15% 12%)" strokeWidth={0.5} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`hg${i}`} x1={0} y1={(i + 1) * 40} x2={400} y2={(i + 1) * 40} stroke="hsl(220 15% 12%)" strokeWidth={0.5} />
          ))}

          {/* Ramp areas */}
          {airport.ramp.map((r, i) => (
            <g key={`ramp-${i}`}>
              <polygon points={r.points} fill="hsl(220 15% 15%)" stroke="hsl(220 15% 25%)" strokeWidth={1} />
              {(() => {
                const pts = r.points.split(" ").map(p => p.split(",").map(Number));
                const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
                const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
                return (
                  <text x={cx} y={cy} fill="hsl(220 10% 40%)" fontSize="7" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
                    {r.label}
                  </text>
                );
              })()}
            </g>
          ))}

          {/* Taxiways */}
          {airport.taxiways.map((tw) => (
            <g key={tw.id}>
              <polyline
                points={tw.points}
                fill="none"
                stroke="hsl(40 100% 40%)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.5}
              />
              {/* Taxiway label at midpoint */}
              {(() => {
                const pts = tw.points.split(" ").map(p => p.split(",").map(Number));
                const mid = pts[Math.floor(pts.length / 2)];
                return (
                  <text x={mid[0] + 8} y={mid[1] - 6} fill="hsl(40 100% 55%)" fontSize="8" fontFamily="Share Tech Mono" fontWeight="bold">
                    {tw.id}
                  </text>
                );
              })()}
            </g>
          ))}

          {/* Runways */}
          {airport.runways.map((rw) => (
            <RunwaySvg key={rw.id} runway={rw} />
          ))}

          {/* Buildings */}
          {airport.buildings.map((b, i) => (
            <g key={`bldg-${i}`}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="hsl(220 12% 20%)" stroke="hsl(220 15% 30%)" strokeWidth={0.8} rx={2} />
              {b.label && (
                <text x={b.x + b.w / 2} y={b.y + b.h / 2} fill="hsl(220 10% 55%)" fontSize="6" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
                  {b.label}
                </text>
              )}
            </g>
          ))}

          {/* Airport beacon */}
          <circle cx={airport.beacon.x} cy={airport.beacon.y} r={4} fill="none" stroke="hsl(160 100% 45%)" strokeWidth={1}>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={airport.beacon.x} cy={airport.beacon.y} r={1.5} fill="hsl(160 100% 45%)">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={airport.beacon.x} y={airport.beacon.y - 8} fill="hsl(160 100% 45%)" fontSize="6" fontFamily="Share Tech Mono" textAnchor="middle">BCN</text>

          {/* Ownship */}
          <AircraftIcon x={ownshipX} y={ownshipY} heading={flight.heading} />

          {/* ICAO label */}
          <text x={20} y={25} fill="hsl(185 100% 55%)" fontSize="14" fontFamily="Share Tech Mono" fontWeight="bold">
            {airport.icao}
          </text>
          <text x={20} y={38} fill="hsl(220 10% 50%)" fontSize="8" fontFamily="Share Tech Mono">
            AIRPORT DIAGRAM
          </text>

          {/* North arrow */}
          <g transform="translate(370,30)">
            <line x1={0} y1={12} x2={0} y2={-8} stroke="hsl(0 0% 92%)" strokeWidth={1} />
            <polygon points="0,-12 -4,-4 4,-4" fill="hsl(0 0% 92%)" />
            <text x={0} y={-15} fill="hsl(0 0% 92%)" fontSize="7" fontFamily="Share Tech Mono" textAnchor="middle">N</text>
          </g>

          {/* Scale bar */}
          <g transform="translate(20,330)">
            <line x1={0} y1={0} x2={50} y2={0} stroke="hsl(0 0% 60%)" strokeWidth={1} />
            <line x1={0} y1={-3} x2={0} y2={3} stroke="hsl(0 0% 60%)" strokeWidth={1} />
            <line x1={50} y1={-3} x2={50} y2={3} stroke="hsl(0 0% 60%)" strokeWidth={1} />
            <text x={25} y={-5} fill="hsl(0 0% 50%)" fontSize="6" fontFamily="Share Tech Mono" textAnchor="middle">1000 FT</text>
          </g>
        </svg>
      </div>

      {/* Runway info strip */}
      <div className="border-t border-avionics-divider bg-avionics-panel px-3 py-1.5">
        <div className="flex items-center gap-3 overflow-x-auto">
          {airport.runways.map((rw) => (
            <div key={rw.id} className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[9px] text-avionics-white">{rw.id}</span>
              <span className="font-mono text-[8px] text-avionics-label">{rw.surface.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-3 py-1 border-t border-avionics-divider">
        <span className="font-mono text-[10px] text-avionics-cyan">SAFETAXI</span>
      </div>
    </div>
  );
};
