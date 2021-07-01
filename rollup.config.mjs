import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import ts from 'rollup-plugin-ts'

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'lib/arcSeed.mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [json({ preferConst: true }), ts()],
})

export default rollupConfig
