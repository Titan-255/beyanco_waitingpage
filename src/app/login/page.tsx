"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { DEFAULT_USER } from "@/lib/storage";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/staging/new";

  const [email, setEmail] = useState(DEFAULT_USER.email || "tarun@beyanco.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authenticating credentials then route to next interface
    setTimeout(() => {
      setIsLoading(false);
      router.push(redirectUrl);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-beyanco-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group mb-6">
          <div className="w-11 h-11 rounded-xl bg-beyanco-navy text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:bg-beyanco-blue transition-colors">
            <span className="font-serif tracking-tighter">B</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[21px] font-bold tracking-tight text-beyanco-navy leading-none">
                BEYANCO
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-beyanco-paleBlue text-beyanco-blue rounded border border-blue-200/60 leading-none">
                AI
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-beyanco-muted uppercase mt-0.5 leading-none">
              Virtual Staging Studio
            </span>
          </div>
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-beyanco-navy">
          Sign In to Your Workspace
        </h2>
        <p className="mt-1.5 text-sm text-beyanco-slate">
          Enter your credentials to continue to Virtual Staging
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="py-8 px-6 sm:px-10 shadow-elevated border border-beyanco-border rounded-[20px] bg-white">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-beyanco-navy mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-beyanco-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-beyanco-border bg-slate-50 text-beyanco-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all"
                  placeholder="you@domain.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-beyanco-navy"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-beyanco-blue hover:text-beyanco-blueHover"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-beyanco-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-beyanco-border bg-slate-50 text-beyanco-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-beyanco-muted hover:text-beyanco-navy"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-beyanco-blue focus:ring-beyanco-blue border-beyanco-border rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-beyanco-slate font-medium"
                >
                  Remember my session
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full h-12 rounded-[12px] text-sm font-semibold bg-beyanco-blue hover:bg-beyanco-blueHover shadow-subtle hover:shadow-card transition-all"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Sign In & Continue
              </Button>
            </div>
          </form>

          {/* Secure Compliance Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-beyanco-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted 256-bit Real Estate Workspace Access</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-beyanco-bg flex items-center justify-center text-xs text-beyanco-slate">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
