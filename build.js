const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const terser = require('terser');

const distDir = path.resolve(__dirname, 'dist');

// 1) JS build (no minify here)
const jsTempFile = path.join(distDir, 'j.tmp.js');
const jsBuild = esbuild.build({
  entryPoints: ['script.js'],
  bundle: false,
  minify: false,
  outfile: jsTempFile,
});

// 2) CSS build (can still minify with esbuild)
const cssBuild = esbuild.build({
  entryPoints: ['styles.css'],
  bundle: false,
  minify: true,
  loader: { '.css': 'css' },
  outfile: path.join(distDir, 's.css'),
});

// 3) After builds complete, minify JS with Terser and copy static assets
Promise.all([jsBuild, cssBuild])
  .then(async () => {
    // Minify JS with Terser (including var and method names)
    const jsCode = fs.readFileSync(jsTempFile, 'utf8');
    const minified = await terser.minify(jsCode, {
      mangle: {
        // toplevel: true, // <- minify top-level vars and functions
      },
      compress: true
    });

    fs.writeFileSync(path.join(distDir, 'j.js'), minified.code);
    fs.unlinkSync(jsTempFile);

    // Ensure dist/ exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Helper to copy one file
    function copyToDist(file) {
      const target = path.join(distDir, path.basename(file));
      fs.copyFileSync(file, target);
      console.log(`Copied ${file} → ${target}`);
    }

    // Copy index.html and assets
    copyToDist('index.html');
    glob.sync('*.png').forEach(copyToDist);
    glob.sync('*.ico').forEach(copyToDist);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
