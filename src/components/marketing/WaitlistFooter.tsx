import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function WaitlistFooter() {
  return (
    <footer className="bg-[#101827] text-[#D8D5CF] pt-20 pb-12 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#1E293B]">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-xs">
              <img
                src="/beyanco-logo.jpg"
                alt="Beyanco"
                className="h-9 sm:h-11 w-auto object-contain"
              />
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[#101827]/5 text-[#101827] rounded border border-[#101827]/10">
                AI
              </span>
            </div>
            <p className="text-sm text-[#8E97A4] max-w-sm leading-relaxed">
              Architectural interior visualization and virtual staging platform.
              Reimagining how empty spaces and property photographs are staged,
              curated and experienced before physical execution.
            </p>
            <div className="pt-2 text-xs text-[#626A75] font-mono">
              Pre-Launch Validation Edition • 2026
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-[#8E97A4]">
              <li>
                <a href="#vision" className="hover:text-white transition-colors">
                  Product Vision
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#for-professionals" className="hover:text-white transition-colors">
                  For Professionals
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Product FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Research & Validation */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-4">
              Customer Research
            </h4>
            <ul className="space-y-3 text-sm text-[#8E97A4]">
              <li>
                <Link
                  href="/feedback"
                  className="hover:text-[#A98460] transition-colors inline-flex items-center gap-1 text-white font-medium"
                >
                  <span>Share Your Opinion</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A98460]" />
                </Link>
              </li>
              <li>
                <a href="#waitlist" className="hover:text-white transition-colors">
                  Join Early-Access Waitlist
                </a>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  Willingness to Pay Study
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  Feature Requests & Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Status & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-4">
              Transparency
            </h4>
            <p className="text-xs text-[#8E97A4] leading-relaxed mb-3">
              Beyanco is in active pre-launch development. Renderings and interactive transformations on this website represent conceptual architectural demonstrations of our upcoming models.
            </p>
            <div className="text-[11px] text-[#626A75]">
              Real estate listing disclosure guidelines & ethical AI virtual staging standards compliant.
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#626A75] gap-4">
          <p>© {new Date().getFullYear()} Beyanco AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#8E97A4] transition-colors cursor-pointer">
              Privacy Notice
            </span>
            <span className="hover:text-[#8E97A4] transition-colors cursor-pointer">
              Terms of Early Access
            </span>
            <Link
              href="/admin/validation"
              className="text-[#626A75] hover:text-[#A98460] transition-colors"
            >
              Validation Analytics
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
