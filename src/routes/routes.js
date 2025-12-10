import Home from "../views/Home.vue";
import Registro from "../views/Registro.vue";
import Consulta from "../views/Consulta.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/registro", component: Registro },
  { path: "/consulta", component: Consulta },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
