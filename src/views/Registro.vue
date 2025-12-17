<template>
  <div class="fondo column justify-center items-center">
    <div class="blur-overlay"></div>

    <div class="contenido row justify-center items-center">
      <div>
        <div class="column justify-center items-center q-gutter-lg">
          <div><h3>Centro de Asistencia Estudiantil</h3></div>

          <div class="container">
            <video ref="video" width="320" height="240" autoplay muted></video>
          </div>

          <div>
            <input v-model="nombre" placeholder="Nombre del estudiante" />
          </div>
          <div>
            <input v-model="documento" placeholder="Documento del estudiante" />
          </div>

          <div>
            <BotonIniciar @click="registroestudiante" :disabled="isLoading">
              <span v-if="isLoading && action === 'registro'">
                <i class="spinner"></i> Registrando...
              </span>
              <span v-else>Registro</span>
            </BotonIniciar>
          </div>

          <div>
            <BotonIniciar @click="abrirmodal" :disabled="isLoading">
              <span v-if="isLoading && action === 'asistencia'">
                <i class="spinner"></i> Marcando...
              </span>
              <span v-else>Marcar Asistencia</span>
            </BotonIniciar>
          </div>
        </div>

        <div v-if="isLoading && action === ''" class="loading-text">
          ⏳ Procesando, por favor espera...
        </div>
      </div>

      <div class="column justify-center items-center q-gutter-md">
        <div><h3>Asistencia del día</h3></div>

        <div v-if="asistenciahoy.length">
          <table class="asistencia-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, index) in asistenciahoy" :key="s.documento">
                <td>{{ index + 1 }}</td>
                <td>{{ s.nombre }}</td>
                <td>{{ s.documento }}</td>
                <td>{{ s.fecha }}</td>
                <td>✅ Presente</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="no-asistencia">
          <p>📭 No hay registros de asistencia hoy.</p>
        </div>
      </div>

      <div v-if="modalVisible" class="modal">
        <div class="modal-content">
          <h3>Marcando asistencia...</h3>
          <p>Acerca tu rostro a la cámara</p>
          <button @click="cerrarmodal" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import { useFace } from "@/composables/useFace";
import BotonIniciar from "../components/BotonIniciar.vue";

function fechaactual() {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const video = ref(null);
const nombre = ref("");
const documento = ref("");
const isLoading = ref(false);
const action = ref("");
const modalVisible = ref(false);

const estudiantes = reactive(
  JSON.parse(localStorage.getItem("estudiantes") || "[]")
);
const asistencia = reactive(
  JSON.parse(localStorage.getItem("asistencia") || "[]")
);

// Cálculo de asistencia del día
const asistenciahoy = computed(() => {
  const hoy = fechaactual();
  return asistencia.filter((a) => a.fecha === hoy);
});

// Métodos importados del módulo facial
const {
  setVideoElement,
  loadModels,
  startCamera,
  getFaceDescriptor,
  createFaceMatcher,
} = useFace();

// Registro de estudiante con rostro
const registroestudiante = async () => {
  if (!nombre.value || !documento.value)
    return alert("Ingresa nombre y documento primero");

  isLoading.value = true;
  action.value = "registro";

  try {
    const existe = estudiantes.find((e) => e.documento === documento.value);
    if (existe) return alert("Este documento ya está registrado");

    const descriptor = await getFaceDescriptor();
    if (!descriptor) return alert("No se detectó el rostro");

    estudiantes.push({
      nombre: nombre.value,
      documento: documento.value,
      descriptor: Array.from(descriptor),
    });

    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

    alert(`Estudiante ${nombre.value} registrado correctamente`);
    nombre.value = "";
    documento.value = "";
  } catch (error) {
    console.error(error);
    alert("Error al registrar");
  } finally {
    isLoading.value = false;
    action.value = "";
  }
};

// Abrir modal para marcar asistencia
const abrirmodal = async () => {
  modalVisible.value = true;

  await nextTick();

  setTimeout(() => {
    marcarasistencia();
  }, 800);
};

// Cerrar modal de asistencia
const cerrarmodal = () => {
  modalVisible.value = false;
};

// Procesar detección y registro de asistencia con reconocimiento facial
const marcarasistencia = async () => {
  if (estudiantes.length === 0) {
    alert("No hay estudiantes registrados");
    cerrarmodal();
    return;
  }

  isLoading.value = true;
  action.value = "asistencia";

  try {
    const descriptor = await getFaceDescriptor();
    if (!descriptor) {
      alert("No se detectó rostro");
      cerrarmodal();
      return;
    }

    const matcher = createFaceMatcher(estudiantes);
    const result = matcher.findBestMatch(descriptor);

    if (result.label === "unknown") {
      alert("Rostro no reconocido");
      cerrarmodal();
      return;
    }

    const estudiante = estudiantes.find((e) => e.nombre === result.label);
    const hoy = fechaactual();

    const ya = asistencia.find(
      (a) => a.documento === estudiante.documento && a.fecha === hoy
    );

    if (ya) {
      alert(`${estudiante.nombre} ya registró asistencia hoy`);
    } else {
      asistencia.push({
        nombre: estudiante.nombre,
        documento: estudiante.documento,
        fecha: hoy,
      });
      localStorage.setItem("asistencia", JSON.stringify(asistencia));
      alert(`Asistencia registrada para ${estudiante.nombre}`);
    }
  } catch (error) {
    console.error(error);
    alert("Error marcando asistencia");
  } finally {
    isLoading.value = false;
    action.value = "";
    cerrarmodal();
  }
};

// Inicialización: conectar video, cargar modelos y activar cámara
onMounted(async () => {
  await nextTick();
  setVideoElement(video.value);
  await loadModels();
  await startCamera();
});
</script>

<style>
body {
  min-height: 100vh !important;
  width: 100% !important;
}

.fondo {
  position: relative;
  min-height: 100vh !important;
  width: 100% !important;
}

.blur-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1;
  pointer-events: none;
}

.contenido {
  position: relative;
  z-index: 2;
  width: 100%;
}

.container {
  display: flex;
  justify-content: center;
  max-width: 420px;
  width: 100%;
  z-index: 99;
}

h3 {
  font-size: 1.9rem;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

video {
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  margin-bottom: 18px;
  background-color: #000;
}

input {
  width: 100%;
  max-width: 320px;
  padding: 12px 14px;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

input::placeholder {
  color: #888;
}

input:focus {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
}

.loading-text {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #f1f1f1;
  text-align: center;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top: 2px solid #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.9s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #ffffff, #f3f3f3);
  padding: 30px 35px;
  border-radius: 14px;
  width: 90%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
  animation: scaleIn 0.25s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-content h3 {
  color: #333;
  margin-bottom: 8px;
}

.modal-content p {
  color: #666;
  margin-bottom: 22px;
}

.btn-cancel {
  padding: 10px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b7d66, #6f634f);
  color: #fff;
  border: none;
  cursor: pointer;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}

.asistencia-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

.asistencia-table th {
  background: linear-gradient(135deg, #8b7d66, #6f634f);
  color: #ffffff;
  padding: 20px;
  letter-spacing: 0.04em;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.asistencia-table td {
  padding: 20px;
  color: #f1f1f1;
  text-align: center;
  background-color: transparent;
  transition: background-color 0.25s ease;
}

.asistencia-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.08);
}

.asistencia-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.15);
}

.no-asistencia {
  margin-top: 12px;
  color: #ffffff;
  font-style: italic;
  text-align: center;
  opacity: 0.85;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}
</style>