"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { storage } from "@/lib/storage";
import { CreditTransaction } from "@/types";
import { formatCredits, formatDate } from "@/lib/utils";
import {
  Coins,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function CreditsBillingPage() {
  const [balance, setBalance] = useState<number>(125);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  useEffect(() => {
    setBalance(storage.getCredits());
    setTransactions(storage.getTransactions());
  }, []);

  const handleBuyCredits = (creditsAmount: number, packName: string) => {
    setIsPurchasing(true);
    setPurchaseSuccess(null);

    setTimeout(() => {
      const newBal = storage.addCredits(
        creditsAmount,
        `Credit Pack Top-up: ${packName} (+${creditsAmount} Credits)`
      );
      setBalance(newBal);
      setTransactions([...storage.getTransactions()]);
      setIsPurchasing(false);
      setPurchaseSuccess(`Successfully added ${creditsAmount} credits to your workspace!`);
    }, 600);
  };

  return (
    <DashboardLayout
      title="Credits & Billing"
      subtitle="Monitor generation usage, top up credits, and manage studio subscription."
    >
      <div className="space-y-8">
        {/* Top Balance Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 flex flex-col justify-between space-y-4 bg-gradient-to-r from-beyanco-navy to-slate-900 text-white">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Available Balance
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  {formatCredits(balance)}
                </span>
                <span className="text-base font-semibold text-beyanco-blue">
                  Credits
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Each staged room variation consumes 5 credits. High-resolution exports and furniture canvas editing are included.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Active Plan: <strong>Growth / Pro ($29.99/mo)</strong></span>
              <span>Next Renewal: <strong>Nov 15, 2026</strong></span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-semibold text-beyanco-muted uppercase tracking-wider">
                Plan Benefits
              </span>
              <h3 className="text-base font-bold text-beyanco-navy mt-1">
                Growth Studio Tier
              </h3>
              <div className="space-y-2 pt-3 text-xs text-beyanco-slate">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-beyanco-emerald shrink-0" />
                  <span>150 credits included monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-beyanco-emerald shrink-0" />
                  <span>Unlimited Furniture Canvas Saves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-beyanco-emerald shrink-0" />
                  <span>4K MLS uncompressed exports</span>
                </div>
              </div>
            </div>

            <Badge variant="blue" size="sm" className="w-fit">
              Auto-renews monthly
            </Badge>
          </Card>
        </div>

        {/* Purchase Packs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-beyanco-navy tracking-tight">
              Top Up Staging Credits
            </h3>
            <p className="text-xs text-beyanco-slate">
              Credits never expire and roll over month to month.
            </p>
          </div>

          {purchaseSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{purchaseSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="space-y-4 p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-beyanco-navy uppercase">
                  Starter Pack
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-beyanco-navy">50</span>
                  <span className="text-xs text-beyanco-slate font-medium">Credits</span>
                </div>
                <p className="text-xs text-beyanco-slate">
                  Ideal for staging 1–2 residential properties (10 variations).
                </p>
                <p className="text-lg font-bold text-beyanco-navy pt-1">$14.99</p>
              </div>

              <Button
                variant="secondary"
                size="md"
                isLoading={isPurchasing}
                onClick={() => handleBuyCredits(50, "Starter Pack")}
                icon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Buy 50 Credits
              </Button>
            </Card>

            <Card hoverEffect className="space-y-4 p-5 flex flex-col justify-between border-2 border-beyanco-blue relative">
              <div className="absolute -top-2.5 right-4 bg-beyanco-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Best Value
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-beyanco-navy uppercase">
                  Agency Pack
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-beyanco-navy">150</span>
                  <span className="text-xs text-beyanco-slate font-medium">Credits</span>
                </div>
                <p className="text-xs text-beyanco-slate">
                  Stage up to 5 properties with multiple style iterations.
                </p>
                <p className="text-lg font-bold text-beyanco-navy pt-1">$34.99</p>
              </div>

              <Button
                variant="primary"
                size="md"
                isLoading={isPurchasing}
                onClick={() => handleBuyCredits(150, "Agency Pack")}
                icon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Buy 150 Credits
              </Button>
            </Card>

            <Card hoverEffect className="space-y-4 p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-beyanco-navy uppercase">
                  Commercial Pack
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-beyanco-navy">400</span>
                  <span className="text-xs text-beyanco-slate font-medium">Credits</span>
                </div>
                <p className="text-xs text-beyanco-slate">
                  High-volume commercial development & broker portfolios.
                </p>
                <p className="text-lg font-bold text-beyanco-navy pt-1">$79.99</p>
              </div>

              <Button
                variant="secondary"
                size="md"
                isLoading={isPurchasing}
                onClick={() => handleBuyCredits(400, "Commercial Pack")}
                icon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Buy 400 Credits
              </Button>
            </Card>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-beyanco-navy tracking-tight">
              Usage & Transaction Ledger
            </h3>
            <p className="text-xs text-beyanco-slate">
              Complete audit trail of credit deductions, refunds, and pack purchases.
            </p>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-beyanco-navy font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Transaction / Activity</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Change</th>
                    <th className="p-4">Balance After</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-beyanco-navy">
                        {tx.description}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={tx.type === "usage" ? "default" : "emerald"}
                          size="sm"
                          className="capitalize"
                        >
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold font-mono">
                        {tx.amount > 0 ? (
                          <span className="text-emerald-600">+{tx.amount}</span>
                        ) : (
                          <span className="text-beyanco-slate">{tx.amount}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-beyanco-navy font-semibold">
                        {tx.balanceAfter}
                      </td>
                      <td className="p-4 text-beyanco-muted">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
