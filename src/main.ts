import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
	const app = createSSRApp(App)

	const pinia = createPiniaStore()
	app.use(pinia)

	return {
		app,
		pinia
	}
}
