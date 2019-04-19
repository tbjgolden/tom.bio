const { exec } = require("child_process");
const { join } = require("path");
const ghpages = require('gh-pages');

exec(`node ${join(__dirname, 'build.js')}`, (err, stdout, stderr) => {
  if (err) {
    console.error({ stdout });
    console.error({ stderr });
    console.error(err);
    process.exit(1);
  }

  ghpages.publish('build');
});
