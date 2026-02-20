import { TopBar } from "@/components/avionics/TopBar";
import { NavInfoStrip } from "@/components/avionics/NavInfoStrip";
import { MapDisplay } from "@/components/avionics/MapDisplay";
import { FlightPlanStrip } from "@/components/avionics/FlightPlanStrip";
import { BottomToolbar } from "@/components/avionics/BottomToolbar";

const Index = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Device frame */}
      <div className="w-full max-w-md rounded-xl overflow-hidden avionics-bezel border-2 border-avionics-divider bg-avionics-panel-dark flex flex-col" style={{ height: "min(85vh, 680px)" }}>
        {/* Garmin header */}
        <div className="bg-avionics-panel border-b border-avionics-divider px-3 py-1.5 flex items-center justify-center">
          <span className="font-body text-xs text-avionics-label tracking-[0.3em] uppercase font-semibold">
            Garmin
          </span>
        </div>

        {/* Top frequency bar */}
        <TopBar />

        {/* Nav info strip */}
        <NavInfoStrip />

        {/* Map display area */}
        <MapDisplay />

        {/* Flight plan strip */}
        <FlightPlanStrip />

        {/* Bottom toolbar */}
        <BottomToolbar />
      </div>
    </div>
  );
};

export default Index;
