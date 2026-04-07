import { api } from "./api";

/** Venture list item (from GET /ventures) */
export interface VentureListItem {
  id: string;
  ref: string;
  name: string;
  owner_id: string | null;
  land_type: string | null;
  status: string;
  district: string | null;
  state: string | null;
  country: string | null;
  full_address: string | null;
  area_acres: number | null;
  total_value: number | null;
  expected_roi_percent: number | null;
  lock_in_months: number | null;
  token_price: number | null;
  total_tokens: number;
  available_tokens: number;
  image_url: string | null;
}

/** Single venture detail (from GET /ventures/:id) */
export interface VentureDocument {
  id: string;
  name: string | null;
  file_key: string | null;
  file_url: string | null;
  file_size_bytes: number | null;
  file_type: string | null;
  verified: boolean;
}

export interface VentureImage {
  id: string;
  file_key: string | null;
  file_url: string | null;
  sort_order: number;
}

export interface VentureDetail {
  id: string;
  ref: string;
  name: string;
  owner_id: string | null;
  land_type: string | null;
  status: string;
  description: string | null;
  litigation_description: string | null;
  survey_number: string | null;
  village: string | null;
  hobli: string | null;
  mandal: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  full_address: string | null;
  area_acres: number | null;
  price_per_sqft: number | null;
  total_value: number | null;
  expected_roi_percent: number | null;
  lock_in_months: number | null;
  features: string[] | null;
  exit_conditions: string[] | null;
  map_geojson: unknown;
  map_center_lat: number | null;
  map_center_lng: number | null;
  contract_address: string | null;
  contract_venture_id: number | null;
  tokens: {
    token_price: number | null;
    total_tokens: number;
    available_tokens: number;
  };
  documents: VentureDocument[];
  images: VentureImage[];
  land_owner: { id: string; name: string | null } | null;
}

export interface VenturesListResponse {
  items: VentureListItem[];
  total: number;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop";

function formatInr(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function formatLockIn(months: number | null | undefined): string {
  if (months == null) return "—";
  if (months === 12) return "12 months";
  if (months === 18) return "18 months";
  if (months === 24) return "24 months";
  if (months === 36) return "36 months";
  if (months === 48) return "48 months";
  return `${months} months`;
}

/** List ventures (public: live only; supports optional auth) */
export async function getVentures(params?: {
  status?: string;
  state?: string;
  min_value?: number;
  limit?: number;
  offset?: number;
  /** Use `me` when authenticated to list your own ventures (owners). */
  owner_id?: string;
  mature_for_bid?: string;
}): Promise<VenturesListResponse> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.state) search.set("state", params.state);
  if (params?.min_value != null) search.set("min_value", String(params.min_value));
  if (params?.owner_id) search.set("owner_id", params.owner_id);
  if (params?.mature_for_bid) search.set("mature_for_bid", params.mature_for_bid);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  const path = q ? `/ventures?${q}` : "/ventures";
  const res = await api.get(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load ventures");
  return data;
}

/** Get single venture by id */
export async function getVentureById(id: string): Promise<VentureDetail | null> {
  const res = await api.get(`/ventures/${id}`);
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load venture");
  return data;
}

/** Get venture tokens (GET /ventures/:id/tokens) */
export async function getVentureTokens(id: string): Promise<{
  token_price: number | null;
  total_tokens: number;
  available_tokens: number;
}> {
  const res = await api.get(`/ventures/${id}/tokens`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to load tokens");
  return data;
}

/** Map list item to Explore page card shape */
export function ventureToExploreCard(v: VentureListItem) {
  const location = [v.district, v.state].filter(Boolean).join(", ") || v.full_address || "—";
  return {
    id: v.id,
    name: v.name,
    location,
    totalValue: formatInr(v.total_value),
    minInvestment: formatInr(v.token_price),
    availableTokens: v.available_tokens,
    totalTokens: v.total_tokens,
    lockIn: formatLockIn(v.lock_in_months),
    expectedROI: v.expected_roi_percent != null ? `${v.expected_roi_percent}%` : "—",
    image: v.image_url || DEFAULT_IMAGE,
  };
}

/** LandData shape used by LandDetail and WishlistDetail */
export interface LandData {
  id: string;
  landId: string;
  name: string;
  location: string;
  surveyNumber: string;
  village: string;
  hobli: string;
  mandal: string;
  district: string;
  state: string;
  country: string;
  pricePerSqFt: string;
  fullAddress: string;
  totalValue: string;
  tokenPrice: string;
  tokenPriceNumber: number;
  minTokens: number;
  maxTokens: number;
  availableTokens: number;
  totalTokens: number;
  lockIn: string;
  expectedROI: string;
  area: string;
  description: string;
  features: string[];
  documents: { name: string; verified: boolean; size: string; type: string; downloadUrl: string }[];
  galleryImages: string[];
  litigations: string;
  landOwner: { name: string; type: string; contactPerson: string; verified: boolean };
  exitConditions: string[];
  images: string[];
  investors: number;
}

/** Map API venture detail to LandData for LandDetail/WishlistDetail */
export function ventureDetailToLandData(v: VentureDetail): LandData {
  const location = [v.district, v.state].filter(Boolean).join(", ") || v.full_address || "";
  const images = (v.images || []).map((i) => i.file_url || DEFAULT_IMAGE).filter(Boolean);
  const documents = (v.documents || []).map((d) => ({
    name: d.name || "Document",
    verified: d.verified,
    size: "—",
    type: d.file_type || "PDF",
    downloadUrl: d.file_url || "#",
  }));
  const tokenPriceNum = v.tokens?.token_price ?? 0;
  return {
    id: v.id,
    landId: v.ref,
    name: v.name,
    location,
    surveyNumber: v.survey_number || "—",
    village: v.village || "—",
    hobli: v.hobli || "—",
    mandal: v.mandal || "—",
    district: v.district || "—",
    state: v.state || "—",
    country: v.country || "India",
    pricePerSqFt: v.price_per_sqft != null ? formatInr(v.price_per_sqft) : "—",
    fullAddress: v.full_address || "",
    totalValue: formatInr(v.total_value),
    tokenPrice: formatInr(v.tokens?.token_price),
    tokenPriceNumber: tokenPriceNum,
    minTokens: 1,
    maxTokens: 10,
    availableTokens: v.tokens?.available_tokens ?? 0,
    totalTokens: v.tokens?.total_tokens ?? 0,
    lockIn: formatLockIn(v.lock_in_months),
    expectedROI: v.expected_roi_percent != null ? `${v.expected_roi_percent}%` : "—",
    area: v.area_acres != null ? `${v.area_acres} Acres` : "—",
    description: v.description || "",
    features: Array.isArray(v.features) ? v.features : [],
    documents,
    galleryImages: images.length ? images : [DEFAULT_IMAGE],
    litigations: v.litigation_description || "No active litigations.",
    landOwner: {
      name: v.land_owner?.name || "—",
      type: "Owner",
      contactPerson: "—",
      verified: !!v.land_owner,
    },
    exitConditions: Array.isArray(v.exit_conditions) ? v.exit_conditions : [],
    images: images.length ? images : [DEFAULT_IMAGE],
    investors: 0,
  };
}
