import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Notify, Loading } from 'quasar'
import { router } from './routes/routes.js'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import language (default export)
import es from 'quasar/lang/es.js'

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {},
  lang: es,             
  iconSet: 'material-icons'
})

app.mount('#app')
