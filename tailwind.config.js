/** Preflight desligado: o CSS migrado do MVP (src/styles.css) continua sendo a base visual.
 *  Utilitários Tailwind já podem ser usados em componentes novos. */
export default { content: ["./index.html", "./src/**/*.{ts,tsx}"], corePlugins: { preflight: false }, theme: { extend: {} }, plugins: [] };
