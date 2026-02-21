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
  lengthFt: number; // runway length in feet
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
        lengthFt: 7616,
      },
      {
        id: "10L/28R",
        headings: ["10L", "28R"],
        cx: 200, cy: 200,
        length: 220, width: 10,
        angle: 100,
        surface: "asphalt",
        lengthFt: 3500,
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
        lengthFt: 4825,
      },
      {
        id: "14/32",
        headings: ["14", "32"],
        cx: 230, cy: 200,
        length: 180, width: 10,
        angle: 140,
        surface: "asphalt",
        lengthFt: 3300,
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
        lengthFt: 11000,
      },
      {
        id: "12R/30L",
        headings: ["12R", "30L"],
        cx: 230, cy: 190,
        length: 260, width: 14,
        angle: 120,
        surface: "concrete",
        lengthFt: 11000,
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
        lengthFt: 11870,
      },
      {
        id: "28R/10L",
        headings: ["28R", "10L"],
        cx: 210, cy: 160,
        length: 300, width: 14,
        angle: 100,
        surface: "asphalt",
        lengthFt: 11381,
      },
      {
        id: "01L/19R",
        headings: ["01L", "19R"],
        cx: 300, cy: 230,
        length: 240, width: 12,
        angle: 10,
        surface: "asphalt",
        lengthFt: 7650,
      },
      {
        id: "01R/19L",
        headings: ["01R", "19L"],
        cx: 340, cy: 230,
        length: 240, width: 12,
        angle: 10,
        surface: "asphalt",
        lengthFt: 8648,
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
        lengthFt: 10520,
      },
      {
        id: "10L/28R",
        headings: ["10L", "28R"],
        cx: 210, cy: 220,
        length: 260, width: 12,
        angle: 100,
        surface: "asphalt",
        lengthFt: 6213,
      },
      {
        id: "10R/28L",
        headings: ["10R", "28L"],
        cx: 210, cy: 260,
        length: 260, width: 12,
        angle: 100,
        surface: "asphalt",
        lengthFt: 5454,
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
  KLAX: {
    icao: "KLAX",
    name: "Los Angeles Intl",
    elevation: 126,
    towerFreq: "133.90",
    atisFreq: "133.80",
    viewBox: "0 0 440 380",
    runways: [
      {
        id: "6L/24R",
        headings: ["06L", "24R"],
        cx: 200, cy: 100,
        length: 310, width: 14,
        angle: 70,
        surface: "asphalt",
        lengthFt: 8925,
      },
      {
        id: "6R/24L",
        headings: ["06R", "24L"],
        cx: 200, cy: 145,
        length: 310, width: 14,
        angle: 70,
        surface: "asphalt",
        lengthFt: 10285,
      },
      {
        id: "7L/25R",
        headings: ["07L", "25R"],
        cx: 210, cy: 240,
        length: 310, width: 14,
        angle: 70,
        surface: "concrete",
        lengthFt: 12091,
      },
      {
        id: "7R/25L",
        headings: ["07R", "25L"],
        cx: 210, cy: 285,
        length: 310, width: 14,
        angle: 70,
        surface: "concrete",
        lengthFt: 11095,
      },
    ],
    taxiways: [
      { id: "AA", points: "50,125 140,125 220,125 340,125" },
      { id: "S", points: "50,195 140,195 260,195 350,195" },
      { id: "E", points: "120,100 120,145 120,195" },
      { id: "T", points: "200,100 200,145" },
      { id: "B", points: "280,100 280,145 280,195" },
      { id: "C", points: "130,195 130,240" },
      { id: "K", points: "230,195 230,240" },
      { id: "P", points: "300,240 300,285" },
    ],
    ramp: [
      { points: "60,150 180,150 180,190 60,190", label: "TERMINALS 1-3" },
      { points: "185,150 310,150 310,190 185,190", label: "TERMINALS 4-6" },
      { points: "120,295 280,295 280,340 120,340", label: "TERMINALS 7-8 / INTL" },
    ],
    buildings: [
      { x: 80, y: 160, w: 80, h: 18, label: "TERMINALS 1-3" },
      { x: 210, y: 160, w: 80, h: 18, label: "TERMINALS 4-6" },
      { x: 150, y: 345, w: 100, h: 18, label: "TOM BRADLEY INTL" },
    ],
    beacon: { x: 400, y: 80 },
  },
  KSAN: {
    icao: "KSAN",
    name: "San Diego Intl (Lindbergh)",
    elevation: 17,
    towerFreq: "118.30",
    atisFreq: "134.80",
    viewBox: "0 0 420 340",
    runways: [
      {
        id: "9/27",
        headings: ["09", "27"],
        cx: 210, cy: 160,
        length: 320, width: 16,
        angle: 90,
        surface: "asphalt",
        lengthFt: 9401,
      },
    ],
    taxiways: [
      { id: "A", points: "60,185 150,185 250,185 360,185" },
      { id: "B", points: "120,160 120,185" },
      { id: "C", points: "200,160 200,185" },
      { id: "E", points: "280,160 280,185" },
      { id: "F", points: "330,160 330,185 330,220" },
      { id: "G", points: "80,185 80,230" },
    ],
    ramp: [
      { points: "100,195 260,195 260,250 100,250", label: "TERMINAL 1 / 2" },
      { points: "270,195 360,195 360,240 270,240", label: "COMMUTER" },
      { points: "50,195 90,195 90,250 50,250", label: "GA" },
    ],
    buildings: [
      { x: 120, y: 255, w: 100, h: 18, label: "TERMINAL 1 / 2" },
      { x: 290, y: 245, w: 50, h: 14, label: "COMMUTER" },
    ],
    beacon: { x: 390, y: 130 },
  },
  KBUR: {
    icao: "KBUR",
    name: "Hollywood Burbank",
    elevation: 778,
    towerFreq: "118.70",
    atisFreq: "126.85",
    viewBox: "0 0 400 340",
    runways: [
      {
        id: "8/26",
        headings: ["08", "26"],
        cx: 200, cy: 140,
        length: 280, width: 14,
        angle: 80,
        surface: "asphalt",
        lengthFt: 6886,
      },
      {
        id: "15/33",
        headings: ["15", "33"],
        cx: 280, cy: 190,
        length: 200, width: 10,
        angle: 150,
        surface: "asphalt",
        lengthFt: 5801,
      },
    ],
    taxiways: [
      { id: "A", points: "60,165 140,165 240,165 340,165" },
      { id: "B", points: "120,140 120,165" },
      { id: "C", points: "200,140 200,165" },
      { id: "D", points: "260,140 260,165" },
      { id: "E", points: "160,165 160,220" },
      { id: "G", points: "310,165 310,190" },
    ],
    ramp: [
      { points: "60,175 150,175 150,240 60,240", label: "GA RAMP" },
      { points: "170,175 280,175 280,235 170,235", label: "TERMINAL" },
    ],
    buildings: [
      { x: 185, y: 240, w: 70, h: 18, label: "TERMINAL" },
      { x: 65, y: 245, w: 60, h: 14, label: "ATLANTIC FBO" },
    ],
    beacon: { x: 360, y: 110 },
  },
  KONT: {
    icao: "KONT",
    name: "Ontario Intl",
    elevation: 944,
    towerFreq: "121.90",
    atisFreq: "127.75",
    viewBox: "0 0 420 360",
    runways: [
      {
        id: "8L/26R",
        headings: ["08L", "26R"],
        cx: 210, cy: 130,
        length: 300, width: 14,
        angle: 80,
        surface: "asphalt",
        lengthFt: 12197,
      },
      {
        id: "8R/26L",
        headings: ["08R", "26L"],
        cx: 210, cy: 260,
        length: 300, width: 14,
        angle: 80,
        surface: "asphalt",
        lengthFt: 10200,
      },
    ],
    taxiways: [
      { id: "A", points: "60,155 140,155 240,155 360,155" },
      { id: "B", points: "60,235 140,235 240,235 360,235" },
      { id: "C", points: "120,130 120,155" },
      { id: "D", points: "200,130 200,155 200,195 200,235" },
      { id: "E", points: "280,130 280,155 280,195 280,235" },
      { id: "F", points: "340,130 340,155" },
      { id: "H", points: "140,235 140,260" },
      { id: "K", points: "320,235 320,260" },
    ],
    ramp: [
      { points: "100,160 180,160 180,230 100,230", label: "TERMINAL 2" },
      { points: "220,160 310,160 310,230 220,230", label: "TERMINAL 4" },
      { points: "320,160 380,160 380,210 320,210", label: "CARGO" },
      { points: "50,160 90,160 90,210 50,210", label: "GA" },
    ],
    buildings: [
      { x: 110, y: 185, w: 55, h: 18, label: "TERMINAL 2" },
      { x: 235, y: 185, w: 55, h: 18, label: "TERMINAL 4" },
      { x: 330, y: 215, w: 40, h: 14, label: "FED EX" },
    ],
    beacon: { x: 395, y: 100 },
  },
};

const RunwaySvg = ({ runway, index }: { runway: RunwayData; index: number }) => {
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

  // Perpendicular for threshold marks & hold short lines
  const perpX = Math.sin(rad) * (runway.width / 2 - 1);
  const perpY = -Math.cos(rad) * (runway.width / 2 - 1);

  // Extended perpendicular for hold short markings (wider than runway)
  const hsExtend = runway.width * 0.9;
  const hsPerpX = Math.sin(rad) * hsExtend;
  const hsPerpY = -Math.cos(rad) * hsExtend;

  // Hold short positions: ~25% from each end, offset perpendicular from runway edge
  const hsOffset1 = halfLen * 0.72;
  const hs1x = runway.cx - hsOffset1 * Math.cos(rad);
  const hs1y = runway.cy - hsOffset1 * Math.sin(rad);
  const hs2x = runway.cx + hsOffset1 * Math.cos(rad);
  const hs2y = runway.cy + hsOffset1 * Math.sin(rad);

  // ILS critical area: hatched zone near each threshold (~18% of runway from end)
  const ilsLen = halfLen * 0.22;
  const ils1StartX = x1;
  const ils1StartY = y1;
  const ils1EndX = x1 + ilsLen * Math.cos(rad);
  const ils1EndY = y1 + ilsLen * Math.sin(rad);
  const ils2StartX = x2;
  const ils2StartY = y2;
  const ils2EndX = x2 - ilsLen * Math.cos(rad);
  const ils2EndY = y2 - ilsLen * Math.sin(rad);

  // ILS critical area box corners (wider than runway for visibility)
  const ilsW = runway.width * 0.7;
  const ilsPerpX = Math.sin(rad) * ilsW;
  const ilsPerpY = -Math.cos(rad) * ilsW;

  // Label positions (offset beyond runway ends)
  const labelOffset = 18;
  const lx1 = x1 - labelOffset * Math.cos(rad);
  const ly1 = y1 - labelOffset * Math.sin(rad);
  const lx2 = x2 + labelOffset * Math.cos(rad);
  const ly2 = y2 + labelOffset * Math.sin(rad);

  const patternId = `ils-hatch-${index}`;

  return (
    <g>
      {/* ILS hatch pattern definition */}
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform={`rotate(${runway.angle + 45})`}>
          <line x1="0" y1="0" x2="0" y2="4" stroke="hsl(0 85% 55%)" strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>

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

      {/* Hold Short Markings — double yellow lines perpendicular to runway */}
      {/* Hold short 1 (near heading[0] end) */}
      <line x1={hs1x - hsPerpX} y1={hs1y - hsPerpY} x2={hs1x + hsPerpX} y2={hs1y + hsPerpY}
        stroke="hsl(50 100% 50%)" strokeWidth={1.8} opacity={0.85} />
      <line
        x1={hs1x - hsPerpX + 3 * Math.cos(rad)} y1={hs1y - hsPerpY + 3 * Math.sin(rad)}
        x2={hs1x + hsPerpX + 3 * Math.cos(rad)} y2={hs1y + hsPerpY + 3 * Math.sin(rad)}
        stroke="hsl(50 100% 50%)" strokeWidth={1} strokeDasharray="3 2" opacity={0.7} />
      {/* HS label */}
      <text
        x={hs1x - hsPerpX - 6 * Math.sin(rad)} y={hs1y - hsPerpY + 6 * Math.cos(rad)}
        fill="hsl(50 100% 50%)" fontSize="5" fontFamily="Share Tech Mono" textAnchor="middle" opacity={0.8}
      >HS</text>

      {/* Hold short 2 (near heading[1] end) */}
      <line x1={hs2x - hsPerpX} y1={hs2y - hsPerpY} x2={hs2x + hsPerpX} y2={hs2y + hsPerpY}
        stroke="hsl(50 100% 50%)" strokeWidth={1.8} opacity={0.85} />
      <line
        x1={hs2x - hsPerpX - 3 * Math.cos(rad)} y1={hs2y - hsPerpY - 3 * Math.sin(rad)}
        x2={hs2x + hsPerpX - 3 * Math.cos(rad)} y2={hs2y + hsPerpY - 3 * Math.sin(rad)}
        stroke="hsl(50 100% 50%)" strokeWidth={1} strokeDasharray="3 2" opacity={0.7} />
      <text
        x={hs2x + hsPerpX + 6 * Math.sin(rad)} y={hs2y + hsPerpY - 6 * Math.cos(rad)}
        fill="hsl(50 100% 50%)" fontSize="5" fontFamily="Share Tech Mono" textAnchor="middle" opacity={0.8}
      >HS</text>

      {/* ILS Critical Area — hatched polygon near each threshold */}
      {/* ILS area 1 (heading[0] approach end) */}
      <polygon
        points={`${ils1StartX - ilsPerpX},${ils1StartY - ilsPerpY} ${ils1StartX + ilsPerpX},${ils1StartY + ilsPerpY} ${ils1EndX + ilsPerpX},${ils1EndY + ilsPerpY} ${ils1EndX - ilsPerpX},${ils1EndY - ilsPerpY}`}
        fill={`url(#${patternId})`}
        stroke="hsl(0 85% 55%)"
        strokeWidth={0.6}
        opacity={0.6}
      />
      <text
        x={(ils1StartX + ils1EndX) / 2 - ilsPerpX * 1.6}
        y={(ils1StartY + ils1EndY) / 2 - ilsPerpY * 1.6}
        fill="hsl(0 85% 55%)" fontSize="4.5" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central" opacity={0.8}
      >ILS</text>

      {/* ILS area 2 (heading[1] approach end) */}
      <polygon
        points={`${ils2StartX - ilsPerpX},${ils2StartY - ilsPerpY} ${ils2StartX + ilsPerpX},${ils2StartY + ilsPerpY} ${ils2EndX + ilsPerpX},${ils2EndY + ilsPerpY} ${ils2EndX - ilsPerpX},${ils2EndY - ilsPerpY}`}
        fill={`url(#${patternId})`}
        stroke="hsl(0 85% 55%)"
        strokeWidth={0.6}
        opacity={0.6}
      />
      <text
        x={(ils2StartX + ils2EndX) / 2 + ilsPerpX * 1.6}
        y={(ils2StartY + ils2EndY) / 2 + ilsPerpY * 1.6}
        fill="hsl(0 85% 55%)" fontSize="4.5" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central" opacity={0.8}
      >ILS</text>

      {/* Runway number labels */}
      <text x={lx1} y={ly1} fill="hsl(0 0% 92%)" fontSize="9" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
        {runway.headings[0]}
      </text>
      <text x={lx2} y={ly2} fill="hsl(0 0% 92%)" fontSize="9" fontFamily="Share Tech Mono" textAnchor="middle" dominantBaseline="central">
        {runway.headings[1]}
      </text>

      {/* Runway length label (in feet) centered on runway */}
      <text
        x={runway.cx + Math.sin(rad) * (runway.width / 2 + 7)}
        y={runway.cy - Math.cos(rad) * (runway.width / 2 + 7)}
        fill="hsl(190 80% 70%)"
        fontSize="5.5"
        fontFamily="Share Tech Mono"
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(${runway.angle - 90}, ${runway.cx + Math.sin(rad) * (runway.width / 2 + 7)}, ${runway.cy - Math.cos(rad) * (runway.width / 2 + 7)})`}
        opacity={0.9}
      >{runway.lengthFt.toLocaleString()}&apos;</text>
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
          {airport.runways.map((rw, i) => (
            <RunwaySvg key={rw.id} runway={rw} index={i} />
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
