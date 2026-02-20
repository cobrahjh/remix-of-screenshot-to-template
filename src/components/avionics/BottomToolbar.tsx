import { RotateCcw, Menu, Circle, Compass } from "lucide-react";

interface BottomButtonProps {
  icon: React.ReactNode;
  label: string;
}

const BottomButton = ({ icon, label }: BottomButtonProps) => (
  <button className="flex flex-col items-center justify-center gap-1 px-5 py-2 hover:bg-avionics-button-hover active:bg-avionics-button-active transition-colors border-r border-avionics-divider last:border-r-0">
    <div className="w-8 h-8 flex items-center justify-center rounded bg-avionics-button avionics-bezel">
      {icon}
    </div>
    <span className="text-[10px] text-avionics-white font-medium">{label}</span>
  </button>
);

export const BottomToolbar = () => {
  return (
    <div className="bg-avionics-panel">
      {/* Nav mode indicators */}
      <div className="flex items-center border-b border-avionics-divider">
        <div className="flex-1 text-center py-1">
          <span className="font-mono text-xs text-avionics-green avionics-glow-green">LPV</span>
        </div>
        <div className="w-px h-4 bg-avionics-divider" />
        <div className="flex-1 text-center py-1">
          <span className="font-mono text-xs text-avionics-green avionics-glow-green">GPS</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-stretch">
        <BottomButton
          icon={<RotateCcw className="w-4 h-4 text-avionics-white" />}
          label="Back"
        />
        <BottomButton
          icon={<Menu className="w-4 h-4 text-avionics-white" />}
          label="Menu"
        />
        <BottomButton
          icon={<Circle className="w-4 h-4 text-avionics-cyan" />}
          label="CDI"
        />
        <BottomButton
          icon={<Compass className="w-4 h-4 text-avionics-cyan" />}
          label="OBS"
        />
      </div>
    </div>
  );
};
