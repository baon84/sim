import React, { useState } from 'react';
import {
  Headmaster,
  Teacher,
  SchoolClass,
  Subject,
  Schedule,
  AttendanceClassSession,
  TeacherAbsenceReport
} from '../types';
import { getTodayDateString } from '../data/initialData';
import { Storage } from '../utils/storage';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Bell,
  Check,
  TrendingUp,
  ShieldAlert,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface Props {
  headmaster: Headmaster;
  teachers: Teacher[];
  classes: SchoolClass[];
  subjects: Subject[];
  schedules: Schedule[];
  classAttendances: AttendanceClassSession[];
  teacherReports: TeacherAbsenceReport[];
  onReportsUpdate: (updated: TeacherAbsenceReport[]) => void;
  selectedReportFromNav?: TeacherAbsenceReport | null;
}

export const KepalaSekolahDashboard: React.FC<Props> = ({
  headmaster,
  teachers,
  classes,
  subjects,
  schedules,
  classAttendances,
  teacherReports,
  onReportsUpdate,
  selectedReportFromNav
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring_kbm' | 'laporan_siswa' | 'rekap_guru'>('laporan_siswa');
  const [tindakLanjutModal, setTindakLanjutModal] = useState<TeacherAbsenceReport | null>(selectedReportFromNav || null);
  const [kepsekNotes, setKepsekNotes] = useState('');

  const today = getTodayDateString();

  // Pending reports
  const pendingReports = teacherReports.filter((r) => r.status === 'menunggu_tindak_lanjut');
  const resolvedReports = teacherReports.filter((r) => r.status !== 'menunggu_tindak_lanjut');

  // Handle follow up action
  const handleResolveReport = (status: 'diverifikasi' | 'selesai') => {
    if (!tindakLanjutModal) return;

    const updated = teacherReports.map((r) => {
      if (r.id === tindakLanjutModal.id) {
        return {
          ...r,
          status,
          catatanKepsek: kepsekNotes || 'Telah ditindaklanjuti oleh Kepala Sekolah via Guru Piket.'
        };
      }
      return r;
    });

    Storage.setTeacherReports(updated);
    onReportsUpdate(updated);

    setTindakLanjutModal(null);
    setKepsekNotes('');
  };

  // Real-time KBM Monitoring status for today
  const todaySchedules = schedules; // in demo shows full schedule roster

  const getKbmMonitoringStatus = (sched: Schedule) => {
    // Check if students reported this teacher today
    const report = teacherReports.find(
      (r) => r.scheduleId === sched.id && r.tanggal === today
    );
    if (report) {
      return {
        status: 'reported_absent',
        label: 'Dilaporkan Siswa: Guru Tidak Hadir',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
        report
      };
    }

    // Check if teacher submitted class attendance journal today
    const journal = classAttendances.find(
      (ca) => ca.scheduleId === sched.id && ca.tanggal === today
    );
    if (journal) {
      return {
        status: 'active_present',
        label: 'KBM Aktif (Jurnal Terisi)',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        journal
      };
    }

    return {
      status: 'pending_kbm',
      label: 'Menunggu Pengisian Jurnal',
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  };

  // Teacher performance statistics
  const teacherStats = teachers.map((teacher) => {
    const teacherSchedules = schedules.filter((s) => s.teacherId === teacher.id);
    const journals = classAttendances.filter((ca) => ca.teacherId === teacher.id);
    const reports = teacherReports.filter((r) => r.teacherId === teacher.id);

    // Simulated compliance percentage
    const baseTotal = teacherSchedules.length * 4 || 1;
    const filled = Math.min(journals.length * 3 + 1, baseTotal);
    const percentage = Math.max(70, Math.min(100, Math.round((filled / baseTotal) * 100) - reports.length * 8));

    return {
      teacher,
      totalSchedules: teacherSchedules.length,
      journalsFilled: journals.length,
      unattendedReports: reports.length,
      complianceRate: percentage
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Headmaster Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-yellow-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-amber-300 font-extrabold text-2xl shadow-inner">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase">
                  Portal Kepala Sekolah
                </span>
                <span className="text-xs font-semibold text-amber-200">
                  Supervisi & Monitoring KBM
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {headmaster.nama}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                NIP: {headmaster.nip} • Periode Kepemimpinan: {headmaster.periode}
              </p>
            </div>
          </div>

          {/* Alert badge counter */}
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/20 border border-rose-500/40 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg animate-pulse">
                {pendingReports.length}
              </div>
              <div>
                <span className="text-xs font-bold text-rose-300 block">
                  Laporan Guru Tidak Hadir
                </span>
                <span className="text-[11px] text-slate-300">
                  {pendingReports.length > 0 ? 'Perlu tindakan supervisi segera' : 'KBM berjalan tertib'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('laporan_siswa')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'laporan_siswa'
              ? 'border-rose-600 text-rose-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-rose-500" />
          <span className="flex items-center gap-1.5">
            Pemberitahuan Guru Tidak Hadir
            {pendingReports.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingReports.length}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring_kbm')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'monitoring_kbm'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Monitoring Kehadiran Guru di Kelas (Live KBM)</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap_guru')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'rekap_guru'
              ? 'border-amber-600 text-amber-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Statistik & Kepatuhan Jam Mengajar Guru</span>
        </button>
      </div>

      {/* Tab 1: Pusat Pemberitahuan Laporan Siswa */}
      {activeTab === 'laporan_siswa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Laporan Masuk: Guru Tidak Hadir di Kelas
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa secara mandiri melaporkan kekosongan jam belajar melalui portal siswa
                </p>
              </div>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold font-mono">
                {pendingReports.length} Menunggu Tindak Lanjut
              </span>
            </div>

            {pendingReports.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                <strong className="text-slate-700 block text-sm">Semua Kelas Terpantau Hadir</strong>
                Tidak ada laporan ketidakhadiran guru yang belum ditindaklanjuti.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/50 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-black text-rose-900 text-sm">
                          Guru: {report.teacherName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                          Mapel: {report.subjectName}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">
                        Jam KBM: {report.jamKbm} • {report.tanggal}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-slate-800">
                      <strong className="text-rose-700 block text-[11px] mb-1">
                        Keterangan Siswa:
                      </strong>
                      "{report.keterangan}"
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-rose-200/60">
                      <div className="text-[11px] text-slate-500">
                        Dilaporkan oleh: <strong className="text-slate-800">{report.studentName}</strong> (NISN: {report.studentNisn}) • Kelas {report.kelasNama}
                      </div>

                      <button
                        onClick={() => setTindakLanjutModal(report)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Tindak Lanjuti Laporan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolved History */}
          {resolvedReports.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900">
                Riwayat Laporan Yang Telah Ditindaklanjuti
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {resolvedReports.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-800">{r.teacherName}</span>
                      <span className="text-slate-400 font-mono text-[11px] ml-2">({r.subjectName} • {r.kelasNama})</span>
                      <p className="text-slate-500 text-[11px] mt-0.5 italic">
                        Catatan Kepsek: "{r.catatanKepsek || 'Telah diverifikasi'}"
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Monitoring Kehadiran Guru di Kelas */}
      {activeTab === 'monitoring_kbm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Monitoring Aktivitas KBM di Seluruh Kelas Hari Ini
              </h3>
              <p className="text-xs text-slate-500">
                Pantau apakah guru yang bertugas sudah masuk kelas dan mengisi jurnal presensi KBM
              </p>
            </div>
            <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              Tanggal: {today}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaySchedules.map((sch) => {
              const cls = classes.find((c) => c.id === sch.kelasId);
              const tch = teachers.find((t) => t.id === sch.teacherId);
              const sbj = subjects.find((s) => s.id === sch.subjectId);
              const monitor = getKbmMonitoringStatus(sch);

              return (
                <div
                  key={sch.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2.5 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Kelas {cls?.namaKelas}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {sch.hari}, {sch.jamMulai} - {sch.jamSelesai}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-slate-700">
                    <p className="font-semibold">{sbj?.namaMapel}</p>
                    <p className="text-slate-500">Guru: {tch?.nama}, {tch?.gelar}</p>
                  </div>

                  {/* Status badge */}
                  <div className={`p-2.5 rounded-xl border font-bold flex items-center justify-between text-[11px] ${monitor.color}`}>
                    <span>{monitor.label}</span>
                    {monitor.status === 'active_present' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {monitor.status === 'reported_absent' && (
                      <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                    )}
                  </div>

                  {monitor.journal && (
                    <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                      <strong>Materi:</strong> {monitor.journal.materiAjar}
                    </div>
                  )}

                  {monitor.report && (
                    <div className="text-[10px] text-rose-700 bg-rose-100/60 p-2 rounded border border-rose-200">
                      <strong>Laporan Siswa:</strong> "{monitor.report.keterangan}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Statistik Kehadiran Guru */}
      {activeTab === 'rekap_guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Rekapitulasi Kepatuhan & Kehadiran Guru di Kelas
            </h3>
            <p className="text-xs text-slate-500">
              Persentase kehadiran mengajar guru semester berjalan
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">Nama Guru</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3 text-center">Beban Jadwal</th>
                  <th className="p-3 text-center">Jurnal Terisi</th>
                  <th className="p-3 text-center text-rose-700">Laporan Kosong</th>
                  <th className="p-3 text-center font-bold">Tingkat Kehadiran</th>
                  <th className="p-3 text-center">Status Supervisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherStats.map((item, idx) => (
                  <tr key={item.teacher.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <strong className="text-slate-900 block">{item.teacher.nama}, {item.teacher.gelar}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">NIP: {item.teacher.nip}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{item.teacher.mataPelajaranUtama}</td>
                    <td className="p-3 text-center font-mono">{item.totalSchedules} Kelas</td>
                    <td className="p-3 text-center font-mono text-emerald-700 font-semibold">{item.journalsFilled} Sesi</td>
                    <td className="p-3 text-center font-mono font-bold text-rose-600">
                      {item.unattendedReports}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-bold text-slate-900">{item.complianceRate}%</span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.complianceRate >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.complianceRate >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.complianceRate >= 90 ? 'Sangat Baik' : item.complianceRate >= 80 ? 'Baik' : 'Perlu Pembinaan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tindak Lanjut Kepala Sekolah */}
      {tindakLanjutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                Tindak Lanjut Laporan Guru Tidak Hadir
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p><strong>Guru:</strong> {tindakLanjutModal.teacherName}</p>
              <p><strong>Mapel & Kelas:</strong> {tindakLanjutModal.subjectName} ({tindakLanjutModal.kelasNama})</p>
              <p><strong>Pelapor:</strong> {tindakLanjutModal.studentName} (NISN: {tindakLanjutModal.studentNisn})</p>
              <p><strong>Keterangan:</strong> "{tindakLanjutModal.keterangan}"</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 block">
                Catatan / Instruksi Tindak Lanjut Kepala Sekolah:
              </label>
              <textarea
                value={kepsekNotes}
                onChange={(e) => setKepsekNotes(e.target.value)}
                rows={3}
                placeholder="Contoh: Menginstruksikan Guru Piket memberikan modul tugas pengganti dan memanggil guru yang bersangkutan untuk klarifikasi..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTindakLanjutModal(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleResolveReport('diverifikasi')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tugaskan Guru Piket
              </button>
              <button
                onClick={() => handleResolveReport('selesai')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Selesaikan Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
