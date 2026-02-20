import React, { createContext, useContext, useState, useCallback } from "react";

export type GtnPage = "map" | "home" | "traffic" | "terrain" | "weather" | "charts" | "flightplan" | "proc" | "nearest" | "waypoint" | "services" | "utilities" | "system";

interface ComState {
  activeFreq: string;
  standbyFreq: string;
  activeLabel: string;
  standbyLabel: string;
}

interface NavState {
  activeFreq: string;
  standbyFreq: string;
}

interface AudioState {
  splitMode: boolean;
  cabinSpeaker: boolean;
  markerAudio: boolean;
  highSense: boolean;
  audio3d: boolean;
  pilotRadios: { com1: boolean; com2: boolean; com3: boolean; nav1: boolean; nav2: boolean };
  coPilotRadios: { com1: boolean; com2: boolean; com3: boolean; nav1: boolean; nav2: boolean };
}

interface GtnState {
  currentPage: GtnPage;
  previousPage: GtnPage | null;
  com: ComState;
  nav: NavState;
  xpdrCode: string;
  xpdrMode: "STBY" | "ON" | "ALT";
  comPanelOpen: boolean;
  audioPanelOpen: boolean;
  xpdrPanelOpen: boolean;
  audio: AudioState;
}

interface GtnContextValue extends GtnState {
  navigateTo: (page: GtnPage) => void;
  goBack: () => void;
  swapComFreqs: () => void;
  setComStandby: (freq: string) => void;
  toggleComPanel: () => void;
  toggleAudioPanel: () => void;
  toggleXpdrPanel: () => void;
  setXpdrMode: (mode: "STBY" | "ON" | "ALT") => void;
  setXpdrCode: (code: string) => void;
  toggleAudioSetting: (key: keyof Pick<AudioState, "splitMode" | "cabinSpeaker" | "markerAudio" | "highSense" | "audio3d">) => void;
}

const GtnContext = createContext<GtnContextValue | null>(null);

export const useGtn = () => {
  const ctx = useContext(GtnContext);
  if (!ctx) throw new Error("useGtn must be used within GtnProvider");
  return ctx;
};

export const GtnProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GtnState>({
    currentPage: "map",
    previousPage: null,
    com: {
      activeFreq: "133.00",
      standbyFreq: "119.52",
      activeLabel: "APPROACH+",
      standbyLabel: "KSNS TWR",
    },
    nav: {
      activeFreq: "117.30",
      standbyFreq: "114.00",
    },
    xpdrCode: "6062",
    xpdrMode: "ALT",
    comPanelOpen: false,
    audioPanelOpen: false,
    xpdrPanelOpen: false,
    audio: {
      splitMode: false,
      cabinSpeaker: true,
      markerAudio: true,
      highSense: false,
      audio3d: false,
      pilotRadios: { com1: true, com2: false, com3: false, nav1: true, nav2: false },
      coPilotRadios: { com1: true, com2: false, com3: false, nav1: false, nav2: false },
    },
  });

  const closeAllPanels = () => ({ comPanelOpen: false, audioPanelOpen: false, xpdrPanelOpen: false });

  const navigateTo = useCallback((page: GtnPage) => {
    setState(s => ({ ...s, previousPage: s.currentPage, currentPage: page, ...closeAllPanels() }));
  }, []);

  const goBack = useCallback(() => {
    setState(s => ({
      ...s,
      currentPage: s.previousPage || "map",
      previousPage: null,
      ...closeAllPanels(),
    }));
  }, []);

  const swapComFreqs = useCallback(() => {
    setState(s => ({
      ...s,
      com: {
        ...s.com,
        activeFreq: s.com.standbyFreq,
        standbyFreq: s.com.activeFreq,
        activeLabel: s.com.standbyLabel,
        standbyLabel: s.com.activeLabel,
      },
    }));
  }, []);

  const setComStandby = useCallback((freq: string) => {
    setState(s => ({ ...s, com: { ...s.com, standbyFreq: freq, standbyLabel: "" } }));
  }, []);

  const toggleComPanel = useCallback(() => {
    setState(s => ({ ...s, comPanelOpen: !s.comPanelOpen, audioPanelOpen: false, xpdrPanelOpen: false }));
  }, []);

  const toggleAudioPanel = useCallback(() => {
    setState(s => ({ ...s, audioPanelOpen: !s.audioPanelOpen, comPanelOpen: false, xpdrPanelOpen: false }));
  }, []);

  const toggleXpdrPanel = useCallback(() => {
    setState(s => ({ ...s, xpdrPanelOpen: !s.xpdrPanelOpen, comPanelOpen: false, audioPanelOpen: false }));
  }, []);

  const setXpdrMode = useCallback((mode: "STBY" | "ON" | "ALT") => {
    setState(s => ({ ...s, xpdrMode: mode }));
  }, []);

  const setXpdrCode = useCallback((code: string) => {
    setState(s => ({ ...s, xpdrCode: code }));
  }, []);

  const toggleAudioSetting = useCallback((key: keyof Pick<AudioState, "splitMode" | "cabinSpeaker" | "markerAudio" | "highSense" | "audio3d">) => {
    setState(s => ({ ...s, audio: { ...s.audio, [key]: !s.audio[key] } }));
  }, []);

  return (
    <GtnContext.Provider value={{
      ...state, navigateTo, goBack, swapComFreqs, setComStandby,
      toggleComPanel, toggleAudioPanel, toggleXpdrPanel,
      setXpdrMode, setXpdrCode, toggleAudioSetting,
    }}>
      {children}
    </GtnContext.Provider>
  );
};
