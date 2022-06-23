module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "eslint"],
  "**/*.ts?(x)": () => {
    return "npm run build-types";
  },
  "*.json": ["prettier --write"],
};
