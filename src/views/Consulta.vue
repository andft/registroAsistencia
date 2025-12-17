<template>
  <div class="fondo row justify-center items-center">
    <div class="blur-overlay"></div>

    <div
      class="consulta-container contenido column justify-center items-center q-gutter-xl"
    >
      <div class="titulo">
        <h1>Consulta de Asistencia</h1>
      </div>

      <div>
        <input
          v-model="documento"
          placeholder="Ingresa el documento del estudiante"
        />
      </div>

      <div class="botones row justify-center items-center q-gutter-xl">
        <div><button @click="buscarPorDocumento">Buscar</button></div>
        <div>
          <button @click="abrirModalRostro">Reconocimiento Facial</button>
        </div>
      </div>

      <div v-if="estudianteSeleccionado" class="calendario-container">
        <h3>Asistencia de {{ estudianteSeleccionado.nombre }}</h3>
        <p>{{ monthName }} {{ yearActual }}</p>

        <div class="calendario">
          <div class="dias-semana">
            <span v-for="d in diasSemana" :key="d">{{ d }}</span>
          </div>
          <div class="dias-mes">
            <span
              v-for="(dia, index) in diasMes"
              :key="index"
              :class="{ asistio: diasAsistencia.includes(dia) }"
            >
              {{ dia }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="mensaje" class="mensaje">
        <p>{{ mensaje }}</p>
      </div>

      <div v-if="modalVisible" class="modal">
        <div class="modal-content">
          <h3>Acerca tu rostro a la cámara</h3>
          <video ref="video" autoplay muted width="320" height="240"></video>
          <div style="margin-top: 10px">
            <button @click="cerrarModal" class="btn-cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { getDaysInMonth } from "date-fns";
import { useFace } from "@/composables/useFace";

const documento = ref("");
const estudianteSeleccionado = ref(null);
const diasAsistencia = ref([]);
const mensaje = ref("");
const modalVisible = ref(false);
const video = ref(null);

const hoy = new Date();
const yearActual = hoy.getFullYear();
const monthActual = hoy.getMonth();
const monthName = hoy.toLocaleString("es-ES", { month: "long" });
const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const diasMes = Array.from({ length: getDaysInMonth(hoy) }, (_, i) => i + 1);

const estudiantes = reactive(
  JSON.parse(localStorage.getItem("estudiantes") || "[]")
);
const asistencia = reactive(
  JSON.parse(localStorage.getItem("asistencia") || "[]")
);

const {
  setVideoElement,
  loadModels,
  startCamera,
  getFaceDescriptor,
  createFaceMatcher,
} = useFace();

const buscarPorDocumento = () => {
  mensaje.value = "";
  estudianteSeleccionado.value = null;
  diasAsistencia.value = [];

  const estudiante = estudiantes.find((e) => e.documento === documento.value);
  if (!estudiante) {
    mensaje.value = "No se encontró ningún estudiante con ese documento.";
    return;
  }

  estudianteSeleccionado.value = estudiante;

  const registrosMes = asistencia.filter((a) => {
    const fecha = new Date(a.fecha + "T00:00");
    return (
      a.documento === estudiante.documento &&
      fecha.getMonth() === monthActual &&
      fecha.getFullYear() === yearActual
    );
  });

  diasAsistencia.value = registrosMes.map((r) =>
    new Date(r.fecha + "T00:00").getDate()
  );
};

const abrirModalRostro = async () => {
  modalVisible.value = true;
  mensaje.value = "";

  await nextTick();
  setVideoElement(video.value);
  await loadModels();
  await startCamera();

  setTimeout(() => {
    reconocimientoFacial();
  }, 1000);
};

const cerrarModal = () => {
  modalVisible.value = false;
};

const reconocimientoFacial = async () => {
  try {
    const descriptor = await getFaceDescriptor();
    if (!descriptor) {
      mensaje.value = "No se detectó rostro.";
      return;
    }

    const matcher = createFaceMatcher(estudiantes);
    const resultado = matcher.findBestMatch(descriptor);

    if (resultado.label === "unknown") {
      mensaje.value = "Rostro no reconocido.";
      return;
    }

    const estudiante = estudiantes.find((e) => e.nombre === resultado.label);
    estudianteSeleccionado.value = estudiante;

    const registrosMes = asistencia.filter((a) => {
      const fecha = new Date(a.fecha + "T00:00");
      return (
        a.documento === estudiante.documento &&
        fecha.getMonth() === monthActual &&
        fecha.getFullYear() === yearActual
      );
    });

    diasAsistencia.value = registrosMes.map((r) =>
      new Date(r.fecha + "T00:00").getDate()
    );
  } catch {
    mensaje.value = "Ocurrió un error al reconocer el rostro.";
  }
};
</script>

<style scoped>
* {
  text-align: center;
}

.fondo {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.blur-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.08);
  z-index: 1;
  pointer-events: none;
}

.contenido {
  position: relative;
  z-index: 2;
  width: 100%;
}

h1 {
  color: white;
  font-size: clamp(1.6rem, 4vw, 12rem);
}

.consulta-container {
  width: 100%;
  padding: clamp(16px, 3vw, 24px);
}

.titulo {
  width: 100%;
}

input {
  padding: clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px);
  font-size: clamp(0.9rem, 2.2vw, 1rem);
  border-radius: clamp(4px, 1vw, 6px);
  border: 1px solid #8b7d66;
}

.botones {
  margin: 0;
}

button {
  padding: clamp(6px, 1.5vw, 10px) clamp(12px, 2.5vw, 18px);
  font-size: clamp(0.85rem, 2vw, 1.5rem);
  background: linear-gradient(135deg, #8b7d66, #6f634f);
  color: white;
  border: none;
  border-radius: clamp(4px, 1vw, 6px);
  cursor: pointer;
}

.calendario-container {
  margin-top: clamp(30px, 6vw, 50px);
  padding: clamp(20px, 4vw, 30px);
  border-radius: clamp(10px, 2vw, 14px);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  box-shadow: 0 clamp(8px, 2vw, 12px) clamp(20px, 5vw, 30px)
    rgba(0, 0, 0, 0.5);
  color: white;
}

.calendario-container h3 {
  margin-bottom: clamp(4px, 1vw, 8px);
  font-size: clamp(2rem, 8vw, 5rem);
  letter-spacing: 0.05em;
}

.calendario-container p {
  margin-bottom: clamp(12px, 3vw, 18px);
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  text-transform: capitalize;
  opacity: 0.85;
}

.calendario {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  letter-spacing: 0.06em;
  padding-bottom: clamp(6px, 1.5vw, 8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.dias-mes {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(6px, 2vw, 10px);
}

.dias-mes span {
  height: clamp(34px, 6vw, 42px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: clamp(8px, 2vw, 10px);
  background: rgba(255, 255, 255, 0.15);
  font-size: clamp(0.8rem, 2.2vw, 0.95rem);
  cursor: default;
  transition: all 0.25s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.dias-mes span:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.dias-mes span.asistio {
  background: linear-gradient(135deg, #6f624d, #f9cc02);
  box-shadow: 0 clamp(4px, 1.5vw, 6px) clamp(10px, 3vw, 14px)
    rgba(0, 0, 0, 0.4);
}

.mensaje {
  margin-top: clamp(16px, 3vw, 20px);
  font-size: clamp(0.85rem, 2.2vw, 0.95rem);
  opacity: 0.85;
}

.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.btn-cancel {
  background-color: #8b7d66;
  border: none;
  padding: clamp(8px, 2vw, 12px) clamp(14px, 3vw, 20px);
  border-radius: clamp(6px, 1.5vw, 8px);
  cursor: pointer;
}
</style>