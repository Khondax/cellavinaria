interface Props {
  layout: number[][];
  posicion: number;
  columnas: number;
}

/** Diagrama compacto del rack con la posición de la botella resaltada. */
export default function MiniRack({ layout, posicion, columnas }: Props) {
  return (
    <div
      class="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {layout.flat().map((pos) => (
        <span
          key={pos}
          class={`aspect-square rounded-[2px] ${
            pos === posicion ? 'bg-wine-600 ring-1 ring-wine-700' : 'bg-cream-300'
          }`}
        />
      ))}
    </div>
  );
}
