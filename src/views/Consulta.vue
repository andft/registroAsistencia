<template>
  <div class="consulta-container column q-pa-md q-gutter-md q-flex q-justify-center q-align-center" style="min-height: 100svh;">
    <h2>Consulta de Asistencia</h2>

    <div class="consulta-form row q-gutter-sm q-justify-center q-align-center">
      <input
        v-model="documento"
        placeholder="Ingresa el documento del estudiante"
      />
      <button @click="buscardocumento">Buscar</button>
      <button @click="abrirmodal">Reconocimiento Facial</button>
    </div>

    <div v-if="estseleccionado" class="calendario-container column q-gutter-sm q-align-center">
      <h3>Asistencia de {{ estseleccionado.nombre }}</h3>
      <p>{{ monthName }} {{ yearActual }}</p>

      <div class="calendario column q-gutter-xs">
        <div class="dias-semana row q-gutter-xs">
          <span v-for="d in diasSemana" :key="d">{{ d }}</span>
        </div>
        <div class="dias-mes row q-gutter-xs">
          <span
            v-for="(dia, index) in diasMes"
            :key="index"
            :class="{ asistio: diasdeasistencia.includes(dia) }"
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
      <div class="modal-content column q-pa-md q-gutter-sm q-align-center q-justify-center">
        <h3>Acerca tu rostro a la cámara</h3>

        <video
          ref="video"
          autoplay
          muted
          playsinline
          width="320"
          height="240"
        ></video>

        <div>
          <button @click="cerrarmodal" class="btn-cancel">Cancelar</button>
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
const estseleccionado = ref(null);
const diasdeasistencia = ref([]);
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

// Métodos importados del módulo facial
const {
  setVideoElement,
  loadModels,
  startCamera,
  getFaceDescriptor,
  createFaceMatcher,
} = useFace();

// Busqueda estudiante por documento
const buscardocumento = () => {
  mensaje.value = "";
  estseleccionado.value = null;
  diasdeasistencia.value = [];

  const estudiante = estudiantes.find((e) => e.documento === documento.value);

  if (!estudiante) {
    mensaje.value = "No se encontró ningún estudiante con ese documento.";
    return;
  }

  estseleccionado.value = estudiante;

  const mesregistrado = asistencia.filter((a) => {
    const fecha = new Date(a.fecha + "T00:00");
    return (
      a.documento === estudiante.documento &&
      fecha.getMonth() === monthActual &&
      fecha.getFullYear() === yearActual
    );
  });

  diasdeasistencia.value = mesregistrado.map((r) =>
    new Date(r.fecha + "T00:00").getDate()
  );
};

const abrirmodal = async () => {
  mensaje.value = "";
  modalVisible.value = true;

  await nextTick();
  await nextTick();

  if (!video.value) {
    console.error("VIDEO ES NULL");
    return;
  }

  setVideoElement(video.value);

  await startCamera();
  await loadModels();

  setTimeout(() => reconocimientofacial(), 1200);
};

const cerrarmodal = () => {
  modalVisible.value = false;
};

// Reconocimiento facial y carga
const reconocimientofacial = async () => {
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
    estseleccionado.value = estudiante;

    const mesregistrado = asistencia.filter((a) => {
      const fecha = new Date(a.fecha + "T00:00");
      return (
        a.documento === estudiante.documento &&
        fecha.getMonth() === monthActual &&
        fecha.getFullYear() === yearActual
      );
    });

    diasdeasistencia.value = mesregistrado.map((r) =>
      new Date(r.fecha + "T00:00").getDate()
    );
  } catch (error) {
    console.error(error);
    mensaje.value = "Ocurrió un error al reconocer el rostro.";
  }
};
</script>


<style scoped>
.consulta-container {
  max-width: 600px;
  margin: auto;
}

input {
  padding: 6px 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #8b7d66;
}

button {
  padding: 6px 12px;
  background-color: #8b7d66;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #72694f;
}

.dias-mes span {
  padding: 5px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.dias-mes span.asistio {
  background-color: #8b7d66;
  color: white;
  font-weight: bold;
}

.mensaje {
  margin-top: 20px;
  font-style: italic;
  color: #333;
}

.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 25px 35px;
  border-radius: 8px;
  text-align: center;
  max-width: 350px;
}

.btn-cancel {
  background-color: #8b7d66;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
