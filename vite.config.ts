import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs';


// https://vite.dev/config/
export default defineConfig({
  plugins: [commonjs(),react()],
  server: {
    port: 8000,
    open: true,
    host: true,
  },
  resolve:{
    alias:{
      '@': '/src'
    }
  }
})
