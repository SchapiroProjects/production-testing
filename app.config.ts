// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    preset: 'bun',
  },
  routers: {
    server: {
      base: '/production',
    },
    client: {
      base: '/production',
    },
    public: {
      base: '/production',
    },
  },
})
