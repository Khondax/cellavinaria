import type { CollectionEntry } from 'astro:content';
import type { VinotecaId } from '../data/inventory';

export type Wine = CollectionEntry<'wines'>;
export type WineData = Wine['data'];

// Vino con información de ubicación (derivado de inventory)
export interface WineWithLocation {
  wine: Wine;
  vinoteca: VinotecaId;
  posicion: number;
}

// Estado de filtros (solo para vinos en inventario)
export interface FilterState {
  tipoUva?: string[];
  variedad?: WineData['variedad'][];
  region?: string[];
  pais?: string[];
  precioMin?: number;
  precioMax?: number;
  puntuacionMin?: number;
  puntuacionMax?: number;
  vinoteca?: VinotecaId[];
}

// Estado de una posición en el rack
export interface RackPositionState {
  posicion: number;
  wine: Wine | null;
  fila: number;
  columna: number;
}
