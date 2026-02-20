interface FrequencyDisplayProps {
  label: string;
  activeFreq: string;
  standbyFreq: string;
  standbyLabel?: string;
}

const FrequencyDisplay = ({ label, activeFreq, standbyFreq, standbyLabel }: FrequencyDisplayProps) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-avionics-label uppercase tracking-wider">{label}</span>
      <span className="font-mono text-lg text-avionics-green avionics-glow-green font-bold leading-none">
        {activeFreq}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-avionics-label uppercase tracking-wider">
        {standbyLabel || "STBY"}
      </span>
      <span className="font-mono text-sm text-avionics-cyan leading-none">
        {standbyFreq}
      </span>
    </div>
  </div>
);

export const TopBar = () => {
  return (
    <div className="flex items-stretch bg-avionics-panel border-b border-avionics-divider">
      {/* COM Frequencies */}
      <div className="flex items-center px-3 py-2 border-r border-avionics-divider">
        <div className="flex flex-col mr-1">
          <span className="text-[9px] text-avionics-label">COM</span>
          <span className="text-[9px] text-avionics-label">Vol</span>
          <span className="text-[8px] text-avionics-label">Psn</span>
          <span className="text-[8px] text-avionics-label">Sq</span>
        </div>
        <FrequencyDisplay
          label="APPROACH+"
          activeFreq="133.00"
          standbyFreq="119.52"
          standbyLabel="KSNS TWR"
        />
      </div>

      {/* Audio Panel */}
      <button className="flex flex-col items-center justify-center px-4 py-2 border-r border-avionics-divider hover:bg-avionics-button-hover transition-colors">
        <span className="text-xs text-avionics-white font-medium">Audio</span>
        <span className="text-xs text-avionics-white font-medium">Panel</span>
      </button>

      {/* MIC/MON indicators */}
      <div className="flex flex-col items-center justify-center px-3 py-2 border-r border-avionics-divider gap-1">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-avionics-label">MIC</span>
          <span className="bg-avionics-green text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-sm">
            1
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-avionics-label">MON</span>
          <span className="bg-avionics-green text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-sm">
            1
          </span>
        </div>
      </div>

      {/* Intercom */}
      <button className="flex flex-col items-center justify-center px-4 py-2 border-r border-avionics-divider hover:bg-avionics-button-hover transition-colors">
        <span className="text-xs text-avionics-white font-medium">Intercom</span>
      </button>

      {/* XPDR */}
      <div className="flex items-center px-3 py-2 border-r border-avionics-divider">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-avionics-label">XPDR</span>
          <span className="text-xs text-avionics-white">IDEN</span>
        </div>
      </div>

      {/* Transponder Code */}
      <div className="flex items-center px-3 py-2">
        <span className="font-mono text-xl text-avionics-green avionics-glow-green font-bold">
          6061
        </span>
      </div>

      {/* ALT indicator */}
      <div className="flex items-center px-2 py-2">
        <span className="text-[10px] text-avionics-label">ALT</span>
      </div>
    </div>
  );
};
