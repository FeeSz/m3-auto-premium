export type VehicleStatus = "available" | "reserved" | "sold";
export type VehicleModification = {
  category:
    | "engine"
    | "exhaust"
    | "suspension"
    | "wheels"
    | "tires"
    | "brakes"
    | "body"
    | "interior"
    | "electronics"
    | "audio"
    | "lighting"
    | "other";
  title: string;
  description: string;
  brand?: string;
  model?: string;
  installedAt?: string;
  documented?: boolean;
  notes?: string;
  images?: string[];
};
export type PricePoint = { price: number; date: string };
export type VehicleImage = {
  src: string;
  alt: string;
  source?: string;
  remoteSrc?: string;
  width?: number;
  height?: number;
};
export type VehicleSource = {
  provider: string;
  sourceUrl: string;
  externalId: string;
  retrievedAt: string;
};
export type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  version?: string;
  year: number;
  price: number;
  mileage: number;
  bodyType?: string;
  transmission?: string;
  fuel?: string;
  color?: string;
  doors?: number;
  status: VehicleStatus;
  /** null means the store entry date has not been supplied; never infer from retrieval. */
  listedAt: string | null;
  soldAt?: string;
  images: string[];
  features: string[];
  description?: string;
  featured: boolean;
  priority: number;
  isModified: boolean;
  modifications?: VehicleModification[];
  modificationSummary?: string;
  priceHistory?: PricePoint[];
  // Preserve verified source information and current presentation without inventing facts.
  manufactureYear?: number;
  condition?: string;
  coverImage?: string;
  imageDetails: VehicleImage[];
  source: VehicleSource;
  notes: string[];
};
