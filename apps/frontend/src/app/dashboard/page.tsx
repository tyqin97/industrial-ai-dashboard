"use client";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

import { getSocket } from "@/lib/socket";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type JWTPayload = {
    sub : number,
    email : string,
    role : string,
    iat : number,
    exp : number,
};

type MetricDto = {
    ts : number,
    name : string,
    value : number,
}

export default function Dashboard() {
    const token = useAuth((s) => s.token);
    const router = useRouter();

    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Live metrics
    const [running, setRunning] = useState(true);
    const [data, setData] = useState<Array<{time : string; value : number}>>([]);

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

    useEffect(() => {
        if (!running) return;
        const s = getSocket();

        function onMetric(m : MetricDto) {
            // Keep only last 60 points
            const time = new Date(m.ts).toLocaleTimeString([], { hour : "2-digit", minute : "2-digit", second : "2-digit"});
            setData((prev) => {
                const next = [...prev, { time, value : Number(m.value.toFixed(2))}];
                return next.length > 60 ? next.slice(next.length -60) : next;
            });
        }

        s.on("metric", onMetric);
        return () => {
            s.off("metric", onMetric);
        };
    },[running]);

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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                {userEmail && <p className="text-lg font-medium">Hello {userEmail} 👋</p>}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                <button
                    onClick={callProtected}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Calling…" : "Call Protected API"}
                </button>

                <button
                    onClick={() => setRunning((r) => !r)}
                    className="px-3 py-2 border rounded hover:bg-slate-50"
                    title="Start/Stop live stream"
                >
                    {running ? "Stop Stream" : "Start Stream"}
                </button>
                </div>

                {message && (
                <pre className="bg-slate-100 p-3 rounded text-sm overflow-x-auto">
                    {message}
                </pre>
                )}
            </div>

            <div className="h-64 w-full bg-white border rounded p-2">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" dot={false} />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}