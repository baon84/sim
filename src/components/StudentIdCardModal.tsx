import React from 'react';
import { Student, SchoolClass } from '../types';
import { BarcodeSVG, QRCodeSVG } from './BarcodeRenderer';
import { X, Printer, Download, GraduationCap, ShieldCheck } from 'lucide-react';

interface Props {
  student: Student;
  schoolClass?: SchoolClass;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<Props> = ({
  student,
  schoolClass,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm">Kartu Tanda Pelajar (KTP Digital & Barcode)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 bg-slate-100 flex flex-col items-center">
          <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-700 relative print:border-slate-800 print:shadow-none">
            {/* Top decorative band */}
            <div className="bg-emerald-500 h-2 w-full" />

            {/* School Header */}
            <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 leading-none">
                  KARTU TANDA PELAJAR
                </h4>
                <h5 className="font-bold text-sm tracking-tight text-white leading-tight">
                  SMA NEGERI 1 NUSANTARA
                </h5>
                <p className="text-[10px] text-slate-300">
                  NPSN: 20108892 • Akreditasi A (Unggul)
                </p>
              </div>
            </div>

            {/* Student Info Body */}
            <div className="p-5 space-y-4">
              <div className="flex gap-4">
                {/* Photo frame */}
                <div className="w-24 h-32 rounded-xl bg-slate-800 border-2 border-white/20 overflow-hidden flex flex-col items-center justify-center relative shrink-0 shadow-inner">
                  {student.fotoUrl ? (
                    <img
                      src={student.fotoUrl}
                      alt={student.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center p-2 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 mb-1">
                        {student.nama.charAt(0)}
                      </div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-300">
                        {student.jenisKelamin === 'L' ? 'Siswa' : 'Siswi'}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-[8px] font-bold py-0.5 text-center text-white">
                    {student.status.toUpperCase()}
                  </div>
                </div>

                {/* Data Fields */}
                <div className="flex-1 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">Nama Siswa</span>
                    <span className="font-bold text-white tracking-wide text-sm block leading-snug">
                      {student.nama}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">NISN</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {student.nisn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Kelas</span>
                      <span className="font-semibold text-slate-200">
                        {schoolClass?.namaKelas || (student.status === 'lulus' ? 'Alumni' : '-')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Tahun Masuk</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {student.tahunMasuk} {student.tahunLulus ? `(Lulus: ${student.tahunLulus})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barcode & QR Code Section */}
              <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-inner">
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Kode Absensi Gerbang
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    ID: {student.barcodeToken}
                  </span>
                </div>

                {/* 1D Barcode */}
                <div className="w-full flex justify-center">
                  <BarcodeSVG
                    value={student.barcodeToken}
                    width={260}
                    height={58}
                    showText={true}
                  />
                </div>

                <div className="w-full border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 leading-tight">
                    Scan pada Terminal Absensi Gerbang untuk presensi Masuk & Pulang
                  </span>
                  <QRCodeSVG value={student.barcodeToken} size={42} className="shrink-0 p-1" />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
              <span>Berlaku selama menjadi peserta didik</span>
              <span className="font-mono">VERIFIED ID</span>
            </div>
          </div>
        </div>

        {/* Modal footer hints */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Gunakan kartu ini untuk absensi barcode harian saat masuk dan pulang.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
