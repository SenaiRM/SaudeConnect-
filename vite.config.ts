import { defineConfig } from 'vite'
import path from 'path'
import os from 'node:os'
import { readFile, writeFile } from 'node:fs/promises'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Guarda o estado da demonstração fora do navegador (pasta temporária do sistema), para
// paciente e secretaria verem os mesmos dados em qualquer navegador ou porta deste computador.
function sharedDemoState() {
  const file = path.join(os.tmpdir(), 'saudeconnect-demo-state.json')
  return {
    name: 'shared-demo-state',
    configureServer(server) {
      server.middlewares.use('/api/demo-state', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        if (req.method === 'GET') {
          try { res.end(await readFile(file, 'utf8')) } catch { res.end('null') }
          return
        }
        if (req.method !== 'PUT') { res.statusCode = 405; res.end('{}'); return }
        try {
          let body = ''
          for await (const chunk of req) {
            body += chunk
            if (body.length > 2_000_000) throw new Error('Estado muito grande')
          }
          const state = JSON.parse(body)
          if (!Array.isArray(state?.agendamentos) || !Array.isArray(state?.notificacoes) || !Array.isArray(state?.historicoAgendamentos)) throw new Error('Formato inválido')
          await writeFile(file, body, 'utf8')
          res.end('{"ok":true}')
        } catch { res.statusCode = 400; res.end('{}') }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    sharedDemoState(),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
