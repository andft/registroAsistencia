<template>
  <div>
    <h2>Registro y Asistencia Facial</h2>
    <video ref="video" width="320" height="240" autoplay muted></video>
    <div>
      <input v-model="nombre" placeholder="Nombre del estudiante" />
      <button @click="registrarEstudiante">Registrar Estudiante</button>
      <button @click="marcarAsistencia">Marcar Asistencia</button>
    </div>
    <h3>Asistencia del día</h3>
    <ul>
      <li v-for="s in asistenciaHoy" :key="s.nombre">{{ s.nombre }} ✅</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import * as faceapi from 'face-api.js';

const video = ref(null);
const nombre = ref('');

const estudiantes = reactive(JSON.parse(localStorage.getItem('estudiantes') || '[]'));
const asistencia = reactive(JSON.parse(localStorage.getItem('asistencia') || '[]'));

const asistenciaHoy = computed(() => {
  const hoy = new Date().toISOString().split('T')[0];
  return asistencia.filter(a => a.fecha === hoy);
});

// Cargar modelos de face-api.js
const cargarModelos = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
};

// Iniciar cámara
const iniciarCamara = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.value.srcObject = stream;
};

// Registrar estudiante
const registrarEstudiante = async () => {
  if (!nombre.value) return alert('Ingresa un nombre');
  const detecciones = await faceapi.detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  if (!detecciones) return alert('No se detectó rostro');
  
  estudiantes.push({
    nombre: nombre.value,
    descriptor: Array.from(detecciones.descriptor),
  });
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
  alert(`${nombre.value} registrado con éxito`);
  nombre.value = '';
};

// Marcar asistencia
const marcarAsistencia = async () => {
  const deteccion = await faceapi.detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  if (!deteccion) return alert('No se detectó rostro');

  const matcher = new faceapi.FaceMatcher(estudiantes.map(e => new faceapi.LabeledFaceDescriptors(e.nombre, [new Float32Array(e.descriptor)])));
  const resultado = matcher.findBestMatch(deteccion.descriptor);

  if (resultado.label !== 'unknown') {
    const hoy = new Date().toISOString().split('T')[0];
    if (!asistencia.find(a => a.nombre === resultado.label && a.fecha === hoy)) {
      asistencia.push({ nombre: resultado.label, fecha: hoy });
      localStorage.setItem('asistencia', JSON.stringify(asistencia));
      alert(`Asistencia registrada para ${resultado.label}`);
    } else {
      alert(`${resultado.label} ya tiene asistencia hoy`);
    }
  } else {
    alert('Rostro no reconocido');
  }
};

onMounted(async () => {
  await cargarModelos();
  await iniciarCamara();
});
</script>

<style scoped>
video {
  border: 2px solid #333;
  margin-bottom: 10px;
}
input {
  margin-right: 5px;
}
</style>
