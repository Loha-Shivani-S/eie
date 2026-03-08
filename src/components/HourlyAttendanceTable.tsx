import React from "react";
import { useAttendance, AttendanceType } from "@/lib/attendanceContext";
import { CheckCircle, XCircle, ScanFace } from "lucide-react";
import { toast } from "sonner";

interface HourlyAttendanceTableProps {
  type: AttendanceType;
}

const HourlyAttendanceTable: React.FC<HourlyAttendanceTableProps> = ({ type }) => {
  const { getStudentList, isPresent, hours, markPresent, unmarkPresent, hasFaceRegistered, getHourDetails } = useAttendance();
  const students = getStudentList(type);

  const handleToggle = async (rollNo: string, hour: number, currentlyPresent: boolean) => {
    if (currentlyPresent) {
      const result = await unmarkPresent(type, rollNo, hour);
      if (result.success) toast.info(result.message);
      else toast.error(result.message);
    } else {
      const result = await markPresent(type, rollNo, hour);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border bg-card -mx-3 sm:mx-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-primary/5">
            <th className="text-left p-2.5 font-semibold text-card-foreground sticky left-0 bg-primary/5 z-10 text-xs">#</th>
            <th className="text-left p-2.5 font-semibold text-card-foreground sticky left-8 bg-primary/5 z-10 text-xs min-w-[120px]">Name</th>
            <th className="text-left p-2.5 font-semibold text-card-foreground text-xs">Roll No</th>
              {hours.map((h) => {
                const details = getHourDetails(h);
                return (
                  <th key={h} className="text-center p-2.5 font-semibold text-card-foreground min-w-[70px] text-[10px] leading-tight">
                    H{h}<br />
                    <span className="text-muted-foreground font-normal whitespace-nowrap">{details.time}</span><br />
                    <span className="text-muted-foreground font-normal text-[9px]">{details.date.split(' ')[0]} {details.date.split(' ')[1]}</span>
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => {
            const isVolunteer = type === "volunteers";
            return (
              <tr key={student.rollNo} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-2.5 text-muted-foreground sticky left-0 bg-card z-10 text-xs">{idx + 1}</td>
                <td className="p-2.5 font-medium text-card-foreground sticky left-8 bg-card z-10 text-xs whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {student.name}
                    {hasFaceRegistered(student.rollNo) && (
                      <span title="Face Registered" className="flex items-center justify-center">
                        <ScanFace className="w-3.5 h-3.5 text-success" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2.5 text-muted-foreground font-mono text-xs">{student.rollNo}</td>
                {hours.map((h) => {
                  const present = isPresent(type, student.rollNo, h);
                  const isScheduled = isVolunteer ? (getStudentList("volunteers", h).some(v => v.rollNo === student.rollNo)) : true;
                  
                  return (
                    <td key={h} className={`p-2 text-center ${!isScheduled ? "bg-muted/30" : ""}`}>
                      <button
                        onClick={() => isScheduled && handleToggle(student.rollNo, h, present)}
                        disabled={!isScheduled}
                        className={`p-1 rounded-lg active:scale-90 transition-transform touch-manipulation ${!isScheduled ? "opacity-20 cursor-not-allowed" : ""}`}
                        title={!isScheduled ? "Not scheduled" : (present ? `Unmark from Hour ${h}` : `Mark present for Hour ${h}`)}
                      >
                        {present ? (
                          <CheckCircle className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive/25 mx-auto" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HourlyAttendanceTable;
