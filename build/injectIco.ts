import { Plugin } from 'vite'

interface InjectIcoOptions {
	/** 图标文件的基础路径，默认为根路径 `/` */
	base?: string
	/** 图标的完整 URL，如果提供则优先使用（覆盖 base + favicon.ico） */
	url?: string
	/** 自定义的完整 link 标签 HTML，如果提供则优先使用（覆盖 url 和 base） */
	link?: string
}

/**
 * 注入网站图标链接到 HTML 文件的头部。
 *
 * @param options - 配置选项
 * @returns 一个 Vite 插件实例，用于在构建过程中修改 HTML 文件
 */
export function injectIco(options: InjectIcoOptions = {}): Plugin {
	return {
		name: 'inject-ico',

		/**
		 * 转换 HTML 入口文件的钩子函数。
		 *
		 * @param html - 原始的 HTML 内容
		 * @returns 经过修改后的 HTML 内容，在 `</head>` 标签前注入图标链接
		 */
		transformIndexHtml(html) {
			let icoTag: string

			if (options.link) {
				// 如果提供了完整的 link 标签，直接使用
				icoTag = options.link
			} else if (options.url) {
				// 如果提供了完整 URL，生成标准 link 标签
				icoTag = `<link rel="icon" href="${options.url}" />`
			} else {
				// 使用 base 路径 + 默认 favicon.ico
				const base = options.base || '/'
				icoTag = `<link rel="icon" href="${base}favicon.ico" />`
			}

			// 在 </head> 标签前插入图标链接
			return html.replace('</head>', `${icoTag}\n</head>`)
		}
	}
}
