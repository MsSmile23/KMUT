import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            react(), 
            splitVendorChunkPlugin(), 
            visualizer()
        ],
        server: {
            port: Number(env.VITE_PORT),
            host: env.VITE_HOST ? String(env.VITE_HOST) : 'localhost',
            /*
            proxy: {
                [env.VITE_API_PREFIX]: {
                    target: 'http://10.100.20.9',
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                },
            }

             */
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@app': path.resolve(__dirname, './src/app'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@containers': path.resolve(__dirname, './src/containers'),
                '@features': path.resolve(__dirname, './src/features'),
                '@entities': path.resolve(__dirname, './src/entities'),
                '@shared': path.resolve(__dirname, './src/shared'),
            }
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id: string) {
                        if (id.includes('dnd-kit')) {
                            return '@dnd-kit';
                        }

                        if (id.includes('lodash')) {
                            return '@lodash';
                        }

                        if (id.includes('highstock') || id.includes('highcharts')) {
                            return '@highcharts';
                        }

                        if (id.includes('moment')) {
                            return '@moment';
                        }

                        if (id.includes('xlsx')) {
                            return '@xlsx';
                        }

                        if (id.includes('elkjs')) {
                            return '@elkjs';
                        }
                    },
                },
            },
        },

    }
})