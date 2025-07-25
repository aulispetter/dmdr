// build.js
const esbuild = require('esbuild');
const fs      = require('fs');
const path    = require('path');
const glob    = require('glob');


const distDir = path.resolve(__dirname, 'dist');

// 1) Kick off both builds in parallel
const jsBuild = esbuild.build({
  entryPoints: ['script.js'],
  bundle:      false,
  minify:      true,
  outfile:     path.join(distDir, 'j.js'),
});

const cssBuild = esbuild.build({
  entryPoints: ['styles.css'],
  bundle:      false,
  minify:      true,
  loader:      { '.css': 'css' },
  outfile:     path.join(distDir, 's.css'),
});

// 2) After both complete, copy static assets
Promise.all([jsBuild, cssBuild])
  .then(() => {
    // ensure dist/ exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // helper to copy one file
    function copyToDist(file) {
      const target = path.join(distDir, path.basename(file));
      fs.copyFileSync(file, target);
      console.log(`Copied ${file} → ${target}`);
    }

    // copy index.html
    copyToDist('index.html');

    // copy all .png and .ico in the project root
    glob.sync('*.png').forEach(copyToDist);
    glob.sync('*.ico').forEach(copyToDist);
  })
  .catch(() => process.exit(1));

