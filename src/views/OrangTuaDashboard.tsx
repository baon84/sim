import React, { useState } from 'react';
import {
  Student,
  SchoolClass,
  Subject,
  Teacher,
  AttendanceDaily,
  AttendanceClassSession,
  StudentGrade,
  Headmaster
} from '../types';
import { getTodayDateString } from '../data/initialData';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { PrintRaportModal } from '../components/PrintRaportModal';
import {
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  Printer,
  TrendingUp,
  AlertCircle,
  ScanLine,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  student: Student;
  schoolClass?: SchoolClass;
  subjects: Subject[];
  teachers: Teacher[];
  dailyAttendances: AttendanceDaily[];
  classAttendances: AttendanceClassSession[];
  grades: StudentGrade[];
  headmaster: Headmaster;
}

export const OrangTuaDashboard: React.FC<Props> = ({
  student,
  schoolClass,
  subjects,
  teachers,
  dailyAttendances,
  classAttendances,
  grades,
  headmaster
}) => {
  const [activeTab, setActiveTab] = useState<'presensi_harian' | 'presensi_mapel' | 'nilai'>('presensi_harian');
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showPrintRaportModal, setShowPrintRaportModal] = useState(false);

  const today = getTodayDateString();

  // Child's daily attendance records
  const myDaily = dailyAttendances.filter((a) => a.studentId === student.id);
  const todayRecord = myDaily.find((a) => a.tanggal === today);

  // Statistics calculation
  const totalDays = myDaily.length || 1;
  const hadirCount = myDaily.filter((a) => a.status === 'hadir').length;
  const terlambatCount = myDaily.filter((a) => a.status === 'terlambat').length;
  const sakitCount = myDaily.filter((a) => a.status === 'sakit').length;
  const izinCount = myDaily.filter((a) => a.status === 'izin').length;
  const alpaCount = myDaily.filter((a) => a.status === 'alpa').length;

  const attendancePercentage = Math.round(((hadirCount + terlambatCount) / totalDays) * 100);

  // Class sessions for student's class
  const studentClassSessions = classAttendances.filter(
    (cs) => cs.kelasId === student.kelasId
  );

  // Student grades
  const studentGrades = subjects.map((sbj) => {
    const g = grades.find((gr) => gr.studentId === student.id && gr.subjectId === sbj.id);
    return {
      subject: sbj,
      grade: g
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Parent Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-cyan-300 font-extrabold text-2xl shadow-inner">
              <Users className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-400 text-slate-950 uppercase">
                  Portal Orang Tua / Wali
                </span>
                <span className="text-xs font-semibold text-cyan-200">
                  {schoolClass?.namaKelas || 'Kelas'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {student.namaOrangTua}
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Memantau Ananda: <strong className="text-white">{student.nama}</strong> (NISN: {student.nisn})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowIdCardModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-cyan-600" />
              <span>Kartu Barcode Ananda</span>
            </button>

            <button
              onClick={() => setShowPrintRaportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Raport Ananda</span>
            </button>
          </div>
        </div>

        {/* Monitoring Highlight Cards */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Presensi Masuk Gerbang</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-base font-bold text-white">
                {todayRecord?.jamMasuk ? `${todayRecord.jamMasuk} WIB` : 'Belum Ada Data'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Presensi Pulang Gerbang</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-base font-bold text-white">
                {todayRecord?.jamPulang ? `${todayRecord.jamPulang} WIB` : 'Belum Pulang'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Tingkat Kedisiplinan / Hadir</span>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-base font-bold text-cyan-300">
                {attendancePercentage}%
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-300 text-[11px] block">Keterangan Hari Ini</span>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                todayRecord?.status === 'hadir'
                  ? 'bg-emerald-500 text-slate-950'
                  : todayRecord?.status === 'terlambat'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {todayRecord?.status || 'Belum Presensi'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('presensi_harian')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'presensi_harian'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Absensi Gerbang & Persentase</span>
        </button>

        <button
          onClick={() => setActiveTab('presensi_mapel')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'presensi_mapel'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Absensi Kelas Sesuai Mata Pelajaran</span>
        </button>

        <button
          onClick={() => setActiveTab('nilai')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'nilai'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Nilai Siswa & Raport</span>
        </button>
      </div>

      {/* Tab 1: Absensi Masuk/Pulang & Persentase */}
      {activeTab === 'presensi_harian' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Riwayat Presensi Barcode Masuk & Pulang Ananda
              </h3>
              <p className="text-xs text-slate-500">
                Setiap kali ananda men-scan kartu barcode di gerbang sekolah, data akan tercatat secara otomatis
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-500">Total Kehadiran:</span>
              <strong className="text-emerald-700 font-bold">{attendancePercentage}%</strong>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-[11px] font-semibold text-emerald-700 block">Tepat Waktu</span>
              <span className="text-xl font-bold font-mono text-emerald-900">{hadirCount} Hari</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <span className="text-[11px] font-semibold text-amber-700 block">Terlambat</span>
              <span className="text-xl font-bold font-mono text-amber-900">{terlambatCount} Hari</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <span className="text-[11px] font-semibold text-blue-700 block">Sakit / Izin</span>
              <span className="text-xl font-bold font-mono text-blue-900">{sakitCount + izinCount} Hari</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
              <span className="text-[11px] font-semibold text-rose-700 block">Alpa / Tanpa Keterangan</span>
              <span className="text-xl font-bold font-mono text-rose-900">{alpaCount} Hari</span>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Jam Masuk</th>
                  <th className="p-3">Jam Pulang</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {myDaily.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-sans font-medium text-slate-800">
                      {rec.tanggal} {rec.tanggal === today && '(Hari Ini)'}
                    </td>
                    <td className="p-3 text-emerald-700 font-semibold">
                      {rec.jamMasuk ? `${rec.jamMasuk} WIB` : '-'}
                    </td>
                    <td className="p-3 text-blue-700 font-semibold">
                      {rec.jamPulang ? `${rec.jamPulang} WIB` : '-'}
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
                    <td className="p-3 font-sans text-slate-500">
                      {rec.keterangan || (rec.status === 'hadir' ? 'Scan gerbang tepat waktu' : '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Absensi Kelas Sesuai dengan Mata Pelajaran */}
      {activeTab === 'presensi_mapel' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Absensi Kelas Sesuai Mata Pelajaran (KBM)
            </h3>
            <p className="text-xs text-slate-500">
              Memantau kehadiran ananda di dalam setiap jam pelajaran (Hadir, Sakit, Ijin, Alpa, atau Bolos) yang dicatat langsung oleh guru mata pelajaran.
            </p>
          </div>

          <div className="space-y-4">
            {studentClassSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                Belum ada data jurnal KBM mata pelajaran yang tersimpan.
              </p>
            ) : (
              studentClassSessions.map((session) => {
                const myRecord = session.records.find((r) => r.studentId === student.id);
                const subj = subjects.find((s) => s.id === session.subjectId);
                const teacher = teachers.find((t) => t.id === session.teacherId);

                return (
                  <div
                    key={session.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {subj?.namaMapel}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          ({session.jam})
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                          myRecord?.status === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : myRecord?.status === 'bolos'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : myRecord?.status === 'sakit' || myRecord?.status === 'ijin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Status: {myRecord?.status || 'Tidak Ada Catatan'}
                      </span>
                    </div>

                    <p className="text-slate-600">
                      <strong>Guru Pengampu:</strong> {teacher?.nama}, {teacher?.gelar}
                    </p>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                      <strong className="text-slate-900 block text-[11px] mb-0.5">Topik & Materi Ajar Hari Ini:</strong>
                      {session.materiAjar}
                      {myRecord?.catatan && (
                        <p className="mt-1 text-slate-500 italic text-[11px] border-t border-slate-100 pt-1">
                          Catatan guru untuk ananda: "{myRecord.catatan}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                      <span>Tanggal KBM: {session.tanggal}</span>
                      <span>Jurnal Terverifikasi SIM</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Nilai Siswa (Tugas 1, 2, UTS, UAS, Raport) */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Laporan Hasil Belajar & Nilai Raport Ananda
              </h3>
              <p className="text-xs text-slate-500">
                Nilai Tugas 1 & 2, UTS, UAS, dan Nilai Raport beserta capaian kompetensi
              </p>
            </div>
            <button
              onClick={() => setShowPrintRaportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh Raport Resmi PDF</span>
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
                  <th className="p-3 text-center bg-cyan-50 text-cyan-950 font-bold">Nilai Raport</th>
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
                    <td className="p-3 text-center font-bold text-sm bg-cyan-50 text-cyan-900">
                      {grade?.nilaiRaport ?? '-'}
                    </td>
                    <td className="p-3 text-center font-sans font-bold">
                      <span className={grade?.predikat === 'A' ? 'text-emerald-600' : 'text-blue-600'}>
                        {grade?.predikat ?? (grade?.nilaiRaport ? (grade.nilaiRaport >= 85 ? 'A' : 'B') : '-')}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-[11px] text-slate-600">
                      {grade?.capaianKompetensi || 'Tuntas capaian pembelajaran.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showIdCardModal && (
        <StudentIdCardModal
          student={student}
          schoolClass={schoolClass}
          onClose={() => setShowIdCardModal(false)}
        />
      )}

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
