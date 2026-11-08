import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-beyanco-darkNavy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-beyanco-blue text-white flex items-center justify-center font-bold text-lg">
                <span className="font-serif">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BEYANCO <span className="text-beyanco-blue">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium AI-powered virtual staging and real estate visualization studio. Elevating property photography, architectural aesthetics, and speed-to-market for modern agencies and developers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Shield className="w-4 h-4 text-beyanco-emerald shrink-0" />
              <span>MLS & Real Estate Regulatory AI Compliant Staging Disclosures</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/staging/new" className="hover:text-white transition-colors">
                  AI Virtual Staging
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Design Gallery
                </Link>
              </li>
              <li>
                <Link href="/design/gen_001/edit" className="hover:text-white transition-colors">
                  Interactive Furniture Editor
                </Link>
              </li>
              <li>
                <Link href="/refine" className="hover:text-white transition-colors">
                  Object Removal & Inpainting
                </Link>
              </li>
              <li>
                <Link href="/comparison" className="hover:text-white transition-colors">
                  Before & After Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Use Cases
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Luxury Residential Brokerages</span>
              </li>
              <li>
                <span className="text-slate-400">Architectural Developers</span>
              </li>
              <li>
                <span className="text-slate-400">Commercial Real Estate</span>
              </li>
              <li>
                <span className="text-slate-400">Property Photographers</span>
              </li>
              <li>
                <span className="text-slate-400">Home Stagers & Remodelers</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Virtual Staging Disclosures
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Commercial Rights & Licensing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Developer REST API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Beyanco AI Inc. All rights reserved. Crafted for world-class real estate professionals.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-beyanco-violet" />
              Beyanco Spatial Architecture Engine v2.4
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-beyanco-blue" />
              Enterprise MLS Grade
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
