import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },

  pluginJs.configs.recommended,

  pluginReact.configs.flat.recommended,

  {
    plugins: {
      prettier: pluginPrettier,
      import: pluginImport,
    },
    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-duplicates": "warn",
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
    },
  },

  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "warn",
      "react/jsx-uses-vars": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-undef": "error",
    },
  },
];
