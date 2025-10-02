"use client";
import { create } from "zustand";

type AuthState = {
    token ?: string;
    setToken: (t ?: string) => void;
    clear : () => void;
};

const KEY = "iad_jwt";

export const useAuth = create<AuthState>((set) => ({
    token : typeof window !== "undefined" ? window.localStorage.getItem(KEY) ?? undefined : undefined,
    setToken : (t) => {
        if (typeof window !== "undefined") {
            if (t) window.localStorage.setItem(KEY, t);
            else window.localStorage.removeItem(KEY);
        }
        set({ token : t });
    },
    clear : () => {
        if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
        set({ token : undefined });
    },
}));