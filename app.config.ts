// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    preset: 'bun',
    baseURL: '/production',
  },
  routers: {
    client: {
      base: '/production',
    },
    server: {
      base: '/production',
    },
    public: {
      base: '/production',
    },
  },
})
