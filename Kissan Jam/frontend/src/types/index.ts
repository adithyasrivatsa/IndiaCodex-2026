/**
 * TypeScript types for AdaCompute
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
}

export interface Service {
  id: string;
  provider_id: string;
  category_id: string;
  name: string;
  description: string;
  short_description: string | null;
  price_ada: number;
  endpoint_url: string;
  docs_url: string | null;
  avg_latency_ms: number;
  success_rate: number;
  total_jobs: number;
  uptime: number;
  rating: number;
  review_count: number;
  version: string;
  model_name: string | null;
  example_input: string | null;
  example_output: string | null;
  tags: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  provider_name: string | null;
  provider_wallet: string | null;
  category_name: string | null;
  category_icon: string | null;
}

export interface ServiceListResponse {
  services: Service[];
  total: number;
  page: number;
  page_size: number;
}

export interface Transaction {
  id: string;
  service_id: string;
  consumer_id: string;
  provider_id: string;
  amount_ada: number;
  tx_hash: string | null;
  status: string;
  result_data: string | null;
  created_at: string;
  completed_at: string | null;
  service_name: string | null;
}

export interface Review {
  id: string;
  service_id: string;
  consumer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  consumer_name: string | null;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface ProviderDashboard {
  total_revenue_ada: number;
  total_requests: number;
  total_jobs_completed: number;
  avg_latency_ms: number;
  success_rate: number;
  rating: number;
  active_services: number;
  revenue_chart: RevenueData[];
}

export interface PurchaseHistory {
  id: string;
  service_name: string;
  amount_ada: number;
  status: string;
  date: string;
}

export interface ConsumerDashboard {
  total_spent_ada: number;
  total_purchases: number;
  total_reviews: number;
  favorite_category: string | null;
  recent_purchases: PurchaseHistory[];
}
