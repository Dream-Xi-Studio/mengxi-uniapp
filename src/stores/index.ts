import piniaPersist from 'pinia-plugin-persistedstate'

/** 创建 pinia 实例 */
export function createPiniaStore() {
	const pinia = createPinia()
	pinia.use(piniaPersist)

	return pinia
}
