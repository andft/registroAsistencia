<template>
  <button class="boton" @click="ir">
    <slot></slot>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const { to } = defineProps({
  to: {
    type: String,
    required: true
  }
})
function ir() {
  router.push(to)
}
</script>

<style scoped>
.boton {
  background: #979090;
  color: #ffffff;
  font-size: clamp(1rem, 3vw, 2rem);
  padding: clamp(0.6rem, 2vw, 0.5rem) clamp(1.5rem, 4vw, 1rem);
  border-radius: clamp(15px, 4vw, 30px);
  cursor: pointer;
  box-shadow: clamp(3px, 1vw, 6px) clamp(3px, 1vw, 6px) 0px #000;
  transition: 0.15s ease;
  letter-spacing: clamp(0.5px, 0.4vw, 2px);
}

.boton:hover {
  transform: translateY(-4px) rotate(-1deg);
  background: #ff3300;
  color: #000;
  box-shadow: clamp(5px, 1.3vw, 8px) clamp(5px, 1.3vw, 8px) 0px #000;
}

.boton:active {
  transform: translateY(3px) rotate(1deg);
  box-shadow: clamp(2px, 0.7vw, 3px) clamp(2px, 0.7vw, 3px) 0px #000;
}
</style>
