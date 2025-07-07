# MxRouter 路由管理类文档

## 概述

`MxRouter` 是一个专为 uni-app 设计的路由管理类，提供了类似 Vue
Router 的 API 接口，同时兼容 uni-app 的多平台特性。该类封装了 uni-app 的原生导航 API，并添加了路由守卫、错误处理等高级功能。

## 安装与使用

### 安装

```javascript
// 导入 MxRouter
import MxRouter from '@/router/mx-router'

// 创建路由实例
const router = new MxRouter({
	routes: [{ path: '/pages/home/index' }, { path: '/pages/user/index' }]
})

export default router
```

### 基本使用

```javascript
// 导入路由实例
import router from '@/router'

// 跳转到新页面
router.push('/pages/detail/index')

// 替换当前页面
router.replace('/pages/login/index')

// 跳转到 tabBar 页面
router.tab('/tabBar/home/index')

// 返回上一页
router.back()
```

## API 文档

### 构造函数

```typescript
new MxRouter(options?: MxRouterOptions)
```

**参数：**

| 参数名  | 类型              | 必填 | 说明         |
| ------- | ----------------- | ---- | ------------ |
| options | `MxRouterOptions` | 否   | 路由配置选项 |

**MxRouterOptions 结构：**

```typescript
interface MxRouterOptions {
	routes?: RouteConfig[]
}
```

### 实例方法

#### push(location: RouteLocationRaw): Promise<void>

保留当前页面，跳转到新页面

#### replace(location: RouteLocationRaw): Promise<void>

关闭当前页面，跳转到新页面

#### launch(location: RouteLocationRaw): Promise<void>

关闭所有页面，打开新页面

#### tab(location: RouteLocationRaw): Promise<void>

跳转到 tabBar 页面

#### go(delta?: number): void

返回指定页面数（默认返回上一页）

#### back(): void

返回上一页（go(-1) 的快捷方式）

#### beforeEach(guard: NavigationGuard): void

添加全局前置守卫

#### afterEach(hook: AfterEachHook): void

添加全局后置钩子

#### getCurrentRoute(): Route | null

获取当前路由信息

### 类型定义

```typescript
/** 路由配置项 */
interface RouteConfig {
	path: string
	meta?: Record<string, unknown>
	children?: RouteConfig[]
}

/** 路由位置描述 */
type RouteLocationRaw = string | RouteLocation

/** 路由位置对象 */
interface RouteLocation {
	path: string
	query?: Record<string, string | number | boolean>
}

/** 当前路由信息 */
interface Route {
	path: string
	fullPath: string
	query: Record<string, string>
}

/** 导航守卫函数 */
type NavigationGuard = (to: Route, from: Route | null, next: NavigationGuardNextCallback) => Promise<boolean | void> | boolean | void

/** 后置钩子函数 */
type AfterEachHook = (to: Route, from: Route | null) => void
```

## 路由守卫

### 全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
	if (!isAuthenticated && to.path !== '/pages/login/index') {
		next('/pages/login/index')
	} else {
		next()
	}
})
```

### 全局后置钩子

```javascript
router.afterEach((to, from) => {
	console.log(`Navigated from ${from?.path} to ${to.path}`)
})
```

## 错误处理

`MxRouter` 使用 `MxRouterError` 类处理路由错误，包含以下错误类型：

```typescript
enum MxRouterErrorType {
	NAVIGATION_ABORTED = 'NAVIGATION_ABORTED', // 导航被中止
	NAVIGATION_REDIRECT = 'NAVIGATION_REDIRECT', // 导航被重定向
	NAVIGATION_FAILED = 'NAVIGATION_FAILED', // 导航失败
	INVALID_METHOD = 'INVALID_METHOD' // 无效的导航方法
}
```

**错误处理示例：**

```javascript
this.$router.push('/pages/secure/index').catch(err => {
	if (err.type === MxRouterErrorType.NAVIGATION_ABORTED) {
		console.log('Navigation was aborted by guard')
	} else if (err.type === MxRouterErrorType.NAVIGATION_REDIRECT) {
		console.log(`Redirected to: ${err.location}`)
	} else {
		console.error('Navigation failed:', err.message)
	}
})
```

## 多平台兼容性

`MxRouter` 通过条件编译自动处理不同平台的差异：

```javascript
getCurrentRoute(): Route | null {
  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
  options = currentPage.options || {};
  // #endif

  // #ifdef H5
  options = currentPage.$vm?.$route?.query || {};
  // #endif

  // #ifdef APP-PLUS
  options = currentPage.$vm?.$mp?.query || {};
  // #endif
}
```

## 最佳实践

1. **路由配置集中管理**：

   ```javascript
   const routes = [
   	{ path: '/pages/home/index', meta: { requiresAuth: false } },
   	{ path: '/pages/user/index', meta: { requiresAuth: true } }
   ]

   const router = new MxRouter({ routes })
   ```

2. **权限控制**：

   ```javascript
   router.beforeEach((to, from, next) => {
   	const requiresAuth = to.meta?.requiresAuth
   	if (requiresAuth && !isLoggedIn()) {
   		next('/pages/login/index')
   	} else {
   		next()
   	}
   })
   ```

3. **错误统一处理**：
   ```javascript
   Vue.config.errorHandler = err => {
   	if (err instanceof MxRouterError) {
   		// 统一处理路由错误
   	}
   }
   ```

## 注意事项

1. `switchTab` 方法不支持传递查询参数
2. 小程序端页面栈最多10层，超出会导致导航失败
3. 路由守卫中避免无限重定向循环
4. 使用条件编译处理平台特定逻辑

## 版本历史

- 1.0.0: 初始版本

## 许可证

MIT License
