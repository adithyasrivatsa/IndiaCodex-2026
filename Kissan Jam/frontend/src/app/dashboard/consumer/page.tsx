"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import { mockConsumerDashboard, mockServices } from "@/lib/mock-data";
import { api } from "@/lib/api";
import type { ConsumerDashboard, Service } from "@/types";

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="stat-card">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1" suppressHydrationWarning>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

export default function ConsumerDashboardPage() {
  const { wallet, connected: meshConnected, connecting } = useWallet();
  const [address, setAddress] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<ConsumerDashboard | null>(null);
  const [favoriteServices, setFavoriteServices] = useState<Service[]>([]);
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

    api.getConsumerDashboard(address)
      .then((data) => {
        setDashboard(data);
        // Load favorite services (first 4 services for demo)
        setFavoriteServices(mockServices.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch live dashboard data (API offline or new wallet). Using mock consumer demo:", err);
        setDashboard(mockConsumerDashboard);
        setFavoriteServices(mockServices.slice(0, 4));
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
        <div className="text-5xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-3">Consumer Activity Dashboard</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Connect your Cardano wallet to view your purchase history, manage your reviews, and track your spending analytics on the AdaCompute exchange.
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

  return (
    <div className="bg-grid min-h-screen">
      <div className="container-xl py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Consumer <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted text-sm flex items-center gap-2">
              Viewing wallet: <span className="text-foreground font-mono text-xs truncate max-w-[200px] sm:max-w-xs">{address}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="text-xs px-2.5 py-1.5 rounded-full font-medium" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", color: "#F59E0B" }}>
                Demo Mode
              </span>
            )}
            <Link href="/marketplace" className="glow-button text-sm py-2 px-5">
              Browse Services
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Spent" value={`₳ ${dashboard.total_spent_ada}`} icon="💳" />
          <StatCard label="Purchases" value={dashboard.total_purchases.toString()} icon="🛒" />
          <StatCard label="Reviews Given" value={dashboard.total_reviews.toString()} icon="⭐" />
          <StatCard label="Favorite" value={dashboard.favorite_category || "Chat"} icon="❤️" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase History */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-semibold mb-5">Recent Purchases</h3>
            {dashboard.recent_purchases.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recent_purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-colors"
                    style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(0, 209, 255, 0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(0, 209, 255, 0.1)" }}>
                        🤖
                      </div>
                      <div>
                        <p className="text-sm font-medium">{purchase.service_name}</p>
                        <p className="text-xs text-muted">{purchase.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: "#00D1FF" }} suppressHydrationWarning>₳ {purchase.amount_ada}</p>
                      <p className="text-xs capitalize" style={{ color: purchase.status === "completed" ? "#00FFA3" : "#F59E0B" }}>
                        {purchase.status === "completed" ? "✓ Completed" : purchase.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted text-sm">
                No purchases yet. Go to the marketplace to try your first AI model request!
              </div>
            )}
          </div>

          {/* Saved Services */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-5">Saved Services</h3>
            <div className="space-y-3">
              {favoriteServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-surface-hover"
                  style={{ border: "1px solid rgba(0, 209, 255, 0.05)" }}
                >
                  <div className="text-xl">{service.category_icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{service.name}</p>
                    <p className="text-xs text-muted">{service.provider_name}</p>
                  </div>
                  <span className="price-tag text-xs">₳ {service.price_ada}</span>
                </Link>
              ))}
            </div>

            {/* Spending chart */}
            <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(0, 209, 255, 0.08)" }}>
              <h4 className="text-sm font-semibold mb-3">Spending by Category</h4>
              <div className="space-y-2.5">
                {[
                  { cat: "Chat", pct: 35, color: "#00D1FF" },
                  { cat: "OCR", pct: 25, color: "#FF6B6B" },
                  { cat: "Image Gen", pct: 20, color: "#EC4899" },
                  { cat: "Coding", pct: 12, color: "#8B5CF6" },
                  { cat: "Other", pct: 8, color: "#8899AA" },
                ].map((item) => (
                  <div key={item.cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{item.cat}</span>
                      <span style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(0, 209, 255, 0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
