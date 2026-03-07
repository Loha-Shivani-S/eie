import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Student, PARTICIPANTS, VOLUNTEERS } from "./mockData";
import { useAuth } from "./authContext";

export type AttendanceType = "participants" | "volunteers";

interface AttendanceRecord {
  roll_no: string;
  type: string;
  hour: number;
  marked_at: string;
}

interface AttendanceContextType {
  records: Record<string, AttendanceRecord>;
  getStudentList: (type: AttendanceType) => Student[];
  findStudent: (type: AttendanceType, rollNo: string) => Student | undefined;
  markPresent: (type: AttendanceType, rollNo: string, hour: number) => Promise<{ success: boolean; message: string }>;
  unmarkPresent: (type: AttendanceType, rollNo: string, hour: number) => Promise<{ success: boolean; message: string }>;
  isPresent: (type: AttendanceType, rollNo: string, hour: number) => boolean;
  getPresentList: (type: AttendanceType, hour: number) => Student[];
  getAbsentList: (type: AttendanceType, hour: number) => Student[];
  hours: number[];
  currentHour: number;
  setCurrentHour: (h: number) => void;
  hackathonDate: string;
  hourSchedule: typeof HOUR_SCHEDULE;
  getHourDetails: (hour: number) => { date: string; time: string };
  loading: boolean;
  refreshRecords: () => Promise<void>;
  hasFaceRegistered: (rollNo: string) => boolean;
}

const AttendanceContext = createContext<AttendanceContextType | null>(null);

export const useAttendance = () => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used within AttendanceProvider");
  return ctx;
};

const ALL_HOURS = Array.from({ length: 10 }, (_, i) => i + 1);
const HACKATHON_DATE = "12 - 13 Mar 2026";

export const HOUR_SCHEDULE: Record<number, { date: string; time: string }> = {
  1: { date: "12 Mar 2026", time: "9:00 AM" },
  2: { date: "12 Mar 2026", time: "9:30 AM" },
  3: { date: "12 Mar 2026", time: "10:45 AM" },
  4: { date: "12 Mar 2026", time: "1:25 PM" },
  5: { date: "12 Mar 2026", time: "4:30 PM" },
  6: { date: "12 Mar 2026", time: "8:30 PM" },
  7: { date: "12 Mar 2026", time: "10:45 PM" },
  8: { date: "13 Mar 2026", time: "12:00 AM" },
  9: { date: "13 Mar 2026", time: "6:00 AM" },
  10: { date: "13 Mar 2026", time: "8:30 AM" },
};

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
  const [currentHour, setCurrentHour] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  const [participants, setParticipants] = useState<Student[]>([]);
  const [volunteers, setVolunteers] = useState<Student[]>([]);
  const [faceRegisteredRolls, setFaceRegisteredRolls] = useState<Set<string>>(new Set());

  const makeKey = (type: string, rollNo: string, hour: number) =>
    `${type}-${hour}-${rollNo.toLowerCase()}`;

  const fetchRecords = useCallback(async () => {
    if (!user) {
      setRecords({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*");

    if (!error && data) {
      const map: Record<string, AttendanceRecord> = {};
      data.forEach((r: any) => {
        const key = makeKey(r.type === "participant" ? "participants" : "volunteers", r.roll_no, r.hour);
        map[key] = { roll_no: r.roll_no, type: r.type, hour: r.hour, marked_at: r.marked_at };
      });
      setRecords(map);
    }
    setLoading(false);
  }, [user]);

  const fetchStudents = useCallback(async () => {
    if (!user) {
      setParticipants([]);
      setVolunteers([]);
      return;
    }
    const { data, error } = await supabase.from("students").select("*");
    if (!error && data && data.length > 0) {
      const p: Student[] = [];
      const v: Student[] = [];
      data.forEach((s: any) => {
        const student: Student = {
          rollNo: s.roll_no,
          name: s.name,
          phoneNumber: s.phone_number,
          department: s.department,
          year: s.year,
          teamName: s.team_name,
        };
        if (s.type === "participant") p.push(student);
        else v.push(student);
      });
      setParticipants(p);
      setVolunteers(v);
    } else {
      // Fallback to mock data if table is empty or doesn't exist yet
      setParticipants(PARTICIPANTS);
      setVolunteers(VOLUNTEERS);
    }
  }, [user]);

  const fetchFaces = useCallback(async () => {
    if (!user) {
      setFaceRegisteredRolls(new Set());
      return;
    }
    const { data, error } = await supabase.from("face_descriptors").select("roll_no");
    if (!error && data) {
      setFaceRegisteredRolls(new Set(data.map((d: any) => d.roll_no.toLowerCase())));
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
    fetchStudents();
    fetchFaces();
  }, [fetchRecords, fetchStudents, fetchFaces]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("attendance-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance_records" }, () => {
        fetchRecords();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchRecords]);

  const getStudentList = useCallback((type: AttendanceType): Student[] => {
    return type === "participants" ? participants : volunteers;
  }, [participants, volunteers]);

  const findStudent = useCallback((type: AttendanceType, rollNo: string): Student | undefined => {
    const list = type === "participants" ? participants : volunteers;
    return list.find((s) => s.rollNo.toLowerCase() === rollNo.trim().toLowerCase());
  }, [participants, volunteers]);

  const markPresent = useCallback(
    async (type: AttendanceType, rollNo: string, hour: number) => {
      const student = findStudent(type, rollNo);
      if (!student) {
        return { success: false, message: "Student not found in database!" };
      }
      const key = makeKey(type, rollNo, hour);
      if (records[key]) {
        return { success: false, message: `${student.name} (${student.rollNo}) is already marked as present for Hour ${hour}!` };
      }
      const dbType = type === "participants" ? "participant" : "volunteer";
      const { error } = await supabase.from("attendance_records").insert({
        roll_no: student.rollNo,
        type: dbType,
        hour,
      });
      if (error) {
        return { success: false, message: `Error: ${error.message}` };
      }
      // Optimistic update
      setRecords((prev) => ({
        ...prev,
        [key]: { roll_no: student.rollNo, type: dbType, hour, marked_at: new Date().toISOString() },
      }));
      return { success: true, message: `${student.name} (${student.rollNo}) marked as present for Hour ${hour}!` };
    },
    [records, findStudent, user]
  );

  const unmarkPresent = useCallback(
    async (type: AttendanceType, rollNo: string, hour: number) => {
      const student = findStudent(type, rollNo);
      if (!student) {
        return { success: false, message: "Student not found!" };
      }
      const key = makeKey(type, rollNo, hour);
      if (!records[key]) {
        return { success: false, message: `${student.name} is not marked present for Hour ${hour}.` };
      }
      const dbType = type === "participants" ? "participant" : "volunteer";
      const { error } = await supabase
        .from("attendance_records")
        .delete()
        .eq("roll_no", student.rollNo)
        .eq("type", dbType)
        .eq("hour", hour);
      if (error) {
        return { success: false, message: `Error: ${error.message}` };
      }
      setRecords((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return { success: true, message: `${student.name} unmarked from Hour ${hour}.` };
    },
    [records, findStudent]
  );

  const isPresent = useCallback(
    (type: AttendanceType, rollNo: string, hour: number) => {
      return !!records[makeKey(type, rollNo, hour)];
    },
    [records]
  );

  const getPresentList = useCallback(
    (type: AttendanceType, hour: number): Student[] => {
      const list = getStudentList(type);
      return list.filter((s) => isPresent(type, s.rollNo, hour));
    },
    [getStudentList, isPresent]
  );

  const getAbsentList = useCallback(
    (type: AttendanceType, hour: number): Student[] => {
      const list = getStudentList(type);
      return list.filter((s) => !isPresent(type, s.rollNo, hour));
    },
    [getStudentList, isPresent]
  );

  const hasFaceRegistered = useCallback((rollNo: string) => {
    return faceRegisteredRolls.has(rollNo.toLowerCase());
  }, [faceRegisteredRolls]);

    const getHourDetails = useCallback((hour: number) => {
    return HOUR_SCHEDULE[hour] || { date: HACKATHON_DATE, time: `Hour ${hour}` };
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        records,
        getStudentList,
        findStudent,
        markPresent,
        unmarkPresent,
        isPresent,
        getPresentList,
        getAbsentList,
        hours: ALL_HOURS,
        currentHour,
        setCurrentHour,
        hackathonDate: HACKATHON_DATE,
        hourSchedule: HOUR_SCHEDULE,
        getHourDetails,
        loading,
        refreshRecords: fetchRecords,
        hasFaceRegistered,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
