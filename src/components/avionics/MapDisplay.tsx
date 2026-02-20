import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGtn } from "./GtnContext";
import { useFlightData } from "./FlightDataContext";

const NEXRAD_URL = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png";

const NEXRAD_LEGEND = [
  { color: "hsl(120 80% 35%)", label: "Light" },
  { color: "hsl(60 90% 45%)", label: "Mod" },
  { color: "hsl(30 100% 50%)", label: "Heavy" },
  { color: "hsl(0 90% 50%)", label: "Extreme" },
  { color: "hsl(300 70% 50%)", label: "Hail" },
];

export const MapDisplay = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const aircraftMarker = useRef<L.Marker | null>(null);
  const nexradLayer = useRef<L.TileLayer | null>(null);
  const { flightPlan, activeWaypointIndex } = useGtn();
  const { flight, connectionMode } = useFlightData();
  const isLive = connectionMode !== "none";
  const [nexradOn, setNexradOn] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [flight.lat, flight.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Flight plan route polyline (magenta)
    const routeCoords = flightPlan.map((wp) => [wp.lat, wp.lng] as L.LatLngTuple);
    L.polyline(routeCoords, {
      color: "hsl(300, 80%, 60%)",
      weight: 3,
      opacity: 0.85,
      dashArray: "8, 6",
    }).addTo(map);

    // Waypoint markers
    flightPlan.forEach((wp, i) => {
      const isActive = i === activeWaypointIndex;
      const isAirport = wp.type === "airport";
      const size = isAirport ? 14 : 10;
      const color = isActive
        ? "hsl(300, 80%, 60%)"
        : isAirport
        ? "hsl(160, 100%, 45%)"
        : "hsl(185, 100%, 55%)";

      const icon = L.divIcon({
        className: "",
        html: isAirport
          ? `<svg width="${size}" height="${size}" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" fill="none" stroke="${color}" stroke-width="2"/><line x1="7" y1="1" x2="7" y2="13" stroke="${color}" stroke-width="1.2"/><line x1="1" y1="7" x2="13" y2="7" stroke="${color}" stroke-width="1.2"/></svg>`
          : `<svg width="${size}" height="${size}" viewBox="0 0 12 12"><polygon points="6,1 11,6 6,11 1,6" fill="${isActive ? color : 'none'}" stroke="${color}" stroke-width="1.5"/></svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([wp.lat, wp.lng], { icon }).addTo(map);
      marker.bindTooltip(
        `<span style="font-family:'Share Tech Mono',monospace;font-size:10px;color:${color};background:hsla(220,20%,8%,0.85);padding:1px 4px;border:1px solid ${color};border-radius:2px;">${wp.name}${wp.alt ? ` ${wp.alt}'` : ""}</span>`,
        { permanent: true, direction: "right", offset: [6, 0], className: "leaflet-tooltip-avionics" }
      );
    });

    // Aircraft marker
    const aircraftIcon = L.divIcon({
      className: "",
      html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L12 22M12 2L8 8M12 2L16 8M4 14H20" stroke="hsl(0,0%,92%)" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    aircraftMarker.current = L.marker([flight.lat, flight.lng], { icon: aircraftIcon, zIndexOffset: 1000 }).addTo(map);
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; aircraftMarker.current = null; nexradLayer.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle NEXRAD layer
  useEffect(() => {
    if (!mapInstance.current) return;
    if (nexradOn) {
      if (!nexradLayer.current) {
        nexradLayer.current = L.tileLayer(NEXRAD_URL, {
          opacity: 0.55,
          maxZoom: 19,
          zIndex: 500,
        });
      }
      nexradLayer.current.addTo(mapInstance.current);
    } else {
      if (nexradLayer.current && mapInstance.current.hasLayer(nexradLayer.current)) {
        mapInstance.current.removeLayer(nexradLayer.current);
      }
    }
  }, [nexradOn]);

  // Update aircraft position when flight data changes
  useEffect(() => {
    if (!aircraftMarker.current || !mapInstance.current) return;
    aircraftMarker.current.setLatLng([flight.lat, flight.lng]);

    // Rotate aircraft SVG
    const el = aircraftMarker.current.getElement();
    if (el) {
      el.style.transformOrigin = "center center";
      el.style.transform = `${el.style.transform?.replace(/rotate\([^)]+\)/, '') || ''} rotate(${flight.heading}deg)`;
    }

    if (isLive) {
      mapInstance.current.panTo([flight.lat, flight.lng], { animate: true, duration: 0.5 });
    }
  }, [flight.lat, flight.lng, flight.heading, isLive]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />

      {/* Connection status overlay */}
      <div className="absolute top-2 left-2 z-[1000] flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-avionics-green animate-pulse" : "bg-avionics-divider"}`} />
        <span className="font-mono text-[9px] text-avionics-label bg-avionics-panel-dark/80 px-1.5 py-0.5 rounded">
          {connectionMode === "test" ? "TEST" : connectionMode === "flowpro" ? "FLOW PRO" : connectionMode === "websocket" ? "WS BRIDGE" : "STATIC"}
        </span>
      </div>

      {/* NEXRAD toggle */}
      <div className="absolute top-2 right-2 z-[1000] flex flex-col items-end gap-1">
        <button
          onClick={() => setNexradOn(!nexradOn)}
          className={`font-mono text-[9px] px-2 py-1 rounded border transition-colors ${
            nexradOn
              ? "border-avionics-green text-avionics-green bg-avionics-panel-dark/90"
              : "border-avionics-divider text-avionics-label bg-avionics-panel-dark/80 hover:text-avionics-white"
          }`}
        >
          {nexradOn ? "NXRD ON" : "NXRD OFF"}
        </button>

        {/* Legend */}
        {nexradOn && (
          <div className="bg-avionics-panel-dark/90 border border-avionics-divider rounded px-2 py-1.5 flex flex-col gap-0.5">
            <span className="font-mono text-[7px] text-avionics-label mb-0.5">NEXRAD</span>
            {NEXRAD_LEGEND.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="font-mono text-[7px] text-avionics-white">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Range indicator */}
      <div className="absolute bottom-2 left-2 z-[1000] font-mono text-[9px] text-avionics-label bg-avionics-panel-dark/80 px-1.5 py-0.5 rounded">
        20 NM
      </div>
    </div>
  );
};
