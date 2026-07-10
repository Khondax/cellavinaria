import { useMemo, useState, useEffect } from 'preact/hooks';
import { VARIEDAD_META, formatPrecio, formatFechaToma, type Variedad } from '../lib/wine';
import MiniRack from './MiniRack';

export interface WineItem {
  id: string;
  nombre: string;
  tipoUva: string;
  uvas: string[];
  variedad: Variedad;
  bodega: string;
  region: string;
  pais: string;
  precio: number | null;
  puntuacion: number | null;
  fechaInicio: number;
  fechaFin: number;
  vinotecaId: string;
  posicion: number;
  fila: number;
  columna: number;
  imagen: string | null;
}

export interface VinotecaMeta {
  id: string;
  nombre: string;
  capacidad: number;
  columnas: number;
  layout: number[][];
}

interface Props {
  wines: WineItem[];
  vinotecas: VinotecaMeta[];
}

interface Filters {
  q: string;
  tipoUva: string[];
  variedad: string[];
  region: string[];
  pais: string[];
  bodega: string[];
  vinoteca: string[];
  anio: number | null;
}

const uniq = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));

export default function WineExplorer({ wines, vinotecas }: Props) {
  const vinotecaById = useMemo(
    () => Object.fromEntries(vinotecas.map((v) => [v.id, v])),
    [vinotecas],
  );

  // Límites de los rangos
  const anioBounds = useMemo(() => {
    const inicios = wines.map((w) => w.fechaInicio);
    const fines = wines.map((w) => w.fechaFin);
    return { min: Math.min(...inicios), max: Math.max(...fines) };
  }, [wines]);

  const defaults: Filters = {
    q: '',
    tipoUva: [],
    variedad: [],
    region: [],
    pais: [],
    bodega: [],
    vinoteca: [],
    anio: null,
  };

  const [filters, setFilters] = useState<Filters>(defaults);

  // Opciones disponibles derivadas de los datos
  const options = useMemo(
    () => ({
      tipoUva: uniq(wines.flatMap((w) => w.uvas)),
      region: uniq(wines.map((w) => w.region)),
      pais: uniq(wines.map((w) => w.pais)),
      bodega: uniq(wines.map((w) => w.bodega)),
      variedad: uniq(wines.map((w) => w.variedad)),
      vinoteca: vinotecas.map((v) => v.id),
    }),
    [wines, vinotecas],
  );

  // Inicializar desde la URL (una sola vez)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if ([...p.keys()].length === 0) return;
    const csv = (k: string) => (p.get(k) ? p.get(k)!.split(',').filter(Boolean) : []);
    setFilters((f) => ({
      ...f,
      q: p.get('q') ?? '',
      tipoUva: csv('uva'),
      variedad: csv('variedad'),
      region: csv('region'),
      pais: csv('pais'),
      bodega: csv('bodega'),
      vinoteca: csv('vinoteca'),
      anio: p.get('anio') ? Number(p.get('anio')) : null,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar filtros → URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set('q', filters.q);
    if (filters.tipoUva.length) p.set('uva', filters.tipoUva.join(','));
    if (filters.variedad.length) p.set('variedad', filters.variedad.join(','));
    if (filters.region.length) p.set('region', filters.region.join(','));
    if (filters.pais.length) p.set('pais', filters.pais.join(','));
    if (filters.bodega.length) p.set('bodega', filters.bodega.join(','));
    if (filters.vinoteca.length) p.set('vinoteca', filters.vinoteca.join(','));
    if (filters.anio != null) p.set('anio', String(filters.anio));
    const qs = p.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters]);

  const toggle = (key: keyof Filters, value: string) =>
    setFilters((f) => {
      const list = f[key] as string[];
      return {
        ...f,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });

  const reset = () => setFilters(defaults);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return wines.filter((w) => {
      if (q) {
        const hay = `${w.nombre} ${w.bodega} ${w.tipoUva} ${w.region} ${w.pais}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.tipoUva.length && !w.uvas.some((u) => filters.tipoUva.includes(u)))
        return false;
      if (filters.variedad.length && !filters.variedad.includes(w.variedad)) return false;
      if (filters.region.length && !filters.region.includes(w.region)) return false;
      if (filters.pais.length && !filters.pais.includes(w.pais)) return false;
      if (filters.bodega.length && !filters.bodega.includes(w.bodega)) return false;
      if (filters.vinoteca.length && !filters.vinoteca.includes(w.vinotecaId)) return false;
      if (filters.anio != null && !(w.fechaInicio <= filters.anio && filters.anio <= w.fechaFin))
        return false;
      return true;
    });
  }, [wines, filters, vinotecaById]);

  const activeCount =
    (filters.q ? 1 : 0) +
    filters.tipoUva.length +
    filters.variedad.length +
    filters.region.length +
    filters.pais.length +
    filters.bodega.length +
    filters.vinoteca.length +
    (filters.anio != null ? 1 : 0);

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div class="lg:grid lg:grid-cols-[19rem_1fr] lg:gap-8">
      {/* Botón filtros (móvil) */}
      <div class="mb-4 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          class="inline-flex items-center gap-2 rounded-full border border-wine-200 bg-white px-4 py-2 text-sm font-medium text-wine-800 shadow-sm"
        >
          Filtros
          {activeCount > 0 && (
            <span class="rounded-full bg-wine-700 px-2 text-xs text-cream-50">{activeCount}</span>
          )}
        </button>
        <p class="text-sm text-wine-900/60" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'vino' : 'vinos'}
        </p>
      </div>

      {/* Panel de filtros */}
      <aside
        class={`${panelOpen ? 'block' : 'hidden'} mb-8 lg:mb-0 lg:block`}
        aria-label="Filtros de búsqueda"
      >
        <div class="space-y-5 rounded-2xl border border-cream-300 bg-white/70 p-5 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold text-wine-800">Buscador</h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={reset}
                class="text-xs font-medium text-wine-600 underline underline-offset-2 hover:text-wine-800"
              >
                Limpiar ({activeCount})
              </button>
            )}
          </div>

          {/* Búsqueda por texto */}
          <div>
            <label for="q" class="mb-1 block text-sm font-medium text-wine-900/80">
              Buscar
            </label>
            <input
              id="q"
              type="search"
              value={filters.q}
              onInput={(e) => setFilters((f) => ({ ...f, q: (e.target as HTMLInputElement).value }))}
              placeholder="Nombre, bodega, uva…"
              class="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-wine-950 placeholder:text-wine-900/40 focus:border-wine-400 focus:ring-2 focus:ring-wine-500/30 focus:outline-none"
            />
          </div>

          <ChipGroup
            label="Variedad"
            options={options.variedad}
            selected={filters.variedad}
            onToggle={(v) => toggle('variedad', v)}
            renderLabel={(v) => VARIEDAD_META[v as Variedad]?.label ?? v}
          />

          <ChipGroup
            label="Tipo de uva"
            options={options.tipoUva}
            selected={filters.tipoUva}
            onToggle={(v) => toggle('tipoUva', v)}
            capitalize
          />

          <ChipGroup
            label="Región"
            options={options.region}
            selected={filters.region}
            onToggle={(v) => toggle('region', v)}
          />

          <ChipGroup
            label="País"
            options={options.pais}
            selected={filters.pais}
            onToggle={(v) => toggle('pais', v)}
          />

          <ChipGroup
            label="Bodega"
            options={options.bodega}
            selected={filters.bodega}
            onToggle={(v) => toggle('bodega', v)}
          />

          <ChipGroup
            label="Vinoteca"
            options={options.vinoteca}
            selected={filters.vinoteca}
            onToggle={(v) => toggle('vinoteca', v)}
            renderLabel={(v) => vinotecaById[v]?.nombre ?? v}
          />

          {/* Fecha de toma */}
          <div>
            <label for="anio" class="mb-1 block text-sm font-medium text-wine-900/80">
              Fecha de toma ideal
            </label>
            <select
              id="anio"
              value={filters.anio ?? ''}
              onChange={(e) => {
                const v = (e.target as HTMLSelectElement).value;
                setFilters((f) => ({ ...f, anio: v ? Number(v) : null }));
              }}
              class="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-wine-950 focus:border-wine-400 focus:ring-2 focus:ring-wine-500/30 focus:outline-none"
            >
              <option value="">Cualquier año</option>
              {Array.from(
                { length: anioBounds.max - anioBounds.min + 1 },
                (_, i) => anioBounds.min + i,
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Resultados */}
      <section>
        <p class="mb-4 hidden text-sm text-wine-900/60 lg:block" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'vino encontrado' : 'vinos encontrados'}
        </p>

        {filtered.length > 0 ? (
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((w) => (
              <WineCardView key={`${w.vinotecaId}-${w.posicion}`} wine={w} vinoteca={vinotecaById[w.vinotecaId]} />
            ))}
          </div>
        ) : (
          <div class="rounded-2xl border border-dashed border-cream-300 bg-white/50 py-16 text-center">
            <p class="text-lg text-wine-900/60">Ningún vino coincide con los filtros.</p>
            <button
              type="button"
              onClick={reset}
              class="mt-3 rounded-full bg-wine-700 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-wine-800"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ----------------------------------------------------------- Subcomponentes */

interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  renderLabel?: (v: string) => string;
  capitalize?: boolean;
}

function ChipGroup({ label, options, selected, onToggle, renderLabel, capitalize }: ChipGroupProps) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend class="mb-1.5 text-sm font-medium text-wine-900/80">{label}</legend>
      <div class="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(opt)}
              class={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                on
                  ? 'border-wine-700 bg-wine-700 text-cream-50'
                  : 'border-cream-300 bg-cream-50 text-wine-900/70 hover:border-wine-300 hover:text-wine-800'
              } ${capitalize ? 'capitalize' : ''}`}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function WineCardView({ wine, vinoteca }: { wine: WineItem; vinoteca?: VinotecaMeta }) {
  const meta = VARIEDAD_META[wine.variedad] ?? VARIEDAD_META.otro;
  return (
    <a
      href={`/vinos/${wine.id}`}
      aria-label={`Ver ficha de ${wine.nombre}`}
      class="reveal flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cabecera con foto o botella */}
      <div class="flex items-start gap-4 border-b border-cream-200 bg-gradient-to-br from-cream-50 to-cream-100 p-5">
        <div class="flex h-20 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/70 text-4xl shadow-inner">
          {wine.imagen ? (
            <img
              src={wine.imagen}
              alt={`Botella de ${wine.nombre}`}
              class="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <span aria-hidden="true">{meta.emoji}</span>
          )}
        </div>
        <div class="min-w-0 flex-1">
          <span
            class={`mb-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
          >
            <span class={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <h3 class="font-display text-lg font-semibold leading-tight text-wine-900">
            {wine.nombre}
          </h3>
          <p class="truncate text-sm text-wine-900/60">{wine.bodega}</p>
        </div>
      </div>

      {/* Cuerpo */}
      <div class="flex flex-1 flex-col gap-3 p-5">
        <dl class="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wide text-wine-900/45">Uva</dt>
            <dd class="capitalize text-wine-900/85">{wine.tipoUva}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-wine-900/45">Origen</dt>
            <dd class="text-wine-900/85">
              {wine.region}, {wine.pais}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-wine-900/45">Consumo</dt>
            <dd class="tabular-nums text-wine-900/85">
              {formatFechaToma({ inicio: wine.fechaInicio, fin: wine.fechaFin })}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-wine-900/45">Puntuación</dt>
            <dd class="font-semibold text-gold-600">
              {wine.puntuacion != null ? `★ ${wine.puntuacion}/10` : '—'}
            </dd>
          </div>
        </dl>

        <div class="mt-auto flex items-end justify-between gap-3 border-t border-cream-200 pt-3">
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-wide text-wine-900/45">Ubicación</p>
            <p class="truncate text-sm font-medium text-wine-800">
              {vinoteca?.nombre ?? wine.vinotecaId}
            </p>
            <p class="text-xs text-wine-900/55">
              Fila {wine.fila}, Columna {wine.columna} · Pos. {wine.posicion}
            </p>
          </div>
          <span class="whitespace-nowrap font-display text-xl font-semibold text-wine-700">
            {wine.precio != null ? formatPrecio(wine.precio) : '—'}
          </span>
        </div>

        {vinoteca && (
          <div class="mt-1">
            <MiniRack
              layout={vinoteca.layout}
              posicion={wine.posicion}
              columnas={vinoteca.columnas}
            />
          </div>
        )}
      </div>
    </a>
  );
}
