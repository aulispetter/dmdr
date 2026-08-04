const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const terser = require('terser');

const distDir = path.resolve(__dirname, 'dist');
const variant = process.argv[2] || 'dynamic';

const variants = {
  dynamic: {
    jsEntry: 'script.js',
    jsOutput: 'j.js',
    cssEntry: 'styles.css',
    cssOutput: 's.css',
    htmlEntry: 'index.html',
    assets: () => [
      ...glob.sync('*.png'),
      ...glob.sync('*.ico')
    ]
  },
  static: {
    jsEntry: 'ambient.js',
    jsOutput: 'ambient.js',
    cssEntry: 'static.css',
    cssOutput: 'static.css',
    htmlEntry: 'index-static.html',
    assets: () => [
      'initial.png',
      'favicon.ico',
      'apple-touch-icon.png'
    ]
  }
};

const selected = variants[variant];

if (!selected) {
  console.error(`Unknown build variant: ${variant}`);
  console.error(`Available variants: ${Object.keys(variants).join(', ')}`);
  process.exit(1);
}

function copyToDist(file, outputName = path.basename(file)) {
  const target = path.join(distDir, outputName);
  fs.copyFileSync(file, target);
  console.log(`Copied ${file} → ${target}`);
}

async function build() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const jsTempFile = path.join(distDir, 'script.tmp.js');

  await Promise.all([
    esbuild.build({
      entryPoints: [selected.jsEntry],
      bundle: false,
      minify: false,
      outfile: jsTempFile
    }),
    esbuild.build({
      entryPoints: [selected.cssEntry],
      bundle: false,
      minify: true,
      loader: { '.css': 'css' },
      outfile: path.join(distDir, selected.cssOutput)
    })
  ]);

  const jsCode = fs.readFileSync(jsTempFile, 'utf8');
  const minified = await terser.minify(jsCode, {
    compress: {
      passes: 3
    },
    mangle: {
      toplevel: true,
      reserved: variant === 'dynamic' ? ['onYouTubeIframeAPIReady'] : []
    },
    format: {
      comments: false
    }
  });

  if (!minified.code) {
    throw new Error(`Terser did not produce JavaScript for the ${variant} build.`);
  }

  fs.writeFileSync(path.join(distDir, selected.jsOutput), minified.code);
  fs.unlinkSync(jsTempFile);

  copyToDist(selected.htmlEntry, 'index.html');
  selected.assets().forEach(file => copyToDist(file));

  console.log(`Built ${variant} version in ${distDir}`);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
