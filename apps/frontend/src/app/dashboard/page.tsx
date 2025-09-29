"use client";
import { useAuth } from "@/store/auth";

export default function Dashboard() {
    const token = useAuth((s) => s.token);

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
            <p>Protected Content will appear here (real-time charts, etc.)</p>
        </div>
    );
}