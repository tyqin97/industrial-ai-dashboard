"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@/store/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type FormVals = {
    email : string,
    password : string,
}

export default function LoginPage() {
    const { register, handleSubmit, formState : { isSubmitting }} = useForm<FormVals>();
    const setToken = useAuth((s) => s.setToken);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(vals : FormVals) {
        setError(null);
        
        try {
            const res = await api.post("/auth/login", vals);
            setToken(res.data.access_token);

            // Redirect to Dashboard page
            router.push("/dashboard");
        }
        catch (e : any) {
            const msg = e?.response?.data?.message ?? "Login Failed";
            setError(Array.isArray(msg) ? msg.join(", ") : msg);
        }
    }

    return (
        <div className="max-w-sm mx-auto bg-white border rounded p-6">
            <h1 className="text-xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input className="w-full border rounded px-3 py-2"
                        type="email" placeholder="you@example.com"
                        {...(register("email", { required : true }))}/>
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input className="w-full border rounded px-3 py-2"
                        type="password" placeholder="••••••••"
                        {...register("password", { required : true })}/>
                </div>
                <button disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white rounded py-2 disabled:opacity-50">
                    {isSubmitting ? "Signind in..." : "Sign in"}
                </button>
            </form>
        </div>
    )
}