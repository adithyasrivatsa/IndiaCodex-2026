/**
 * API client for AdaCompute backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Services
  getServices: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchAPI<import("@/types").ServiceListResponse>(`/services${query}`);
  },
  getService: (id: string) =>
    fetchAPI<import("@/types").Service>(`/services/${id}`),
  createService: (data: Record<string, unknown>, walletAddress: string) =>
    fetchAPI<import("@/types").Service>(
      `/services?wallet_address=${walletAddress}`,
      { method: "POST", body: JSON.stringify(data) }
    ),

  // Categories
  getCategories: () =>
    fetchAPI<import("@/types").Category[]>("/categories"),

  // Purchase
  purchase: (data: { service_id: string; consumer_wallet: string; input_data?: string }) =>
    fetchAPI<import("@/types").Transaction>("/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Reviews
  getReviews: (serviceId: string) =>
    fetchAPI<import("@/types").Review[]>(`/reviews/${serviceId}`),
  createReview: (data: { service_id: string; consumer_wallet: string; rating: number; comment?: string }) =>
    fetchAPI<import("@/types").Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Dashboard
  getProviderDashboard: (walletAddress: string) =>
    fetchAPI<import("@/types").ProviderDashboard>(
      `/dashboard/provider?wallet_address=${walletAddress}`
    ),
  getConsumerDashboard: (walletAddress: string) =>
    fetchAPI<import("@/types").ConsumerDashboard>(
      `/dashboard/consumer?wallet_address=${walletAddress}`
    ),

  // Transactions
  getTransactions: (walletAddress: string) =>
    fetchAPI<import("@/types").Transaction[]>(
      `/transactions?wallet_address=${walletAddress}`
    ),
};
