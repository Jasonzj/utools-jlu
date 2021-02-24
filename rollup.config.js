import cleaner from 'rollup-plugin-cleaner'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import pluginConfig from './plugin.config.js'
import { version } from './package.json'

/**
 * 当前环境
 * @type {'development'|'production'}
 */
const NODE_ENV = (process.env.NODE_ENV || 'development').trim()

/** plugin.json */
pluginConfig.version = version
const pluginJsonStr = JSON.stringify(pluginConfig)

/** 生成preload.js */
/** @type {import ('rollup').RollupOptions} */
const rollupOptions = {
  input: './src/index.ts',
  output: {
    file: './dist/preload.js',
    format: 'cjs',
    sourcemap: NODE_ENV === 'production' ? false : 'inline',
  },
  plugins: [
    cleaner({
      targets: ['dist'],
    }),
    json(),
    typescript(),
    resolve(),
    commonjs(),
    copy({
      flatten: false,
      copyOnce: false,
      targets: [
        {
          src: 'plugin.config.js',
          dest: 'dist',
          transform: (contents) => pluginJsonStr,
          rename: (name, extension) => 'plugin.json',
        },
        { src: 'README.md', dest: 'dist' },
        { src: 'src/assets/**/*', dest: 'dist' },
      ],
      verbose: true,
    }),
  ],
}
export default rollupOptions
