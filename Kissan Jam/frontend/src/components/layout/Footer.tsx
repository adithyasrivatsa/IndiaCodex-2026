import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "rgba(13, 27, 42, 0.9)", borderTop: "1px solid rgba(0, 209, 255, 0.08)" }}>
      <div className="container-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg, #00D1FF, #A855F7)" }}>₳</div>
              <span className="text-lg font-bold"><span className="gradient-text">Ada</span><span>Compute</span></span>
            </div>
            <p className="text-sm text-muted leading-relaxed">The decentralized AI Service Exchange built on Cardano. Pay-per-use AI services with trustless payments.</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/marketplace" className="text-sm text-muted hover:text-foreground transition-colors">Marketplace</Link>
              <Link href="/dashboard/provider" className="text-sm text-muted hover:text-foreground transition-colors">Provider Dashboard</Link>
              <Link href="/dashboard/consumer" className="text-sm text-muted hover:text-foreground transition-colors">Consumer Dashboard</Link>
              <Link href="/marketplace" className="text-sm text-muted hover:text-foreground transition-colors">Browse Services</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Resources</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted">Documentation</span>
              <span className="text-sm text-muted">API Reference</span>
              <span className="text-sm text-muted">Smart Contracts</span>
              <span className="text-sm text-muted">GitHub</span>
            </div>
          </div>

          {/* Cardano */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Built on Cardano</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted">Mesh SDK</span>
              <span className="text-sm text-muted">Aiken Smart Contracts</span>
              <span className="text-sm text-muted">Blockfrost API</span>
              <span className="text-sm text-muted">Lace Wallet</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(0, 209, 255, 0.08)" }}>
          <p className="text-xs text-muted">© 2026 AdaCompute. Decentralized AI Service Exchange.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">Powered by</span>
            <span className="text-xs font-semibold gradient-text">Cardano</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
