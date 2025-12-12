// src/composables/useFace.js
import * as faceapi from "face-api.js";

export function useFace() {
  let video = null; // <video> DOM real

  const setVideoElement = (videoRef) => {
    video = videoRef;
  };

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    console.log("Modelos cargados correctamente");
  };

  const startCamera = async () => {
    if (!video) {
      console.error("❌ No se encontró el elemento <video>");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = stream;
    await video.play();
  };

  const getFaceDescriptor = async () => {
    if (!video) return null;

    const result = await faceapi
      .detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) return null;
    return result.descriptor;
  };

  const createFaceMatcher = (estudiantes) => {
    const labeled = estudiantes.map((e) =>
      new faceapi.LabeledFaceDescriptors(
        e.nombre,
        [new Float32Array(e.descriptor)]
      )
    );

    return new faceapi.FaceMatcher(labeled);
  };

  return {
    setVideoElement,
    loadModels,
    startCamera,
    getFaceDescriptor,
    createFaceMatcher,
  };
}
