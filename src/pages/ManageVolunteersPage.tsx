import React, { useState, useMemo } from "react";
import { useAttendance } from "@/lib/attendanceContext";
import { Student } from "@/lib/mockData";
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const ManageVolunteersPage: React.FC = () => {
  const { getStudentList, upsertStudent, deleteStudent, loading } = useAttendance();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const volunteers = useMemo(() => getStudentList("volunteers"), [getStudentList]);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (student?: Student) => {
    setEditingStudent(student || {
      name: "",
      rollNo: "",
      phoneNumber: "",
      department: "EIE",
      year: "I",
      session: []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    if (!editingStudent.rollNo || !editingStudent.name) {
      toast.error("Roll No and Name are required!");
      return;
    }

    setIsSaving(true);
    const result = await upsertStudent(editingStudent as Omit<Student, "id">, "volunteers");
    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      handleCloseModal();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (rollNo: string) => {
    if (!confirm(`Are you sure you want to delete volunteer with Roll No: ${rollNo}?`)) return;
    
    const result = await deleteStudent(rollNo, "volunteers");
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="px-3 sm:px-6 py-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary font-display">Manage Volunteers</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or remove volunteers and their sessions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-transform active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Volunteer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Loading volunteers...</p>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 border rounded-2xl bg-muted/20 border-dashed">
          <AlertCircle className="w-10 h-10 opacity-20" />
          <p className="text-sm font-medium">No volunteers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVolunteers.map((v) => (
            <div key={v.rollNo} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-card-foreground leading-tight">{v.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{v.rollNo}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1 max-w-[120px]">
                  {v.session && v.session.length > 0 ? (
                    v.session.map(h => (
                      <span key={h} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold">
                        H{h}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] text-muted-foreground">No hours set</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground font-medium">Phone</p>
                  <p className="text-card-foreground">{v.phoneNumber}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground font-medium">Department</p>
                  <p className="text-card-foreground">{v.department} • Year {v.year}</p>
                </div>
              </div>

              <div className="flex border-t pt-3 gap-2">
                <button
                  onClick={() => handleOpenModal(v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.rollNo)}
                  className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold font-display">
                {editingStudent?.rollNo ? "Edit Volunteer" : "Add New Volunteer"}
              </h2>
              <button onClick={handleCloseModal} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent?.rollNo || ""}
                    onChange={(e) => setEditingStudent({...editingStudent!, rollNo: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    placeholder="e.g. 23EIR001"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scheduled Hours (1-10)</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          const currentSession = editingStudent?.session || [];
                          const nextSession = currentSession.includes(h)
                            ? currentSession.filter(hour => hour !== h)
                            : [...currentSession, h].sort((a, b) => a - b);
                          setEditingStudent({...editingStudent!, session: nextSession});
                        }}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                          (editingStudent?.session || []).includes(h)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/30 text-muted-foreground border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        H{h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent?.name || ""}
                  onChange={(e) => setEditingStudent({...editingStudent!, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="Student Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editingStudent?.phoneNumber || ""}
                  onChange={(e) => setEditingStudent({...editingStudent!, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="10-digit number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    required
                    value={editingStudent?.department || ""}
                    onChange={(e) => setEditingStudent({...editingStudent!, department: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    placeholder="e.g. EIE"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</label>
                  <select
                    value={editingStudent?.year || "I"}
                    onChange={(e) => setEditingStudent({...editingStudent!, year: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingStudent?.rollNo ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVolunteersPage;
