import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/Input.tsx";
import { Button } from "./ui/Button.tsx";
import { apiService } from "../lib/apiService.ts";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("remembered_username"));
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: localStorage.getItem("remembered_username") || "",
      password: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const loginData = await apiService.login(data.username, data.password);

      if (rememberMe) {
        localStorage.setItem("remembered_username", data.username);
      } else {
        localStorage.removeItem("remembered_username");
      }

      const token = loginData.token;
      localStorage.setItem("token", token);
      onLoginSuccess(token);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Inventory FIFO Portal</h2>
          <p className="text-sm text-slate-500">Sign in to view real-time inventory and costing ledger</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Username"
            placeholder="e.g. admin"
            {...register("username", { required: "Username is required" })}
            error={errors.username?.message as string}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message as string}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus:outline-none cursor-pointer flex items-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="flex items-center text-xs font-semibold text-slate-500 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-emerald-600 h-4 w-4"
              />
              Remember Me
            </label>
          </div>

          <Button type="submit" loading={loading}>
            Sign In <Lock size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};
