"use client";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
    sub : number,
    email : string,
    role : string,
    iat : number,
    exp : number,
};

export default function Dashboard() {
    const token = useAuth((s) => s.token);
    const router = useRouter();

    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            const t = setTimeout(() => router.push("/login"), 800);
            return () => clearTimeout(t);
        }
        else {
            try {
                const decoded = jwtDecode<JWTPayload>(token);
                setUserEmail(String(decoded.email));
            }
            catch {
                setUserEmail(null);
            }
        }
    }, [token, router]);

    async function callProtected() {
        setLoading(true);
        setMessage(null);

        try {
            const res = await api.get("/protected");
            setMessage(JSON.stringify(res.data, null, 2));
        }
        catch (e : any) {
            setMessage("Error: " + (e?.response?.data?.message ?? e.message));
        }
        finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-medium">You are not logged in!</p>
                <p className="text-sm">Go to the Login page, sign in and come back.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {userEmail && (
                <p className="text-lg font-medium">Hello {userEmail} 👋</p>
            )}
            <p>Protected Content will appear here (real-time charts, etc.)</p>
            <button
                onClick={callProtected}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Calling…" : "Call Protected API"}
            </button>

            {message && (
                <pre className="bg-slate-100 p-3 rounded text-sm overflow-x-auto">
                {message}
                </pre>
            )}
        </div>
    );
}