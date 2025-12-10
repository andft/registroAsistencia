import Nick from "../views/Nick.vue"
import Jugar from "../views/Jugar.vue"
import Categorias from "../views/Categorias.vue"
import Niveles from "../views/Niveles.vue"
import Jugando from "../views/Jugando.vue"
import Estadisticas from "../views/Estadisticas.vue"
import Presentacion from "../views/Presentacion.vue"
import { createRouter, createWebHashHistory } from "vue-router"



const routes = [
    { path: "/", component: Presentacion },
    { path: "/nick", component: Nick },
    { path: "/jugar", component: Jugar },
    { path: "/categorias", component: Categorias },
    { path: "/niveles", component: Niveles },
    { path: "/jugando", component: Jugando },
    { path: "/estadisticas", component: Estadisticas },


    { path: "/:catchAll(.*)", redirect: "/" }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Variable en memoria que se reinicia al recargar la página
let initialNavigation = true

// Cuando recargue pagina lleva a presentacion
router.beforeEach((to, from, next) => {
  if (initialNavigation) {
    initialNavigation = false
    if (to.path !== "/") {
      return next("/")
    }
  }

  // Rutas que requieren sesión iniciada
  const requiereSesion = ["/jugar", "/categorias", "/estadisticas"]

  const usuario = localStorage.getItem("usuarioActual")

  if (requiereSesion.includes(to.path) && !usuario) {
    return next("/nick") // Si no hay sesión, lo manda a registrar/iniciar
  }

  next()
})
