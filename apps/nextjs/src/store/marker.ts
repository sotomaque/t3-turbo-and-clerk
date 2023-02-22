import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Marker = {
  x: number;
  y: number;
};

interface MarkerState {
  marker: Marker | null;
  markerHeight: number;
  markerWidth: number;
  setMarker: (marker: Marker) => void;
  clearMarker: () => void;
  setMarkerHeight: (height: number) => void;
  setMarkerWidth: (width: number) => void;
}

export const useMarkerStore = create<MarkerState>()(
  devtools((set) => ({
    marker: null,
    markerHeight: 0,
    markerWidth: 0,
    setMarker: (marker: Marker) => set({ marker }),
    clearMarker: () => set({ marker: null }),
    setMarkerHeight: (height: number) => set({ markerHeight: height }),
    setMarkerWidth: (width: number) => set({ markerWidth: width }),
  })),
);
