import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

export function createPiniaStore() {
	const pinia = createPinia()
	pinia.use(piniaPersist)

	return pinia
}
