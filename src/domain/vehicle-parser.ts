import type {
  Vehicle,
  VehicleImage,
  VehicleModification,
  PricePoint,
} from "./vehicle.ts";
export type VehicleDiagnostic = {
  vehicleId: string;
  field: string;
  message: string;
};
export type DiagnosticSink = (diagnostic: VehicleDiagnostic) => void;
const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Vehicle input must be an object");
  return value as Record<string, unknown>;
};
const optionalString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
export function parseVehicleNumber(value: unknown, field: string): number {
  let result: unknown = value;
  if (typeof value === "string") {
    let clean = value
      .trim()
      .replace(/^R\$\s*/, "")
      .replace(/\s*km$/i, "")
      .replace(/\s/g, "");
    if (!/^\d+(?:[.,]\d+)*$/.test(clean)) throw Error(`Invalid ${field}`);
    if (clean.includes(","))
      clean = clean.replaceAll(".", "").replace(",", ".");
    else if (/^\d{1,3}(?:\.\d{3})+$/.test(clean))
      clean = clean.replaceAll(".", "");
    result = Number(clean);
  }
  if (typeof result !== "number" || !Number.isFinite(result) || result < 0)
    throw Error(`Invalid ${field}`);
  return result;
}
export function validIso(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(
      value,
    ) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value.slice(0, 10)).toISOString().slice(0, 10) === value.slice(0, 10)
  );
}
const categories = new Set([
  "engine",
  "exhaust",
  "suspension",
  "wheels",
  "tires",
  "brakes",
  "body",
  "interior",
  "electronics",
  "audio",
  "lighting",
  "other",
]);
function modification(value: unknown): VehicleModification {
  const row = object(value);
  if (
    !categories.has(String(row.category)) ||
    !optionalString(row.title) ||
    !optionalString(row.description)
  )
    throw Error("Invalid modification");
  if (row.installedAt !== undefined && !validIso(row.installedAt))
    throw Error("Invalid modification installedAt");
  return {
    category: row.category as VehicleModification["category"],
    title: row.title as string,
    description: row.description as string,
    ...(optionalString(row.brand) ? { brand: row.brand as string } : {}),
    ...(optionalString(row.model) ? { model: row.model as string } : {}),
    ...(row.installedAt ? { installedAt: row.installedAt as string } : {}),
    ...(typeof row.documented === "boolean"
      ? { documented: row.documented }
      : {}),
    ...(optionalString(row.notes) ? { notes: row.notes as string } : {}),
    ...(Array.isArray(row.images) ? { images: strings(row.images) } : {}),
  };
}
export function parseVehicle(
  input: unknown,
  report: DiagnosticSink = () => {},
): Vehicle {
  const row = object(input);
  const id = optionalString(row.id);
  if (!id) throw Error("Missing vehicle id");
  const warn = (field: string, message: string) =>
    report({ vehicleId: id, field, message });
  const required = (key: string) => {
    const value = optionalString(row[key]);
    if (!value) throw Error(`Vehicle ${id}: missing ${key}`);
    return value;
  };
  const slug = required("slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw Error(`Vehicle ${id}: invalid slug`);
  const price = parseVehicleNumber(row.price, "price"),
    mileage = parseVehicleNumber(row.mileage ?? row.mileageKm, "mileage"),
    year = parseVehicleNumber(row.year ?? row.modelYear, "year");
  if (price <= 0 || !Number.isInteger(year) || year < 1886 || year > 2100)
    throw Error(`Vehicle ${id}: invalid price/year`);
  const status = row.status ?? "available";
  if (typeof status !== 'string' || !["available", "reserved", "sold"].includes(status))
    throw Error(`Vehicle ${id}: invalid status`);
  if (row.status === undefined) warn("status", "Missing; default available");
  const listedAt = validIso(row.listedAt) ? row.listedAt : null;
  if (!listedAt) warn("listedAt", "Unknown store entry date; left null");
  for (const field of ['version','bodyType','transmission','fuel','color','doors','description'] as const) {
    if (row[field] === undefined || row[field] === null || row[field] === '') warn(field, 'Not provided by source; left absent');
  }
  if (row.soldAt !== undefined && !validIso(row.soldAt))
    throw Error(`Vehicle ${id}: invalid soldAt`);
  const imageDetails: VehicleImage[] = [];
  for (const image of Array.isArray(row.images) ? row.images : []) {
    if (typeof image === "string") {
      imageDetails.push({ src: image, alt: "" });
    } else {
      const item = object(image);
      const src = optionalString(item.src);
      if (src)
        imageDetails.push({
          src,
          alt: optionalString(item.alt) || "",
          ...(optionalString(item.source)
            ? { source: item.source as string }
            : {}),
          ...(optionalString(item.remoteSrc)
            ? { remoteSrc: item.remoteSrc as string }
            : {}),
          ...(typeof item.width === "number" && item.width > 0
            ? { width: item.width }
            : {}),
          ...(typeof item.height === "number" && item.height > 0
            ? { height: item.height }
            : {}),
        });
    }
  }
  // Canonical records carry captions separately; keep them when applying write operations.
  if (Array.isArray(row.imageDetails))
    for (const detail of row.imageDetails) {
      const item = object(detail);
      const at = imageDetails.findIndex((i) => i.src === item.src);
      if (at >= 0)
        imageDetails[at] = {
          ...imageDetails[at],
          alt: optionalString(item.alt) || "",
          ...(optionalString(item.source)
            ? { source: item.source as string }
            : {}),
          ...(optionalString(item.remoteSrc)
            ? { remoteSrc: item.remoteSrc as string }
            : {}),
          ...(typeof item.width === "number" ? { width: item.width } : {}),
          ...(typeof item.height === "number" ? { height: item.height } : {}),
        };
    }
  if (!imageDetails.length)
    warn("images", "Missing photos; default empty gallery");
  const sourceRow = row.source ? object(row.source) : {};
  const source = {
    provider: optionalString(sourceRow.provider) || "",
    sourceUrl: optionalString(sourceRow.sourceUrl) || "",
    externalId: optionalString(sourceRow.externalId) || "",
    retrievedAt: optionalString(sourceRow.retrievedAt) || "",
  };
  if (!source.provider) warn("source", "Missing provenance");
  const priority =
    typeof row.priority === "number" && Number.isFinite(row.priority)
      ? row.priority
      : 0;
  if (priority < 0 || priority > 100)
    throw Error(`Vehicle ${id}: priority outside 0–100`);
  if (row.priority === undefined) warn("priority", "Missing; default 0");
  const isModified =
    typeof row.isModified === "boolean" ? row.isModified : false;
  if (row.isModified === undefined)
    warn(
      "isModified",
      "Missing; default false, not proof of original configuration",
    );
  const modifications = Array.isArray(row.modifications)
    ? row.modifications.map(modification)
    : undefined;
  const priceHistory: PricePoint[] | undefined = Array.isArray(row.priceHistory)
    ? row.priceHistory.map((p) => {
        const item = object(p);
        const amount = parseVehicleNumber(item.price, "priceHistory.price");
        if (amount <= 0 || !validIso(item.date))
          throw Error(`Vehicle ${id}: invalid price history`);
        return { price: amount, date: item.date };
      })
    : undefined;
  const result: Vehicle = {
    id,
    slug,
    make: required("make"),
    model: required("model"),
    year,
    price,
    mileage,
    status: status as Vehicle["status"],
    listedAt,
    images: imageDetails.map((i) => i.src),
    imageDetails,
    features: strings(row.features),
    featured: row.featured === true,
    priority,
    isModified,
    source,
    notes: strings(row.notes),
  };
  for (const key of [
    "version",
    "bodyType",
    "transmission",
    "fuel",
    "color",
    "condition",
    "coverImage",
    "description",
    "modificationSummary",
    "soldAt",
  ] as const) {
    const value = optionalString(row[key]);
    if (value) result[key] = value;
  }
  for (const key of ["doors", "manufactureYear"] as const)
    if (row[key] !== undefined) {
      const value = parseVehicleNumber(row[key], key);
      if (!Number.isInteger(value) || value < 1) throw Error(`Invalid ${key}`);
      result[key] = value;
    }
  if (modifications) result.modifications = modifications;
  if (priceHistory) result.priceHistory = priceHistory;
  return result;
}
export function parseVehicles(
  input: unknown,
  report?: DiagnosticSink,
): Vehicle[] {
  if (!Array.isArray(input)) throw Error("Inventory must be an array");
  const rows = input.map((row) => parseVehicle(row, report));
  for (const key of ["id", "slug"] as const)
    if (new Set(rows.map((row) => row[key])).size !== rows.length)
      throw Error(`Duplicate vehicle ${key}`);
  return rows;
}
