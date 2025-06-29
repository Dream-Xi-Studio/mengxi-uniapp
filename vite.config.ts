import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import path from 'path'
function resolve(dir: string) {
	return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(config => {
	const env = loadEnv(config.mode, process.cwd())

	return {
		define: {},

		plugins: [uni()],

		resolve: {
			alias: {
				'@': resolve('src'),
				'~': resolve('src'),
				'@api': resolve('src/api'),
				'@pages': resolve('src/pages'),
				'@static': resolve('src/static'),
				'@hooks': resolve('src/hooks'),
				'@server': resolve('src/server'),
				'@stores': resolve('src/stores'),
				'@styles': resolve('src/styles'),
				'@utils': resolve('src/utils')
			}
		},

		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['legacy-js-api'],
					javascriptEnabled: true,
					additionalData: `@use "@/styles/mixin.scss" as *;`
				}
			}
		},

		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: env.VITE_USER_NODE_ENV === 'production' ? true : false
				}
			}
		}
	}
})
