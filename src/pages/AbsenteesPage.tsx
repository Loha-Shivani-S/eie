import React from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import { Phone } from "lucide-react";

interface AbsenteesPageProps {
  type: AttendanceType;
}

const AbsenteesPage: React.FC<AbsenteesPageProps> = ({ type }) => {
  const { getAbsentList, getStudentList, currentHour } = useAttendance();
  const title = type === "participants" ? "Participants" : "Volunteers";
  const absentees = getAbsentList(type, currentHour);
  const total = getStudentList(type).length;
  const scheduled = type === "volunteers" ? getStudentList(type, currentHour).length : total;

  return (
    <div className="px-3 sm:px-6 py-4 space-y-4 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary font-display">{title} — Absentees</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Hour {currentHour}
          </span>
          <span className="text-sm text-destructive font-medium">{absentees.length} absent</span>
          {type === "volunteers" && scheduled !== total && (
            <span className="text-xs text-muted-foreground">({scheduled} of {total} scheduled this hour)</span>
          )}
        </div>
      </div>

      {absentees.length === 0 ? (
        <div className="p-6 text-center bg-success/10 rounded-xl">
          <p className="text-success font-semibold text-lg">✓ All students are present!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {absentees.map((student, idx) => (
            <div
              key={student.rollNo}
              className="flex items-center justify-between p-3 rounded-xl border bg-card active:bg-muted/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono w-6">{idx + 1}.</span>
                  <p className="font-medium text-card-foreground text-sm truncate">{student.name}</p>
                </div>
                <div className="flex items-center gap-2 ml-8 mt-0.5">
                  <span className="text-xs text-muted-foreground font-mono">{student.rollNo}</span>
                  {student.teamName && (
                    <span className="text-xs text-primary font-medium">• {student.teamName}</span>
                  )}
                </div>
              </div>
              <a
                href={`tel:${student.phoneNumber}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium active:scale-[0.95] transition-transform shrink-0 ml-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AbsenteesPage;
