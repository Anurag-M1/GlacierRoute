// ==================== Trip Types ====================
export interface TripRequest {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budgetInr: number;
  travelStyle: "budget" | "mid-range" | "luxury" | "adventure" | "cultural" | "relaxation";
  groupType: "solo" | "couple" | "family" | "friends" | "business";
  specialRequirements?: string;
}

export interface TripPlan {
  id: string;
  sessionId: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budgetInr: number;
  travelStyle: string;
  groupType: string;
  status: "planning" | "active" | "completed" | "cancelled";
  budget: BudgetResult;
  route: RouteResult;
  transport: TransportResult;
  hotels: HotelResult;
  itinerary: ItineraryResult;
  safety: SafetyResult;
  packing: PackingResult;
  confidenceScore: number;
  summary: string;
  createdAt: string;
}

// ==================== Agent Result Types ====================
export interface BudgetResult {
  transport: { estimated: number; min: number; max: number; breakdown: Record<string, number> };
  accommodation: { estimated: number; perNight: number; totalNights: number };
  food: { estimated: number; perDay: number; total: number };
  activities: { estimated: number; breakdown: { name: string; cost: number }[] };
  shoppingMisc: { estimated: number };
  emergencyBuffer: { amount: number; percentage: number };
  totalEstimated: number;
  withinBudget: boolean;
  savingsTips: string[];
}

export interface RouteResult {
  routes: {
    id: string;
    name: string;
    stages: RouteStage[];
    scores: { timeEfficiency: number; costEfficiency: number; comfort: number; scenicValue: number };
    isRecommended: boolean;
  }[];
}

export interface RouteStage {
  from: string;
  to: string;
  mode: string;
  operator: string;
  duration: string;
  costInr: number;
  coordinates: { lat: number; lng: number }[];
  notes: string;
}

export interface TransportResult {
  flights: TransportOption[];
  trains: TransportOption[];
  buses: TransportOption[];
}

export interface TransportOption {
  id: string;
  mode: string;
  operator: string;
  departure: string;
  arrival: string;
  duration: string;
  priceInr: number;
  class: string;
  stops: number;
  isCheapest: boolean;
  isRecommended: boolean;
  details: Record<string, string>;
}

export interface HotelResult {
  hotels: HotelOption[];
}

export interface HotelOption {
  id: string;
  name: string;
  area: string;
  stars: number;
  reviewScore: number;
  pricePerNight: number;
  totalCost: number;
  amenities: string[];
  freeCancellation: boolean;
  distanceToCentre: number;
  nearestAttraction: string;
  bookingUrl: string;
  highlight: string;
  isRecommended: boolean;
  tier: "budget" | "mid-range" | "premium";
}

export interface ItineraryResult {
  days: ItineraryDay[];
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  date: string;
  morning: ItinerarySlot[];
  afternoon: ItinerarySlot[];
  evening: ItinerarySlot[];
  meals: { name: string; cuisine: string; costPerPerson: number; type: "breakfast" | "lunch" | "dinner" }[];
  transportNote: string;
}

export interface ItinerarySlot {
  activity: string;
  location: string;
  duration: number;
  costInr: number;
  insiderTip: string;
  bestTime: string;
  crowdLevel: "low" | "medium" | "high";
}

export interface SafetyResult {
  overallScore: number;
  advisoryLevel: "safe" | "exercise_caution" | "avoid";
  healthRisks: { risk: string; prevention: string }[];
  emergencyContacts: { name: string; number: string }[];
  seasonalRisks: string[];
  safetyTips: string[];
  travelInsuranceRecommended: boolean;
}

export interface PackingResult {
  categories: PackingCategory[];
  recommendedBagSize: string;
}

export interface PackingCategory {
  name: string;
  items: PackingItem[];
}

export interface PackingItem {
  name: string;
  quantity: number;
  essential: boolean;
  packed?: boolean;
}

// ==================== Agent Stream Types ====================
export interface AgentLog {
  agent: string;
  msg: string;
  ts: number;
  status?: "started" | "running" | "completed" | "error";
  model?: string;
  provider?: string;
}

export interface AgentStatus {
  name: string;
  status: "idle" | "running" | "done" | "error";
  model: string;
  provider: string;
  startedAt?: number;
  completedAt?: number;
  tokensUsed?: number;
  durationMs?: number;
}

// ==================== Destination Types ====================
export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  country: string;
  region: string;
  category: string;
  description: string;
  bestMonths: string[];
  avgBudgetInr: number;
  safetyScore: number;
  heroImageUrl: string;
  photos: string[];
  lat: number;
  lng: number;
}

// ==================== User Types ====================
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  role: "user" | "admin";
}

// ==================== Expense Types ====================
export interface Expense {
  id: string;
  tripId: string;
  category: string;
  amountInr: number;
  description: string;
  receiptUrl?: string;
  date: string;
  createdAt: string;
}

// ==================== Chat Types ====================
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}
