import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import { copyFile, injectIco } from './build'

function resolve(dir: string) {
	return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(config => {
	const viteEnv = loadEnv(config.mode, process.cwd())

	// 是否为 H5 平台
	const isH5 = process.env.UNI_PLATFORM === 'h5'
	const isProd = viteEnv.VITE_USER_NODE_ENV === 'production'

	return {
		base: isH5 ? viteEnv.VITE_BASE_URL : void 0,

		define: {},

		// 过滤掉 null 值
		plugins: [
			uni(),

			// 仅在 H5 模式下注入 favicon.ico
			isH5 ? injectIco(viteEnv.VITE_BASE_URL) : null,

			// 仅在 H5 模式下复制文件
			isH5 ? copyFile({ sourceDir: resolve('public'), targetDir: isProd ? resolve('dist/build/h5') : resolve('dist/dev/h5') }) : null
		].filter(Boolean),

		resolve: {
			alias: {
				'@': resolve('src'),
				'~': resolve('src'),
				'@api': resolve('src/api'),
				'@pages': resolve('src/pages'),
				'@router': resolve('src/router'),
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
					drop_console: viteEnv.VITE_USER_NODE_ENV === 'production' ? true : false
				}
			}
		}
	}
})
