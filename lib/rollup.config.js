import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json' assert { type: 'json' };

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: pkg.typings,
      format: 'es',
    },
  }),
]