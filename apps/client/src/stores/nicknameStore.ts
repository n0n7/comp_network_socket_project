import { create } from "zustand";

type nicknameStore = {
    nickname: string;
    setNickname: (nickname: string) => void;
};

export const useNicknameStore = create<nicknameStore>((set) => ({
    nickname: "",
    setNickname: (nickname) => set({ nickname }),
}));
