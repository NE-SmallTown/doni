import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import path from 'path';
import pkg from './package.json';

const commonOutputOptions = {

};

function getOutputOptions(options) {
  return {
    ...commonOutputOptions,
    ...options,
  };
}

function getCJSOutputOptions(options) {
  return {
    ...getOutputOptions({
      dir: 'lib/cjs',
      ...options,
    }),
    format: 'cjs',
    exports: 'named',
  };
}

function getESMOutputOptions(options) {
  return {
    ...getOutputOptions({
      dir: 'lib/esm',
      ...options,
    }),
    format: 'esm',
  };
}

export default [
  {
    input: 'src/index.tsx',
    output: [
      // ESM
      getESMOutputOptions({}),
      // CommonJS
      getCJSOutputOptions({})
    ],
    plugins: [
      peerDepsExternal(),

      nodeResolve(),

      commonjs(),

      typescript({
        tsconfig: path.resolve('./tsconfig.json')
      }),

      postcss({
        extract: 'style.css',
      }),

      copy({
        targets: [
          { src: 'README.md', dest: 'lib' },
          { src: 'package.json', dest: 'lib' },
          { src: 'LICENSE', dest: 'lib' },
        ]
      })
    ],
    external: Object.keys(pkg.devDependencies),
  },

  {
    input: 'src/Form/index.tsx',
    output: [
      // ESM
      getESMOutputOptions({
        dir: 'lib/esm/form',
      }),
      // CommonJS
      getCJSOutputOptions({
        dir: 'lib/cjs/form',
      })
    ],
    plugins: [
      peerDepsExternal(),

      nodeResolve(),

      commonjs(),

      typescript({
        tsconfig: path.resolve('./tsconfig.json')
      }),

      postcss({
        extract: 'style.css',
      }),

      copy({
        targets: [
          { src: 'README.md', dest: 'lib' },
          { src: 'package.json', dest: 'lib' },
          { src: 'LICENSE', dest: 'lib' },
        ]
      })
    ],
    external: Object.keys(pkg.devDependencies),
  }
];
