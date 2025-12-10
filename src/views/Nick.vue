<template>
  <CardInicio titulo="¡Desafía al Ahorcado Maldito!"
    class="flex column justify-center items-center text-center q-gutter-md">

    <div class="row justify-center items-center q-gutter-md q-pb-xl">
      <div><img :src="Saludando" /></div>
      <div class="column justify-center">
        <p class="text-h5">
          Solo los valientes pueden jugar.
          <br />
          Regístrate para convertirte en un verdadero desafiante y enfrenta al
          espíritu maldito.
          <br />
          ¿Tienes el valor y la astucia para ganar? ¡Demuestra que eres el
          mejor!
        </p>

        <div class="row justify-center items-center q-gutter-xl">
          <q-input v-if="!sesionActiva" v-model="nick" label="Ingresa tu nick" filled class="nick-input"
            style="width: 50%;" />

          <div v-else class="activa row justify-center items-center q-gutter-md">
            <strong>Jugando como:</strong>
            <h4>{{ sesionActiva }}</h4>
          </div>

          <q-btn round dense icon="check" @click="registrarOIniciar" />
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <BotonIniciar to="/jugar">A Jugar</BotonIniciar>
    </div>
  </CardInicio>
</template>

<script setup>

import { ref } from "vue";
import { Notify } from "quasar";
import BotonIniciar from "../components/BotonIniciar.vue";
import CardInicio from "../components/CardInicio.vue";
import Saludando from "../assets/Saludando.png";

const nick = ref("");
const sesionActiva = ref(localStorage.getItem("usuarioActual") || "");

function registrarOIniciar() {
  if (sesionActiva.value) {
    Notify.create({
      message: `Ya estás conectado como: ${sesionActiva.value}`,
      caption: "Para cambiar de desafiante, primero cierra sesión...",
      color: null,
      textColor: null,
      classes: "bg-white text-red-5 text-bold shadow-10 grito-notify",
      icon: "block",
      position: "top",
      timeout: 2500,
      html: true
    });
    return;
  }

  const valor = nick.value.trim();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existente = usuarios.find(u => u.nick === valor);

  if (existente) {
    localStorage.setItem("usuarioActual", existente.nick);
    sesionActiva.value = existente.nick;

    Notify.create({
      message: `Volviste, ${existente.nick}...`,
      caption: "El ahorcado ya escuchó tus pasos 👁️",
      color: null,
      textColor: null,
      classes: "bg-white text-red-5 text-bold shadow-10 grito-notify",
      icon: "psychology",
      position: "top",
      timeout: 2500,
      html: true
    });
    return;
  }

  const nuevoUsuario = {
    nick: valor,
    partidas: []
  };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioActual", valor);
  sesionActiva.value = valor;

  Notify.create({
    message: `Nuevo desafiante creado: ${valor}`,
    caption: "Que los espíritus te acompañen...",
    color: null,
    textColor: null,
    classes: "bg-white text-red-5 text-bold shadow-10 grito-notify",
    icon: "skull",
    position: "top",
    timeout: 2800,
    html: true
  });
}
</script>

<style>
.nick-input .q-field__control {
  background-color: rgba(0, 0, 0, 0.15) !important;
  border-radius: 25px !important;
  padding: 10px 15px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out;
}

.nick-input .q-field__label {
  color: #000000 !important;
  font-weight: bold !important;
  font-size: 1.5rem !important;
  letter-spacing: 2px;
}

.nick-input .q-field__native {
  color: #000000 !important;
  font-size: 1.3rem !important;
  text-align: center !important;
  font-weight: normal !important;
  background-color: transparent !important;
  padding-bottom: 5px !important;
  letter-spacing: 2px !important;
  text-transform: none !important;
}

.nick-input .q-field__bottom {
  display: none;
}

.nick-input input::placeholder {
  color: #888 !important;
  text-align: center !important;
}

.activa h4 {
  color: #f00;
}

.activa {
  letter-spacing: 3px;
}
</style>