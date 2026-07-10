import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type VinotecaId = 'gran-canaria' | 'santander';

export interface Inventory {
  'santander': Record<number, string | null>;
  'gran-canaria': Record<number, string | null>;
}

export const inventory: Inventory = {
  'santander': {
    1: 'alma-carraovejas-ossian',
    2: null,
    3: 'viñedos-balmoral-edone-rose-gran-cuvee',
    4: null,
    5: 'alma-carraovejas-mein-castes-brancas',
    6: 'stratvs-diego-a-secas',
    7: null,
    8: null,
    9: null,
    10: 'la-geria-manto-malvasia-volcanica',
    11: null,
    12: 'raul-perez-el-rapolao',
    13: null,
    14: null,
    15: null,
    16: 'el-lagar-de-isilla-reserva',
    17: null,
    18: 'pradorey-finca-la-mina',
    19: null,
    20: 'pago-de-carraovejas-crianza',
    21: 'marques-de-riscal-baron-de-chirel',
    22: null,
    23: 'marques-de-riscal-baron-de-chirel',
    24: null,
    25: 'marques-de-murrieta-reserva',
    26: 'pradorey-adaro',
    27: null,
    28: 'arbui-v47',
  },
  'gran-canaria': {
    1: null,
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
  },
};

// Helper para obtener vinos en inventario
export async function getWinesInInventory() {
  const allWines = await getCollection('wines');
  const wineMap = new Map(allWines.map(w => [w.id, w]));

  const winesInInventory: Array<{
    wine: CollectionEntry<'wines'>;
    vinoteca: VinotecaId;
    posicion: number;
  }> = [];

  for (const vinotecaId of Object.keys(inventory) as VinotecaId[]) {
    for (const [posicion, wineSlug] of Object.entries(inventory[vinotecaId])) {
      if (typeof wineSlug !== 'string') continue;
      const wine = wineMap.get(wineSlug);
      if (wine) {
        winesInInventory.push({
          wine,
          vinoteca: vinotecaId,
          posicion: Number(posicion),
        });
      }
    }
  }

  return winesInInventory;
}
