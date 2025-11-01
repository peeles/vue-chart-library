import { createApp } from 'vue'
import App from './App.vue'
import installFontAwesome from '../src/plugins/fontawesome.js'
import '../src/styles/main.css'

const app = createApp(App)

// Install FontAwesome
installFontAwesome(app)

app.mount('#app')