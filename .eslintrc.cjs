// Use gitignore as eslintignore (single source of truth)
const ignorePatterns = require("fs")
  .readFileSync(`${__dirname}/.gitignore`, "utf8")
  .split("\n")
  .map((line) => {
    return line.split("#")[0].trim();
  })
  .filter((withoutComment) => {
    return withoutComment.length > 0;
  });

const getConfig = (isTypeScript = false) => {
  return {
    extends: [
      "eslint:recommended",
      ...(isTypeScript ? ["plugin:@typescript-eslint/recommended"] : []),
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:unicorn/recommended",
      "prettier",
    ],
    plugins: ["react", "unicorn", "prettier"],
    rules: {
      "arrow-body-style": ["warn", "always"],
      "no-array-constructor": "off",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": ["warn", { forbid: [">", "}"] }],
      ...(isTypeScript
        ? {
            "@typescript-eslint/no-restricted-imports": [
              "error",
              {
                paths: [
                  {
                    name: "baseui/link",
                    message:
                      "Use \"import { Link } from '_/components/Link'\" instead.",
                  },
                  {
                    name: "react-router-dom",
                    importNames: ["Link"],
                    message:
                      "Use \"import { Link } from '_/components/Link'\" instead.",
                  },
                  {
                    name: "baseui/modal",
                    message:
                      "Use \"import { Modal } from '_/components/Modal'\" instead.",
                  },
                  {
                    name: "baseui/drawer",
                    message:
                      "Use \"import { Drawer } from '_/components/Drawer'\" instead.",
                  },
                ],
              },
            ],
            "@typescript-eslint/no-unused-vars": [
              "error",
              {
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: false,
                varsIgnorePattern: "^_",
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^(_|error$)",
              },
            ],
            "@typescript-eslint/no-array-constructor": ["error"],
          }
        : {}),
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: ["-env\\.d\\.ts$"],
        },
      ],
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          extendDefaultReplacements: false,
          replacements: {
            def: {
              defer: true,
              deferred: true,
              define: true,
              definition: true,
            },
            dir: { direction: true, directory: true },
            docs: { documentation: true, documents: true },
            dst: {
              daylightSavingTime: true,
              destination: true,
              distribution: true,
            },
            e: { error: true, event: true },
            rel: { related: true, relationship: true, relative: true },
            res: { response: true, result: true },
          },
        },
      ],
      "unicorn/prefer-switch": ["error", { minimumCases: 5 }],
      "unicorn/no-new-array": "off",
    },
  };
};

module.exports = {
  ignorePatterns,
  overrides: [
    // Configuration for cjs files
    {
      files: ["**/*.cjs", "**/*.js"],
      env: {
        node: true,
        commonjs: true,
        es2020: true,
      },
      ...getConfig(false),
    },
    // Configuration for mjs files
    {
      files: ["**/*.mjs"],
      env: {
        node: true,
        es2020: true,
      },
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
      },
      ...getConfig(false),
    },
    // Configuration for TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: {
        node: true,
        browser: true,
        es2020: true,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
      ...getConfig(true),
    },
    // Configuration for Astro
    {
      files: ["**/*.astro"],
      env: {
        node: true,
        browser: true,
        es2020: true,
      },
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.json",
        extraFileExtensions: [".astro"],
      },
      globals: {
        Astro: "readonly",
      },

      // ...
    },
  ],
};
