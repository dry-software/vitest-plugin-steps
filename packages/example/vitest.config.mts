import { defineConfig } from 'vitest/config'
import steps from 'vitest-plugin-steps'

export default defineConfig({
  plugins: [steps()],
})
