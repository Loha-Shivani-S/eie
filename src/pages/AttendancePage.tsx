import React, { useState } from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import AttendanceMarker from "@/components/AttendanceMarker";
import FaceRecognitionMarker from "@/components/FaceRecognitionMarker";
import HourlyAttendanceTable from "@/components/HourlyAttendanceTable";
import { exportAttendanceToExcel, exportAllHoursToExcel } from "@/lib/excelExport";
import { Download, FileSpreadsheet, Keyboard, ScanFace } from "lucide-react";

interface AttendancePageProps {
  type: AttendanceType;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ type }) => {
  const { getPresentList, getAbsentList, getStudentList, currentHour, hours, hackathonDate, getHourDetails } = useAttendance();
  const [mode, setMode] = useState<"manual" | "face">("manual");
  const hourDetails = getHourDetails(currentHour);
  const title = type === "participants" ? "Participants" : "Volunteers";
  const total = getStudentList(type).length;
  const presentCount = getPresentList(type, currentHour).length;
  const absentCount = getAbsentList(type, currentHour).length;
  const scheduledCount = type === "volunteers" ? (presentCount + absentCount) : total;

  const handleExportCurrentHour = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    exportAttendanceToExcel({
      type,
      hour: currentHour,
      presentList: getPresentList(type, currentHour),
      absentList: getAbsentList(type, currentHour),
    });
  };

  const handleExportAllHours = () => {
    exportAllHoursToExcel(type, hours, getPresentList, getAbsentList, hackathonDate);
  };

  return (
    <div className="px-3 sm:px-6 py-4 space-y-4 max-w-screen-xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary font-display">{title} Attendance</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
            Hour {currentHour} • {hourDetails.time} ({hourDetails.date})
          </span>
          <span className="text-success font-medium">{presentCount} present</span>
          <span className="text-destructive font-medium">{absentCount} absent</span>
          {type === "volunteers" && (
            <span className="text-muted-foreground text-xs font-medium">({scheduledCount} of {total} scheduled)</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleExportCurrentHour}
          className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border bg-card text-card-foreground text-sm font-medium active:scale-[0.97] transition-transform"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span> Hour {currentHour}
        </button>
        <button
          onClick={handleExportAllHours}
          className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium active:scale-[0.97] transition-transform"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="p-4 rounded-xl border bg-card space-y-3">
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-card-foreground font-display text-base">
            Mark Attendance — Hour {currentHour} ({hourDetails.time})
          </h2>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setMode("manual")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === "manual" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Keyboard className="w-3 h-3" /> Manual
            </button>
            <button
              onClick={() => setMode("face")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === "face" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <ScanFace className="w-3 h-3" /> Face
            </button>
          </div>
        </div>
        {mode === "manual" ? <AttendanceMarker type={type} /> : <FaceRecognitionMarker type={type} />}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground font-display text-base">Hourly Overview</h2>
        <HourlyAttendanceTable type={type} />
      </div>
    </div>
  );
};

export default AttendancePage;
