import React, { useState } from 'react';
import {
  Teacher,
  SchoolClass,
  Subject,
  Schedule,
  Student,
  AttendanceClassSession,
  AttendanceStatusClass,
  StudentGrade,
  Announcement
} from '../types';
import { getTodayDateString } from '../data/initialData';
import { Storage } from '../utils/storage';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  Plus,
  Save,
  Check,
  AlertCircle,
  Bell,
  Users,
  Award,
  Filter
} from 'lucide-react';

interface Props {
  teacher: Teacher;
  classes: SchoolClass[];
  subjects: Subject[];
  schedules: Schedule[];
  students: Student[];
  classAttendances: AttendanceClassSession[];
  grades: StudentGrade[];
  announcements: Announcement[];
  onClassAttendanceUpdate: (updated: AttendanceClassSession[]) => void;
  onGradesUpdate: (updated: StudentGrade[]) => void;
  onAnnouncementsUpdate: (updated: Announcement[]) => void;
}

export const GuruDashboard: React.FC<Props> = ({
  teacher,
  classes,
  subjects,
  schedules,
  students,
  classAttendances,
  grades,
  announcements,
  onClassAttendanceUpdate,
  onGradesUpdate,
  onAnnouncementsUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'absensi_kbm' | 'jadwal' | 'penilaian' | 'pengumuman'>('absensi_kbm');

  // CRITICAL REQUIREMENT: Filter ONLY schedules and subjects assigned to THIS teacher!
  // "mata pelajaran secara otomatis masuk saat admin untuk jadwal pelajaran sesuai dengan nama guru untuk pelajaran guru yang lain tidak akan muncul"
  const mySchedules = schedules.filter((s) => s.teacherId === teacher.id);

  // Available classes for this teacher
  const myClassIds = Array.from(new Set(mySchedules.map((s) => s.kelasId)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  // Available subjects for this teacher
  const mySubjectIds = Array.from(new Set(mySchedules.map((s) => s.subjectId)));
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  // FORM ABSENSI KBM STATE
  const [selectedClassId, setSelectedClassId] = useState(myClasses[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(mySubjects[0]?.id || '');
  const [materiAjar, setMateriAjar] = useState('');
  const [kbmDate, setKbmDate] = useState(getTodayDateString());
  const [kbmJam, setKbmJam] = useState('07:30 - 09:00');
  const [kbmStatusMap, setKbmStatusMap] = useState<Record<string, { status: AttendanceStatusClass; catatan: string }>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Students in selected class
  const classStudents = students.filter(
    (s) => s.kelasId === selectedClassId && s.status === 'aktif'
  );

  // Initialize status for each student
  const getStudentStatus = (studentId: string): AttendanceStatusClass => {
    return kbmStatusMap[studentId]?.status || 'hadir';
  };

  const getStudentCatatan = (studentId: string): string => {
    return kbmStatusMap[studentId]?.catatan || '';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatusClass) => {
    setKbmStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        catatan: prev[studentId]?.catatan || ''
      }
    }));
  };

  const handleCatatanChange = (studentId: string, catatan: string) => {
    setKbmStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'hadir',
        catatan
      }
    }));
  };

  // Save KBM Attendance Session
  const handleSaveKbmAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSubjectId || !materiAjar.trim()) return;

    // Find schedule ID if matching
    const sched = mySchedules.find(
      (s) => s.kelasId === selectedClassId && s.subjectId === selectedSubjectId
    );

    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: getStudentStatus(s.id),
      catatan: getStudentCatatan(s.id)
    }));

    const newSession: AttendanceClassSession = {
      id: `acs-${Date.now()}`,
      scheduleId: sched?.id || `sch-auto-${selectedClassId}-${selectedSubjectId}`,
      teacherId: teacher.id,
      subjectId: selectedSubjectId,
      kelasId: selectedClassId,
      tanggal: kbmDate,
      jam: kbmJam,
      materiAjar: materiAjar.trim(),
      createdAt: new Date().toISOString(),
      records
    };

    const updated = [newSession, ...classAttendances];
    Storage.setClassAttendance(updated);
    onClassAttendanceUpdate(updated);

    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 4000);
  };

  // GRADES STATE
  const [gradeClassId, setGradeClassId] = useState(myClasses[0]?.id || '');
  const [gradeSubjectId, setGradeSubjectId] = useState(mySubjects[0]?.id || '');
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Local draft of grades being edited
  const [gradeInputs, setGradeInputs] = useState<
    Record<
      string,
      {
        tugas1: number;
        tugas2: number;
        uts: number;
        uas: number;
        nilaiRaport: number;
        capaian: string;
      }
    >
  >({});

  const gradeStudents = students.filter(
    (s) => s.kelasId === gradeClassId && s.status === 'aktif'
  );

  // Load existing grades into draft when selecting class/subject
  const getGradeForStudent = (studentId: string) => {
    if (gradeInputs[studentId]) return gradeInputs[studentId];

    const existing = grades.find(
      (g) =>
        g.studentId === studentId &&
        g.subjectId === gradeSubjectId &&
        g.kelasId === gradeClassId
    );

    if (existing) {
      return {
        tugas1: existing.tugas1,
        tugas2: existing.tugas2,
        uts: existing.uts,
        uas: existing.uas,
        nilaiRaport: existing.nilaiRaport,
        capaian: existing.capaianKompetensi || ''
      };
    }

    return {
      tugas1: 80,
      tugas2: 80,
      uts: 80,
      uas: 80,
      nilaiRaport: 80,
      capaian: 'Menunjukkan pemahaman yang baik.'
    };
  };

  const handleGradeFieldChange = (
    studentId: string,
    field: 'tugas1' | 'tugas2' | 'uts' | 'uas' | 'nilaiRaport' | 'capaian',
    val: any
  ) => {
    const current = getGradeForStudent(studentId);
    const updatedStudent = {
      ...current,
      [field]: field === 'capaian' ? val : Number(val) || 0
    };

    // Auto-calculate Nilai Raport if changing tests: Tugas 30%, UTS 30%, UAS 40%
    if (field !== 'nilaiRaport' && field !== 'capaian') {
      const avgTugas = (updatedStudent.tugas1 + updatedStudent.tugas2) / 2;
      const calc = Math.round(avgTugas * 0.3 + updatedStudent.uts * 0.3 + updatedStudent.uas * 0.4);
      updatedStudent.nilaiRaport = calc;
    }

    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: updatedStudent
    }));
  };

  const handleSaveAllGrades = () => {
    let updatedGrades = [...grades];

    gradeStudents.forEach((student) => {
      const data = getGradeForStudent(student.id);
      const predikat =
        data.nilaiRaport >= 90
          ? 'A'
          : data.nilaiRaport >= 80
          ? 'B'
          : data.nilaiRaport >= 70
          ? 'C'
          : 'D';

      const existingIndex = updatedGrades.findIndex(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === gradeSubjectId &&
          g.kelasId === gradeClassId
      );

      const gradeRecord: StudentGrade = {
        id: existingIndex >= 0 ? updatedGrades[existingIndex].id : `grd-${Date.now()}-${student.id}`,
        studentId: student.id,
        subjectId: gradeSubjectId,
        kelasId: gradeClassId,
        tahunAjaran: '2025/2026',
        semester: 'Ganjil',
        tugas1: data.tugas1,
        tugas2: data.tugas2,
        uts: data.uts,
        uas: data.uas,
        nilaiRaport: data.nilaiRaport,
        predikat,
        capaianKompetensi: data.capaian
      };

      if (existingIndex >= 0) {
        updatedGrades[existingIndex] = gradeRecord;
      } else {
        updatedGrades.push(gradeRecord);
      }
    });

    Storage.setGrades(updatedGrades);
    onGradesUpdate(updatedGrades);

    setGradeSuccess(true);
    setTimeout(() => setGradeSuccess(false), 4000);
  };

  // ANNOUNCEMENT FORM
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [targetClass, setTargetClass] = useState(myClasses[0]?.id || '');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      judul: newTitle.trim(),
      konten: newContent.trim(),
      kategori: 'wali_kelas',
      authorName: `${teacher.nama}, ${teacher.gelar}`,
      targetRole: 'siswa',
      targetKelasId: targetClass || undefined,
      tanggal: getTodayDateString(),
      isImportant: false
    };

    const updated = [newAnc, ...announcements];
    Storage.setAnnouncements(updated);
    onAnnouncementsUpdate(updated);

    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Teacher Profile Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-blue-300 font-extrabold text-2xl shadow-inner">
              <BookOpen className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-400 text-slate-950 uppercase">
                  Portal Guru Pengampu
                </span>
                <span className="text-xs font-semibold text-blue-200">
                  Mata Pelajaran: {teacher.mataPelajaranUtama}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {teacher.nama}, {teacher.gelar}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                NIP: {teacher.nip} • {teacher.jabatan === 'wali_kelas' ? 'Wali Kelas Terdaftar' : 'Guru Pengampu'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-xs text-slate-200 space-y-1">
            <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider block">
              Filter Otomatis Mata Pelajaran:
            </span>
            <p className="font-semibold text-white">
              Hanya menampilkan mapel {teacher.mataPelajaranUtama} di kelas Anda.
            </p>
            <span className="text-[10px] text-slate-400">
              *Mata pelajaran guru lain secara otomatis disembunyikan.
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('absensi_kbm')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'absensi_kbm'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Absensi Siswa (Jurnal KBM)</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'jadwal'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Mengajar</span>
        </button>

        <button
          onClick={() => setActiveTab('penilaian')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'penilaian'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Input Nilai (Tugas 1 & 2, UTS, UAS, Raport)</span>
        </button>

        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'pengumuman'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengumuman untuk Siswa</span>
        </button>
      </div>

      {/* Tab 1: Absensi Siswa per KBM */}
      {activeTab === 'absensi_kbm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Formulir Absensi Siswa & Jurnal KBM
            </h3>
            <p className="text-xs text-slate-500">
              Catat kehadiran siswa di kelas: Hadir, Sakit, Ijin, Alpa, atau Bolos sesuai mata pelajaran Anda.
            </p>
          </div>

          {attendanceSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Jurnal Absensi KBM Berhasil Disimpan!</strong>
                <p>Data tersinkronisasi ke Dashboard Siswa, Orang Tua, dan Kepala Sekolah.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveKbmAttendance} className="space-y-6">
            {/* Class, Subject, Time, Topic Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Kelas:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                >
                  {myClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.namaKelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mata Pelajaran (Otomatis):</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                >
                  {mySubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaMapel} ({s.kodeMapel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tanggal KBM:</label>
                <input
                  type="date"
                  value={kbmDate}
                  onChange={(e) => setKbmDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Jam Pelajaran:</label>
                <input
                  type="text"
                  value={kbmJam}
                  onChange={(e) => setKbmJam(e.target.value)}
                  placeholder="07:30 - 09:00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 block">Materi Ajar / Topik Pembelajaran Hari Ini:</label>
              <textarea
                value={materiAjar}
                onChange={(e) => setMateriAjar(e.target.value)}
                required
                rows={2}
                placeholder="Contoh: Hukum Newton II dan Penerapannya pada Gerak Bidang Miring..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Students attendance table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  Daftar Siswa Kelas {myClasses.find(c => c.id === selectedClassId)?.namaKelas} ({classStudents.length} Siswa)
                </span>
                <span className="text-slate-500 text-[11px]">
                  Pilih status: Hadir • Sakit • Ijin • Alpa • Bolos
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {classStudents.map((st, idx) => {
                  const currentStatus = getStudentStatus(st.id);

                  return (
                    <div key={st.id} className="p-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-slate-400 font-mono font-medium text-[11px] text-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{st.nama}</p>
                          <p className="text-[10px] text-slate-500 font-mono">NISN: {st.nisn}</p>
                        </div>
                      </div>

                      {/* Status Radios */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {(['hadir', 'sakit', 'ijin', 'alpa', 'bolos'] as AttendanceStatusClass[]).map((statusOption) => (
                          <label
                            key={statusOption}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition cursor-pointer ${
                              currentStatus === statusOption
                                ? statusOption === 'hadir'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : statusOption === 'bolos'
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                  : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`status-${st.id}`}
                              value={statusOption}
                              checked={currentStatus === statusOption}
                              onChange={() => handleStatusChange(st.id, statusOption)}
                              className="sr-only"
                            />
                            <span>{statusOption}</span>
                          </label>
                        ))}
                      </div>

                      {/* Optional Note */}
                      <input
                        type="text"
                        placeholder="Catatan siswa (opsional)..."
                        value={getStudentCatatan(st.id)}
                        onChange={(e) => handleCatatanChange(st.id, e.target.value)}
                        className="text-[11px] p-1.5 bg-slate-50 border border-slate-200 rounded-lg md:w-48 focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi Siswa & Jurnal KBM</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Jadwal Pelajaran Guru */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Jadwal Mengajar Anda
              </h3>
              <p className="text-xs text-slate-500">
                Jadwal KBM yang telah dialokasikan oleh bagian Kurikulum/Admin
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
              Total: {mySchedules.length} Jam Mengajar Mingguan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari) => {
              const daySchedules = mySchedules.filter((s) => s.hari === hari);

              return (
                <div key={hari} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                    <span>{hari}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {daySchedules.length} Kelas
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 space-y-2">
                    {daySchedules.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Tidak ada jam mengajar</p>
                    ) : (
                      daySchedules.map((sched) => {
                        const subj = subjects.find((s) => s.id === sched.subjectId);
                        const cls = classes.find((c) => c.id === sched.kelasId);

                        return (
                          <div key={sched.id} className="pt-2 first:pt-0 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">
                                Kelas {cls?.namaKelas}
                              </span>
                              <span className="font-mono text-[11px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                                {sched.jamMulai} - {sched.jamSelesai}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5 font-medium">
                              {subj?.namaMapel}
                            </p>
                            <span className="text-[10px] text-slate-400 block">
                              Ruang: {sched.ruangan || cls?.ruangan}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Penilaian (Tugas 1 & 2, UTS, UAS, Raport) */}
      {activeTab === 'penilaian' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Input Penilaian Hasil Belajar Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Input nilai Tugas 1 & 2, UTS, UAS. Nilai Raport dihitung otomatis (Bobot: 30% Tugas, 30% UTS, 40% UAS) atau dapat disesuaikan.
              </p>
            </div>
            <button
              onClick={handleSaveAllGrades}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Nilai Kelas</span>
            </button>
          </div>

          {gradeSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Nilai Berhasil Disimpan ke Basis Data Sekolah!</strong>
                <p>Nilai telah diperbarui di transkrip siswa, orang tua, dan rekap raport admin.</p>
              </div>
            </div>
          )}

          {/* Filter Class & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Pilih Kelas yang Dinilai:</label>
              <select
                value={gradeClassId}
                onChange={(e) => setGradeClassId(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {myClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Mata Pelajaran Anda:</label>
              <select
                value={gradeSubjectId}
                onChange={(e) => setGradeSubjectId(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {mySubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.namaMapel} (KKM: {s.kkm})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grades input table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center w-20">Tugas 1</th>
                  <th className="p-3 text-center w-20">Tugas 2</th>
                  <th className="p-3 text-center w-20">UTS</th>
                  <th className="p-3 text-center w-20">UAS</th>
                  <th className="p-3 text-center w-24 bg-blue-50 text-blue-900 font-bold">Nilai Raport</th>
                  <th className="p-3">Capaian Kompetensi (Deskripsi Raport)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradeStudents.map((st, idx) => {
                  const g = getGradeForStudent(st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{st.nama}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">NISN: {st.nisn}</span>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.tugas1}
                          onChange={(e) => handleGradeFieldChange(st.id, 'tugas1', e.target.value)}
                          className="w-16 p-1 text-center font-mono font-semibold bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.tugas2}
                          onChange={(e) => handleGradeFieldChange(st.id, 'tugas2', e.target.value)}
                          className="w-16 p-1 text-center font-mono font-semibold bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.uts}
                          onChange={(e) => handleGradeFieldChange(st.id, 'uts', e.target.value)}
                          className="w-16 p-1 text-center font-mono font-semibold bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.uas}
                          onChange={(e) => handleGradeFieldChange(st.id, 'uas', e.target.value)}
                          className="w-16 p-1 text-center font-mono font-semibold bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 text-center bg-blue-50/50">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.nilaiRaport}
                          onChange={(e) => handleGradeFieldChange(st.id, 'nilaiRaport', e.target.value)}
                          className="w-16 p-1 text-center font-mono font-bold text-sm bg-white border-2 border-blue-400 rounded text-blue-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={g.capaian}
                          onChange={(e) => handleGradeFieldChange(st.id, 'capaian', e.target.value)}
                          placeholder="Deskripsi pencapaian kompetensi..."
                          className="w-full p-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Pengumuman untuk Siswa */}
      {activeTab === 'pengumuman' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Buat Pengumuman Baru
            </h3>
            <p className="text-xs text-slate-500">
              Kirim informasi tugas, jadwal praktikum, atau pengingat belajar untuk siswa
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Judul Pengumuman:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="Contoh: Pengumpulan Tugas Fisika Pekan Ini"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Ditujukan Untuk Kelas:</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="">Semua Kelas Yang Diajar</option>
                  {myClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      Kelas {c.namaKelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Isi Pesan Pengumuman:</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tuliskan pengumuman secara jelas dan ringkas..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-900/20"
              >
                <Send className="w-4 h-4" />
                <span>Terbitkan Pengumuman</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Pengumuman Aktif
            </h3>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{anc.judul}</span>
                    <span className="font-mono text-[10px] text-slate-500">{anc.tanggal}</span>
                  </div>
                  <p className="text-slate-600">{anc.konten}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                    <span>Oleh: {anc.authorName}</span>
                    <span>Target: {anc.targetKelasId ? `Kelas ID: ${anc.targetKelasId}` : 'Semua'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
