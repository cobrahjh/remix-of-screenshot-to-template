import React, { createContext, useContext, useState, useCallback } from "react";

export type GtnPage = "map" | "home" | "traffic" | "terrain" | "weather" | "charts" | "flightplan" | "proc" | "nearest" | "waypoint" | "services" | "utilities" | "system" | "directto" | "emergency";

export interface FlightPlanWaypoint {
  id: string;
  name: string;
  type: "airport" | "vor" | "ndb" | "fix" | "user";
  dtk: number;
  dis: number;
  alt?: number;
  ete: string;
  active?: boolean;
}

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
  flightPlan: FlightPlanWaypoint[];
  activeWaypointIndex: number;
  smartGlideActive: boolean;
  emergencyDescentActive: boolean;
  directToTarget: string | null;
  gpsPhase: "ENR" | "TERM" | "APCH" | "GA";
  obsMode: boolean;
  obsCourse: number;
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
  activateDirectTo: (waypoint: string) => void;
  cancelDirectTo: () => void;
  toggleSmartGlide: () => void;
  toggleEmergencyDescent: () => void;
  setActiveWaypoint: (index: number) => void;
  toggleObs: () => void;
  setObsCourse: (course: number) => void;
}

const GtnContext = createContext<GtnContextValue | null>(null);

export const useGtn = () => {
  const ctx = useContext(GtnContext);
  if (!ctx) throw new Error("useGtn must be used within GtnProvider");
  return ctx;
};

const defaultFlightPlan: FlightPlanWaypoint[] = [
  { id: "1", name: "KSNS", type: "airport", dtk: 315, dis: 0, alt: 137, ete: "00:00", active: false },
  { id: "2", name: "MANNA", type: "fix", dtk: 315, dis: 12, alt: 3000, ete: "06:24", active: false },
  { id: "3", name: "GIPVY", type: "fix", dtk: 298, dis: 18, alt: 3000, ete: "09:36", active: true },
  { id: "4", name: "JELCO", type: "fix", dtk: 285, dis: 8, alt: 2500, ete: "04:16", active: false },
  { id: "5", name: "SISGY", type: "fix", dtk: 270, dis: 6, alt: 2000, ete: "03:12", active: false },
  { id: "6", name: "RW31", type: "fix", dtk: 315, dis: 4, alt: 1500, ete: "02:08", active: false },
  { id: "7", name: "MAFAF", type: "fix", dtk: 315, dis: 2, alt: 500, ete: "01:04", active: false },
  { id: "8", name: "KMRY", type: "airport", dtk: 315, dis: 1, alt: 257, ete: "00:32", active: false },
];

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
    nav: { activeFreq: "117.30", standbyFreq: "114.00" },
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
    flightPlan: defaultFlightPlan,
    activeWaypointIndex: 2,
    smartGlideActive: false,
    emergencyDescentActive: false,
    directToTarget: null,
    gpsPhase: "ENR",
    obsMode: false,
    obsCourse: 315,
  });

  const closeAllPanels = () => ({ comPanelOpen: false, audioPanelOpen: false, xpdrPanelOpen: false });

  const navigateTo = useCallback((page: GtnPage) => {
    setState(s => ({ ...s, previousPage: s.currentPage, currentPage: page, ...closeAllPanels() }));
  }, []);

  const goBack = useCallback(() => {
    setState(s => ({ ...s, currentPage: s.previousPage || "map", previousPage: null, ...closeAllPanels() }));
  }, []);

  const swapComFreqs = useCallback(() => {
    setState(s => ({
      ...s,
      com: { ...s.com, activeFreq: s.com.standbyFreq, standbyFreq: s.com.activeFreq, activeLabel: s.com.standbyLabel, standbyLabel: s.com.activeLabel },
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

  const activateDirectTo = useCallback((waypoint: string) => {
    setState(s => ({ ...s, directToTarget: waypoint, currentPage: "map" as GtnPage, ...closeAllPanels() }));
  }, []);

  const cancelDirectTo = useCallback(() => {
    setState(s => ({ ...s, directToTarget: null }));
  }, []);

  const toggleSmartGlide = useCallback(() => {
    setState(s => ({
      ...s,
      smartGlideActive: !s.smartGlideActive,
      emergencyDescentActive: false,
      xpdrCode: !s.smartGlideActive ? "7700" : "6062",
    }));
  }, []);

  const toggleEmergencyDescent = useCallback(() => {
    setState(s => ({ ...s, emergencyDescentActive: !s.emergencyDescentActive }));
  }, []);

  const setActiveWaypoint = useCallback((index: number) => {
    setState(s => ({
      ...s,
      activeWaypointIndex: index,
      flightPlan: s.flightPlan.map((wp, i) => ({ ...wp, active: i === index })),
    }));
  }, []);

  const toggleObs = useCallback(() => {
    setState(s => ({ ...s, obsMode: !s.obsMode }));
  }, []);

  const setObsCourse = useCallback((course: number) => {
    setState(s => ({ ...s, obsCourse: course }));
  }, []);

  return (
    <GtnContext.Provider value={{
      ...state, navigateTo, goBack, swapComFreqs, setComStandby,
      toggleComPanel, toggleAudioPanel, toggleXpdrPanel,
      setXpdrMode, setXpdrCode, toggleAudioSetting,
      activateDirectTo, cancelDirectTo, toggleSmartGlide, toggleEmergencyDescent,
      setActiveWaypoint, toggleObs, setObsCourse,
    }}>
      {children}
    </GtnContext.Provider>
  );
};
