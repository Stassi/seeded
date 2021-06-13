import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-ts'

const rollupConfig = defineConfig({
  input: 'src/arcSeed.ts',
  output: {
    file: 'lib/arcSeed.mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [ts()],
})

export default rollupConfig
