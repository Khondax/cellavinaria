import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type VinotecaId = 'gran-canaria' | 'santander';

export interface Inventory {
  'gran-canaria': Record<number, string | null>;
  'santander': Record<number, string | null>;
}

export const inventory: Inventory = {
  'gran-canaria': {
    1: null,
    2: 'ribera-emilio-moro-2020',
    3: 'rioja-marques-riscal-reserva',
    4: null,
    5: 'ribera-emilio-moro-2020',
    6: null,
    7: 'chablis-william-fevre-2021',
    8: null,
    9: null,
    10: 'rioja-marques-riscal-reserva',
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
  },
  'santander': {
    1: 'barolo-fontanafredda-2019',
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
    19: null,
    20: null,
    21: null,
    22: null,
    23: null,
    24: null,
    25: null,
    26: null,
    27: null,
    28: null,
    29: null,
    30: null,
  },
};

// Helper para obtener vinos en inventario
export async function getWinesInInventory() {
  const allWines = await getCollection('wines');
  const wineMap = new Map(allWines.map(w => [w.slug, w]));

  const winesInInventory: Array<{
    wine: CollectionEntry<'wines'>;
    vinoteca: VinotecaId;
    posicion: number;
  }> = [];

  for (const [vinotecaId, positions] of Object.entries(inventory)) {
    for (const [posicion, wineSlug] of Object.entries(positions)) {
      if (wineSlug) {
        const wine = wineMap.get(wineSlug);
        if (wine) {
          winesInInventory.push({
            wine,
            vinoteca: vinotecaId as VinotecaId,
            posicion: Number(posicion),
          });
        }
      }
    }
  }

  return winesInInventory;
}
