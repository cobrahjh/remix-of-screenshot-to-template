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

interface GtnState {
  currentPage: GtnPage;
  previousPage: GtnPage | null;
  com: ComState;
  nav: NavState;
  xpdrCode: string;
  xpdrMode: "STBY" | "ON" | "ALT";
  comPanelOpen: boolean;
}

interface GtnContextValue extends GtnState {
  navigateTo: (page: GtnPage) => void;
  goBack: () => void;
  swapComFreqs: () => void;
  setComStandby: (freq: string) => void;
  toggleComPanel: () => void;
  setXpdrMode: (mode: "STBY" | "ON" | "ALT") => void;
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
  });

  const navigateTo = useCallback((page: GtnPage) => {
    setState(s => ({ ...s, previousPage: s.currentPage, currentPage: page, comPanelOpen: false }));
  }, []);

  const goBack = useCallback(() => {
    setState(s => ({
      ...s,
      currentPage: s.previousPage || "map",
      previousPage: null,
      comPanelOpen: false,
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
    setState(s => ({
      ...s,
      com: { ...s.com, standbyFreq: freq, standbyLabel: "" },
    }));
  }, []);

  const toggleComPanel = useCallback(() => {
    setState(s => ({ ...s, comPanelOpen: !s.comPanelOpen }));
  }, []);

  const setXpdrMode = useCallback((mode: "STBY" | "ON" | "ALT") => {
    setState(s => ({ ...s, xpdrMode: mode }));
  }, []);

  return (
    <GtnContext.Provider value={{ ...state, navigateTo, goBack, swapComFreqs, setComStandby, toggleComPanel, setXpdrMode }}>
      {children}
    </GtnContext.Provider>
  );
};
