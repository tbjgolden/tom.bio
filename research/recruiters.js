const fs = require("fs/promises");
const path = require("path");
const neatCsv = require("neat-csv");

const COLORS = ["#000", "#111", "#222", "#333", "#444", "#555", "#666", "#777"];

const main = async () => {
  const text = await fs.readFile(
    path.join(__dirname, "recruiters.csv"),
    "utf8"
  );

  const x = {};
  const data = await neatCsv(text);
  for (const { 'Company': y } of data) {
    x[y] = (x[y] || 0) + 1;
  }

  const parts = Object.entries(x).sort((a, b) => b[1] - a[1]);

  console.log(parts.map(([id, value], i) => ({ id, value, color: COLORS[parts.length - 1 - i] })));
};

try {
  main();
} catch (err) {
  console.log(err);
}
