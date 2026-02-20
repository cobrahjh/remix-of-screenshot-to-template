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
import { SystemScreen } from "@/components/avionics/screens/SystemScreen";
import { UtilitiesScreen } from "@/components/avionics/screens/UtilitiesScreen";
import { PlaceholderScreen } from "@/components/avionics/screens/PlaceholderScreen";
import { Home } from "lucide-react";

const GtnDisplay = () => {
  const { currentPage, comPanelOpen, audioPanelOpen, xpdrPanelOpen, navigateTo } = useGtn();

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
        return <WeatherScreen />;
      case "system":
        return <SystemScreen />;
      case "utilities":
        return <UtilitiesScreen />;
      default:
        return <PlaceholderScreen page={currentPage} />;
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl overflow-hidden avionics-bezel border-2 border-avionics-divider bg-avionics-panel-dark flex flex-col" style={{ height: "min(85vh, 680px)" }}>
      {/* Header */}
      <div className="bg-avionics-panel border-b border-avionics-divider px-3 py-1 flex items-center justify-between">
        <span className="font-body text-[10px] text-avionics-label tracking-[0.3em] uppercase font-semibold">
          Avionics
        </span>
        <button
          onClick={() => navigateTo("home")}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <Home className="w-3 h-3 text-avionics-cyan" />
          <span className="text-[9px] text-avionics-cyan font-mono">HOME</span>
        </button>
      </div>

      {/* Top frequency bar */}
      <TopBar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {renderScreen()}
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
