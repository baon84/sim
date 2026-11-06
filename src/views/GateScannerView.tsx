import React, { useState, useEffect, useRef } from 'react';
import { Student, AttendanceDaily, SchoolClass } from '../types';
import { Storage } from '../utils/storage';
import { scannerAudio } from '../utils/audio';
import { getTodayDateString } from '../data/initialData';
import {
  ScanLine,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  LogOut,
  Camera,
  ShieldCheck,
  History,
  Volume2,
  Sparkles,
  Search
} from 'lucide-react';

interface Props {
  students: Student[];
  classes: SchoolClass[];
  dailyAttendances: AttendanceDaily[];
  onAttendanceUpdate: (newDailyList: AttendanceDaily[]) => void;
  onClose?: () => void;
}

export const GateScannerView: React.FC<Props> = ({
  students,
  classes,
  dailyAttendances,
  onAttendanceUpdate,
  onClose
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'error';
    student?: Student;
    mode?: 'masuk' | 'pulang';
    statusText?: string;
    jam?: string;
    message: string;
  } | null>(null);

  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode input for physical USB handheld scanner
  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      // Keep focused if user is at gate
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'BUTTON') {
        inputRef.current?.focus();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Web camera toggle (simulation / media stream)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Fallback if camera denied
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCamera]);

  const processBarcode = (tokenOrNisn: string) => {
    const clean = tokenOrNisn.trim();
    if (!clean) return;

    // Find student by barcodeToken or NISN
    const student = students.find(
      (s) => s.barcodeToken === clean || s.nisn === clean
    );

    if (!student) {
      scannerAudio.playErrorBeep();
      setScanResult({
        type: 'error',
        message: `Barcode / NISN "${clean}" tidak terdaftar dalam sistem sekolah.`
      });
      setBarcodeInput('');
      return;
    }

    if (student.status === 'lulus') {
      scannerAudio.playErrorBeep();
      setScanResult({
        type: 'error',
        student,
        message: `Siswa "${student.nama}" berstatus Alumni (Lulus). Presensi gerbang tidak aktif.`
      });
      setBarcodeInput('');
      return;
    }

    const today = getTodayDateString();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check existing daily attendance today
    const existing = dailyAttendances.find(
      (a) => a.studentId === student.id && a.tanggal === today
    );

    let updatedList = [...dailyAttendances];
    let mode: 'masuk' | 'pulang' = 'masuk';
    let statusText = '';

    if (!existing) {
      // First scan of the day -> Jam Masuk
      mode = 'masuk';
      const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 15);
      const attStatus = isLate ? 'terlambat' : 'hadir';
      statusText = isLate ? 'Terlambat (Lewat 07:15)' : 'Tepat Waktu';

      const newRecord: AttendanceDaily = {
        id: `att-${Date.now()}-${student.id}`,
        studentId: student.id,
        tanggal: today,
        jamMasuk: timeStr,
        status: attStatus,
        metode: 'barcode',
        keterangan: isLate ? 'Scan gerbang otomatis (Terlambat)' : 'Scan gerbang otomatis (Tepat Waktu)'
      };

      updatedList = [newRecord, ...dailyAttendances];
    } else if (!existing.jamPulang) {
      // Second scan -> Jam Pulang
      mode = 'pulang';
      statusText = 'Presensi Pulang Berhasil';

      updatedList = dailyAttendances.map((a) => {
        if (a.id === existing.id) {
          return {
            ...a,
            jamPulang: timeStr
          };
        }
        return a;
      });
    } else {
      // Already checked in and checked out
      mode = 'pulang';
      statusText = 'Sudah Presensi Pulang Sebelumnya';
    }

    scannerAudio.playSuccessBeep();
    Storage.setDailyAttendance(updatedList);
    onAttendanceUpdate(updatedList);

    setScanResult({
      type: 'success',
      student,
      mode,
      jam: timeStr,
      statusText,
      message:
        mode === 'masuk'
          ? `Selamat Datang, ${student.nama}! Absensi Masuk berhasil tercatat.`
          : `Selamat Jalan, ${student.nama}! Absensi Pulang berhasil tercatat.`
    });

    setBarcodeInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processBarcode(barcodeInput);
    }
  };

  // Recent scans for today
  const today = getTodayDateString();
  const todayScans = dailyAttendances.filter((a) => a.tanggal === today);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Gate Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ScanLine className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white">Terminal Absensi Barcode Gerbang</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE KIOSK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              SMA Negeri 1 Nusantara • Mendukung Scanner USB Handheld, Kamera, & Barcode Digital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Suara Beep Aktif</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Kembali ke Menu Utama
            </button>
          )}
        </div>
      </header>

      {/* Main Scanner Section */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scanner Terminal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Scan Box / Viewfinder */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-200">
                  Arahkan Barcode / Kartu Siswa ke Pemindai
                </h3>
              </div>
              <button
                onClick={() => setUseCamera(!useCamera)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  useCamera
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{useCamera ? 'Tutup Kamera' : 'Gunakan Kamera'}</span>
              </button>
            </div>

            {/* Visual Viewfinder Box */}
            <div className="relative h-64 bg-slate-950 rounded-xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center overflow-hidden">
              {useCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <ScanLine className="w-10 h-10 text-emerald-400 animate-bounce" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Scanner USB Siap Digunakan
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Sorotkan barcode kartu pelajar siswa atau ketikkan NISN lalu tekan Enter.
                  </p>
                </div>
              )}

              {/* Laser line animation overlay */}
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-pulse" />
            </div>

            {/* Input form for Barcode scanner */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-medium text-slate-400 block">
                Input Barcode / Token NISN (Mendukung Scanner Barcode Otomatis):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Scan barcode atau masukkan NISN..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={() => processBarcode(barcodeInput)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-lg shadow-emerald-950"
                >
                  Proses Absen
                </button>
              </div>
            </div>

            {/* Quick Demo Scan Buttons for easy testing */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Simulasi Cepat (Klik untuk Tes Scan Siswa):
                </span>
                <span className="text-[11px] text-slate-500">Demo Barcode Reader</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {students.filter(s => s.status === 'aktif').slice(0, 5).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => processBarcode(s.barcodeToken)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-medium">{s.nama.split(' ')[0]}</span>
                    <span className="font-mono text-slate-400 text-[10px]">({s.nisn})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Banner upon scan */}
          {scanResult && (
            <div
              className={`p-5 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-4 duration-200 ${
                scanResult.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    scanResult.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {scanResult.type === 'success' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <AlertCircle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base">
                      {scanResult.type === 'success' ? 'Presensi Tercatat!' : 'Pemindaian Gagal'}
                    </h4>
                    {scanResult.mode && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        scanResult.mode === 'masuk' ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-white'
                      }`}>
                        {scanResult.mode === 'masuk' ? 'MASUK' : 'PULANG'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{scanResult.message}</p>

                  {scanResult.student && (
                    <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Siswa:</span>
                        <span className="font-semibold text-white">{scanResult.student.nama}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">NISN:</span>
                        <span className="font-mono text-emerald-300">{scanResult.student.nisn}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Waktu:</span>
                        <span className="font-mono text-amber-300 font-semibold">{scanResult.jam} WIB</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Status:</span>
                        <span className="font-medium text-white">{scanResult.statusText}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live History Today */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-sm text-slate-200">
                Aktivitas Presensi Hari Ini
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
              {todayScans.length} Siswa
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {todayScans.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                Belum ada data scan presensi gerbang hari ini.
              </div>
            ) : (
              todayScans.map((att) => {
                const student = students.find((s) => s.id === att.studentId);
                const sClass = classes.find((c) => c.id === student?.kelasId);

                return (
                  <div
                    key={att.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        {student?.nama.charAt(0) || 'S'}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">
                          {student?.nama || 'Siswa'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          NISN: {student?.nisn} • {sClass?.namaKelas || '-'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="font-mono text-emerald-300 font-bold">
                          {att.jamMasuk || '-'}
                        </span>
                        {att.jamPulang && (
                          <span className="text-slate-500 font-mono">
                            → <span className="text-blue-400 font-bold">{att.jamPulang}</span>
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase ${
                          att.status === 'hadir'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : att.status === 'terlambat'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Batas Tepat Waktu: 07:15 WIB</span>
            <span>Jam Pulang: 14:00+ WIB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
