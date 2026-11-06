import React, { useState } from 'react';
import {
  Student,
  SchoolClass,
  Schedule,
  Subject,
  Teacher,
  AttendanceDaily,
  AttendanceClassSession,
  TeacherAbsenceReport,
  StudentGrade,
  Announcement
} from '../types';
import { getTodayDateString } from '../data/initialData';
import { Storage } from '../utils/storage';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { PrintRaportModal } from '../components/PrintRaportModal';
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Bell,
  ScanLine,
  Send,
  Printer,
  ChevronRight,
  TrendingUp,
  Info,
  Check
} from 'lucide-react';

interface Props {
  student: Student;
  schoolClass?: SchoolClass;
  schedules: Schedule[];
  subjects: Subject[];
  teachers: Teacher[];
  dailyAttendances: AttendanceDaily[];
  classAttendances: AttendanceClassSession[];
  teacherReports: TeacherAbsenceReport[];
  grades: StudentGrade[];
  announcements: Announcement[];
  headmaster: any;
  onReportsUpdate: (reports: TeacherAbsenceReport[]) => void;
  onOpenGateScanner: () => void;
}

export const SiswaDashboard: React.FC<Props> = ({
  student,
  schoolClass,
  schedules,
  subjects,
  teachers,
  dailyAttendances,
  classAttendances,
  teacherReports,
  grades,
  announcements,
  headmaster,
  onReportsUpdate,
  onOpenGateScanner
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'absensi' | 'jadwal' | 'nilai' | 'lapor_guru' | 'pengumuman'>('ringkasan');
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showPrintRaportModal, setShowPrintRaportModal] = useState(false);

  // Form Lapor Guru Kosong
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [absenceReason, setAbsenceReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const today = getTodayDateString();

  // Student's daily attendance records
  const myDailyAttendances = dailyAttendances.filter((a) => a.studentId === student.id);
  const todayAttendance = myDailyAttendances.find((a) => a.tanggal === today);

  // Calculate percentage
  const totalDays = myDailyAttendances.length || 1;
  const hadirCount = myDailyAttendances.filter((a) => a.status === 'hadir').length;
  const terlambatCount = myDailyAttendances.filter((a) => a.status === 'terlambat').length;
  const sakitCount = myDailyAttendances.filter((a) => a.status === 'sakit').length;
  const izinCount = myDailyAttendances.filter((a) => a.status === 'izin').length;
  const alpaCount = myDailyAttendances.filter((a) => a.status === 'alpa').length;

  const attendancePercentage = Math.round(((hadirCount + terlambatCount) / totalDays) * 100);

  // Student's schedules for current class
  const classSchedules = schedules.filter((s) => s.kelasId === student.kelasId);

  // Student's grades
  const studentGrades = subjects.map((sbj) => {
    const g = grades.find((gr) => gr.studentId === student.id && gr.subjectId === sbj.id);
    return {
      subject: sbj,
      grade: g
    };
  });

  // Handle reporting teacher
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId || !absenceReason.trim()) return;

    const sched = schedules.find((s) => s.id === selectedScheduleId);
    const teacher = teachers.find((t) => t.id === sched?.teacherId);
    const subject = subjects.find((s) => s.id === sched?.subjectId);

    const newReport: TeacherAbsenceReport = {
      id: `rpt-${Date.now()}`,
      scheduleId: selectedScheduleId,
      studentId: student.id,
      studentName: student.nama,
      studentNisn: student.nisn,
      kelasId: student.kelasId,
      kelasNama: schoolClass?.namaKelas || 'Kelas',
      teacherId: teacher?.id || '',
      teacherName: teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru Pengampu',
      subjectName: subject?.namaMapel || 'Mata Pelajaran',
      tanggal: today,
      jamKbm: `${sched?.jamMulai} - ${sched?.jamSelesai}`,
      keterangan: absenceReason.trim(),
      createdAt: new Date().toISOString(),
      status: 'menunggu_tindak_lanjut'
    };

    const updated = [newReport, ...teacherReports];
    Storage.setTeacherReports(updated);
    onReportsUpdate(updated);

    setReportSuccess(true);
    setAbsenceReason('');
    setSelectedScheduleId('');
    setTimeout(() => setReportSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Student Profile & Quick Status Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-emerald-300 font-extrabold text-2xl shadow-inner">
              {student.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 uppercase">
                  Siswa Aktif
                </span>
                <span className="text-xs font-semibold text-emerald-200">
                  {schoolClass?.namaKelas || 'Kelas'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {student.nama}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                NISN: {student.nisn} • Tahun Masuk: {student.tahunMasuk}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowIdCardModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-emerald-600" />
              <span>Kartu Barcode Siswa</span>
            </button>

            <button
              onClick={() => setShowPrintRaportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Lihat & Cetak Raport</span>
            </button>
          </div>
        </div>

        {/* Quick Today's Attendance Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Absensi Masuk Hari Ini</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-base font-bold text-white">
                {todayAttendance?.jamMasuk ? `${todayAttendance.jamMasuk} WIB` : 'Belum Scan'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Absensi Pulang Hari Ini</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-base font-bold text-white">
                {todayAttendance?.jamPulang ? `${todayAttendance.jamPulang} WIB` : 'Belum Pulang'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Persentase Kehadiran</span>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-base font-bold text-emerald-300">
                {attendancePercentage}%
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Status Presensi Gerbang</span>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                todayAttendance?.status === 'hadir'
                  ? 'bg-emerald-500 text-slate-950'
                  : todayAttendance?.status === 'terlambat'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {todayAttendance?.status || 'Belum Presensi'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'ringkasan'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ringkasan & Presensi</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'jadwal'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Pelajaran</span>
        </button>

        <button
          onClick={() => setActiveTab('nilai')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'nilai'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nilai & Raport</span>
        </button>

        <button
          onClick={() => setActiveTab('lapor_guru')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'lapor_guru'
              ? 'border-rose-600 text-rose-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span className="text-rose-600 font-bold">Lapor Guru Tidak Hadir</span>
        </button>

        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'pengumuman'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengumuman Sekolah</span>
        </button>
      </div>

      {/* Tab 1: Ringkasan & Presensi Harian */}
      {activeTab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kehadiran & Persentase */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Rekap Kehadiran Masuk & Pulang
                </h3>
                <p className="text-xs text-slate-500">
                  Data scan presensi barcode harian di gerbang sekolah
                </p>
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                Total: {totalDays} Hari Terdata
              </span>
            </div>

            {/* Visual Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-[11px] font-semibold text-emerald-700 block">Hadir Tepat Waktu</span>
                <span className="text-xl font-bold font-mono text-emerald-900">{hadirCount}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="text-[11px] font-semibold text-amber-700 block">Terlambat</span>
                <span className="text-xl font-bold font-mono text-amber-900">{terlambatCount}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-[11px] font-semibold text-blue-700 block">Sakit / Izin</span>
                <span className="text-xl font-bold font-mono text-blue-900">{sakitCount + izinCount}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                <span className="text-[11px] font-semibold text-rose-700 block">Alpa / Bolos</span>
                <span className="text-xl font-bold font-mono text-rose-900">{alpaCount}</span>
              </div>
            </div>

            {/* Table of Daily Attendance */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Jam Masuk</th>
                    <th className="p-3">Jam Pulang</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {myDailyAttendances.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-sans font-medium text-slate-800">
                        {rec.tanggal} {rec.tanggal === today && '(Hari Ini)'}
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        {rec.jamMasuk || '-'}
                      </td>
                      <td className="p-3 text-blue-700 font-semibold">
                        {rec.jamPulang || '-'}
                      </td>
                      <td className="p-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rec.status === 'hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-500 capitalize">
                        {rec.metode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Attendance per Subject (KBM Class Attendance) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Presensi Kelas (Sesuai Mata Pelajaran)
              </h3>
              <p className="text-xs text-slate-500">
                Status kehadiran di dalam kelas yang dicatat guru masing-masing mapel
              </p>
            </div>

            <div className="space-y-3">
              {classAttendances.filter(ca => ca.kelasId === student.kelasId).map((ca) => {
                const myRecord = ca.records.find((r) => r.studentId === student.id);
                const subj = subjects.find((s) => s.id === ca.subjectId);
                const teacher = teachers.find((t) => t.id === ca.teacherId);

                return (
                  <div
                    key={ca.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm">
                        {subj?.namaMapel || 'Mapel'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          myRecord?.status === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : myRecord?.status === 'bolos'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {myRecord?.status || 'Belum Tercatat'}
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium">
                      Guru: {teacher?.nama}, {teacher?.gelar}
                    </p>

                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                      <strong>Materi Ajar:</strong> {ca.materiAjar}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>Tanggal: {ca.tanggal}</span>
                      <span>Jam KBM: {ca.jam}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Jadwal Pelajaran */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Jadwal Pelajaran Mingguan — Kelas {schoolClass?.namaKelas}
              </h3>
              <p className="text-xs text-slate-500">
                Wali Kelas: {teachers.find(t => t.id === schoolClass?.waliKelasId)?.nama || '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari) => {
              const daySchedules = classSchedules.filter((s) => s.hari === hari);

              return (
                <div key={hari} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                    <span>{hari}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {daySchedules.length} Mapel
                    </span>
                  </div>

                  <div className="p-3 divide-y divide-slate-100 space-y-2">
                    {daySchedules.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Tidak ada jam KBM</p>
                    ) : (
                      daySchedules.map((sched) => {
                        const subj = subjects.find((s) => s.id === sched.subjectId);
                        const tch = teachers.find((t) => t.id === sched.teacherId);

                        return (
                          <div key={sched.id} className="pt-2 first:pt-0 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">
                                {subj?.namaMapel}
                              </span>
                              <span className="font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                                {sched.jamMulai} - {sched.jamSelesai}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {tch?.nama}, {tch?.gelar}
                            </p>
                            <span className="text-[10px] text-slate-400 block">
                              Ruang: {sched.ruangan || schoolClass?.ruangan}
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

      {/* Tab 3: Nilai (Tugas 1, Tugas 2, UTS, UAS, Raport) */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Transkrip Nilai Hasil Belajar (Semester Ganjil 2025/2026)
              </h3>
              <p className="text-xs text-slate-500">
                Komponen nilai: Tugas 1 & 2, UTS, UAS, dan Nilai Raport
              </p>
            </div>
            <button
              onClick={() => setShowPrintRaportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Raport Resmi</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3 text-center">KKM</th>
                  <th className="p-3 text-center">Tugas 1</th>
                  <th className="p-3 text-center">Tugas 2</th>
                  <th className="p-3 text-center">UTS</th>
                  <th className="p-3 text-center">UAS</th>
                  <th className="p-3 text-center bg-emerald-50 text-emerald-950 font-bold">Nilai Raport</th>
                  <th className="p-3 text-center">Predikat</th>
                  <th className="p-3">Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {studentGrades.map(({ subject, grade }) => (
                  <tr key={subject.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-sans font-medium text-slate-800">
                      {subject.namaMapel}
                    </td>
                    <td className="p-3 text-center text-slate-500">{subject.kkm}</td>
                    <td className="p-3 text-center">{grade?.tugas1 ?? '-'}</td>
                    <td className="p-3 text-center">{grade?.tugas2 ?? '-'}</td>
                    <td className="p-3 text-center">{grade?.uts ?? '-'}</td>
                    <td className="p-3 text-center">{grade?.uas ?? '-'}</td>
                    <td className="p-3 text-center font-bold text-sm bg-emerald-50 text-emerald-800">
                      {grade?.nilaiRaport ?? '-'}
                    </td>
                    <td className="p-3 text-center font-sans font-bold">
                      <span className={grade?.predikat === 'A' ? 'text-emerald-600' : 'text-blue-600'}>
                        {grade?.predikat ?? (grade?.nilaiRaport ? (grade.nilaiRaport >= 85 ? 'A' : 'B') : '-')}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-[11px] text-slate-600">
                      {grade?.capaianKompetensi || 'Telah mencapai ketuntasan kompetensi secara baik.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Lapor Guru Tidak Hadir di Kelas */}
      {activeTab === 'lapor_guru' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Formulir Lapor Guru Tidak Hadir di Kelas
              </h3>
              <p className="text-xs text-slate-500">
                Laporan ini akan langsung diteruskan secara real-time ke Dashboard Kepala Sekolah
              </p>
            </div>
          </div>

          {reportSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Laporan Berhasil Terkirim!</strong>
                <p>Kepala Sekolah telah menerima pemberitahuan Anda untuk segera ditindaklanjuti.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Pilih Jadwal Mata Pelajaran Hari Ini:
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-rose-500"
              >
                <option value="">-- Pilih Jam Pelajaran yang Gurunya Tidak Hadir --</option>
                {classSchedules.map((sch) => {
                  const sbj = subjects.find((s) => s.id === sch.subjectId);
                  const tch = teachers.find((t) => t.id === sch.teacherId);
                  return (
                    <option key={sch.id} value={sch.id}>
                      [{sch.hari} {sch.jamMulai}-{sch.jamSelesai}] {sbj?.namaMapel} — Guru: {tch?.nama}, {tch?.gelar}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Keterangan Kondisi di Kelas:
              </label>
              <textarea
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                required
                rows={4}
                placeholder="Jelaskan kondisi kelas (misal: Guru belum hadir lebih dari 20 menit, belum ada tugas pengganti yang diberikan, kelas kondusif menunggu instruksi)..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Identitas Anda ({student.nama} - NISN: {student.nisn}) akan dicantumkan secara bertanggung jawab untuk verifikasi supervisi pengajaran.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/20"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Laporan ke Kepala Sekolah</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Pengumuman Sekolah */}
      {activeTab === 'pengumuman' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              Pengumuman & Informasi Sekolah
            </h3>
          </div>

          <div className="space-y-4">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className={`p-4 rounded-2xl border ${
                  anc.isImportant
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        {anc.judul}
                      </h4>
                      {anc.isImportant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          Penting
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {anc.konten}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Diumumkan oleh: {anc.authorName}</span>
                  <span className="font-mono">{anc.tanggal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student ID Card Modal */}
      {showIdCardModal && (
        <StudentIdCardModal
          student={student}
          schoolClass={schoolClass}
          onClose={() => setShowIdCardModal(false)}
        />
      )}

      {/* Print Raport Modal */}
      {showPrintRaportModal && (
        <PrintRaportModal
          student={student}
          schoolClass={schoolClass}
          subjects={subjects}
          grades={grades}
          waliKelas={teachers.find((t) => t.id === schoolClass?.waliKelasId)}
          headmaster={headmaster}
          onClose={() => setShowPrintRaportModal(false)}
        />
      )}
    </div>
  );
};
