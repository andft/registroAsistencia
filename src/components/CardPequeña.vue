<template>
  <q-card :style="{ backgroundColor: color }" class="card-pequena flex flex-column items-center justify-start"
    @click="$emit('select', titulo)" :class="{ seleccionada: selected }">
    <div class="img-container">
      <q-img :src="imagen" class="img-bw" />
      <div class="text-center text-subtitle1">{{ titulo }}</div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  color: { type: String, default: "#ffffff" },
  imagen: { type: String, required: true },
  titulo: { type: String, required: true },
  selected: { type: Boolean, default: false },
});

defineEmits(["select"]);
</script>

<style scoped>
.card-pequena {
  width: 200px;
  min-height: 100px;
  border-radius: 12px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card-pequena:hover {
  transform: translateY(-4px);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
}

.img-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.img-bw {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.card-pequena:hover .img-bw {
  filter: grayscale(0%);
  filter: brightness(120%);
}


.seleccionada {
  background-color: #ffe066;
  border: 3px solid #f0c419;
  transform: translateY(-4px);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
}

.seleccionada .img-bw {
  filter: grayscale(0%) brightness(120%) !important;
}
</style>