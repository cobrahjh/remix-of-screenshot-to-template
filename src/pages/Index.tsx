import { GtnProvider, useGtn } from "@/components/avionics/GtnContext";
import { TopBar } from "@/components/avionics/TopBar";
import { NavInfoStrip } from "@/components/avionics/NavInfoStrip";
import { MapDisplay } from "@/components/avionics/MapDisplay";
import { FlightPlanStrip } from "@/components/avionics/FlightPlanStrip";
import { BottomToolbar } from "@/components/avionics/BottomToolbar";
import { ComPanel } from "@/components/avionics/ComPanel";
import { AudioPanel } from "@/components/avionics/AudioPanel";
import { XpdrPanel } from "@/components/avionics/XpdrPanel";
import { HomeScreen } from "@/components/avionics/screens/HomeScreen";
import { TrafficScreen } from "@/components/avionics/screens/TrafficScreen";
import { TerrainScreen } from "@/components/avionics/screens/TerrainScreen";
import { WeatherScreen } from "@/components/avionics/screens/WeatherScreen";
import { WeatherDetailScreen } from "@/components/avionics/screens/WeatherDetailScreen";
import { SystemScreen } from "@/components/avionics/screens/SystemScreen";
import { UtilitiesScreen } from "@/components/avionics/screens/UtilitiesScreen";
import { FlightPlanScreen } from "@/components/avionics/screens/FlightPlanScreen";
import { ProceduresScreen } from "@/components/avionics/screens/ProceduresScreen";
import { DirectToScreen } from "@/components/avionics/screens/DirectToScreen";
import { EmergencyScreen } from "@/components/avionics/screens/EmergencyScreen";
import { NearestScreen } from "@/components/avionics/screens/NearestScreen";
import { ChartsScreen } from "@/components/avionics/screens/ChartsScreen";
import { WaypointScreen } from "@/components/avionics/screens/WaypointScreen";
import { PlaceholderScreen } from "@/components/avionics/screens/PlaceholderScreen";
import { CdiBar } from "@/components/avionics/CdiBar";
import { Home, Navigation } from "lucide-react";

const GtnDisplay = () => {
  const { currentPage, comPanelOpen, audioPanelOpen, xpdrPanelOpen, navigateTo, smartGlideActive, directToTarget } = useGtn();

  const renderScreen = () => {
    switch (currentPage) {
      case "map":
        return (
          <>
            <NavInfoStrip />
            <MapDisplay />
            <FlightPlanStrip />
          </>
        );
      case "home":
        return <HomeScreen />;
      case "traffic":
        return <TrafficScreen />;
      case "terrain":
        return <TerrainScreen />;
      case "weather":
        return <WeatherDetailScreen />;
      case "system":
        return <SystemScreen />;
      case "utilities":
        return <UtilitiesScreen />;
      case "flightplan":
        return <FlightPlanScreen />;
      case "proc":
        return <ProceduresScreen />;
      case "directto":
        return <DirectToScreen />;
      case "emergency":
        return <EmergencyScreen />;
      case "nearest":
        return <NearestScreen />;
      case "charts":
        return <ChartsScreen />;
      case "waypoint":
        return <WaypointScreen />;
      default:
        return <PlaceholderScreen page={currentPage} />;
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden avionics-bezel border-2 border-avionics-divider bg-avionics-panel-dark flex flex-col" style={{ height: "min(85vh, 680px)" }}>
      {/* Header */}
      <div className={`border-b border-avionics-divider px-3 py-1 flex items-center justify-between ${smartGlideActive ? "bg-destructive/20" : "bg-avionics-panel"}`}>
        <span className="font-body text-[10px] text-avionics-label tracking-[0.3em] uppercase font-semibold">
          {smartGlideActive ? "⚠ EMERGENCY" : "Avionics"}
        </span>
        <div className="flex items-center gap-2">
          {directToTarget && (
            <span className="font-mono text-[9px] text-avionics-magenta">D→ {directToTarget}</span>
          )}
          <button
            onClick={() => navigateTo("directto")}
            className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
          >
            <Navigation className="w-3 h-3 text-avionics-magenta" />
            <span className="text-[9px] text-avionics-magenta font-mono">D→</span>
          </button>
          <button
            onClick={() => navigateTo("home")}
            className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
          >
            <Home className="w-3 h-3 text-avionics-cyan" />
            <span className="text-[9px] text-avionics-cyan font-mono">HOME</span>
          </button>
        </div>
      </div>

      {/* Top frequency bar */}
      <TopBar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {renderScreen()}
        {currentPage === "map" && <CdiBar />}
        {comPanelOpen && <ComPanel />}
        {audioPanelOpen && <AudioPanel />}
        {xpdrPanelOpen && <XpdrPanel />}
      </div>

      {/* Bottom toolbar */}
      <BottomToolbar />
    </div>
  );
};

const Index = () => {
  return (
    <GtnProvider>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <GtnDisplay />
      </div>
    </GtnProvider>
  );
};

export default Index;
