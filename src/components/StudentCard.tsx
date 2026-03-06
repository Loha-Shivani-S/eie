import React from "react";
import { Student } from "@/lib/mockData";
import { CheckCircle, UserPlus, Loader2 } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onMarkPresent?: () => void;
  isPresent?: boolean;
  showMarkButton?: boolean;
  disabled?: boolean;
  hasFaceRegistered?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onMarkPresent, isPresent, showMarkButton = true, disabled, hasFaceRegistered }) => {
  return (
    <div className="p-4 rounded-xl border-2 bg-card animate-fade-in space-y-3">
      <div className="space-y-1">
        <p className="font-bold text-lg text-card-foreground">{student.name}</p>
        <p className="text-sm text-muted-foreground font-mono">{student.rollNo}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
          {student.department}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
          Year {student.year}
        </span>
        {student.teamName && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
            {student.teamName}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">📞 {student.phoneNumber}</p>
        {hasFaceRegistered && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success font-semibold text-xs text-right whitespace-nowrap">
            <CheckCircle className="w-3.5 h-3.5" /> Face Registered
          </span>
        )}
      </div>
      
      {showMarkButton && (
        isPresent ? (
          <div className="flex items-center gap-2 text-success font-semibold text-sm bg-success/10 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5" />
            Already Marked Present
          </div>
        ) : (
          <button
            onClick={onMarkPresent}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.97] transition-transform disabled:opacity-50"
          >
            {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {disabled ? "Marking..." : "Mark Present"}
          </button>
        )
      )}
    </div>
  );
};

export default StudentCard;
