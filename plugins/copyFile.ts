import { Plugin } from 'vite'
import fs from 'fs-extra'

/** 定义复制文件插件的配置选项接口 */
interface CopyFileOptions {
	/** 源文件目录的路径 */
	sourceDir: string
	/** 目标文件目录的路径 */
	targetDir: string
}

/**
 * 自定义 Vite 插件，用于在构建完成后将指定源目录的文件复制到目标目录
 *
 * @param options - 配置参数，包含源目录和目标目录路径
 * @returns 返回一个 Vite 插件对象
 */
export function copyFile({ sourceDir, targetDir }: CopyFileOptions): Plugin {
	return {
		// 插件名称，用于在 Vite 构建日志中标识该插件
		name: 'copy-file',
		// 指定插件在构建流程的最后阶段执行，确保其他构建任务完成后再进行文件复制
		enforce: 'post',

		/**
		 * Vite 构建完成后触发的钩子函数，执行文件复制操作
		 */
		async writeBundle() {
			try {
				// 使用 fs-extra 的 ensureDir 方法确保目标目录存在，若不存在则自动创建
				await fs.ensureDir(targetDir)

				// 使用 fs-extra 的 copy 方法将源目录下的所有文件和子目录复制到目标目录
				// 若目标目录中已存在同名文件，会被新文件覆盖
				await fs.copy(sourceDir, targetDir)

				// 复制成功，在控制台输出成功信息
				console.log('✅ 复制文件成功')
			} catch (err) {
				// 复制过程中出现错误，在控制台输出错误信息
				console.error('❌ 复制文件失败：', err)
			}
		}
	}
}
