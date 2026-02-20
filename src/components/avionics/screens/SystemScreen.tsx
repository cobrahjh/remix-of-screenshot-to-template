import { useState } from "react";

type Tab = "setup" | "alerts" | "units" | "backlight" | "shortcuts";

const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-[10px] font-mono transition-colors border-b-2 ${
      active ? "text-avionics-cyan border-avionics-cyan" : "text-avionics-label border-transparent hover:text-avionics-white"
    }`}
  >
    {label}
  </button>
);

const SettingRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 px-3 border-b border-avionics-divider/50">
    <span className="text-[10px] text-avionics-white">{label}</span>
    <span className="text-[10px] text-avionics-cyan font-mono">{value}</span>
  </div>
);

export const SystemScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>("setup");

  return (
    <div className="flex-1 flex flex-col bg-avionics-panel-dark overflow-hidden">
      <div className="flex items-center px-3 py-1.5 bg-avionics-panel border-b border-avionics-divider">
        <span className="font-mono text-xs text-avionics-white">System</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-avionics-panel border-b border-avionics-divider overflow-x-auto">
        {(["setup", "alerts", "units", "backlight", "shortcuts"] as Tab[]).map(tab => (
          <TabButton key={tab} label={tab.charAt(0).toUpperCase() + tab.slice(1)} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "setup" && (
          <div>
            <SettingRow label="CDI Scale" value="Auto" />
            <SettingRow label="Nearest Apt Runway" value="Hard Only" />
            <SettingRow label="Time Format" value="Local 24hr" />
            <SettingRow label="Keyboard Type" value="ABC" />
            <SettingRow label="FPL Import" value="Enabled" />
            <SettingRow label="Crossfill" value="On" />
            <SettingRow label="Speed Constraints" value="Enabled" />
          </div>
        )}
        {activeTab === "alerts" && (
          <div>
            <SettingRow label="Airspace Alerts" value="On" />
            <SettingRow label="Arrival Alert" value="2.0 NM" />
            <SettingRow label="RAIM Alert" value="On" />
          </div>
        )}
        {activeTab === "units" && (
          <div>
            <SettingRow label="Altitude/Vertical" value="Feet (ft/fpm)" />
            <SettingRow label="Distance/Speed" value="NM/kt" />
            <SettingRow label="Fuel" value="Gallons" />
            <SettingRow label="NAV Angle" value="Magnetic (°)" />
            <SettingRow label="Position Format" value="LAT/LON DD°MM.M'" />
            <SettingRow label="Pressure" value="in Hg" />
            <SettingRow label="Temperature" value="°C" />
          </div>
        )}
        {activeTab === "backlight" && (
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-avionics-white">Level</span>
                <span className="font-mono text-xs text-avionics-green">100%</span>
              </div>
              <div className="w-full h-2 bg-avionics-inset rounded-full overflow-hidden">
                <div className="h-full bg-avionics-green rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-avionics-white">Manual Offset</span>
                <span className="font-mono text-xs text-avionics-cyan">+0.0%</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "shortcuts" && (
          <div>
            <SettingRow label="Slot 1" value="Map" />
            <SettingRow label="Slot 2" value="FPL" />
            <SettingRow label="Slot 3" value="TERR" />
            <SettingRow label="Slot 4" value="Traffic" />
            <SettingRow label="Slot 5" value="Weather" />
            <SettingRow label="Slot 6" value="Charts" />
            <SettingRow label="Slot 7" value="VNAV" />
          </div>
        )}
      </div>
    </div>
  );
};
