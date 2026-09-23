"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Vehicle } from "@/lib/vehicles";
import { money, number } from "@/lib/vehicle-format";
import { whatsappUrl } from "@/lib/dealership";
import {
  VEHICLE_SORT_OPTIONS,
  SEARCH_DEBOUNCE_MS,
  type SortKey,
} from "@/config/catalog";
import {
  emptyCatalogFilters,
  readCatalogQuery,
  catalogQuery,
  selectCatalog,
  catalogOptions,
  quickCatalogFilters,
  catalogPage,
  activeCatalogFilterCount,
  suggestedPriceCeiling,
  normalizeCatalogText,
  normalizeCatalogBody,
  type CatalogFilters,
} from "@/lib/catalog";
import { VehicleGrid } from "./vehicle-card";
import styles from "./inventory.module.css";

export function Inventory({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState(emptyCatalogFilters);
  const [expanded, setExpanded] = useState(false);
  const [sheet, setSheet] = useState<"filters" | "sort" | null>(null);
  const [pages, setPages] = useState(1);
  const [catalogVisible, setCatalogVisible] = useState(true);
  const catalogElement = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<CatalogFilters | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const element = catalogElement.current;
    if (!element) return;
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      // Release the fixed bar as the footer takes over the lower half of the viewport.
      observer = new IntersectionObserver(
        ([entry]) => setCatalogVisible(entry.isIntersecting),
        { rootMargin: `-${Math.floor(window.innerHeight / 2)}px 0px 0px 0px` },
      );
      observer.observe(element);
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, []);
  useEffect(() => {
    const sync = () => {
      if (timer.current) clearTimeout(timer.current);
      pending.current = null;
      setFilters(readCatalogQuery(location.search));
      setPages(1);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!sheet) return;
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    const desktop = window.matchMedia("(min-width: 810px)");
    const closeOnDesktop = () => {
      if (desktop.matches) element.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
      opener.current?.focus({ preventScroll: true });
    };
  }, [sheet]);
  function writeUrl(next: CatalogFilters, mode: "push" | "replace") {
    const query = catalogQuery(next);
    const url = location.pathname + (query ? "?" + query : "") + location.hash;
    if (url === location.pathname + location.search + location.hash) return;
    if (mode === "push") history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  }
  function update(next: CatalogFilters, typing = false) {
    if (timer.current) clearTimeout(timer.current);
    if (!typing && pending.current) writeUrl(pending.current, "replace");
    pending.current = typing ? next : null;
    setFilters(next);
    setPages(1);
    if (typing)
      timer.current = setTimeout(() => {
        writeUrl(next, "replace");
        pending.current = null;
      }, SEARCH_DEBOUNCE_MS);
    else writeUrl(next, "push");
  }
  function set<K extends keyof CatalogFilters>(
    key: K,
    value: CatalogFilters[K],
    typing = false,
  ) {
    update(
      { ...filters, [key]: value, ...(key === "make" ? { model: "" } : {}) },
      typing,
    );
  }
  const matches = useMemo(
    () => selectCatalog(vehicles, filters),
    [vehicles, filters],
  );
  const options = useMemo(
    () => catalogOptions(vehicles, filters.make),
    [vehicles, filters.make],
  );
  const chips = useMemo(() => quickCatalogFilters(vehicles), [vehicles]);
  const count = activeCatalogFilterCount(filters);
  const page = catalogPage(matches, pages);
  const priceSuggestion = suggestedPriceCeiling(vehicles, filters);
  const clear = () => update({ ...emptyCatalogFilters(), sort: filters.sort });
  const totalLabel = `${number(matches.length)} ${matches.length === 1 ? "veículo" : "veículos"}`;
  function sortControl() {
    return (
      <label className="field">
        Ordenar veículos
        <select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value as SortKey)}
        >
          {VEHICLE_SORT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  function select(
    key: "make" | "model" | "body" | "fuel" | "transmission",
    label: string,
  ) {
    const values = options[key];
    if (values.length < 2) return null;
    const current = filters[key];
    const normalize =
      key === "body" ? normalizeCatalogBody : normalizeCatalogText;
    const selected =
      values.find((value) => normalize(value) === normalize(current)) ||
      current;
    return (
      <label className="field" key={key}>
        {label}
        <select value={selected} onChange={(e) => set(key, e.target.value)}>
          <option value="">Todos</option>
          {selected && !values.includes(selected) && (
            <option value={selected}>
              {selected === "automatic" ? "Automático" : selected}
            </option>
          )}
          {values.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
    );
  }
  function advancedControls() {
    const years = [
      ...new Set(
        vehicles.filter((v) => v.status !== "sold").map((v) => v.year),
      ),
    ].sort((a, b) => b - a);
    const mileages = new Set(
      vehicles.filter((v) => v.status !== "sold").map((v) => v.mileage),
    );
    return (
      <div className={styles.fields}>
        {select("make", "Marca")}
        {select("model", "Modelo")}
        {options.price &&
          options.price.min < options.price.max &&
          (["minPrice", "maxPrice"] as const).map((key) => {
            const range = options.price!;
            const value =
              filters[key] ?? (key === "minPrice" ? range.min : range.max);
            return (
              <label className={`field ${styles.range}`} key={key}>
                {key === "minPrice" ? "Preço mínimo" : "Preço máximo"}:{" "}
                {money(value)}
                <input
                  type="range"
                  aria-label={
                    key === "minPrice" ? "Preço mínimo" : "Preço máximo"
                  }
                  aria-valuetext={money(value)}
                  min={Math.min(range.min, value)}
                  max={Math.max(range.max, value)}
                  step="1"
                  value={value}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    update(
                      {
                        ...filters,
                        [key]: value,
                        ...(key === "minPrice" &&
                        filters.maxPrice !== undefined &&
                        value > filters.maxPrice
                          ? { maxPrice: value }
                          : {}),
                        ...(key === "maxPrice" &&
                        filters.minPrice !== undefined &&
                        value < filters.minPrice
                          ? { minPrice: value }
                          : {}),
                      },
                      true,
                    );
                  }}
                />
                <small>
                  {money(range.min)} a {money(range.max)}
                </small>
              </label>
            );
          })}
        {years.length >= 2 &&
          (["minYear", "maxYear"] as const).map((key) => (
            <label className="field" key={key}>
              {key === "minYear" ? "Ano mínimo" : "Ano máximo"}
              <select
                value={filters[key] ?? ""}
                onChange={(e) =>
                  set(key, e.target.value ? Number(e.target.value) : undefined)
                }
              >
                <option value="">Sem limite</option>
                {filters[key] !== undefined &&
                  !years.includes(filters[key]) && (
                    <option value={filters[key]}>{filters[key]}</option>
                  )}
                {years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </label>
          ))}
        {mileages.size >= 2 && (
          <label className="field">
            Quilometragem máxima
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max={options.maxMileage ?? undefined}
              step="1"
              placeholder="Sem limite"
              value={filters.maxMileage ?? ""}
              onChange={(e) =>
                set(
                  "maxMileage",
                  e.target.value === ""
                    ? undefined
                    : Math.max(0, Number(e.target.value)),
                  true,
                )
              }
            />
          </label>
        )}
        {select("body", "Categoria")}
        {select("transmission", "Câmbio")}
        {select("fuel", "Combustível")}
        {options.configuration && (
          <label className="field">
            Configuração
            <select
              value={filters.configuration}
              onChange={(e) =>
                set(
                  "configuration",
                  e.target.value as CatalogFilters["configuration"],
                )
              }
            >
              <option value="all">Todos</option>
              <option value="original">Originais</option>
              <option value="modified">Modificados</option>
            </select>
          </label>
        )}
      </div>
    );
  }
  function openSheet(kind: "filters" | "sort", trigger: HTMLButtonElement) {
    opener.current = trigger;
    setSheet(kind);
  }
  const active: { label: string; patch: Partial<CatalogFilters> }[] = [];
  if (normalizeCatalogText(filters.q))
    active.push({ label: `Busca: ${filters.q}`, patch: { q: "" } });
  for (const [key, label] of [
    ["make", "Marca"],
    ["model", "Modelo"],
    ["body", "Categoria"],
    ["transmission", "Câmbio"],
    ["fuel", "Combustível"],
  ] as const)
    if (filters[key])
      active.push({
        label: `${label}: ${filters[key] === "automatic" ? "Automático" : filters[key]}`,
        patch: { [key]: "", ...(key === "make" ? { model: "" } : {}) },
      });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
    active.push({
      label: `Preço: ${filters.minPrice === undefined ? "sem mínimo" : money(filters.minPrice)} — ${filters.maxPrice === undefined ? "sem máximo" : money(filters.maxPrice)}`,
      patch: { minPrice: undefined, maxPrice: undefined },
    });
  if (filters.minYear !== undefined || filters.maxYear !== undefined)
    active.push({
      label: `Ano: ${filters.minYear ?? "sem mínimo"} — ${filters.maxYear ?? "sem máximo"}`,
      patch: { minYear: undefined, maxYear: undefined },
    });
  if (filters.maxMileage !== undefined)
    active.push({
      label: `Até ${number(filters.maxMileage)} km`,
      patch: { maxMileage: undefined },
    });
  if (filters.configuration !== "all")
    active.push({
      label: filters.configuration === "modified" ? "Modificados" : "Originais",
      patch: { configuration: "all" },
    });
  return (
    <section
      id="conteudo"
      ref={catalogElement}
      className={`container inventory-layout ${styles.catalog}`}
      aria-label="Catálogo de veículos"
    >
      <div className={styles.toolbar}>
        <label className="field">
          Buscar veículo
          <input
            type="search"
            maxLength={160}
            placeholder="Marca, modelo, versão ou ano"
            value={filters.q}
            onChange={(e) => set("q", e.target.value, true)}
          />
        </label>
        <div className={styles.desktop}>{sortControl()}</div>
        <button
          className={`${styles.button} ${styles.desktop}`}
          aria-expanded={expanded}
          aria-controls="catalog-advanced"
          onClick={() => setExpanded(!expanded)}
        >
          Filtros ({count})
        </button>
      </div>
      <div className={`body-tabs ${styles.chips}`} aria-label="Filtros rápidos">
        {chips.map((chip) => {
          const pressed =
            chip.id === "all"
              ? count === 0
              : Object.entries(chip.patch).every(
                  ([key, value]) =>
                    (key === "body"
                      ? normalizeCatalogBody
                      : normalizeCatalogText)(
                      String(filters[key as keyof CatalogFilters] ?? ""),
                    ) ===
                    (key === "body"
                      ? normalizeCatalogBody
                      : normalizeCatalogText)(String(value ?? "")),
                );
          return (
            <button
              key={chip.id}
              aria-pressed={pressed}
              onClick={() => {
                if (chip.id === "all") clear();
                else if (pressed)
                  update({
                    ...filters,
                    ...Object.fromEntries(
                      Object.keys(chip.patch).map((key) => [
                        key,
                        emptyCatalogFilters()[key as keyof CatalogFilters],
                      ]),
                    ),
                  });
                else update({ ...filters, ...chip.patch });
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {expanded && (
        <div
          id="catalog-advanced"
          className={`${styles.advanced} ${styles.desktop}`}
        >
          {advancedControls()}
          <button className="text-button" onClick={clear}>
            Limpar filtros
          </button>
        </div>
      )}
      {active.length > 0 && (
        <div className={styles.active} aria-label="Filtros ativos">
          {active.map((item) => (
            <button
              key={item.label}
              onClick={() => update({ ...filters, ...item.patch })}
              aria-label={`Remover ${item.label}`}
            >
              {item.label} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
      <div className="inventory-results">
        <div className={styles.status}>
          <p role="status" aria-live="polite">
            {totalLabel}
          </p>
          {count > 0 && (
            <button className="text-button" onClick={clear}>
              Limpar filtros
            </button>
          )}
        </div>
        {matches.length ? (
          <VehicleGrid vehicles={page.items} />
        ) : (
          <div className="empty-state">
            <h2>Nenhum veículo corresponde a esses filtros.</h2>
            <p>Amplie a busca ou remova alguns filtros.</p>
            <div className={styles.emptyActions}>
              <button className={styles.button} onClick={clear}>
                Limpar filtros
              </button>
              {priceSuggestion !== null && (
                <button
                  className={styles.button}
                  onClick={() => set("maxPrice", priceSuggestion)}
                >
                  Ampliar até {money(priceSuggestion)}
                </button>
              )}
              <a
                className="text-button"
                href={whatsappUrl(
                  "Olá! Não encontrei o veículo que procuro no catálogo. Podem me ajudar?",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com a M3 pelo WhatsApp
              </a>
            </div>
          </div>
        )}
        {page.hasMore && (
          <div className={styles.more}>
            <button
              className={styles.button}
              onClick={() => setPages((value) => value + 1)}
            >
              Carregar mais veículos
            </button>
          </div>
        )}
        <p className="inventory-disclaimer">
          Estoque consultado em{" "}
          {new Date(vehicles[0]?.source.retrievedAt).toLocaleDateString(
            "pt-BR",
            { timeZone: "America/Sao_Paulo" },
          )}
          . Preços, equipamentos e disponibilidade devem ser confirmados com a
          M3 antes da negociação.
        </p>
      </div>
      <div
        className={styles.mobileBar}
        hidden={!catalogVisible}
        aria-label="Controles do catálogo"
      >
        <button
          className={styles.button}
          aria-haspopup="dialog"
          onClick={(e) => openSheet("filters", e.currentTarget)}
        >
          Filtrar ({count})
        </button>
        <button
          className={styles.button}
          aria-haspopup="dialog"
          onClick={(e) => openSheet("sort", e.currentTarget)}
        >
          Ordenar
        </button>
      </div>
      <dialog
        ref={dialog}
        className={styles.drawer}
        aria-labelledby="catalog-sheet-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
            ),
          ].filter((element) => element.getClientRects().length > 0);
          const first = controls[0],
            last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => setSheet(null)}
      >
        <div className={styles.drawerHeading}>
          <h2 id="catalog-sheet-title">
            {sheet === "sort" ? "Ordenar veículos" : "Filtrar veículos"}
          </h2>
          <button
            className={styles.button}
            onClick={() => dialog.current?.close()}
            aria-label="Fechar painel"
          >
            Fechar
          </button>
        </div>
        <div className={styles.drawerBody}>
          {sheet === "filters"
            ? advancedControls()
            : sheet === "sort"
              ? sortControl()
              : null}
        </div>
        <div className={styles.drawerFooter}>
          <button className="text-button" onClick={clear}>
            Limpar
          </button>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => dialog.current?.close()}
          >
            Ver {totalLabel}
          </button>
        </div>
      </dialog>
    </section>
  );
}
