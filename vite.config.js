import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: ['formik', 'yup'], // أضف أي مكتبة تسبب مشاكل
  },
})
