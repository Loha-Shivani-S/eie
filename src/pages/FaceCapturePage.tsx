import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/authContext";
import { loadFaceModels, getFaceDescriptor } from "@/lib/faceApi";
import { toast } from "sonner";
import { Student } from "@/lib/mockData";
import { Camera, CheckCircle2, Loader2, Search, RefreshCw, Users, UserCheck, FlipHorizontal } from "lucide-react";

const FaceCapturePage: React.FC = () => {
  const { getStudentList, findStudent } = useAttendance();
  const { user } = useAuth();
  const [type, setType] = useState<AttendanceType>("participants");
  const [modelsReady, setModelsReady] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [rollNoInput, setRollNoInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [capturedRolls, setCapturedRolls] = useState<Set<string>>(new Set());
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadFaceModels()
      .then(() => {
        setModelsReady(true);
        setLoadingModels(false);
      })
      .catch(() => {
        toast.error("Failed to load face detection models");
        setLoadingModels(false);
      });
  }, []);

  // Fetch already captured roll numbers
  useEffect(() => {
    const fetchCaptured = async () => {
      const { data } = await supabase
        .from("face_descriptors")
        .select("roll_no")
        .eq("type", type === "participants" ? "participant" : "volunteer");
      if (data) {
        setCapturedRolls(new Set(data.map((d: any) => d.roll_no.toLowerCase())));
      }
    };
    fetchCaptured();
  }, [type]);

  const startCamera = useCallback(async (mode: "user" | "environment" = "user") => {
    try {
      // Stop existing stream first
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 640 }, height: { ideal: 480 } },
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

  const flipCamera = useCallback(() => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleSearch = () => {
    if (!rollNoInput.trim()) return;
    setCapturing(false);
    const student = findStudent(type, rollNoInput.trim());
    if (student) {
      setSelectedStudent(student);
    } else {
      toast.error("Student not found!");
      setSelectedStudent(null);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !selectedStudent || !modelsReady) return;
    setCapturing(true);

    try {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) {
        toast.error("No face detected. Please position your face clearly in the camera.");
        setCapturing(false);
        return;
      }

      const dbType = type === "participants" ? "participant" : "volunteer";
      const descriptorArray = Array.from(descriptor);

      const { error } = await supabase.from("face_descriptors").upsert(
        {
          roll_no: selectedStudent.rollNo,
          type: dbType,
          descriptor: descriptorArray,
        },
        { onConflict: "roll_no,type" }
      );

      if (error) {
        toast.error(`Error saving: ${error.message}`);
      } else {
        toast.success(`Face captured for ${selectedStudent.name} (${selectedStudent.rollNo})`);
        setCapturedRolls((prev) => new Set(prev).add(selectedStudent.rollNo.toLowerCase()));
        setSelectedStudent(null);
        setRollNoInput("");
      }
    } catch (err) {
      toast.error("Face detection failed. Try again.");
    }
    setCapturing(false);
  };

  const students = getStudentList(type);
  const capturedCount = students.filter((s) => capturedRolls.has(s.rollNo.toLowerCase())).length;

  return (
    <div className="px-3 sm:px-6 py-4 space-y-4 max-w-screen-xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary font-display">Face Capture</h1>
        <p className="text-sm text-muted-foreground">Capture participant faces for recognition-based attendance</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { setType("participants"); setSelectedStudent(null); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${type === "participants" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"
            }`}
        >
          <Users className="w-4 h-4" /> Participants
        </button>
        <button
          onClick={() => { setType("volunteers"); setSelectedStudent(null); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${type === "volunteers" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"
            }`}
        >
          <UserCheck className="w-4 h-4" /> Volunteers
        </button>
      </div>

      {/* Progress */}
      <div className="p-3 rounded-xl border bg-card">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Faces captured</span>
          <span className="font-bold font-display text-primary">{capturedCount}/{students.length}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${students.length > 0 ? (capturedCount / students.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {loadingModels ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading face detection models...</span>
        </div>
      ) : (
        <>
          {/* Roll number search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={rollNoInput}
                onChange={(e) => setRollNoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter Roll Number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              />
            </div>
            <button onClick={handleSearch} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
              Search
            </button>
          </div>

          {selectedStudent && (
            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-card-foreground">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.rollNo} • {selectedStudent.department} • Year {selectedStudent.year}</p>
                  {selectedStudent.teamName && <p className="text-xs text-primary font-medium mt-0.5">Team: {selectedStudent.teamName}</p>}
                </div>
                {capturedRolls.has(selectedStudent.rollNo.toLowerCase()) && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                  playsInline
                  muted
                />
                
                {/* Face Guide Overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-[60%] h-[70%] max-w-[250px] max-h-[350px]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <ellipse cx="50" cy="50" rx="45" ry="48" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                        <ellipse cx="50" cy="50" rx="45" ry="48" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.5" />
                      </svg>
                      <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <span className="text-white/90 text-xs font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Position face within oval</span>
                      </div>
                    </div>
                  </div>
                )}

                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => startCamera(facingMode)}
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
                    onClick={handleCapture}
                    disabled={capturing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
                  >
                    {capturing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</>
                    ) : (
                      <><Camera className="w-4 h-4" /> Capture Face</>
                    )}
                  </button>
                  <button
                    onClick={flipCamera}
                    title="Flip Camera"
                    className="px-3 py-3 rounded-xl border text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-3 rounded-xl border text-muted-foreground text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Student list with capture status */}
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground font-display text-sm">
              {type === "participants" ? "Participants" : "Volunteers"} — Capture Status
            </h2>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto">
              {students.map((s) => {
                const captured = capturedRolls.has(s.rollNo.toLowerCase());
                return (
                  <button
                    key={s.rollNo}
                    onClick={() => { setSelectedStudent(s); setRollNoInput(s.rollNo); setCapturing(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedStudent?.rollNo === s.rollNo ? "bg-primary/10 border border-primary/30" : "bg-card border hover:bg-muted/50"
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${captured ? "bg-primary" : "bg-muted-foreground/30"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                    </div>
                    {captured && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaceCapturePage;
