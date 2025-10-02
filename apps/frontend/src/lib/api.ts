"use client";

import axios from "axios";
import { useAuth } from "@/store/auth";

export const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    // Attach token if present
    try {
        const token = useAuth.getState().token;

        if (token) {
            config.headers = config.headers ?? {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    }
    catch {
        // in SSR this may throw; safe to ignore for now
    }
    return config;
})