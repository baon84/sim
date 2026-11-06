export type UserRole = 'admin' | 'guru' | 'kepsek' | 'siswa' | 'ortu';

export type AttendanceStatusDaily = 'hadir' | 'terlambat' | 'sakit' | 'izin' | 'alpa';
export type AttendanceStatusClass = 'hadir' | 'sakit' | 'ijin' | 'alpa' | 'bolos';

export interface Student {
  id: string;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  kelasId: string; // references Class.id, or null/empty if alumni
  status: 'aktif' | 'lulus' | 'pindah';
  tahunMasuk: number;
  tahunLulus?: number;
  namaOrangTua: string;
  kontakOrangTua: string;
  alamat: string;
  fotoUrl?: string;
  barcodeToken: string; // token/barcode string (usually NISN or custom code)
}

export interface Teacher {
  id: string;
  nip: string;
  nama: string;
  gelar: string;
  mataPelajaranUtama: string; // e.g. "Matematika", "Bahasa Indonesia"
  telepon: string;
  email: string;
  jabatan: 'guru_mapel' | 'wali_kelas';
  kelasWaliId?: string;
}

export interface Headmaster {
  id: string;
  nip: string;
  nama: string;
  gelar: string;
  periode: string;
  telepon: string;
  email: string;
  sambutan?: string;
}

export interface SchoolClass {
  id: string;
  namaKelas: string; // e.g. "X-A", "XI-IPA 1", "XII-MIPA 1"
  tingkat: 'X' | 'XI' | 'XII';
  jurusan: 'IPA' | 'IPS' | 'Umum' | 'Bahasa';
  waliKelasId: string; // references Teacher.id
  tahunAjaran: string; // e.g. "2025/2026"
  ruangan: string;
}

export interface Subject {
  id: string;
  kodeMapel: string;
  namaMapel: string;
  kkm: number; // Kriteria Ketuntasan Minimal (misal 75)
  kategori: 'Wajib' | 'Peminatan' | 'Muatan Lokal';
}

export interface Schedule {
  id: string;
  kelasId: string;
  teacherId: string;
  subjectId: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string; // "07:30"
  jamSelesai: string; // "09:00"
  ruangan?: string;
}

export interface AttendanceDaily {
  id: string;
  studentId: string;
  tanggal: string; // YYYY-MM-DD
  jamMasuk?: string; // "06:55"
  jamPulang?: string; // "14:15"
  status: AttendanceStatusDaily;
  metode: 'barcode' | 'manual';
  keterangan?: string;
}

export interface AttendanceClassSession {
  id: string;
  scheduleId: string;
  teacherId: string;
  subjectId: string;
  kelasId: string;
  tanggal: string; // YYYY-MM-DD
  jam: string; // "07:30 - 09:00"
  materiAjar: string;
  createdAt: string;
  records: {
    studentId: string;
    status: AttendanceStatusClass;
    catatan?: string;
  }[];
}

export interface TeacherAbsenceReport {
  id: string;
  scheduleId: string;
  studentId: string; // Pelapor
  studentName: string;
  studentNisn: string;
  kelasId: string;
  kelasNama: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  tanggal: string; // YYYY-MM-DD
  jamKbm: string;
  keterangan: string;
  createdAt: string;
  status: 'menunggu_tindak_lanjut' | 'diverifikasi' | 'selesai';
  catatanKepsek?: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  subjectId: string;
  kelasId: string;
  tahunAjaran: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  tugas1: number;
  tugas2: number;
  uts: number;
  uas: number;
  nilaiRaport: number; // weighted or average
  capaianKompetensi?: string;
  predikat?: 'A' | 'B' | 'C' | 'D';
}

export interface Announcement {
  id: string;
  judul: string;
  konten: string;
  kategori: 'sekolah' | 'akademik' | 'kegiatan' | 'wali_kelas';
  authorName: string;
  targetRole: 'semua' | 'siswa' | 'guru' | 'ortu';
  targetKelasId?: string; // optional: only for specific class
  tanggal: string;
  isImportant?: boolean;
}

export interface CurrentUser {
  role: UserRole;
  identifier: string; // username, nisn, or nip
  name: string;
  studentId?: string; // for siswa or ortu
  teacherId?: string; // for guru
  headmasterId?: string; // for kepsek
}
