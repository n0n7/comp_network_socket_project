import { create } from "zustand";

type dmRoom = {
    isDm: boolean;
    setIsDm: (isDm: boolean) => void;
    isGroup: boolean;
    setIsGroup: (isGroup: boolean) => void;
};

export const useRoomStatusStore = create<dmRoom>((set) => ({
    isDm: false,
    setIsDm: (isDm) => set({ isDm }),
    isGroup: false,
    setIsGroup: (isGroup) => set({ isGroup }),
}));
