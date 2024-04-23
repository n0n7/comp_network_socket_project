import { create } from "zustand";

type directMessage = {
    clientId: string | null;
    setClientId: (clientId: string | null) => void;
    clientName: string | null;
    setClientName: (clientName: string | null) => void;
};

export const useDmStore = create<directMessage>((set) => ({
    clientId: null,
    setClientId: (clientId) => set({ clientId }),
    clientName: null,
    setClientName: (clientName) => set({ clientName }),
}));
