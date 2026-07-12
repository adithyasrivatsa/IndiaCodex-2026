"use client";

import { useState, useMemo, useEffect } from "react";
import ServiceCard from "@/components/marketplace/ServiceCard";
import { mockServices, mockCategories } from "@/lib/mock-data";
import { api } from "@/lib/api";
import type { Service, Category } from "@/types";

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("rating");

  useEffect(() => {
    api.getServices()
      .then((res) => {
        if (res && res.services) {
          setServices(res.services);
        }
      })
      .catch((err) => console.log("Using mock services (API offline):", err));

    api.getCategories()
      .then((res) => {
        if (res && res.length > 0) {
          setCategories(res);
        }
      })
      .catch((err) => console.log("Using mock categories (API offline):", err));
  }, []);

  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.tags && s.tags.toLowerCase().includes(q)) ||
          (s.provider_name && s.provider_name.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((s) => s.category_name === selectedCategory);
    }

    // Price
    result = result.filter((s) => s.price_ada <= maxPrice);

    // Rating
    if (minRating > 0) {
      result = result.filter((s) => s.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.price_ada - b.price_ada);
        break;
      case "price-high":
        result.sort((a, b) => b.price_ada - a.price_ada);
        break;
      case "popular":
        result.sort((a, b) => b.total_jobs - a.total_jobs);
        break;
      case "fastest":
        result.sort((a, b) => a.avg_latency_ms - b.avg_latency_ms);
        break;
    }

    return result;
  }, [search, selectedCategory, maxPrice, minRating, sortBy]);

  return (
    <div className="bg-grid min-h-screen">
      <div className="container-xl py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            AI Service <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-muted text-lg">Discover and compare {services.length} AI services from {new Set(services.map(s => s.provider_name)).size} providers</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search AI services by name, category, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            id="marketplace-search"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`category-badge text-sm px-4 py-2 cursor-pointer transition-all ${
              selectedCategory === null ? "ring-1 ring-accent" : ""
            }`}
            style={{
              background: selectedCategory === null ? "rgba(0, 209, 255, 0.15)" : "rgba(0, 209, 255, 0.05)",
              border: `1px solid ${selectedCategory === null ? "rgba(0, 209, 255, 0.4)" : "rgba(0, 209, 255, 0.15)"}`,
              color: selectedCategory === null ? "#00D1FF" : "#8899AA",
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className="category-badge text-sm px-4 py-2 cursor-pointer transition-all"
              style={{
                background: selectedCategory === cat.name ? `${cat.color}20` : `${cat.color}08`,
                border: `1px solid ${selectedCategory === cat.name ? `${cat.color}50` : `${cat.color}20`}`,
                color: selectedCategory === cat.name ? cat.color : "#8899AA",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl" style={{ background: "rgba(27, 40, 56, 0.5)", border: "1px solid rgba(0, 209, 255, 0.08)" }}>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted font-medium">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg outline-none cursor-pointer"
              style={{ background: "var(--surface)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              id="sort-select"
            >
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="fastest">Fastest</option>
            </select>
          </div>

          {/* Max Price */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted font-medium">Max Price:</label>
            <input
              type="range"
              min="0.05"
              max="5000"
              step="0.05"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-[#00D1FF]"
            />
            <span className="text-xs font-medium" style={{ color: "#00D1FF" }}>₳ {maxPrice.toFixed(2)}</span>
          </div>

          {/* Min Rating */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted font-medium">Min Rating:</label>
            <div className="flex gap-1">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className="text-xs px-2 py-1 rounded-md transition-all"
                  style={{
                    background: minRating === r ? "rgba(0, 209, 255, 0.15)" : "transparent",
                    border: `1px solid ${minRating === r ? "rgba(0, 209, 255, 0.3)" : "transparent"}`,
                    color: minRating === r ? "#00D1FF" : "#8899AA",
                  }}
                >
                  {r === 0 ? "Any" : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="ml-auto text-xs text-muted">
            {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Service Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service, i) => (
              <div
                key={service.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
