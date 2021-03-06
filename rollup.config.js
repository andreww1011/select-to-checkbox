import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'dist/select-to-checkbox.js',
  output: {
    file: 'dist/select-to-checkbox-bundle.js',
    format: 'iife',
    name: "RowMergeBundle",
    globals: {
      jquery: '$'
    },
    sourcemap: true
  },
  external: [
    'jquery'
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    sourcemaps()
  ]
};
