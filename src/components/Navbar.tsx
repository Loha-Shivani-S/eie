import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAttendance } from "@/lib/attendanceContext";
import { useAuth } from "@/lib/authContext";
import { Home, Users, UserCheck, UserX, Menu, X, ChevronLeft, ChevronRight, LogOut, ScanFace, UserPlus } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentHour, hours, setCurrentHour } = useAttendance();
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/capture-faces", label: "Faces", icon: ScanFace },
    { path: "/participants", label: "Participants", icon: Users },
    { path: "/participants/absentees", label: "Absent (P)", icon: UserX },
    { path: "/volunteers", label: "Volunteers", icon: UserCheck },
    { path: "/volunteers/absentees", label: "Absent (V)", icon: UserX },
    { path: "/manage-volunteers", label: "Manage Volunteers", icon: UserPlus },
    { path: "/manage-participants", label: "Manage Participants", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-3 h-14">
        <Link to="/" className="font-display text-sm font-bold text-primary shrink-0 tracking-tight">
          CALIBRIX
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted active:scale-95 transition-transform"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Hour selector */}
      <div className="flex items-center gap-1 px-3 py-2 border-t bg-muted/30">
        <span className="text-xs text-muted-foreground font-medium shrink-0 mr-1">Hour:</span>
        <button
          onClick={() => setCurrentHour(Math.max(1, currentHour - 1))}
          className="p-1 rounded text-muted-foreground hover:bg-muted active:scale-90 transition-transform shrink-0"
          disabled={currentHour === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {hours.map((h) => (
            <button
              key={h}
              onClick={() => setCurrentHour(h)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all active:scale-90 shrink-0 ${
                currentHour === h
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-muted border"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentHour(Math.min(12, currentHour + 1))}
          className="p-1 rounded text-muted-foreground hover:bg-muted active:scale-90 transition-transform shrink-0"
          disabled={currentHour === 12}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-card px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium transition-colors active:scale-[0.98] ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
