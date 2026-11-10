"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, Menu, X, ArrowRight, Layers } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-beyanco-border shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/beyanco-logo.jpg"
            alt="Beyanco"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-beyanco-paleBlue text-beyanco-blue rounded border border-blue-200/60 leading-none">
            AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-beyanco-slate">
          <Link
            href="#how-it-works"
            className="hover:text-beyanco-blue transition-colors py-1"
          >
            How it Works
          </Link>
          <Link
            href="#gallery"
            className="hover:text-beyanco-blue transition-colors py-1"
          >
            Transformations
          </Link>
          <Link
            href="#editor-showcase"
            className="hover:text-beyanco-blue transition-colors py-1 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-beyanco-blue" />
            Furniture Editor
          </Link>
          <Link
            href="#pricing"
            className="hover:text-beyanco-blue transition-colors py-1"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="hover:text-beyanco-blue transition-colors py-1"
          >
            FAQ
          </Link>
        </nav>

        {/* Action CTAs: Sign In | Start Staging */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="md"
              className="text-beyanco-slate hover:text-beyanco-navy font-semibold px-4 h-11"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/login?redirect=/staging/new">
            <Button
              variant="primary"
              size="md"
              className="bg-beyanco-blue hover:bg-beyanco-blueHover text-white font-semibold h-11 px-5 rounded-[12px] shadow-subtle hover:shadow-card transition-all"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Start Staging
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-beyanco-slate hover:text-beyanco-navy rounded-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-beyanco-border bg-white px-5 pt-3 pb-6 space-y-4 shadow-elevated">
          <div className="flex flex-col space-y-3 font-medium text-beyanco-slate text-sm">
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-beyanco-blue"
            >
              How it Works
            </Link>
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-beyanco-blue"
            >
              Transformations
            </Link>
            <Link
              href="#editor-showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-beyanco-blue flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-beyanco-blue" />
              Furniture Editor
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-beyanco-blue"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-beyanco-blue"
            >
              FAQ
            </Link>
          </div>

          <div className="pt-4 border-t border-beyanco-border flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="md" className="w-full h-11 rounded-[12px]">
                Sign In
              </Button>
            </Link>
            <Link href="/login?redirect=/staging/new" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                className="w-full h-11 rounded-[12px]"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start Staging
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
