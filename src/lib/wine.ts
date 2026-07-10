import type { WineData } from '../types/wine';

export type Variedad = WineData['variedad'];

interface VariedadMeta {
  label: string;
  /** Clases Tailwind para el badge (fondo + texto + borde) */
  badge: string;
  /** Color de acento (punto/indicador) como clase de fondo */
  dot: string;
  /** Color del vidrio de la botella (clase text-* para SVG con fill currentColor) */
  glass: string;
  emoji: string;
}

/** Metadata visual por variedad, compartida entre tarjetas, racks y filtros. */
export const VARIEDAD_META: Record<Variedad, VariedadMeta> = {
  tinto: {
    label: 'Tinto',
    badge: 'bg-wine-100 text-wine-800 border-wine-200',
    dot: 'bg-wine-600',
    glass: 'text-wine-700',
    emoji: '🍷',
  },
  blanco: {
    label: 'Blanco',
    badge: 'bg-gold-300/25 text-gold-600 border-gold-300/50',
    dot: 'bg-gold-400',
    glass: 'text-gold-500',
    emoji: '🥂',
  },
  rosado: {
    label: 'Rosado',
    badge: 'bg-wine-50 text-wine-500 border-wine-200',
    dot: 'bg-wine-300',
    glass: 'text-wine-400',
    emoji: '🌸',
  },
  espumoso: {
    label: 'Espumoso',
    badge: 'bg-cream-200 text-gold-600 border-cream-400',
    dot: 'bg-gold-300',
    glass: 'text-gold-600',
    emoji: '🍾',
  },
  otro: {
    label: 'Otro',
    badge: 'bg-cream-200 text-wine-800 border-cream-400',
    dot: 'bg-cream-400',
    glass: 'text-wine-500',
    emoji: '🍇',
  },
};

export function variedadMeta(v: Variedad): VariedadMeta {
  return VARIEDAD_META[v] ?? VARIEDAD_META.otro;
}

/**
 * Separa el campo tipoUva en variedades individuales.
 * Divide por comas e ignora cualquier texto entre paréntesis (p. ej. porcentajes
 * o sinónimos): "Tempranillo (Tinta del País), Merlot" → ["Tempranillo", "Merlot"].
 */
export function parseUvas(tipoUva: string): string[] {
  return tipoUva
    .replace(/\([^)]*\)/g, '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
}

/** Formatea un precio en euros. */
export function formatPrecio(precio: number): string {
  return precio.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}

/** Formatea el rango de fecha de toma. */
export function formatFechaToma(fecha: { inicio: number; fin: number }): string {
  return fecha.inicio === fecha.fin
    ? `${fecha.inicio}`
    : `${fecha.inicio}–${fecha.fin}`;
}
