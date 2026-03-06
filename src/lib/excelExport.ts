import * as XLSX from "xlsx";
import { Student } from "./mockData";
import { AttendanceType } from "./attendanceContext";

interface ExportOptions {
  type: AttendanceType;
  hour: number;
  presentList: Student[];
  absentList: Student[];
  hackathonDate: string;
  attendanceTime: string;
}

export function exportAttendanceToExcel(options: ExportOptions) {
  const { type, hour, presentList, absentList, hackathonDate, attendanceTime } = options;
  const typeLabel = type === "participants" ? "PARTICIPANTS" : "VOLUNTEERS / CLUB MEMBERS";

  const wb = XLSX.utils.book_new();

  // Present sheet
  const presentData = presentList.map((s, i) => ({
    "S.No": i + 1,
    "Name": s.name,
    "Roll No": s.rollNo,
    "Phone Number": s.phoneNumber,
  }));

  const presentWs = XLSX.utils.aoa_to_sheet([
    ["KONGU ENGINEERING COLLEGE"],
    ["HACKATHON"],
    ["ELECTRONICS AND INSTRUMENTATION DEPARTMENT"],
    [`${hackathonDate}`],
    [`${attendanceTime}`],
    [],
    [`${typeLabel} - PRESENT LIST`],
    [],
    ["S.No", "Name", "Roll No", "Phone Number"],
    ...presentData.map((r) => [r["S.No"], r["Name"], r["Roll No"], r["Phone Number"]]),
  ]);

  // Set column widths
  presentWs["!cols"] = [{ wch: 6 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, presentWs, `Hour ${hour} - Present`);

  // Absent sheet
  const absentData = absentList.map((s, i) => ({
    "S.No": i + 1,
    "Name": s.name,
    "Roll No": s.rollNo,
    "Phone Number": s.phoneNumber,
  }));

  const absentWs = XLSX.utils.aoa_to_sheet([
    ["KONGU ENGINEERING COLLEGE"],
    ["HACKATHON"],
    ["ELECTRONICS AND INSTRUMENTATION DEPARTMENT"],
    [`${hackathonDate}`],
    [`${attendanceTime}`],
    [],
    [`${typeLabel} - ABSENTEES LIST`],
    [],
    ["S.No", "Name", "Roll No", "Phone Number"],
    ...absentData.map((r) => [r["S.No"], r["Name"], r["Roll No"], r["Phone Number"]]),
  ]);

  absentWs["!cols"] = [{ wch: 6 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, absentWs, `Hour ${hour} - Absent`);

  const fileName = `Hackathon_${typeLabel}_Hour${hour}_Attendance.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportAllHoursToExcel(
  type: AttendanceType,
  hours: number[],
  getPresentList: (type: AttendanceType, hour: number) => Student[],
  getAbsentList: (type: AttendanceType, hour: number) => Student[],
  hackathonDate: string
) {
  const typeLabel = type === "participants" ? "PARTICIPANTS" : "VOLUNTEERS / CLUB MEMBERS";
  const wb = XLSX.utils.book_new();

  hours.forEach((hour) => {
    const present = getPresentList(type, hour);
    const absent = getAbsentList(type, hour);

    const presentData = present.map((s, i) => [i + 1, s.name, s.rollNo, s.phoneNumber]);
    const absentData = absent.map((s, i) => [i + 1, s.name, s.rollNo, s.phoneNumber]);

    const ws = XLSX.utils.aoa_to_sheet([
      ["KONGU ENGINEERING COLLEGE"],
      ["HACKATHON"],
      ["ELECTRONICS AND INSTRUMENTATION DEPARTMENT"],
      [`${hackathonDate}`],
      [`Time: Hour ${hour}`],
      [],
      [`${typeLabel} - ATTENDANCE REPORT`],
      [],
      ["PRESENT LIST"],
      ["S.No", "Name", "Roll No", "Phone Number"],
      ...presentData,
      [],
      ["ABSENTEES LIST"],
      ["S.No", "Name", "Roll No", "Phone Number"],
      ...absentData,
    ]);

    ws["!cols"] = [{ wch: 6 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, `Hour ${hour}`);
  });

  XLSX.writeFile(wb, `Hackathon_${typeLabel}_All_Hours.xlsx`);
}
