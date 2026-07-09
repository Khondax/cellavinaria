# Reglas de Desarrollo para Astro

Este documento define las directrices de desarrollo del proyecto, alineadas con las skills instaladas y con la estructura real del repositorio.

# Comportamiento

Behavioral guidelines to reduce common LLM coding mistakes.

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Skills Instaladas en el Proyecto

Skills detectadas en `skills-lock.json`:

- `accessibility` (addyosmani/web-quality-skills)
- `astro` (astrolicious/agent-skills)
- `deploy-to-vercel` (vercel-labs/agent-skills)
- `frontend-design` (anthropics/skills)
- `karpathy-guidelines` (multica-ai/andrej-karpathy-skills)
- `nodejs-backend-patterns` (wshobson/agents)
- `nodejs-best-practices` (sickn33/antigravity-awesome-skills)
- `seo` (addyosmani/web-quality-skills)
- `tailwind-css-patterns` (giuseppe-trisciuoglio/developer-kit)
- `typescript-advanced-types` (wshobson/agents)
- `vitest` (antfu/skills)

### Cuándo usar cada skill

- UI y diseño visual: prioriza `frontend-design`; si usas utilidades CSS, combina con `tailwind-css-patterns`.
- Desarrollo Astro: usa `astro` para rutas dinámicas, islands, markdown/MDX y assets.
- API y lógica de servidor: usa `nodejs-backend-patterns` y `nodejs-best-practices` en endpoints de `src/pages/api`.
- Calidad de ejecución del agente: usa `karpathy-guidelines` para evitar sobreingeniería, hacer cambios quirúrgicos y definir criterios de verificación.
- Tipado: usa `typescript-advanced-types` para contratos, utilidades y tipos genéricos complejos.
- Calidad web: usa `accessibility` y `seo` como parte de la revisión previa a release.
- Pruebas: usa `vitest` para tests unitarios y validación de contenido.
- Deploy: usa `deploy-to-vercel` para despliegues preview y producción.

---

## Buenas Prácticas de Programación

### Política de Documentación por Cambios Relevantes

- Todo cambio relevante en el código debe incluir actualización de documentación en el mismo PR/commit.
- La documentación debe seguir los esquemas ya definidos en este documento: estructura por carpeta en `src/`, buenas prácticas por dominio (Astro, TypeScript, API, SEO/accesibilidad, testing) y checklist pre-commit.
- Si se crea o modifica una ruta, componente, layout, colección o endpoint, debe actualizarse la sección correspondiente en `agents.md` o `CLAUDE.md`.
- Si cambia el modelo de datos, contratos o validaciones, deben actualizarse tipos (`src/types/`) y documentación de reglas afectadas.
- Si se incorpora una nueva convención, añadirla en la sección de buenas prácticas aplicable y en checklist si impacta calidad o release.

### Astro

- Mantener separación clara entre frontmatter y template.
- Preferir componentes presentacionales reutilizables.
- Hidratar solo lo necesario (islands) para mejorar rendimiento.

### TypeScript

- Mantener `strict: true`.
- Tipar props, respuestas de APIs y utilidades.
- Evitar tipos implícitos en funciones públicas.

### Contenido y Datos

- Definir schemas con Zod para cada colección.
- Estandarizar frontmatter y validar fechas/campos opcionales.
- Evitar duplicidad de datos entre markdown y código.

### API y Backend

- Validar request params y payloads.
- Manejar errores con estructura de respuesta consistente.
- Añadir timeouts y control de fallos en llamadas externas.

### SEO y Accesibilidad

- Incluir metadatos base y Open Graph en todas las páginas indexables.
- Mantener jerarquía correcta de headings (h1-h2-h3).
- Asegurar `alt` descriptivo en imágenes.
- Verificar navegación por teclado y contraste.

### Testing

- Escribir tests unitarios para utilidades y validaciones.
- Testear colecciones (`src/content`) para detectar frontmatter inválido.
- Ejecutar pruebas antes de cada merge.

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev
npm run build
npm run preview

# Testing
npm run test
npm run test:run
npm run test:coverage

# Calidad
npm run lint
npm run format
```

---

## Checklist Pre-Commit

- [ ] Tests pasando
- [ ] Sin errores TypeScript
- [ ] Sin warnings críticos de lint
- [ ] Formato aplicado
- [ ] Metadatos SEO revisados
- [ ] Accesibilidad básica verificada
- [ ] Validación de contenido (colecciones) completada

---

## Recursos

- Astro Docs: https://docs.astro.build
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/