/** 路由配置项接口 */
declare interface RouteConfig {
	/** 路由路径 */
	path: string
	/** 路由元信息，可存储任意自定义数据 */
	meta?: Record<string, unknown>
	/** 子路由配置数组 */
	children?: RouteConfig[]
}

/** 路由位置描述对象 */
declare interface RouteLocation {
	/** 目标路径 */
	path: string
	/** 查询参数对象 */
	query?: Record<string, string | number | boolean>
}

/** 路由位置描述，可以是字符串路径或RouteLocation对象 */
declare type RouteLocationRaw = string | RouteLocation

/** uni-app路由跳转方法类型 */
declare type UniRouterMethod = 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack'

/** 当前路由信息 */
declare interface Route {
	/** 路由路径 */
	path: string
	/** 完整路径（包含查询参数） */
	fullPath: string
	/** 解析后的查询参数对象 */
	query: Record<string, string>
}

/**
 * 路由导航守卫函数
 * @param to 即将进入的路由
 * @param from 当前导航正要离开的路由
 * @param next 调用该方法来 resolve 这个钩子
 * @returns 可返回Promise或直接返回boolean/void
 */
declare type NavigationGuard = (to: Route, from: Route | null, next: (result?: boolean | void) => void) => Promise<boolean | void> | boolean | void

/**
 * 路由后置钩子函数
 * @param to 已经进入的路由
 * @param from 上一个路由
 */
declare type AfterEachHook = (to: Route, from: Route | null) => void

/** 路由构造器选项 */
declare interface UniRouterOptions {
	/** 路由配置数组 */
	routes?: RouteConfig[]
}

/** uni-app路由类接口 */
declare class UniRouterInterface {
	/** 构造函数 */
	constructor(options?: UniRouterOptions)

	/** 跳转到指定页面（保留当前页面） */
	push(location: RouteLocationRaw): Promise<void>

	/** 跳转到指定页面（关闭当前页面） */
	replace(location: RouteLocationRaw): Promise<void>

	/** 跳转到指定页面（关闭所有页面） */
	launch(location: RouteLocationRaw): Promise<void>

	/** 跳转到tabBar页面 */
	tab(location: RouteLocationRaw): Promise<void>

	/** 返回指定页面数 */
	go(delta?: number): void

	/** 返回上一页 */
	back(): void

	/** 添加全局前置守卫 */
	beforeEach(guard: NavigationGuard): void

	/** 添加全局后置钩子 */
	afterEach(hook: AfterEachHook): void

	/** 获取当前路由信息 */
	getCurrentRoute(): Route | null
}
