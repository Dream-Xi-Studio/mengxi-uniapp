import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
import { copyFile, injectIco } from './plugins'

function resolve(dir: string) {
	return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(config => {
	const viteEnv = loadEnv(config.mode, process.cwd())

	/** 是否为 H5 平台 */
	const isH5 = process.env.UNI_PLATFORM === 'h5'
	/** 是否为生产环境 */
	const isProd = viteEnv.VITE_USER_NODE_ENV === 'production'

	return {
		base: isH5 ? viteEnv.VITE_BASE_URL : void 0,

		define: {},

		/** 过滤掉 null 值 */
		plugins: [
			uni(),

			AutoImport({
				/** 自动导入 uni-app、vue、pinia 相关 API */
				imports: ['uni-app', 'vue', 'pinia'],
				/** 生成自动导入的声明文件 */
				dts: 'src/types/auto-imports.d.ts',
				/** 自动导入目录下的文件 */
				dirs: ['src/hooks/**', 'src/stores/**', 'src/utils/**'],
				/** 声明文件生成位置和文件名称 */
				vueTemplate: true
			}),

			/** 仅在 H5 模式下注入 favicon.ico */
			isH5 ? injectIco(viteEnv.VITE_BASE_URL) : null,

			/** 仅在 H5 模式下复制文件 */
			isH5 ? copyFile({ sourceDir: resolve('public'), targetDir: isProd ? resolve('dist/build/h5') : resolve('dist/dev/h5') }) : null
		].filter(Boolean),

		resolve: {
			alias: {
				'@': resolve('src'),
				'~': resolve('src')
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
					/** 仅在生产环境下移除 console.log */
					drop_console: isProd ? true : false
				}
			}
		}
	}
})
