"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import { mockProviderDashboard, mockServices } from "@/lib/mock-data";
import { api } from "@/lib/api";
import type { ProviderDashboard, Service } from "@/types";

function StatCard({ label, value, icon, change }: { label: string; value: string; icon: string; change?: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(0, 255, 163, 0.1)", color: "#00FFA3" }}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" suppressHydrationWarning>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

export default function ProviderDashboardPage() {
  const { wallet, connected: meshConnected, connecting } = useWallet();
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const devAddr = localStorage.getItem("dev_wallet_address");
    
    if (meshConnected && wallet) {
      const fetchAddress = async () => {
        try {
          const unused = await wallet.getUnusedAddresses();
          if (unused && unused.length > 0) {
            setAddress(unused[0]);
            return setConnected(true);
          }
          
          const used = await wallet.getUsedAddresses();
          if (used && used.length > 0) {
            setAddress(used[0]);
            return setConnected(true);
          }
          
          const change = await wallet.getChangeAddress();
          if (change) {
            setAddress(change);
            return setConnected(true);
          }
        } catch (e) {
          console.warn("Wallet address fetch error", e);
        }
        
        if (devAddr) {
          setAddress(devAddr);
          setConnected(true);
        } else {
          setLoading(false);
        }
      };
      
      fetchAddress();
    } else if (devAddr) {
      setAddress(devAddr);
      setConnected(true);
    } else {
      setAddress("");
      setConnected(false);
      setLoading(false);
    }
  }, [meshConnected, wallet]);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setIsDemoMode(false);

    api.getProviderDashboard(address)
      .then((data) => {
        setDashboard(data);
        // Also fetch provider's services
        return api.getServices({ provider_wallet: address });
      })
      .then((res) => {
        if (res && res.services) {
          setServices(res.services);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch live dashboard data (API offline or new wallet). Using mock provider demo:", err);
        setDashboard(mockProviderDashboard);
        setServices(mockServices.filter((s) => s.provider_name === "VisionAI Labs" || s.provider_name === "NeuralForge"));
        setIsDemoMode(true);
        setLoading(false);
      });
  }, [address]);

  const handleManualConnect = () => {
    if (manualAddress.trim()) {
      localStorage.setItem("dev_wallet_address", manualAddress.trim());
      window.location.reload();
    }
  };

  if (!mounted) {
    return (
      <div className="container-xl py-20 text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  if (connecting || (connected && loading)) {
    return (
      <div className="container-xl py-20 text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="container-xl py-24 text-center bg-grid min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-5xl mb-6">📊</div>
        <h2 className="text-2xl font-bold mb-3">Provider Analytics Dashboard</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Connect your Cardano wallet to view your revenue, active services, request metrics, and manage your AI API endpoints.
        </p>
        <CardanoWallet />

        <div className="mt-8 pt-6 w-full max-w-md border-t border-dashed border-muted/20">
          <p className="text-xs text-muted mb-3">Developer Override: Paste a Cardano Address to test dashboards without wallet extension</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="addr_test1..."
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              className="flex-1 bg-[#0D1B2A]/90 border border-muted/20 rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleManualConnect}
              className="glow-button text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Connect Address
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const maxRevenue = Math.max(...dashboard.revenue_chart.map((d) => d.amount), 1);

  return (
    <div className="bg-grid min-h-screen">
      <div className="container-xl py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Provider <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted text-sm flex items-center gap-2">
              Managing endpoints for: <span className="text-foreground font-mono text-xs truncate max-w-[200px] sm:max-w-xs">{address}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="text-xs px-2.5 py-1.5 rounded-full font-medium" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", color: "#F59E0B" }}>
                Demo Mode
              </span>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(0, 255, 163, 0.1)", border: "1px solid rgba(0, 255, 163, 0.2)", color: "#00FFA3" }}>
              <div className="w-2 h-2 rounded-full bg-[#00FFA3]" />
              Live Connected
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value={`₳ ${dashboard.total_revenue_ada.toLocaleString()}`} icon="💰" change="+12.3%" />
          <StatCard label="Total Requests" value={dashboard.total_requests.toLocaleString()} icon="📊" change="+8.7%" />
          <StatCard label="Success Rate" value={`${dashboard.success_rate}%`} icon="✅" />
          <StatCard label="Avg Rating" value={dashboard.rating.toFixed(2)} icon="⭐" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-6">Revenue (Last 7 Days)</h3>
            {dashboard.revenue_chart.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {dashboard.revenue_chart.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-muted" suppressHydrationWarning>₳{day.amount.toFixed(0)}</span>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(day.amount / maxRevenue) * 140}px`,
                        background: `linear-gradient(to top, #00D1FF, #A855F7)`,
                        opacity: 0.8,
                      }}
                    />
                    <span className="text-xs text-muted">{day.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted text-sm">
                No revenue history found.
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-5">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Active Services</span>
                <span className="text-sm font-bold">{dashboard.active_services}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Jobs Completed</span>
                <span className="text-sm font-bold" suppressHydrationWarning>{dashboard.total_jobs_completed.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Avg Latency</span>
                <span className="text-sm font-bold">{dashboard.avg_latency_ms}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Revenue Today</span>
                <span className="text-sm font-bold gradient-text" suppressHydrationWarning>
                  ₳ {dashboard.revenue_chart.length > 0 ? dashboard.revenue_chart[dashboard.revenue_chart.length - 1].amount : 0}
                </span>
              </div>

              {/* Revenue progress bar */}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0, 209, 255, 0.08)" }}>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Monthly Goal</span>
                  <span suppressHydrationWarning>₳ {dashboard.total_revenue_ada.toFixed(0)} / 2,000</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "rgba(0, 209, 255, 0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((dashboard.total_revenue_ada / 2000) * 100, 100)}%`, background: "linear-gradient(90deg, #00D1FF, #A855F7)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="glass-card p-6 mt-6">
          <h3 className="text-lg font-semibold mb-5">Your Services</h3>
          {services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0, 209, 255, 0.1)" }}>
                    <th className="text-left py-3 text-xs text-muted font-medium">Service</th>
                    <th className="text-left py-3 text-xs text-muted font-medium">Category</th>
                    <th className="text-right py-3 text-xs text-muted font-medium">Price</th>
                    <th className="text-right py-3 text-xs text-muted font-medium">Jobs</th>
                    <th className="text-right py-3 text-xs text-muted font-medium">Rating</th>
                    <th className="text-right py-3 text-xs text-muted font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-surface-hover transition-colors" style={{ borderBottom: "1px solid rgba(0, 209, 255, 0.05)" }}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{service.category_icon}</span>
                          <span className="font-medium">{service.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted">{service.category_name}</td>
                      <td className="py-3 text-right"><span className="price-tag text-xs">₳ {service.price_ada}</span></td>
                      <td className="py-3 text-right" suppressHydrationWarning>{service.total_jobs.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className="flex items-center justify-end gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {service.rating.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ 
                          background: service.status === "active" ? "rgba(0, 255, 163, 0.1)" : "rgba(255, 107, 107, 0.1)", 
                          color: service.status === "active" ? "#00FFA3" : "#FF6B6B" 
                        }}>{service.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted text-sm mb-4">You have not registered any AI services yet.</p>
              <Link href="/provider/register" className="glow-button text-xs py-2 px-4">
                Register Your First Service
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
