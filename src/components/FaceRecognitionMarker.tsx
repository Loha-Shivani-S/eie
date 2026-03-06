import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import { supabase } from "@/integrations/supabase/client";
import { loadFaceModels, getFaceDescriptor, matchFace } from "@/lib/faceApi";
import { toast } from "sonner";
import StudentCard from "./StudentCard";
import { Camera, Loader2, ScanFace, CameraOff } from "lucide-react";

interface FaceRecognitionMarkerProps {
  type: AttendanceType;
}

interface StoredDescriptor {
  rollNo: string;
  descriptor: Float32Array;
}

const FaceRecognitionMarker: React.FC<FaceRecognitionMarkerProps> = ({ type }) => {
  const { findStudent, markPresent, isPresent, currentHour, hasFaceRegistered } = useAttendance();
  const [modelsReady, setModelsReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [storedDescriptors, setStoredDescriptors] = useState<StoredDescriptor[]>([]);
  const [matchedStudent, setMatchedStudent] = useState<ReturnType<typeof findStudent>>(undefined);
  const [marking, setMarking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadFaceModels()
      .then(() => { setModelsReady(true); setLoadingModels(false); })
      .catch(() => { toast.error("Failed to load face models"); setLoadingModels(false); });
  }, []);

  // Load stored face descriptors
  useEffect(() => {
    const fetchDescriptors = async () => {
      const dbType = type === "participants" ? "participant" : "volunteer";
      const { data } = await supabase
        .from("face_descriptors")
        .select("roll_no, descriptor")
        .eq("type", dbType);
      if (data) {
        setStoredDescriptors(
          data.map((d: any) => ({
            rollNo: d.roll_no,
            descriptor: new Float32Array(d.descriptor as number[]),
          }))
        );
      }
    };
    fetchDescriptors();
  }, [type]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      toast.error("Could not access camera");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setMatchedStudent(undefined);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleScan = async () => {
    if (!videoRef.current || !modelsReady) return;
    if (storedDescriptors.length === 0) {
      toast.error("No face data found. Please capture faces first.");
      return;
    }
    setScanning(true);
    setMatchedStudent(undefined);

    try {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) {
        toast.error("No face detected. Try again.");
        setScanning(false);
        return;
      }

      const match = matchFace(descriptor, storedDescriptors, 0.5);
      if (match) {
        const student = findStudent(type, match.rollNo);
        if (student) {
          setMatchedStudent(student);
          toast.success(`Matched: ${student.name} (${(1 - match.distance).toFixed(0)}% confidence)`);
        } else {
          toast.error("Face matched but student details not found");
        }
      } else {
        toast.error("Not exist (Face not recognized in database)");
      }
    } catch {
      toast.error("Recognition failed. Try again.");
    }
    setScanning(false);
  };

  const handleMarkPresent = async (rollNo: string) => {
    setMarking(true);
    const result = await markPresent(type, rollNo, currentHour);
    if (result.success) {
      toast.success(result.message);
      setMatchedStudent(undefined);
    } else {
      toast.error(result.message);
    }
    setMarking(false);
  };

  if (loadingModels) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading face recognition...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {storedDescriptors.length} face(s) in database
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3]">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        {!cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              <Camera className="w-5 h-5" /> Open Camera
            </button>
          </div>
        )}
      </div>

      {cameraActive && (
        <div className="flex gap-2">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
          >
            {scanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
            ) : (
              <><ScanFace className="w-4 h-4" /> Recognize Face</>
            )}
          </button>
          <button
            onClick={stopCamera}
            className="px-4 py-3 rounded-xl border text-muted-foreground text-sm font-medium"
          >
            <CameraOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {matchedStudent && (
        <StudentCard
          student={matchedStudent}
          isPresent={isPresent(type, matchedStudent.rollNo, currentHour)}
          onMarkPresent={() => handleMarkPresent(matchedStudent.rollNo)}
          disabled={marking}
          hasFaceRegistered={hasFaceRegistered(matchedStudent.rollNo)}
        />
      )}
    </div>
  );
};

export default FaceRecognitionMarker;
