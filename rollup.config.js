import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [

  // Back-end
  {
    input: './src/back/index.ts',
    output: {
      format: 'commonjs',
      file: 'dist/index.js'
    },
    plugins: [
      typescript(),
      commonjs(),
      resolve()
    ],
    external: [
      'express',
      'path'
    ]
  },

  // Front-end
  {
    input: './src/front/index.ts',
    output: {
      format: 'iife',
      file: 'public/index.js',
      name: 'API'
    },
    plugins: [
      typescript(),
      commonjs(),
      resolve(),
      babel(),
      terser()
    ]
  }

]