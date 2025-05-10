// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
    apiBase: '/production/api',
  },
  server: {
    preset: 'bun',
  },
  routers: {
    server: {
      base: '/production/_server',
    },
    client: {
      base: '/production/_build',
    },
    public: {
      base: '/production',
    },
  },
})
