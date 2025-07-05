import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPiniaStore } from '@/stores'

export function createApp() {
	const app = createSSRApp(App)

	const pinia = createPiniaStore()
	app.use(pinia)

	return {
		app,
		pinia
	}
}
