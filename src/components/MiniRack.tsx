interface Props {
  layout: number[][];
  posicion: number;
  columnas: number;
}

/** Diagrama compacto del rack con la posición de la botella resaltada. */
export default function MiniRack({ layout, posicion, columnas }: Props) {
  return (
    <div class="flex flex-col gap-[3px]" aria-hidden="true">
      {layout.map((row, r) => (
        <div key={r} class="flex justify-center gap-[3px]">
          {row.map((pos) => (
            <span
              key={pos}
              class={`aspect-square rounded-[2px] ${
                pos === posicion ? 'bg-wine-600 ring-1 ring-wine-700' : 'bg-cream-300'
              }`}
              style={{ flex: `0 0 calc((100% - ${columnas - 1} * 3px) / ${columnas})` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
