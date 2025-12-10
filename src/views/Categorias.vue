<template>
  <CardInicio
    titulo="Selecciona las categorias, sin miedo.."
    class="column justify-center items-center"
  >
    <div class="column q-gutter-xl">
      <div class="categoriaimg q-ma-none">
        <div><img :src="LocoJugar" /></div>

        <div class="cards q-ma-none">
          <CardPequeña
            :imagen="Animales"
            titulo="animales"
            :selected="categoria === 'animales'"
            @select="seleccionarcat"
          />

          <CardPequeña
            :imagen="Instrumentos"
            titulo="instrumentos"
            :selected="categoria === 'instrumentos'"
            @select="seleccionarcat"
          />

          <CardPequeña
            :imagen="Deportes"
            titulo="deportes"
            :selected="categoria === 'deportes'"
            @select="seleccionarcat"
          />

          <CardPequeña
            :imagen="Videojuegos"
            titulo="videojuegos"
            :selected="categoria === 'videojuegos'"
            @select="seleccionarcat"
          />

          <CardPequeña
            :imagen="Peliculas"
            titulo="peliculas"
            :selected="categoria === 'peliculas'"
            @select="seleccionarcat"
          />

          <CardPequeña
            :imagen="Ciencia"
            titulo="ciencia"
            :selected="categoria === 'ciencia'"
            @select="seleccionarcat"
          />
        </div>
      </div>

      <div class="flex justify-center q-ma-none q-pt-xl">
        <BotonIniciar
          :to="categoria ? `/niveles?cat=${categoria}` : undefined"
          :class="{ 'cursor-not-allowed opacity-50': !categoria }"
        >
          Siguiente, RAPIDOOO!!
        </BotonIniciar>
      </div>
    </div>
  </CardInicio>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";

import BotonIniciar from "../components/BotonIniciar.vue";
import CardInicio from "../components/CardInicio.vue";
import CardPequeña from "../components/CardPequeña.vue";

import Animales from "../assets/Animales.png";
import Instrumentos from "../assets/Instrumentos.png";
import Deportes from "../assets/Deportes.png";
import Videojuegos from "../assets/Videojuegos.png";
import Peliculas from "../assets/Peliculas.png";
import Ciencia from "../assets/Ciencia.png";
import LocoJugar from "../assets/LocoJugar.png";

const categoria = ref("");

function seleccionarcat(cat) {
  categoria.value = cat.toLowerCase();
  console.log("Seleccionaste:", categoria.value);
}
</script>


<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: clamp(10px, 5vw, 20px);
  justify-content: center;
  align-items: center;
}

.categoriaimg {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(30px, 10vw, 100px);
  flex-wrap: wrap;
}

.categoriaimg img {
  width: clamp(100px, 30vw, 200px);
  height: auto;
  object-fit: contain;
}

.flex.q-ma-none.q-pt-xl {
  padding-top: clamp(10px, 4vw, 30px);
}

.BotonIniciar {
  font-size: clamp(16px, 4vw, 22px);
  padding: clamp(10px, 3vw, 16px) clamp(20px, 5vw, 30px);
}

.grito-notify {
  animation: temblorLoco 0.1s infinite, glitchColorLoco 0.15s infinite alternate,
    zoomLoco 0.4s infinite alternate !important;
  letter-spacing: 5px !important;
  font-size: 25px !important;
  background: rgba(0, 0, 0, 0.7) !important;
  padding: 12px 24px !important;
  border-radius: 12px !important;
  text-transform: uppercase !important;
  text-align: center !important;
  display: inline-block !important;
  max-width: 90% !important;
}

@keyframes temblorLoco {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  10% {
    transform: translate(-3px, 2px) rotate(-2deg);
  }

  20% {
    transform: translate(4px, -3px) rotate(1deg);
  }

  30% {
    transform: translate(-2px, 4px) rotate(-1deg);
  }

  40% {
    transform: translate(3px, -2px) rotate(2deg);
  }

  50% {
    transform: translate(-4px, 1px) rotate(-1deg);
  }

  60% {
    transform: translate(2px, -3px) rotate(1deg);
  }

  70% {
    transform: translate(-1px, 3px) rotate(-2deg);
  }

  80% {
    transform: translate(3px, -1px) rotate(2deg);
  }

  90% {
    transform: translate(-2px, 2px) rotate(-1deg);
  }

  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes glitchColorLoco {
  0% {
    text-shadow: 2px 0 red, -2px 0 blue, 0 2px lime;
  }

  20% {
    text-shadow: -2px 1px blue, 2px -1px lime, 1px 0 red;
  }

  40% {
    text-shadow: 3px -2px lime, -3px 2px red, 0 0 blue;
  }

  60% {
    text-shadow: -1px 3px red, 1px -2px blue, 2px 0 lime;
  }

  80% {
    text-shadow: 2px -1px lime, -2px 1px blue, 0 3px red;
  }

  100% {
    text-shadow: 3px 0 red, -3px 0 blue, 1px -1px lime;
  }
}

@keyframes zoomLoco {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>