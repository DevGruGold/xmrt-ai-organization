import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  outDir: 'dist',
  external: ['@elizaos/core', '@elizaos/plugin-bootstrap', '@elizaos/plugin-node', '@elizaos/plugin-web3']
});

