import React, { useState } from 'react';
import { CurrentUser, Student, Teacher, Headmaster } from '../types';
import {
  GraduationCap,
  User,
  Users,
  BookOpen,
  Award,
  Shield,
  ScanLine,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  students: Student[];
  teachers: Teacher[];
  headmaster: Headmaster;
  onLoginSuccess: (user: CurrentUser) => void;
  onOpenGateScanner: () => void;
}

export const LoginView: React.FC<Props> = ({
  students,
  teachers,
  headmaster,
  onLoginSuccess,
  onOpenGateScanner
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'ortu' | 'guru' | 'kepsek' | 'admin'>('siswa');

  // Input states
  const [nisn, setNisn] = useState('0061234567');
  const [studentPassword, setStudentPassword] = useState('123456');

  const [ortuNisn, setOrtuNisn] = useState('0061234567');
  const [ortuPassword, setOrtuPassword] = useState('123456');

  const [guruNip, setGuruNip] = useState('198203152008011004'); // Drs. Budi Santoso
  const [guruPassword, setGuruPassword] = useState('guru123');

  const [kepsekNip, setKepsekNip] = useState('197001011995031001'); // Dr. H. Ahmad Dahlan
  const [kepsekPassword, setKepsekPassword] = useState('kepsek123');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [errorMessage, setErrorMessage] = useState('');

  const handleSiswaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanNisn = nisn.trim();
    const student = students.find((s) => s.nisn === cleanNisn);

    if (!student) {
      setErrorMessage(`NISN "${cleanNisn}" tidak ditemukan.`);
      return;
    }

    onLoginSuccess({
      role: 'siswa',
      identifier: student.nisn,
      name: student.nama,
      studentId: student.id
    });
  };

  const handleOrtuLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanNisn = ortuNisn.trim();
    const student = students.find((s) => s.nisn === cleanNisn);

    if (!student) {
      setErrorMessage(`NISN anak "${cleanNisn}" tidak ditemukan.`);
      return;
    }

    onLoginSuccess({
      role: 'ortu',
      identifier: student.nisn,
      name: `${student.namaOrangTua} (Wali dari ${student.nama})`,
      studentId: student.id
    });
  };

  const handleGuruLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanNip = guruNip.trim();
    const teacher = teachers.find((t) => t.nip === cleanNip || t.email.includes(cleanNip));

    if (!teacher) {
      setErrorMessage(`NIP / Akun Guru "${cleanNip}" tidak terdaftar.`);
      return;
    }

    onLoginSuccess({
      role: 'guru',
      identifier: teacher.nip,
      name: `${teacher.nama}, ${teacher.gelar}`,
      teacherId: teacher.id
    });
  };

  const handleKepsekLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanNip = kepsekNip.trim();

    if (cleanNip !== headmaster.nip && cleanNip !== 'kepsek') {
      setErrorMessage('NIP / Akun Kepala Sekolah tidak valid.');
      return;
    }

    onLoginSuccess({
      role: 'kepsek',
      identifier: headmaster.nip,
      name: headmaster.nama,
      headmasterId: headmaster.id
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (adminUsername.trim() !== 'admin') {
      setErrorMessage('Username admin salah (Gunakan: admin / admin123).');
      return;
    }

    onLoginSuccess({
      role: 'admin',
      identifier: 'admin',
      name: 'Administrator SIM Sekolah'
    });
  };

  // Quick Demo Buttons
  const quickDemoLogin = (role: 'siswa' | 'ortu' | 'guru' | 'kepsek' | 'admin', id?: string) => {
    if (role === 'siswa') {
      const student = students.find((s) => s.id === (id || 'std-1')) || students[0];
      onLoginSuccess({
        role: 'siswa',
        identifier: student.nisn,
        name: student.nama,
        studentId: student.id
      });
    } else if (role === 'ortu') {
      const student = students.find((s) => s.id === (id || 'std-1')) || students[0];
      onLoginSuccess({
        role: 'ortu',
        identifier: student.nisn,
        name: `${student.namaOrangTua} (Wali dari ${student.nama})`,
        studentId: student.id
      });
    } else if (role === 'guru') {
      const teacher = teachers.find((t) => t.id === (id || 'tch-2')) || teachers[0];
      onLoginSuccess({
        role: 'guru',
        identifier: teacher.nip,
        name: `${teacher.nama}, ${teacher.gelar}`,
        teacherId: teacher.id
      });
    } else if (role === 'kepsek') {
      onLoginSuccess({
        role: 'kepsek',
        identifier: headmaster.nip,
        name: headmaster.nama,
        headmasterId: headmaster.id
      });
    } else if (role === 'admin') {
      onLoginSuccess({
        role: 'admin',
        identifier: 'admin',
        name: 'Administrator SIM Sekolah'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white">
              SIM SEKOLAH NUSANTARA
            </h1>
            <p className="text-xs text-slate-400">
              Sistem Informasi Manajemen, Presensi Barcode & Monitoring KBM
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGateScanner}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950 transition cursor-pointer"
        >
          <ScanLine className="w-4 h-4" />
          <span>Kiosk Scanner Gerbang</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block text-slate-300">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Terintegrasi
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
              Manajemen Sekolah Modern, Transparan & Otomatis
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dilengkapi pemindai barcode kartu siswa untuk presensi gerbang, monitoring kehadiran guru oleh Kepala Sekolah, portal penilaian, dan cetak raport standar resmi.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Absensi Barcode & Notifikasi Otomatis</strong>
                <span className="text-slate-400">Presensi masuk & pulang tercatat real-time dan dipantau orang tua.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Supervisi KBM & Alert Guru Kosong</strong>
                <span className="text-slate-400">Siswa dapat melaporkan guru yang tidak hadir langsung ke Kepala Sekolah.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Arsip Nilai Siswa & Alumni Permanen</strong>
                <span className="text-slate-400">Rekap nilai tetap dapat dicari kapan saja walaupun siswa telah lulus.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Form Box */}
        <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-6">
            <h3 className="font-extrabold text-xl text-slate-900">
              Masuk ke Portal Sekolah
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih peran Anda di bawah ini untuk mengakses sistem informasi sekolah.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('siswa');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'siswa'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Siswa</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ortu');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'ortu'
                  ? 'bg-white text-cyan-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Orang Tua</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('guru');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'guru'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guru</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('kepsek');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'kepsek'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Kepsek</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Siswa */}
          {activeTab === 'siswa' && (
            <form onSubmit={handleSiswaLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Nomor Induk Siswa Nasional (NISN):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    required
                    placeholder="Contoh: 0061234567"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  NISN tertera pada kartu pelajar dan kartu barcode absensi siswa.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20"
              >
                <span>Masuk Portal Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Ortu */}
          {activeTab === 'ortu' && (
            <form onSubmit={handleOrtuLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  NISN Ananda (Siswa):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={ortuNisn}
                    onChange={(e) => setOrtuNisn(e.target.value)}
                    required
                    placeholder="Masukkan NISN anak..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-cyan-500 focus:bg-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Orang tua login menggunakan NISN dan kata sandi ananda.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi Ananda:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={ortuPassword}
                    onChange={(e) => setOrtuPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-900/20"
              >
                <span>Masuk Portal Orang Tua</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Guru */}
          {activeTab === 'guru' && (
            <form onSubmit={handleGuruLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Nomor Induk Pegawai (NIP) / Akun Guru:
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={guruNip}
                    onChange={(e) => setGuruNip(e.target.value)}
                    required
                    placeholder="Contoh: 198203152008011004"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Mata pelajaran guru akan otomatis terfilter sesuai jadwal mengajar.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={guruPassword}
                    onChange={(e) => setGuruPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-900/20"
              >
                <span>Masuk Portal Guru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Kepsek */}
          {activeTab === 'kepsek' && (
            <form onSubmit={handleKepsekLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  NIP Kepala Sekolah:
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={kepsekNip}
                    onChange={(e) => setKepsekNip(e.target.value)}
                    required
                    placeholder="NIP Kepala Sekolah..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={kepsekPassword}
                    onChange={(e) => setKepsekPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-900/20"
              >
                <span>Masuk Portal Kepala Sekolah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Admin */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Username Administrator:
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/20"
              >
                <span>Masuk Portal Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Instant 1-Click Demo Login Bar */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Akses Instan Demo (1-Klik Masuk Langsung):
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => quickDemoLogin('siswa')}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-emerald-900 block truncate">Siswa (Rizky)</span>
                <span className="text-[10px] text-emerald-700 font-mono">NISN: 0061234567</span>
              </button>

              <button
                onClick={() => quickDemoLogin('ortu')}
                className="p-2 text-left bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-cyan-900 block truncate">Orang Tua (Joko P.)</span>
                <span className="text-[10px] text-cyan-700">Wali Murid XI-IPA 1</span>
              </button>

              <button
                onClick={() => quickDemoLogin('guru', 'tch-2')}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-blue-900 block truncate">Guru Fisika</span>
                <span className="text-[10px] text-blue-700">Drs. Budi Santoso</span>
              </button>

              <button
                onClick={() => quickDemoLogin('guru', 'tch-1')}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-blue-900 block truncate">Guru Matematika</span>
                <span className="text-[10px] text-blue-700">Dra. Hj. Siti N.</span>
              </button>

              <button
                onClick={() => quickDemoLogin('kepsek')}
                className="p-2 text-left bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-amber-900 block truncate">Kepala Sekolah</span>
                <span className="text-[10px] text-amber-700">Dr. H. Ahmad Dahlan</span>
              </button>

              <button
                onClick={() => quickDemoLogin('admin')}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl transition cursor-pointer text-xs"
              >
                <span className="font-bold text-purple-900 block truncate">Admin Sekolah</span>
                <span className="text-[10px] text-purple-700">Kelola Seluruh SIM</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-2">
        SMA Negeri 1 Nusantara • Sistem Informasi Manajemen Sekolah v2.5 • Terintegrasi KEMDIKBUDRISTEK
      </footer>
    </div>
  );
};
