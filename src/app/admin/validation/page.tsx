"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export default function AdminValidationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/validation");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load validation analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#101827] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D5CF]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#626A75] hover:text-[#101827] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing Page</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-[#101827]">
              Customer Validation & Waitlist Intelligence
            </h1>
            <p className="text-xs text-[#626A75] mt-1">
              Live responses gathered from `/feedback` and waitlist registrations in `data/*.json`.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#D8D5CF] text-xs font-semibold uppercase tracking-wider text-[#101827] hover:border-[#101827] transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {loading && !data ? (
          <div className="py-20 text-center text-sm text-[#626A75]">
            Loading validation intelligence...
          </div>
        ) : !data ? (
          <div className="py-20 text-center text-sm text-red-600">
            Failed to load data. Ensure API endpoint is accessible.
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-[20px] bg-white border border-[#D8D5CF] shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-[#626A75] uppercase tracking-wider">
                  <span>Total Waitlist Signups</span>
                  <Users className="w-4 h-4 text-[#A98460]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#101827]">
                  {data.metrics?.totalWaitlist || 0}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Verified leads
                </span>
              </div>

              <div className="p-6 rounded-[20px] bg-white border border-[#D8D5CF] shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-[#626A75] uppercase tracking-wider">
                  <span>Completed Surveys</span>
                  <MessageSquare className="w-4 h-4 text-[#A98460]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#101827]">
                  {data.metrics?.totalFeedback || 0}
                </div>
                <span className="text-[11px] text-[#A98460] font-medium">
                  Discovery research entries
                </span>
              </div>

              <div className="p-6 rounded-[20px] bg-white border border-[#D8D5CF] shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-[#626A75] uppercase tracking-wider">
                  <span>Willingness to Pay</span>
                  <TrendingUp className="w-4 h-4 text-[#A98460]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#101827]">
                  {Object.keys(data.metrics?.purchaseIntentCount || {}).length > 0
                    ? `${Math.round(
                        (((data.metrics?.purchaseIntentCount["Definitely would pay"] || 0) +
                          (data.metrics?.purchaseIntentCount["Probably would pay"] || 0)) /
                          (data.metrics?.totalFeedback || 1)) *
                          100
                      )}%`
                    : "0%"}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Positive purchase intent
                </span>
              </div>

              <div className="p-6 rounded-[20px] bg-white border border-[#D8D5CF] shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-[#626A75] uppercase tracking-wider">
                  <span>Top Model Preference</span>
                  <DollarSign className="w-4 h-4 text-[#A98460]" />
                </div>
                <div className="text-xl font-serif font-bold text-[#101827] truncate">
                  {Object.entries(data.metrics?.pricingModelCount || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "None yet"}
                </div>
                <span className="text-[11px] text-[#626A75]">
                  Most preferred monetization
                </span>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Audience breakdown */}
              <div className="p-6 rounded-[22px] bg-white border border-[#D8D5CF] shadow-subtle space-y-4">
                <h3 className="text-base font-serif font-bold text-[#101827]">
                  Survey Respondents by Professional Role
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(data.metrics?.feedbackRoles || {}).map(([role, count]: any) => (
                    <div key={role} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#101827] font-medium">{role}</span>
                        <span className="text-[#626A75] font-semibold">{count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF8F5] overflow-hidden">
                        <div
                          className="h-full bg-[#101827]"
                          style={{
                            width: `${Math.min(100, (count / (data.metrics?.totalFeedback || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Intent breakdown */}
              <div className="p-6 rounded-[22px] bg-white border border-[#D8D5CF] shadow-subtle space-y-4">
                <h3 className="text-base font-serif font-bold text-[#101827]">
                  Likelihood to Pay
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(data.metrics?.purchaseIntentCount || {}).map(([intent, count]: any) => (
                    <div key={intent} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#101827] font-medium">{intent}</span>
                        <span className="text-[#626A75] font-semibold">{count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF8F5] overflow-hidden">
                        <div
                          className="h-full bg-[#A98460]"
                          style={{
                            width: `${Math.min(100, (count / (data.metrics?.totalFeedback || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Desired Features */}
              <div className="p-6 rounded-[22px] bg-white border border-[#D8D5CF] shadow-subtle space-y-4">
                <h3 className="text-base font-serif font-bold text-[#101827]">
                  Top 3 Most Valued Features (Ranked)
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(data.metrics?.topThreeFeaturesCount || {})
                    .sort((a: any, b: any) => b[1] - a[1])
                    .map(([feature, count]: any) => (
                      <div key={feature} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#101827] font-medium">{feature}</span>
                          <span className="text-[#626A75] font-semibold">{count} votes</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#FAF8F5] overflow-hidden">
                          <div
                            className="h-full bg-[#2563EB]"
                            style={{
                              width: `${Math.min(100, (count / (data.metrics?.totalFeedback || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Price Expectation */}
              <div className="p-6 rounded-[22px] bg-white border border-[#D8D5CF] shadow-subtle space-y-4">
                <h3 className="text-base font-serif font-bold text-[#101827]">
                  Reasonable Price Expectation (Per Finished Room)
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(data.metrics?.priceExpectationCount || {}).map(([price, count]: any) => (
                    <div key={price} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#101827] font-medium">{price}</span>
                        <span className="text-[#626A75] font-semibold">{count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF8F5] overflow-hidden">
                        <div
                          className="h-full bg-emerald-600"
                          style={{
                            width: `${Math.min(100, (count / (data.metrics?.totalFeedback || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Submissions Table */}
            <div className="p-6 rounded-[22px] bg-white border border-[#D8D5CF] shadow-subtle space-y-4">
              <h3 className="text-base font-serif font-bold text-[#101827]">
                Recent Survey Submissions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D5CF] text-[#626A75] uppercase tracking-wider">
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Volume</th>
                      <th className="py-3 px-3">Purchase Intent</th>
                      <th className="py-3 px-3">Pricing Model</th>
                      <th className="py-3 px-3">Price Expectation</th>
                      <th className="py-3 px-3">Early Access</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D5CF]/40">
                    {(data.recentFeedback || []).map((f: any) => (
                      <tr key={f.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-3 font-semibold text-[#101827]">{f.role}</td>
                        <td className="py-3 px-3 text-[#626A75]">{f.propertyVolume || "—"}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.purchaseIntent?.includes("Definitely")
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {f.purchaseIntent || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#626A75]">{f.preferredPricingModel || "—"}</td>
                        <td className="py-3 px-3 font-medium text-[#101827]">{f.priceExpectationPerRoom || "—"}</td>
                        <td className="py-3 px-3 text-[#A98460] font-medium">{f.earlyAccessInterest || "—"}</td>
                        <td className="py-3 px-3 text-[#94A3B8]">
                          {new Date(f.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
