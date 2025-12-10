<template>
  <CardInicio
    titulo="¡EL AHORCADO MALDITO!"
    class="column justify-center items-center"
  >
    <div class="column q-gutter-xl">
      <div>
        <img :src="Ahorcado" />
      </div>
      <div class="flex justify-center">
        <BotonIniciar to="/nick">¡JUGAR Y SOBREVIVIR!</BotonIniciar>
      </div>
    </div>
  </CardInicio>
</template>

<script setup>
import BotonIniciar from "../components/BotonIniciar.vue";
import CardInicio from "../components/CardInicio.vue";
import Ahorcado from "../assets/Loco.png";
</script>

<style scoped>
</style>