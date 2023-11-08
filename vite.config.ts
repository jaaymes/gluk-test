import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';


export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react(), ViteImageOptimizer()],
    define: {
      'process.env': env,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    }
  })
}
