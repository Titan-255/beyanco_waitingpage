"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export function WaitlistNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#F6F4EF]/90 backdrop-blur-md border-b border-[#D8D5CF]/60 shadow-[0_2px_12px_rgba(16,24,39,0.03)]"
          : "bg-[#F6F4EF]/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/beyanco-logo.jpg"
            alt="Beyanco"
            className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply"
          />
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[#101827]/5 text-[#101827] rounded border border-[#101827]/10">
            AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide uppercase text-[#626A75]">
          <Link
            href="#vision"
            className="hover:text-[#101827] transition-colors py-1"
          >
            Vision
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-[#101827] transition-colors py-1"
          >
            How It Works
          </Link>
          <Link
            href="#capabilities"
            className="hover:text-[#101827] transition-colors py-1"
          >
            Capabilities
          </Link>
          <Link
            href="#faq"
            className="hover:text-[#101827] transition-colors py-1"
          >
            FAQ
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#101827] hover:text-[#A98460] transition-colors py-2 px-3"
          >
            <span>Share Your Opinion</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#A98460]" />
          </Link>

          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#101827] text-white hover:bg-[#A98460] shadow-sm hover:shadow-md transition-all duration-200"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#101827] hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EF] border-b border-[#D8D5CF] px-6 pt-4 pb-8 space-y-4 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium tracking-wide uppercase text-[#626A75]">
            <Link
              href="#vision"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#101827]"
            >
              Vision
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#101827]"
            >
              How It Works
            </Link>
            <Link
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#101827]"
            >
              Capabilities
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#101827]"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-4 border-t border-[#D8D5CF] flex flex-col gap-3">
            <Link
              href="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#D8D5CF] text-xs font-semibold uppercase tracking-wider text-[#101827]"
            >
              <span>Share Your Opinion</span>
              <ArrowUpRight className="w-4 h-4 text-[#A98460]" />
            </Link>
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#101827] text-white hover:bg-[#A98460]"
            >
              Join Early Access Waitlist
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
