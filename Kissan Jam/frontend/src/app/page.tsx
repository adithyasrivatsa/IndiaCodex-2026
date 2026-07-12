"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mockServices } from "@/lib/mock-data";

const stats = [
  { label: "AI Services", value: 12, suffix: "+" },
  { label: "Total Jobs", value: 640, suffix: "K+" },
  { label: "Providers", value: 6, suffix: "" },
  { label: "ADA Transacted", value: 24, suffix: "K+" },
];

const features = [
  {
    icon: "🔐",
    title: "Trustless Escrow",
    description: "ADA is held in smart contract escrow until service delivery is confirmed. No middlemen required.",
  },
  {
    icon: "⭐",
    title: "On-Chain Reputation",
    description: "Provider ratings and job history stored immutably on Cardano. Transparent and tamper-proof.",
  },
  {
    icon: "⚡",
    title: "Pay-Per-Use",
    description: "No subscriptions. Pay only for what you use. From 0.05 ADA per inference.",
  },
  {
    icon: "🌐",
    title: "Any AI Model",
    description: "Providers can host OpenAI-compatible APIs, Ollama, vLLM, Hugging Face, or custom models.",
  },
  {
    icon: "🎯",
    title: "Smart Discovery",
    description: "Find the perfect AI service by category, price, latency, and rating. Instant comparison.",
  },
  {
    icon: "🔗",
    title: "Built on Cardano",
    description: "Leveraging eUTxO model for secure, predictable transactions with low fees.",
  },
];

const steps = [
  { step: "01", title: "Provider Registers", description: "List your AI service with pricing, documentation, and endpoint." },
  { step: "02", title: "User Discovers", description: "Search and compare AI services by category, price, and rating." },
  { step: "03", title: "ADA Enters Escrow", description: "Payment is locked in a smart contract until delivery." },
  { step: "04", title: "AI Delivers", description: "Provider runs inference and returns the result." },
  { step: "05", title: "Payment Released", description: "Escrow releases ADA. Both parties update reputation." },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="gradient-text text-4xl md:text-5xl font-bold" suppressHydrationWarning>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="bg-grid">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-[#00D1FF] top-20 -left-48" />
        <div className="orb w-80 h-80 bg-[#A855F7] top-40 right-0" style={{ animationDelay: "5s" }} />
        <div className="orb w-64 h-64 bg-[#00FFA3] bottom-0 left-1/3" style={{ animationDelay: "10s" }} />

        <div className="container-xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 animate-fade-in-up" style={{ background: "rgba(0, 209, 255, 0.08)", border: "1px solid rgba(0, 209, 255, 0.2)", color: "#00D1FF" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
              Built on Cardano · Preprod Testnet
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              The Decentralized{" "}
              <span className="gradient-text">AI Service</span>{" "}
              Exchange
            </h1>

            <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Discover, purchase, and use AI services with ADA.
              Trustless payments. On-chain reputation. No subscriptions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link href="/marketplace" className="glow-button text-base px-8 py-3.5 rounded-xl">
                Explore Services
              </Link>
              <Link
                href="/dashboard/provider"
                className="px-8 py-3.5 rounded-xl text-base font-medium transition-all"
                style={{ border: "1px solid rgba(0, 209, 255, 0.3)", color: "#00D1FF" }}
              >
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Featured services mini-cards */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            {mockServices.slice(0, 4).map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="glass-card p-4 text-center group">
                <div className="text-2xl mb-2">{service.category_icon}</div>
                <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">{service.name}</h3>
                <p className="text-xs text-muted mt-1">₳ {service.price_ada}/req</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">AdaCompute</span>?
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Blockchain-powered infrastructure for a new AI economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container-xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted text-lg">Five steps from discovery to delivery</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {steps.map((step, i) => (
              <div key={step.step} className="glass-card p-5 flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${i % 2 === 0 ? "#00D1FF20" : "#A855F720"}, transparent)`,
                    border: `1px solid ${i % 2 === 0 ? "#00D1FF30" : "#A855F730"}`,
                    color: i % 2 === 0 ? "#00D1FF" : "#A855F7",
                  }}
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20">
        <div className="container-xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Service <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-muted text-lg">Find the perfect AI for any task</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              { name: "Chat", icon: "💬", color: "#00D1FF" },
              { name: "OCR", icon: "📄", color: "#FF6B6B" },
              { name: "Vision", icon: "👁️", color: "#A855F7" },
              { name: "Speech", icon: "🎤", color: "#F59E0B" },
              { name: "Translation", icon: "🌐", color: "#10B981" },
              { name: "Summarization", icon: "📝", color: "#3B82F6" },
              { name: "Coding", icon: "💻", color: "#8B5CF6" },
              { name: "Image Gen", icon: "🎨", color: "#EC4899" },
              { name: "Video", icon: "🎬", color: "#EF4444" },
              { name: "Audio", icon: "🔊", color: "#06B6D4" },
              { name: "Document AI", icon: "📋", color: "#14B8A6" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace?category=${cat.name.toLowerCase()}`}
                className="category-badge text-sm px-4 py-2.5 hover:scale-105 transition-transform"
                style={{
                  background: `${cat.color}10`,
                  border: `1px solid ${cat.color}30`,
                  color: cat.color,
                }}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-xl">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden animate-pulse-glow">
            <div className="orb w-60 h-60 bg-[#00D1FF] -top-20 -right-20" />
            <div className="orb w-48 h-48 bg-[#A855F7] -bottom-10 -left-10" style={{ animationDelay: "7s" }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to join the <span className="gradient-text">AI economy</span>?
              </h2>
              <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                Whether you&apos;re building AI or consuming it — AdaCompute is your decentralized exchange.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/marketplace" className="glow-button text-base px-8 py-3.5 rounded-xl">
                  Start Exploring
                </Link>
                <Link
                  href="/dashboard/provider"
                  className="px-8 py-3.5 rounded-xl text-base font-medium transition-all"
                  style={{ border: "1px solid rgba(0, 209, 255, 0.3)", color: "#00D1FF" }}
                >
                  List Your Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
