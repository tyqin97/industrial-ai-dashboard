"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@/store/auth";

type FormVals = {
    email : string,
    password : string,
}

export default function LoginPage() {
    const { register, handleSubmit, formState : { isSubmitting }} = useForm<FormVals>();
    const setToken = useAuth((s) => s.setToken);

    async function onSubmit(vals : FormVals) {
        // For now, we’ll fake success so UI works (Day 4 will call real API).
        // If you want to try the real call later, uncomment below and ensure NestJS auth exists.
        //
        // const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, vals);
        // setToken(res.data.access_token);

        // Temporary Mock:
        await new Promise(r => setTimeout(r, 400));
        setToken("dummy-token");
        alert("Logged in (mock). Go To Dashboard");
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
                <p className="text-xs text-slate-500">
                    *Mock Login for now. We ill wire real JWT auth on Day4.
                </p>
            </form>
        </div>
    )
}