"use client";

import Link from "next/link";
import type { Service } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#F59E0B" : "none"}
          stroke={star <= Math.round(rating) ? "#F59E0B" : "#8899AA"}
          strokeWidth="2"
          opacity={star <= Math.round(rating) ? 1 : 0.3}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function formatJobs(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.id}`} className="block">
      <div className="glass-card p-5 h-full flex flex-col cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${service.category_icon ? "rgba(0, 209, 255, 0.1)" : "rgba(0, 209, 255, 0.1)"}` }}
            >
              {service.category_icon || "🤖"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                {service.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">{service.provider_name}</p>
            </div>
          </div>
          <div className="price-tag text-xs">
            ₳ {service.price_ada}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted leading-relaxed mb-4 flex-1 line-clamp-2">
          {service.short_description || service.description}
        </p>

        {/* Category badge */}
        <div className="mb-3">
          <span
            className="category-badge text-xs"
            style={{
              background: `${getCategoryColor(service.category_name)}15`,
              border: `1px solid ${getCategoryColor(service.category_name)}30`,
              color: getCategoryColor(service.category_name),
            }}
          >
            {service.category_icon} {service.category_name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(0, 209, 255, 0.08)" }}>
          <div className="flex items-center gap-1">
            <StarRating rating={service.rating} />
            <span className="text-xs text-muted ml-1">{service.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{formatJobs(service.total_jobs)} jobs</span>
            <span>{service.avg_latency_ms < 1000 ? `${service.avg_latency_ms}ms` : `${(service.avg_latency_ms / 1000).toFixed(1)}s`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getCategoryColor(name: string | null): string {
  const colors: Record<string, string> = {
    "Chat": "#00D1FF",
    "OCR": "#FF6B6B",
    "Vision": "#A855F7",
    "Speech-to-Text": "#F59E0B",
    "Translation": "#10B981",
    "Summarization": "#3B82F6",
    "Coding": "#8B5CF6",
    "Image Generation": "#EC4899",
    "Video": "#EF4444",
    "Audio": "#06B6D4",
    "Document AI": "#14B8A6",
  };
  return colors[name || ""] || "#00D1FF";
}
