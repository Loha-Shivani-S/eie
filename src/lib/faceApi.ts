import * as faceapi from "@vladmandic/face-api";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/model/";

let modelsLoaded = false;

export const loadFaceModels = async (): Promise<void> => {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
};

export const getFaceDescriptor = async (
  input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
): Promise<Float32Array | null> => {
  const detection = await faceapi
    .detectSingleFace(input)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor ?? null;
};

export const matchFace = (
  queryDescriptor: Float32Array,
  storedDescriptors: { rollNo: string; descriptor: Float32Array }[],
  threshold = 0.5
): { rollNo: string; distance: number } | null => {
  let bestMatch: { rollNo: string; distance: number } | null = null;
  for (const stored of storedDescriptors) {
    const distance = faceapi.euclideanDistance(queryDescriptor, stored.descriptor);
    if (distance < threshold && (!bestMatch || distance < bestMatch.distance)) {
      bestMatch = { rollNo: stored.rollNo, distance };
    }
  }
  return bestMatch;
};

export { faceapi };
