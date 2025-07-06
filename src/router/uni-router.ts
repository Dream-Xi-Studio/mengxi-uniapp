/** uni-app 路由实现类 */
class UniRouter implements UniRouterInterface {
	/** 路由配置列表 */
	private routes: RouteConfig[]
	/** 全局前置守卫列表 */
	private beforeEachHooks: NavigationGuard[]
	/** 全局后置钩子列表 */
	private afterEachHooks: AfterEachHook[]

	/**
	 * 创建路由实例
	 * @param options 路由配置选项
	 */
	constructor(options: UniRouterOptions = {}) {
		this.routes = options.routes || []
		this.beforeEachHooks = []
		this.afterEachHooks = []
	}

	/**
	 * 跳转到新页面（保留当前页面）
	 * @param location 目标位置
	 */
	push(location: RouteLocationRaw): Promise<void> {
		return this.navigate(location, 'navigateTo')
	}

	/**
	 * 替换当前页面（关闭当前页面）
	 * @param location 目标位置
	 */
	replace(location: RouteLocationRaw): Promise<void> {
		return this.navigate(location, 'redirectTo')
	}

	/**
	 * 重新启动应用并打开页面（关闭所有页面）
	 * @param location 目标位置
	 */
	launch(location: RouteLocationRaw): Promise<void> {
		return this.navigate(location, 'reLaunch')
	}

	/**
	 * 跳转到 tabBar 页面
	 * @param location 目标位置
	 */
	tab(location: RouteLocationRaw): Promise<void> {
		return this.navigate(location, 'switchTab')
	}

	/**
	 * 返回指定页面数
	 * @param delta 返回的页面数，默认为1（负数无效）
	 */
	go(delta: number = -1): void {
		uni.navigateBack({
			delta: Math.abs(delta)
		})
	}

	/** 返回上一页 */
	back(): void {
		this.go(-1)
	}

	/**
	 * 添加全局前置守卫
	 * @param guard 守卫函数
	 */
	beforeEach(guard: NavigationGuard): void {
		this.beforeEachHooks.push(guard)
	}

	/**
	 * 添加全局后置钩子
	 * @param hook 钩子函数
	 */
	afterEach(hook: AfterEachHook): void {
		this.afterEachHooks.push(hook)
	}

	/**
	 * 获取当前路由信息
	 * @returns 当前路由对象或null
	 */
	getCurrentRoute(): Route | null {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]

		if (!currentPage) {
			return null
		}

		// 使用条件编译处理多平台差异
		let options: Record<string, string> = {}

		// #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
		options = (currentPage as AnyObject).options || {}
		// #endif

		// #ifdef H5
		options = currentPage.$vm?.$route?.query || {}
		// #endif

		// #ifdef APP-PLUS
		options = currentPage.$vm?.$mp?.query || {}
		// #endif

		return {
			path: currentPage.route || '',
			fullPath: this.buildUrl(currentPage.route || ''),
			query: options
		}
	}

	/**
	 * 执行路由跳转
	 * @private
	 * @param location 目标位置
	 * @param method 跳转方法
	 */
	private async navigate(location: RouteLocationRaw, method: UniRouterMethod): Promise<void> {
		const { path, query } = this.parseLocation(location)
		const from = this.getCurrentRoute()
		const to: Route = {
			path,
			query: query || {},
			fullPath: this.buildUrl(path, query)
		}

		// 执行全局前置守卫
		for (const hook of this.beforeEachHooks) {
			const result = await hook(to, from, () => {})
			if (result === false) {
				return Promise.reject(new Error('Navigation aborted by guard'))
			}
		}

		try {
			if (method === 'switchTab') {
				await this.callUniMethod('switchTab', this.buildUrl(path))
			} else {
				await this.callUniMethod(method, to.fullPath)
			}

			// 执行全局后置钩子
			for (const hook of this.afterEachHooks) {
				hook(to, from)
			}
		} catch (err) {
			return Promise.reject(err)
		}
	}

	/**
	 * 调用 uni-app 原生导航方法
	 * @private
	 * @param method 方法名
	 * @param url 目标URL
	 */
	private callUniMethod(method: UniRouterMethod, url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const uniNav = uni[method]
			if (typeof uniNav === 'function') {
				// 明确使用 Promise 版本的重载
				;(uniNav as (options: { url: string }) => Promise<void>)({ url }).then(resolve).catch(reject)
			} else {
				reject(new Error(`Navigation method ${method} not available`))
			}
		})
	}

	/**
	 * 解析路由位置
	 * @private
	 * @param location 路由位置
	 * @returns 解析后的路径和查询参数
	 */
	private parseLocation(location: RouteLocationRaw): { path: string; query?: Record<string, string> } {
		if (typeof location === 'string') {
			return { path: location }
		}
		return {
			path: location.path,
			query: location.query as Record<string, string>
		}
	}

	/**
	 * 构建完整URL
	 * @private
	 * @param path 路径
	 * @param query 查询参数
	 * @returns 完整URL字符串
	 */
	private buildUrl(path: string, query?: Record<string, string | number | boolean>): string {
		// 处理路径开头的斜杠
		const normalizedPath = path.startsWith('/') ? path : `/${path}`

		// tabBar页面不处理查询参数
		if (path.startsWith('tabBar/')) {
			return normalizedPath
		}

		// 如果路径已包含查询参数，直接返回
		if (path.includes('?')) {
			return normalizedPath
		}

		// 没有查询参数的情况
		if (!query) {
			return normalizedPath
		}

		// 构建查询字符串
		const queryStr = Object.keys(query)
			.filter(key => query[key] !== undefined && query[key] !== null)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
			.join('&')

		return queryStr ? `${normalizedPath}?${queryStr}` : normalizedPath
	}
}

export default UniRouter
