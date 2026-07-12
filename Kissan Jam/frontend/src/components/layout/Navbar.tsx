"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/dashboard/provider", label: "Provider" },
  { href: "/dashboard/consumer", label: "Consumer" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { wallet, connected: meshConnected } = useWallet();
  const [address, setAddress] = useState<string>("");
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
          if (unused && unused.length > 0) return setAddress(unused[0]);
          
          const used = await wallet.getUsedAddresses();
          if (used && used.length > 0) return setAddress(used[0]);
          
          const change = await wallet.getChangeAddress();
          if (change) return setAddress(change);
        } catch (e) {
          console.warn("Wallet address fetch error", e);
        }
        
        if (devAddr) setAddress(devAddr);
      };
      
      fetchAddress();
    } else if (devAddr) {
      setAddress(devAddr);
    } else {
      setAddress("");
    }
  }, [meshConnected, wallet]);

  const handleDisconnect = () => {
    localStorage.removeItem("dev_wallet_address");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(13, 27, 42, 0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0, 209, 255, 0.1)" }}>
      <div className="container-xl flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: "linear-gradient(135deg, #00D1FF, #A855F7)" }}>
            ₳
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Ada</span>
            <span className="text-foreground">Compute</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm font-medium ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Wallet / CTA */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(0, 255, 163, 0.1)", border: "1px solid rgba(0, 255, 163, 0.2)", color: "#00FFA3" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
            Preprod
          </div>

          {mounted ? (
            <div className="flex items-center gap-3">
              <CardanoWallet />
              
              {!meshConnected && address && (
                <div className="flex items-center gap-2 border-l border-muted/20 pl-3 ml-1">
                  <span className="text-xs text-muted font-mono bg-[#0D1B2A]/90 border border-muted/20 px-2 py-1.5 rounded-lg">
                    {address.slice(0, 8)}...{address.slice(-5)} (dev)
                  </span>
                  <button
                    onClick={handleDisconnect}
                    className="text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                  >
                    Disconnect Dev
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[140px] h-10 bg-muted/20 rounded-xl animate-pulse" />
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4" style={{ borderTop: "1px solid rgba(0, 209, 255, 0.1)" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium ${pathname === link.href ? "text-accent" : "text-muted"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
