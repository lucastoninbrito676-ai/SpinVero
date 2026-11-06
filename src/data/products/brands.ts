import type { Brand } from "../../types";
/** Marcas (entidade própria). IDs em minúsculas, estáveis; é o que Product.brandId referencia. */
export const brands: Brand[] = ["Butterfly", "Donic", "Tibhar", "Yasaka", "Stiga", "Xiom", "Andro", "Nittaku", "DHS", "Palio"]
  .map((name) => ({ id: name.toLowerCase(), name, description: `Fabricante ${name}. Descrição de demonstração.` }));
