import { inventory } from './inventory';
import type { VinotecaId } from './inventory';

export interface Vinoteca {
  id: VinotecaId;
  nombre: string;
  capacidad: number;
  filas: number;
  columnas: number;
  layout: number[][];
}

export const vinotecas: Record<VinotecaId, Vinoteca> = {
  'santander': {
    id: 'santander',
    nombre: 'Vinoteca Santander',
    capacidad: 28,
    filas: 6,
    columnas: 5,
    layout: [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
      [26, 27, 28],
    ],
  },
  'gran-canaria': {
    id: 'gran-canaria',
    nombre: 'Vinoteca Gran Canaria',
    capacidad: 18,
    filas: 3,
    columnas: 6,
    layout: [
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18],
    ],
  },
};

// Helper: Calcular fila y columna desde posición numérica
export function getRowCol(posicion: number, vinoteca: Vinoteca): { fila: number; columna: number } {
  for (let fila = 0; fila < vinoteca.layout.length; fila++) {
    const columna = vinoteca.layout[fila].indexOf(posicion);
    if (columna !== -1) {
      return { fila: fila + 1, columna: columna + 1 };
    }
  }
  return { fila: 0, columna: 0 };
}

// Helper: Obtener wine slug en una posición específica
export function getWineAtPosition(vinotecaId: VinotecaId, posicion: number): string | null {
  return inventory[vinotecaId]?.[posicion] ?? null;
}
