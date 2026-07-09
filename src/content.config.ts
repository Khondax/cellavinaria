import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const wines = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/wines' }),
  schema: z.object({
    nombre: z.string(),
    tipoUva: z.string(),
    variedad: z.enum(['tinto', 'blanco', 'rosado', 'espumoso', 'otro']),
    bodega: z.string(),
    region: z.string(),
    pais: z.string(),
    precio: z.number().positive(),
    puntuacion: z.number().min(1).max(10).optional(),
    fechaToma: z.object({
      inicio: z.number().int().min(2020),
      fin: z.number().int().min(2020),
    }).refine(data => data.fin >= data.inicio, {
      message: "Año fin debe ser mayor o igual al año inicio"
    }),
  }),
});

export const collections = { wines };
