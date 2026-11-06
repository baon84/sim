import React, { useState } from 'react';
import { CurrentUser, TeacherAbsenceReport } from '../types';
import {
  GraduationCap,
  Bell,
  LogOut,
  ScanLine,
  User,
  Users,
  Shield,
  BookOpen,
  Award,
  RotateCcw,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface Props {
  currentUser: CurrentUser | null;
  teacherReports: TeacherAbsenceReport[];
  onLogout: () => void;
  onOpenGateScanner: () => void;
  onSwitchRole: (role: CurrentUser['role'], id?: string) => void;
  onResetData: () => void;
  onOpenReportModal?: (report: TeacherAbsenceReport) => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  teacherReports,
  onLogout,
  onOpenGateScanner,
  onSwitchRole,
  onResetData,
  onOpenReportModal
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Filter pending teacher absence reports
  const pendingReports = teacherReports.filter(
    (r) => r.status === 'menunggu_tindak_lanjut'
  );

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'kepsek':
        return 'Kepala Sekolah';
      case 'guru':
        return 'Guru Pengampu';
      case 'siswa':
        return 'Siswa (Peserta Didik)';
      case 'ortu':
        return 'Orang Tua / Wali';
      default:
        return 'Tamu';
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'kepsek':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'guru':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'siswa':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ortu':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  SIM SEKOLAH
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NUSANTARA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistem Informasi Manajemen, Presensi Barcode & Raport Terpadu
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Terminal Barcode Scanner Button */}
            <button
              onClick={onOpenGateScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
              title="Buka Terminal Barcode Scanner Gerbang"
            >
              <ScanLine className="w-4 h-4" />
              <span className="hidden md:inline">Scanner Gerbang</span>
            </button>

            {/* Notification Bell (Specially crucial for Kepsek) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Pemberitahuan Laporan Siswa"
              >
                <Bell className="w-4 h-4" />
                {pendingReports.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                    {pendingReports.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h4 className="font-bold text-xs">Pemberitahuan Guru Tidak Hadir</h4>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                      {pendingReports.length} Menunggu Tindak Lanjut
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {pendingReports.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">
                        Tidak ada laporan guru tidak hadir yang menunggu verifikasi.
                      </div>
                    ) : (
                      pendingReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-3 hover:bg-slate-50 transition cursor-pointer"
                          onClick={() => {
                            if (onOpenReportModal) onOpenReportModal(report);
                            setShowNotifMenu(false);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">
                              {report.teacherName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {report.jamKbm}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            "{report.keterangan}"
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Pelapor: {report.studentName} ({report.kelasNama})</span>
                            <span className="text-amber-600 font-semibold">Cek Detail →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer border border-slate-700"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="max-w-[100px] truncate sm:max-w-none font-semibold">
                  {currentUser ? currentUser.name : 'Pilih Akun Demo'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ganti Peran / Demo Cepat:
                  </div>

                  <button
                    onClick={() => {
                      onSwitchRole('admin');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Admin Utama</p>
                      <p className="text-[10px] text-slate-500">Master Data, Jadwal, Alumni, Raport</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('kepsek');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Kepala Sekolah (Dr. H. Ahmad Dahlan)</p>
                      <p className="text-[10px] text-slate-500">Monitoring KBM & Alert Guru Tidak Hadir</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('guru', 'tch-2');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Guru Fisika (Drs. Budi Santoso)</p>
                      <p className="text-[10px] text-slate-500">Absensi KBM, Jadwal, Nilai Siswa</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('guru', 'tch-1');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Guru Matematika (Dra. Hj. Siti)</p>
                      <p className="text-[10px] text-slate-500">Absensi KBM & Nilai Matematika</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('siswa', 'std-1');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Siswa (M. Rizky Pratama)</p>
                      <p className="text-[10px] text-slate-500">NISN: 0061234567 • XI-IPA 1</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchRole('ortu', 'std-1');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-cyan-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Orang Tua (Bpk. Joko Pratama)</p>
                      <p className="text-[10px] text-slate-500">Pantau Absensi & Nilai Rizky</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      if (confirm('Reset semua data ke sampel awal?')) {
                        onResetData();
                      }
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data Simulasi</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout button */}
            {currentUser && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 transition cursor-pointer"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-bar showing active role & user context */}
      {currentUser && (
        <div className="bg-slate-950/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Sedang Aktif Sebagai:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeColor(
                currentUser.role
              )}`}
            >
              {getRoleLabel(currentUser.role)}
            </span>
            <span className="font-medium text-slate-200 hidden sm:inline">
              — {currentUser.name}
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            ID: {currentUser.identifier}
          </div>
        </div>
      )}
    </header>
  );
};
