import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#1a7ad4",
  budget: "#F59E0B",
  route: "#3B82F6",
  transport: "#8B5CF6",
  hotel: "#EC4899",
  itinerary: "#10B981",
  safety: "#EF4444",
  packing: "#F97316",
};

export const AGENT_MODELS: Record<string, string> = {
  orchestrator: "llama3.1:70b",
  budget: "qwen2.5:72b",
  route: "mixtral:8x22b",
  transport: "mistral-nemo:12b",
  hotel: "gemma2:27b",
  itinerary: "llama3.1:70b",
  safety: "llama3.1:8b",
  packing: "phi3.5:3.8b",
};

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "" : "http://localhost:8000");
