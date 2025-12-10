<template>
  <div class="contenedor">
    <!-- TABS -->
    <div class="tabs">
      <button :class="{ active: tab === 'todos' }" @click="tab = 'todos'">
        Global
      </button>
      <button :class="{ active: tab === 'facil' }" @click="tab = 'facil'">
        Fácil
      </button>
      <button :class="{ active: tab === 'medio' }" @click="tab = 'medio'">
        Medio
      </button>
      <button :class="{ active: tab === 'dificil' }" @click="tab = 'dificil'">
        Difícil
      </button>
    </div>

    <div class="contenido">
      <div v-if="tab === 'todos'">
        <div class="top3">
          <div class="lado segundo">
            <CardTop2 :data="TopTodos[1]" />
          </div>

          <div class="centro primero">
            <CardTop1 :data="TopTodos[0]" />
          </div>

          <div class="lado tercero">
            <CardTop3 :data="TopTodos[2]" />
          </div>
        </div>

        <Tabla :items="TopTodos.slice(3)" />
      </div>

      <div v-if="tab === 'facil'">
        <div class="top3">
          <div class="lado segundo">
            <CardTop2 :data="TopFacil[1]" />
          </div>

          <div class="centro primero">
            <CardTop1 :data="TopFacil[0]" />
          </div>

          <div class="lado tercero">
            <CardTop3 :data="TopFacil[2]" />
          </div>
        </div>

        <Tabla :items="TopFacil.slice(3)" />
      </div>

      <div v-if="tab === 'medio'">
        <div class="top3">
          <div class="lado segundo">
            <CardTop2 :data="TopMedio[1]" />
          </div>

          <div class="centro primero">
            <CardTop1 :data="TopMedio[0]" />
          </div>

          <div class="lado tercero">
            <CardTop3 :data="TopMedio[2]" />
          </div>
        </div>

        <Tabla :items="TopMedio.slice(3)" />
      </div>

      <div v-if="tab === 'dificil'">
        <div class="top3">
          <div class="lado segundo">
            <CardTop2 :data="TopDificil[1]" />
          </div>

          <div class="centro primero">
            <CardTop1 :data="TopDificil[0]" />
          </div>

          <div class="lado tercero">
            <CardTop3 :data="TopDificil[2]" />
          </div>
        </div>

        <Tabla :items="TopDificil.slice(3)" />
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";

import CardTop1 from "@/components/CardTop1.vue";
import CardTop2 from "@/components/CardTop2.vue";
import CardTop3 from "@/components/CardTop3.vue";
import Tabla from "@/components/Tabla.vue";

const tab = ref("todos");

function obtenerusuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function tiempoasegundos(t) {
  return t.split(":").reduce((m, s) => m * 60 + +s);
}

const TopTodos = computed(() => {
  const usuarios = obtenerusuarios();

  return usuarios
    .flatMap((u) =>
      u.partidas.map((p) => ({
        usuario: u.nick,
        categoria: p.categoria,
        nivel: p.nivel,
        tiempo: p.tiempo,
        fecha: p.fecha,
        segundos: tiempoasegundos(p.tiempo),
      }))
    )
    .sort((a, b) => a.segundos - b.segundos);
});

const TopFacil = computed(() =>
  TopTodos.value.filter((p) => p.nivel === "facil")
);
const TopMedio = computed(() =>
  TopTodos.value.filter((p) => p.nivel === "medio")
);
const TopDificil = computed(() =>
  TopTodos.value.filter((p) => p.nivel === "dificil")
);
</script>


<style scoped>
.contenedor {
  padding: clamp(15px, 4vw, 25px);
  min-height: 100vh;
  color: #e5e5e5;
  font-family: "Segoe UI", sans-serif;
}

.tabs {
  display: flex;
  gap: clamp(8px, 2vw, 12px);
  margin-bottom: clamp(15px, 4vw, 25px);
  justify-content: center;
}

.tabs button {
  padding: clamp(8px, 2vw, 12px) clamp(15px, 4vw, 22px);
  border: none;
  background: #1c1c22;
  color: #bbb;
  border-radius: clamp(6px, 2vw, 10px);
  cursor: pointer;
  font-weight: bold;
  font-size: clamp(12px, 3vw, 15px);
  transition: 0.25s ease;
  box-shadow: 0 0 clamp(6px, 2vw, 8px) rgba(0, 0, 0, 0.4);
}

.tabs button:hover {
  background: #252530;
  color: #fff;
}

.tabs button.active {
  background: #6a00ff;
  color: #fff;
  box-shadow: 0 0 clamp(10px, 4vw, 15px) #6a00ffb0;
}

.contenido {
  margin-top: clamp(10px, 3vw, 15px);
  padding: clamp(10px, 3vw, 15px);
}

.top3 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(30px, 10vw, 120px);
  padding: clamp(15px, 5vw, 50px);
  flex-wrap: wrap;
}

.centro {
  transform: scale(clamp(1, 1.2, 1.25));
  position: relative;
  z-index: 2;
}

.lado {
  transform: translateY(clamp(5px, 2vw, 25px)) scale(clamp(0.9, 1, 1.05));
}
</style>