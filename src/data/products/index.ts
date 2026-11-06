import type { Product } from "../../types";
import { accessories } from "./accessories";
import { blades } from "./blades";
import { rackets } from "./rackets";
import { rubbers } from "./rubbers";
export { brands } from "./brands";
/** Catálogo completo (mock). Só o productRepository deve importar este módulo. */
export const products: Product[] = [...rackets, ...blades, ...rubbers, ...accessories];
