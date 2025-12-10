<template>
  <div class="tabla-container" v-if="items.length > 0">
    <table>
      <thead>
        <tr>
          <th>Puesto</th>
          <th>Usuario</th>
          <th>Categoría</th>
          <th>Nivel</th>
          <th>Tiempo</th>
          <th>Fecha</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in items" :key="index" class="text-center">
          <td>{{ index + 4 }}</td>
          <td>{{ item.usuario }}</td>
          <td>{{ item.categoria }}</td>
          <td>{{ item.nivel }}</td>
          <td>{{ item.tiempo }}</td>
          <td>{{ item.fecha }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.tabla-container {
  max-height: 360px;
  overflow-y: auto;
  margin-top: 22px;
  border-radius: 14px;

  background: rgba(15, 15, 20, 0.75);
  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.7);

  color: #fff;
}

.tabla-container::-webkit-scrollbar {
  width: 10px;
}

.tabla-container::-webkit-scrollbar-track {
  background: rgba(40, 40, 50, 0.5);
}

.tabla-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6a00ff, #4600aa);
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #eee;
  font-size: 15px;
}

thead {
  background: rgba(30, 30, 40, 0.9);
  color: #d8c9ff;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 5;

  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 -2px 5px rgba(0, 0, 0, 0.4);
}

th {
  padding: 14px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #dfccff;
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #f0f0f0;
}

tbody tr {
  transition: 0.25s ease;
}

tbody tr:hover {
  background: rgba(100, 0, 255, 0.15);
  box-shadow: inset 0 0 12px rgba(120, 0, 255, 0.4);
}

tbody tr:last-child td {
  border-bottom: none;
}
</style>