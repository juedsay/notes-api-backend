import globals from "globals";
import pluginJs from "@eslint/js";
import standard from "@eslint/standard-config"; // Importa la configuración de Standard

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } }, // Agrega el entorno Jest
  pluginJs.configs.recommended,
  standard, // Aplica la configuración de Standard
];