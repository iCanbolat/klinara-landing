/**
 * Z-index ölçeği. Yalnız sistem katmanları için; bölüm içi istiflemede
 * `isolate` + DOM sırası yeterli.
 */
export const LAYER = {
  header: "z-40",
  menu: "z-50",
} as const;
