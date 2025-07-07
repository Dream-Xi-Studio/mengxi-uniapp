/** 路由错误类 */
export class MxRouterError extends Error {
	/** 错误类型 */
	public type: MxRouterErrorType
	/** 错误位置 */
	public location?: string | RouteLocationRaw

	/**
	 * 构造函数
	 * @param type 错误类型
	 * @param message 错误消息
	 * @param location 目标位置
	 */
	constructor(type: MxRouterErrorType, message: string, location?: string | RouteLocationRaw) {
		super(message)
		this.type = type
		this.location = location
		Object.setPrototypeOf(this, MxRouterError.prototype)
	}

	/**
	 * 创建导航中止错误
	 */
	static navigationAborted(): MxRouterError {
		return new MxRouterError(MxRouterErrorType.NAVIGATION_ABORTED, 'Navigation aborted by guard')
	}

	/**
	 * 创建导航重定向错误
	 * @param location 重定向位置
	 */
	static navigationRedirect(location: string | RouteLocationRaw): MxRouterError {
		return new MxRouterError(MxRouterErrorType.NAVIGATION_REDIRECT, 'Navigation redirected', location)
	}

	/**
	 * 创建导航失败错误
	 * @param message 错误信息
	 */
	static navigationFailed(message: string): MxRouterError {
		return new MxRouterError(MxRouterErrorType.NAVIGATION_FAILED, message || 'Navigation failed')
	}

	/**
	 * 创建无效方法错误
	 * @param method 方法名
	 */
	static invalidMethod(method: string): MxRouterError {
		return new MxRouterError(MxRouterErrorType.INVALID_METHOD, `Navigation method ${method} not available`)
	}
}
