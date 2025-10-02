"use client";

import { useAuth } from "@/store/auth";

export default function LogoutButton() {
    const clear = useAuth((s) => s.clear);
    return (
        <button
            onClick = {() => clear()}
            className = "text-sm px-2 py-1 border rounded hover:bg-slate-50"
            title = "Clear token"
        >Logout</button>
    );
}