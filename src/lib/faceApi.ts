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

/**
 * Checks if the lighting is sufficient for face recognition
 * by calculating the average brightness of the input.
 */
export const checkLightingCondition = (
  input: HTMLVideoElement | HTMLCanvasElement
): { isPoor: boolean; brightness: number } => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { isPoor: false, brightness: 100 };

  ctx.drawImage(input, 0, 0, 100, 100);
  const imageData = ctx.getImageData(0, 0, 100, 100);
  const data = imageData.data;
  
  let r, g, b, avg;
  let colorSum = 0;

  for (let x = 0, len = data.length; x < len; x += 4) {
    r = data[x];
    g = data[x + 1];
    b = data[x + 2];
    avg = Math.floor((r + g + b) / 3);
    colorSum += avg;
  }

  const brightness = Math.floor(colorSum / (canvas.width * canvas.height));
  // Threshold 60 is generally "dimly lit"
  return { isPoor: brightness < 60, brightness };
};

export const getFaceDescriptor = async (
  input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
): Promise<{ descriptor: Float32Array | null; error?: string }> => {
  // Check for multiple faces
  const detections = await faceapi
    .detectAllFaces(input)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length > 1) {
    return { descriptor: null, error: "Multiple faces detected. Please scan only one person." };
  }

  if (detections.length === 0) {
    return { descriptor: null };
  }

  return { descriptor: detections[0].descriptor };
};

// threshold = 0.3 (Strict)
export const FACE_MATCH_THRESHOLD = 0.3;

export const matchFace = (
  queryDescriptor: Float32Array,
  storedDescriptors: { rollNo: string; descriptor: Float32Array }[],
  threshold = FACE_MATCH_THRESHOLD
): { rollNo: string; distance: number } | null => {
  let bestMatch: { rollNo: string; distance: number } | null = null;
  
  for (const stored of storedDescriptors) {
    // Safety check: Ensure stored descriptor is a Float32Array
    // Some databases return descriptors as standard arrays or JSON
    const storedDescriptor = stored.descriptor instanceof Float32Array 
      ? stored.descriptor 
      : new Float32Array(Array.from(stored.descriptor).map(Number));

    const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);
    if (distance < threshold && (!bestMatch || distance < bestMatch.distance)) {
      bestMatch = { rollNo: stored.rollNo, distance };
    }
  }
  return bestMatch;
};

export { faceapi };
