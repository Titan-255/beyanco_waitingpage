"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { storage, AIProviderConfig, DEFAULT_USER, DEFAULT_ORG } from "@/lib/storage";
import { User, Organization } from "@/types";
import {
  Settings,
  Cpu,
  Key,
  Check,
  Server,
  Shield,
  Layers,
  Copy,
  Plus,
  User as UserIcon,
  Building,
  Upload,
  Camera,
  Sparkles,
  RotateCcw,
  Briefcase,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

const PRESET_AVATARS = [
  {
    id: "avatar_blue_studio",
    label: "Studio Lighting (Current)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "avatar_executive_arch",
    label: "Executive Architect",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "avatar_lead_designer",
    label: "Lead Stager",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "avatar_broker_director",
    label: "Broker Director",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

const TITLE_SUGGESTIONS = [
  "Studio Owner",
  "Principal Architect",
  "Luxury Staging Director",
  "Real Estate Broker",
  "Lead 3D Interior Visualizer",
  "Founder & Creative Director",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "organization" | "ai" | "api">("profile");

  // User Profile State
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Organization State
  const [org, setOrg] = useState<Organization>(DEFAULT_ORG);
  const [orgLocation, setOrgLocation] = useState<string>("Los Angeles, CA & Manhattan, NY");
  const [orgSuccess, setOrgSuccess] = useState<boolean>(false);

  // AI Provider State
  const [providerConfig, setProviderConfig] = useState<AIProviderConfig>({
    provider: "demo",
    isEnabled: true,
  });
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [baseUrlInput, setBaseUrlInput] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check URL hash
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash === "profile") setActiveTab("profile");
      else if (hash === "organization") setActiveTab("organization");
      else if (hash === "ai-engine") setActiveTab("ai");
      else if (hash === "api-keys") setActiveTab("api");
    }

    const cfg = storage.getProviderConfig();
    setProviderConfig(cfg);
    setApiKeyInput(cfg.apiKey || "");
    setBaseUrlInput(cfg.baseUrl || "");

    setUser(storage.getUser());
    setOrg(storage.getOrganization());
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveUser(user);
    setUser(updated);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Avatar image must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUser((prev) => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetProfile = () => {
    if (confirm("Reset profile details to original defaults?")) {
      const reset = storage.saveUser(DEFAULT_USER);
      setUser(reset);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2000);
    }
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveOrganization(org);
    setOrg(updated);
    setOrgSuccess(true);
    setTimeout(() => setOrgSuccess(false), 3000);
  };

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AIProviderConfig = {
      ...providerConfig,
      apiKey: apiKeyInput.trim(),
      baseUrl: baseUrlInput.trim(),
      isEnabled: true,
    };
    storage.saveProviderConfig(updated);
    setProviderConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGenerateDevKey = () => {
    const key = `byk_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedApiKey(key);
  };

  return (
    <DashboardLayout
      title="Settings & Workspace Customization"
      subtitle="Customize studio profile, roles, branding, AI inference providers, and REST API credentials."
    >
      <div className="max-w-4xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-beyanco-border space-x-1 sm:space-x-4 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "profile"
                ? "border-beyanco-blue text-beyanco-blue"
                : "border-transparent text-beyanco-slate hover:text-beyanco-navy"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveTab("organization")}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "organization"
                ? "border-beyanco-blue text-beyanco-blue"
                : "border-transparent text-beyanco-slate hover:text-beyanco-navy"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Studio & Organization</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "ai"
                ? "border-beyanco-blue text-beyanco-blue"
                : "border-transparent text-beyanco-slate hover:text-beyanco-navy"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Inference Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "api"
                ? "border-beyanco-blue text-beyanco-blue"
                : "border-transparent text-beyanco-slate hover:text-beyanco-navy"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Developer REST APIs</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: FULLY CUSTOMIZABLE PROFILE & ACCOUNT (Studio Owner)      */}
        {/* ============================================================== */}
        {activeTab === "profile" && (
          <div id="profile" className="space-y-6">
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-beyanco-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-beyanco-blue flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                      Studio Member & Owner Profile
                    </h3>
                    <p className="text-xs text-beyanco-slate">
                      Customize your name, professional title, portrait photograph, and contact credentials.
                    </p>
                  </div>
                </div>

                {/* Live Preview Badge */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={user.avatarUrl || DEFAULT_USER.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-beyanco-blue shadow-xs shrink-0"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-beyanco-navy leading-none">
                      {user.name || "Tarun Sharma"}
                    </span>
                    <span className="text-[11px] text-beyanco-blue font-medium mt-0.5 leading-none">
                      {user.title || "Studio Owner"}
                    </span>
                    <span className="text-[9px] text-beyanco-muted mt-1 uppercase tracking-wider font-semibold">
                      Live Preview in Header & Sidebar
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Customization */}
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                    Profile Avatar Photograph
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={user.avatarUrl || DEFAULT_USER.avatarUrl}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-subtle group-hover:border-beyanco-blue transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Upload Custom Photo"
                      >
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-bold">Change</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileUpload}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          icon={<Upload className="w-3.5 h-3.5" />}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Custom Portrait
                        </Button>
                        <span className="text-[11px] text-beyanco-muted">
                          Supports JPEG, PNG, WebP up to 5MB.
                        </span>
                      </div>

                      {/* Presets */}
                      <div>
                        <span className="text-[10px] font-semibold text-beyanco-muted uppercase tracking-wider block mb-1.5">
                          Or Choose from Curated Executive Avatars:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {PRESET_AVATARS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setUser({ ...user, avatarUrl: preset.url })}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                                user.avatarUrl === preset.url
                                  ? "bg-blue-50 border-beyanco-blue text-beyanco-blue font-bold shadow-xs"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span>{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Title Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy flex items-center gap-1.5 mb-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-beyanco-blue" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      placeholder="e.g. Tarun Sharma"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy flex items-center gap-1.5 mb-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-beyanco-blue" />
                      Professional Role / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={user.title || ""}
                      onChange={(e) => setUser({ ...user, title: e.target.value })}
                      placeholder="e.g. Studio Owner"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Title Quick Selection Chips */}
                <div>
                  <span className="text-[10px] font-semibold text-beyanco-muted uppercase tracking-wider block mb-1.5">
                    Quick Role Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TITLE_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setUser({ ...user, title: sug })}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          user.title === sug
                            ? "bg-beyanco-blue text-white border-beyanco-blue font-semibold"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-beyanco-blue hover:text-beyanco-blue"
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy flex items-center gap-1.5 mb-1.5">
                      <Mail className="w-3.5 h-3.5 text-beyanco-blue" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      placeholder="tarun@beyanco.ai"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy flex items-center gap-1.5 mb-1.5">
                      <Phone className="w-3.5 h-3.5 text-beyanco-blue" />
                      Phone / Mobile Contact
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ""}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      placeholder="+1 (555) 382-9104"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Bio / Tagline */}
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-beyanco-blue" />
                    Professional Bio & Real Estate Focus
                  </label>
                  <textarea
                    rows={2}
                    value={user.bio || ""}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    placeholder="Luxury residential staging specialist and interior visualization director."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white transition-all leading-relaxed"
                  />
                </div>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Profile updated! Your new name, title, and avatar are now live across Beyanco AI.</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={handleResetProfile}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Sparkles className="w-4 h-4" />}
                    className="bg-beyanco-blue hover:bg-beyanco-blueHover text-white px-6 rounded-[12px]"
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STUDIO & ORGANIZATION BRANDING                          */}
        {/* ============================================================== */}
        {activeTab === "organization" && (
          <div id="organization" className="space-y-6">
            <Card className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-beyanco-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-beyanco-violet flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                      Studio Workspace & Brokerage Branding
                    </h3>
                    <p className="text-xs text-beyanco-slate">
                      Manage organization name, MLS branding presets, and regional market focus.
                    </p>
                  </div>
                </div>

                <Badge variant="blue" size="sm">
                  {org.plan.toUpperCase()} PLAN
                </Badge>
              </div>

              <form onSubmit={handleSaveOrg} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy block mb-1.5">
                      Studio / Brokerage Name
                    </label>
                    <input
                      type="text"
                      required
                      value={org.name}
                      onChange={(e) => setOrg({ ...org, name: e.target.value })}
                      placeholder="e.g. Beyanco Real Estate Studio"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-beyanco-navy block mb-1.5">
                      Workspace Slug / Custom Domain
                    </label>
                    <input
                      type="text"
                      required
                      value={org.slug}
                      onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                      placeholder="beyanco-studio"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy font-mono focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-1.5">
                    Primary Regional Markets & Specialties
                  </label>
                  <input
                    type="text"
                    value={orgLocation}
                    onChange={(e) => setOrgLocation(e.target.value)}
                    placeholder="e.g. Los Angeles, CA & Manhattan, NY"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy focus:outline-none focus:ring-2 focus:ring-beyanco-blue focus:bg-white"
                  />
                </div>

                {orgSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Studio organization details updated successfully!</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="bg-beyanco-blue hover:bg-beyanco-blueHover text-white px-6 rounded-[12px]"
                  >
                    Save Studio Settings
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AI INFERENCE PROVIDER (Preserved existing feature)     */}
        {/* ============================================================== */}
        {activeTab === "ai" && (
          <div id="ai-engine" className="space-y-6">
            <Card className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-beyanco-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-beyanco-violet flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                      AI Image Generation Provider
                    </h3>
                    <p className="text-xs text-beyanco-slate">
                      Pluggable inference backend for spatial staging and inpainting.
                    </p>
                  </div>
                </div>

                <Badge
                  variant={providerConfig.provider === "demo" ? "blue" : "violet"}
                  size="sm"
                >
                  {providerConfig.provider === "demo" ? "Curated Demo Engine" : "Custom API Adapter"}
                </Badge>
              </div>

              <form onSubmit={handleSaveProvider} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-beyanco-navy block mb-2">
                    Active Provider Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "demo",
                        label: "Demo Mode (Included)",
                        desc: "Free, zero-cost curated architectural renders with realistic speed.",
                      },
                      {
                        id: "replicate",
                        label: "Replicate (SDXL / Flux)",
                        desc: "Cloud inference on Flux Realism and Interior LoRA models.",
                      },
                      {
                        id: "openai",
                        label: "OpenAI DALL-E 3",
                        desc: "High-prompt fidelity semantic generation via OpenAI API.",
                      },
                      {
                        id: "stability",
                        label: "Stability AI",
                        desc: "Stable Diffusion XL Inpainting & high-res architectural models.",
                      },
                      {
                        id: "comfyui",
                        label: "Local ComfyUI",
                        desc: "Self-hosted local GPU pipeline (http://127.0.0.1:8188).",
                      },
                    ].map((mode) => (
                      <div
                        key={mode.id}
                        onClick={() =>
                          setProviderConfig({
                            ...providerConfig,
                            provider: mode.id as any,
                          })
                        }
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          providerConfig.provider === mode.id
                            ? "border-beyanco-blue bg-blue-50/50 ring-2 ring-beyanco-blue/20"
                            : "border-beyanco-border bg-slate-50/50 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-beyanco-navy">
                            {mode.label}
                          </span>
                          {providerConfig.provider === mode.id && (
                            <span className="w-2 h-2 rounded-full bg-beyanco-blue" />
                          )}
                        </div>
                        <p className="text-[11px] text-beyanco-slate leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {providerConfig.provider !== "demo" && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                        {providerConfig.provider.toUpperCase()} API Key / Token
                      </label>
                      <input
                        type="password"
                        placeholder="sk-••••••••••••••••••••••••"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy font-mono focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-beyanco-navy block mb-1">
                        Custom Base URL / Self-Hosted Endpoint (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://api.replicate.com/v1"
                        value={baseUrlInput}
                        onChange={(e) => setBaseUrlInput(e.target.value)}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-beyanco-border rounded-xl text-beyanco-navy font-mono focus:outline-none focus:ring-2 focus:ring-beyanco-blue"
                      />
                    </div>
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Provider configuration updated successfully!</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" size="md">
                    Save Provider Settings
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DEVELOPER REST API KEYS (Preserved existing feature)    */}
        {/* ============================================================== */}
        {activeTab === "api" && (
          <div id="api-keys" className="space-y-6">
            <Card className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-beyanco-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-beyanco-blue flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-beyanco-navy tracking-tight">
                      Developer REST API Keys
                    </h3>
                    <p className="text-xs text-beyanco-slate">
                      Integrate Beyanco AI virtual staging into CRM, PMS, and MLS listing workflows.
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateDevKey}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Generate Secret Key
                </Button>
              </div>

              {generatedApiKey && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-beyanco-navy block">
                    New API Key Generated (Copy and save in your secure vault):
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-beyanco-navy flex-1 select-all">
                      {generatedApiKey}
                    </code>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigator.clipboard.writeText(generatedApiKey)}
                      icon={<Copy className="w-3.5 h-3.5" />}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs text-beyanco-slate">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-beyanco-navy font-mono">
                      byk_live_prod_992a83f1••••••••••••
                    </p>
                    <p className="text-[11px] text-beyanco-muted">
                      Created Oct 24, 2026 • Full Access
                    </p>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Active
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
