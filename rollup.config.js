import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import minify from 'rollup-plugin-babel-minify'
import pkg from './package.json'

const CONSOLE_CODE = `console.log(\`%c🍊%c Shikwasa Podcast Player v${pkg.version} %c https://jessuni.github.io/shikwasa/\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

const sharedPlugins = [
  postcss({
    extract: true,
    plugins: [autoprefixer()],
  }),
  replace({
    include: './src/main.js',
    delimiters: ['/** ', ' */'],
    'CONSOLE_MSG': CONSOLE_CODE,
  }),
  babel(),
  cleanup({
    comments: 'none',
  }),
]

function bundle(target, format) {
  let text = format
  const plugins = [...sharedPlugins]
  if (format === 'umd') {
    text = 'min'
    plugins.push(minify({
      comments: false,
      banner: false,
      sourceMap: false,
    }))
  }
  return {
    input: `src/${target}.js`,
    output: {
      name: 'shikwasa',
      file: `dist/shikwasa.${target === 'main' ? '' : target + '.' }${text}.js`,
      format,
      compact: true,
      sourcemap: format === 'umd',
    },
    plugins,
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

console.log(bundle('src/chapter.js', 'chapter', 'cjs'))

module.exports = [
  bundle(process.env.TARGET, 'cjs'),
  bundle(process.env.TARGET, 'umd'),
]
