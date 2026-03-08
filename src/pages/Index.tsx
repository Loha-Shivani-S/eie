import React from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, ClipboardList, BarChart3, ScanFace } from "lucide-react";
import { useAttendance } from "@/lib/attendanceContext";

const Index: React.FC = () => {
  const { getStudentList, getPresentList, currentHour } = useAttendance();

  const pTotal = getStudentList("participants").length;
  const pPresent = getPresentList("participants", currentHour).length;
  const vTotal = getStudentList("volunteers", currentHour).length;
  const vPresent = getPresentList("volunteers", currentHour).length;

  return (
    <div className="px-3 sm:px-6 py-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-display">CALIBRIX</h1>
        <p className="text-sm text-muted-foreground">
          Kongu Engineering College — EIE Department
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold font-display">
          <BarChart3 className="w-4 h-4" />
          Hour {currentHour}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Participants" value={pTotal} sub={`${pPresent} present`} />
        <StatCard label="Absent (P)" value={pTotal - pPresent} sub="this hour" color="destructive" />
        <StatCard label="Volunteers" value={vTotal} sub={`${vPresent} present`} />
        <StatCard label="Absent (V)" value={vTotal - vPresent} sub="this hour" color="destructive" />
      </div>

      <div className="space-y-3">
        <QuickLink
          href="/capture-faces"
          icon={ScanFace}
          title="Capture Faces"
          desc="Register participant faces"
          stat="→"
        />
        <QuickLink
          href="/participants"
          icon={Users}
          title="Participants"
          desc="Mark attendance"
          stat={`${pPresent}/${pTotal}`}
        />
        <QuickLink
          href="/volunteers"
          icon={UserCheck}
          title="Volunteers"
          desc="Mark attendance"
          stat={`${vPresent}/${vTotal}`}
        />
        <QuickLink
          href="/participants/absentees"
          icon={ClipboardList}
          title="Absent Participants"
          desc="View & call"
          stat={`${pTotal - pPresent}`}
          variant="destructive"
        />
        <QuickLink
          href="/volunteers/absentees"
          icon={ClipboardList}
          title="Absent Volunteers"
          desc="View & call"
          stat={`${vTotal - vPresent}`}
          variant="destructive"
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, color }: { label: string; value: number; sub: string; color?: string }) => (
  <div className="p-4 rounded-xl border bg-card space-y-1">
    <p className={`text-3xl font-bold font-display ${color === "destructive" ? "text-destructive" : "text-card-foreground"}`}>
      {value}
    </p>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
    <p className="text-xs text-muted-foreground">{sub}</p>
  </div>
);

const QuickLink = ({ href, icon: Icon, title, desc, stat, variant }: {
  href: string; icon: React.FC<{ className?: string }>; title: string; desc: string; stat: string; variant?: string;
}) => (
  <Link
    to={href}
    className="flex items-center gap-3 p-4 rounded-xl border bg-card active:bg-muted/50 transition-colors"
  >
    <div className={`p-2.5 rounded-xl ${variant === "destructive" ? "bg-destructive/10" : "bg-primary/10"}`}>
      <Icon className={`w-5 h-5 ${variant === "destructive" ? "text-destructive" : "text-primary"}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-card-foreground text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <span className={`text-lg font-bold font-display ${variant === "destructive" ? "text-destructive" : "text-primary"}`}>
      {stat}
    </span>
  </Link>
);

export default Index;
