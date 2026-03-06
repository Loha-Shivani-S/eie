import React, { useState } from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import { toast } from "sonner";
import StudentCard from "./StudentCard";
import { Student } from "@/lib/mockData";
import { Search, Keyboard } from "lucide-react";

interface AttendanceMarkerProps {
  type: AttendanceType;
}

const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({ type }) => {
  const { findStudent, markPresent, isPresent, currentHour, hasFaceRegistered } = useAttendance();
  const [rollNoInput, setRollNoInput] = useState("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [marking, setMarking] = useState(false);

  const handleSearch = () => {
    if (!rollNoInput.trim()) return;
    const student = findStudent(type, rollNoInput.trim());
    if (student) {
      setFoundStudent(student);
    } else {
      toast.error("Student not found in database!");
      setFoundStudent(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMarkPresent = async (rollNo: string) => {
    setMarking(true);
    const result = await markPresent(type, rollNo, currentHour);
    if (result.success) {
      toast.success(result.message);
      setFoundStudent(null);
      setRollNoInput("");
    } else {
      toast.error(result.message);
    }
    setMarking(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={rollNoInput}
              onChange={(e) => setRollNoInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Enter Roll Number"
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              autoComplete="off"
              autoCapitalize="characters"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
          >
            Search
          </button>
        </div>
      </div>

      {foundStudent && (
        <StudentCard
          student={foundStudent}
          isPresent={isPresent(type, foundStudent.rollNo, currentHour)}
          onMarkPresent={() => handleMarkPresent(foundStudent.rollNo)}
          disabled={marking}
          hasFaceRegistered={hasFaceRegistered(foundStudent.rollNo)}
        />
      )}
    </div>
  );
};

export default AttendanceMarker;
