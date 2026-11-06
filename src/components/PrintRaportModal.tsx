import React from 'react';
import { Student, SchoolClass, Subject, StudentGrade, Teacher, Headmaster } from '../types';
import { X, Printer, Download, Award, CheckCircle } from 'lucide-react';

interface Props {
  student: Student;
  schoolClass?: SchoolClass;
  subjects: Subject[];
  grades: StudentGrade[];
  waliKelas?: Teacher;
  headmaster: Headmaster;
  semester?: 'Ganjil' | 'Genap';
  tahunAjaran?: string;
  onClose: () => void;
}

export const PrintRaportModal: React.FC<Props> = ({
  student,
  schoolClass,
  subjects,
  grades,
  waliKelas,
  headmaster,
  semester = 'Ganjil',
  tahunAjaran = '2025/2026',
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Map subjects with grades
  const subjectGrades = subjects.map((sbj) => {
    const found = grades.find(
      (g) =>
        g.studentId === student.id &&
        g.subjectId === sbj.id &&
        (!g.semester || g.semester === semester)
    );
    return {
      subject: sbj,
      grade: found
    };
  });

  // Calculate average
  const gradedList = subjectGrades.filter((sg) => sg.grade && sg.grade.nilaiRaport);
  const averageScore = gradedList.length > 0
    ? Math.round(gradedList.reduce((acc, curr) => acc + (curr.grade?.nilaiRaport || 0), 0) / gradedList.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white shrink-0 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-sm">Cetak Laporan Hasil Belajar (Raport Resmi)</h3>
              <p className="text-xs text-slate-300">Format Standar Kurikulum Nasional • Siap Cetak & PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100 flex justify-center">
          <div className="bg-white w-full max-w-3xl p-8 md:p-12 shadow-md rounded-xl text-slate-900 text-xs leading-relaxed border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Kop Surat Resmi */}
            <div className="border-b-2 border-slate-900 pb-3 mb-6 flex items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center font-extrabold text-xl text-slate-900 shrink-0">
                SMA
              </div>
              <div className="flex-1 text-center">
                <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-700">
                  PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA
                </h4>
                <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-700">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h4>
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-950 mt-0.5">
                  SMA NEGERI 1 NUSANTARA
                </h2>
                <p className="text-[10px] text-slate-600">
                  Jalan Pendidikan Karakter No. 1, Telp: (021) 88776655, Faksimile: (021) 88776656
                </p>
                <p className="text-[10px] text-slate-600">
                  Laman: www.sman1nusantara.sch.id • Pos-el: info@sman1nusantara.sch.id
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-4">
              <h3 className="text-sm font-extrabold uppercase underline tracking-wide">
                LAPORAN CAPAIAN KOMPETENSI PESERTA DIDIK
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Tahun Ajaran {tahunAjaran} — Semester {semester}
              </p>
            </div>

            {/* Student Biodata Table */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs mb-5 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
              <div className="flex">
                <span className="w-32 text-slate-600">Nama Peserta Didik</span>
                <span className="font-bold text-slate-900">: {student.nama}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Kelas / Fase</span>
                <span className="font-semibold text-slate-900">: {schoolClass?.namaKelas || (student.status === 'lulus' ? 'Alumni' : '-')}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-600">Nomor Induk Siswa (NISN)</span>
                <span className="font-mono font-semibold text-slate-900">: {student.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Semester</span>
                <span className="font-semibold text-slate-900">: {semester}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-600">Sekolah</span>
                <span className="text-slate-900">: SMA Negeri 1 Nusantara</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Tahun Pelajaran</span>
                <span className="text-slate-900">: {tahunAjaran}</span>
              </div>
            </div>

            {/* Main Grades Table */}
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase mb-2 text-slate-800">
                A. Nilai Hasil Belajar & Capaian Kompetensi
              </h4>
              <div className="overflow-x-auto border border-slate-300 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-[11px]">
                      <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                      <th className="p-2 border-r border-slate-300">Mata Pelajaran</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">KKM</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">T1</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">T2</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">UTS</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">UAS</th>
                      <th className="p-2 border-r border-slate-300 w-14 text-center font-bold bg-slate-200">Nilai Akhir</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">Predikat</th>
                      <th className="p-2">Deskripsi Capaian Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {subjectGrades.map((item, idx) => {
                      const g = item.grade;
                      return (
                        <tr key={item.subject.id} className="hover:bg-slate-50/50">
                          <td className="p-2 border-r border-slate-200 text-center text-slate-500 font-mono">
                            {idx + 1}
                          </td>
                          <td className="p-2 border-r border-slate-200 font-medium">
                            {item.subject.namaMapel}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-600">
                            {item.subject.kkm}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono">
                            {g ? g.tugas1 : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono">
                            {g ? g.tugas2 : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono">
                            {g ? g.uts : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono">
                            {g ? g.uas : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold font-mono bg-slate-50">
                            {g ? g.nilaiRaport : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-bold">
                            <span className={g?.predikat === 'A' ? 'text-emerald-700' : g?.predikat === 'B' ? 'text-blue-700' : 'text-slate-700'}>
                              {g ? g.predikat || (g.nilaiRaport >= 90 ? 'A' : g.nilaiRaport >= 80 ? 'B' : g.nilaiRaport >= 70 ? 'C' : 'D') : '-'}
                            </span>
                          </td>
                          <td className="p-2 text-[10px] text-slate-600 leading-tight">
                            {g?.capaianKompetensi || (g?.nilaiRaport && g.nilaiRaport >= 75 ? 'Menunjukkan penguasaan materi yang baik sesuai target KKM.' : 'Memerlukan bimbingan lanjutan pada materi esensial.') || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t border-slate-300">
                      <td colSpan={7} className="p-2 text-right border-r border-slate-300">
                        Rata-Rata Nilai Akhir Peserta Didik:
                      </td>
                      <td className="p-2 text-center font-mono bg-emerald-100 text-emerald-900 border-r border-slate-300">
                        {averageScore}
                      </td>
                      <td colSpan={2} className="p-2 text-xs text-slate-700">
                        Status: {averageScore >= 75 ? 'Tuntas / Sangat Memuaskan' : 'Perlu Pendampingan'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Attendance & Notes */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Rekap Kehadiran */}
              <div className="border border-slate-300 rounded p-3">
                <h5 className="font-bold text-xs uppercase mb-2 text-slate-800">B. Ketidakhadiran</h5>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 text-slate-600">1. Sakit</td>
                      <td className="py-1 font-mono text-right font-medium">1 hari</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 text-slate-600">2. Izin</td>
                      <td className="py-1 font-mono text-right font-medium">0 hari</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-600">3. Tanpa Keterangan (Alpa)</td>
                      <td className="py-1 font-mono text-right font-medium">0 hari</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Catatan Wali Kelas */}
              <div className="border border-slate-300 rounded p-3 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs uppercase mb-1 text-slate-800">C. Catatan Wali Kelas</h5>
                  <p className="text-[11px] text-slate-700 italic leading-relaxed">
                    "Ananda menunjukkan kedisiplinan dan sopan santun yang luar biasa dalam mengikuti pembelajaran. Terus pertahankan prestasi dan kembangkan potensi kepemimpinan."
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 text-right mt-2">
                  Ditetapkan di Jakarta, 18 Desember 2026
                </div>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-3 gap-4 text-center text-xs mt-10 pt-4 print:mt-16">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-semibold text-slate-800">Orang Tua / Wali Murid</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 border-b border-slate-900 inline-block px-4">
                  ( {student.namaOrangTua} )
                </p>
              </div>

              <div>
                <p className="text-slate-600">Wali Kelas {schoolClass?.namaKelas || ''}</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 border-b border-slate-900 inline-block px-4">
                  {waliKelas?.nama || 'Drs. Budi Santoso'}, {waliKelas?.gelar || 'M.Si'}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                  NIP. {waliKelas?.nip || '198203152008011004'}
                </p>
              </div>

              <div>
                <p className="text-slate-600">Kepala Sekolah,</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 border-b border-slate-900 inline-block px-4">
                  {headmaster.nama}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                  NIP. {headmaster.nip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom note */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Raport dapat dicetak menggunakan kertas F4 / A4 atau disimpan dalam bentuk PDF melalui menu print browser.</span>
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
