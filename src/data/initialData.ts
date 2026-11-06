import {
  Student,
  Teacher,
  Headmaster,
  SchoolClass,
  Subject,
  Schedule,
  AttendanceDaily,
  AttendanceClassSession,
  TeacherAbsenceReport,
  StudentGrade,
  Announcement
} from '../types';

export const INITIAL_HEADMASTER: Headmaster = {
  id: 'kepsek-1',
  nip: '197001011995031001',
  nama: 'Dr. H. Ahmad Dahlan, M.Pd',
  gelar: 'M.Pd',
  periode: '2022 - 2026',
  telepon: '081234567890',
  email: 'kepsek@sman1nusantara.sch.id',
  sambutan: 'Mewujudkan generasi unggul, berkarakter, dan berdaya saing global melalui kedisiplinan dan transparansi teknologi.'
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    nip: '197805122003122001',
    nama: 'Dra. Hj. Siti Nurjanah',
    gelar: 'M.Pd',
    mataPelajaranUtama: 'Matematika',
    telepon: '081211112222',
    email: 'siti.nurjanah@sman1nusantara.sch.id',
    jabatan: 'wali_kelas',
    kelasWaliId: 'cls-1'
  },
  {
    id: 'tch-2',
    nip: '198203152008011004',
    nama: 'Drs. Budi Santoso',
    gelar: 'M.Si',
    mataPelajaranUtama: 'Fisika',
    telepon: '081233334444',
    email: 'budi.santoso@sman1nusantara.sch.id',
    jabatan: 'wali_kelas',
    kelasWaliId: 'cls-2'
  },
  {
    id: 'tch-3',
    nip: '198906202014022003',
    nama: 'Rina Melati',
    gelar: 'S.Pd',
    mataPelajaranUtama: 'Bahasa Indonesia',
    telepon: '081255556666',
    email: 'rina.melati@sman1nusantara.sch.id',
    jabatan: 'wali_kelas',
    kelasWaliId: 'cls-3'
  },
  {
    id: 'tch-4',
    nip: '198511042010011008',
    nama: 'Hendra Kurniawan',
    gelar: 'M.Pd',
    mataPelajaranUtama: 'Bahasa Inggris',
    telepon: '081277778888',
    email: 'hendra.kurniawan@sman1nusantara.sch.id',
    jabatan: 'wali_kelas',
    kelasWaliId: 'cls-4'
  },
  {
    id: 'tch-5',
    nip: '199109082019031006',
    nama: 'Ahmad Fauzi',
    gelar: 'S.Kom',
    mataPelajaranUtama: 'Informatika',
    telepon: '081299990000',
    email: 'ahmad.fauzi@sman1nusantara.sch.id',
    jabatan: 'guru_mapel'
  },
  {
    id: 'tch-6',
    nip: '199304142020122011',
    nama: 'Dewi Lestari',
    gelar: 'S.Pd',
    mataPelajaranUtama: 'Biologi',
    telepon: '081312345678',
    email: 'dewi.lestari@sman1nusantara.sch.id',
    jabatan: 'guru_mapel'
  }
];

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-1',
    namaKelas: 'X-A',
    tingkat: 'X',
    jurusan: 'Umum',
    waliKelasId: 'tch-1',
    tahunAjaran: '2025/2026',
    ruangan: 'Gedung A - R.101'
  },
  {
    id: 'cls-2',
    namaKelas: 'XI-IPA 1',
    tingkat: 'XI',
    jurusan: 'IPA',
    waliKelasId: 'tch-2',
    tahunAjaran: '2025/2026',
    ruangan: 'Gedung B - R.201'
  },
  {
    id: 'cls-3',
    namaKelas: 'XI-IPS 1',
    tingkat: 'XI',
    jurusan: 'IPS',
    waliKelasId: 'tch-3',
    tahunAjaran: '2025/2026',
    ruangan: 'Gedung B - R.202'
  },
  {
    id: 'cls-4',
    namaKelas: 'XII-MIPA 1',
    tingkat: 'XII',
    jurusan: 'IPA',
    waliKelasId: 'tch-4',
    tahunAjaran: '2025/2026',
    ruangan: 'Gedung C - R.301'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sbj-1', kodeMapel: 'MAT-W', namaMapel: 'Matematika', kkm: 75, kategori: 'Wajib' },
  { id: 'sbj-2', kodeMapel: 'BIN-W', namaMapel: 'Bahasa Indonesia', kkm: 75, kategori: 'Wajib' },
  { id: 'sbj-3', kodeMapel: 'BIG-W', namaMapel: 'Bahasa Inggris', kkm: 75, kategori: 'Wajib' },
  { id: 'sbj-4', kodeMapel: 'FIS-P', namaMapel: 'Fisika', kkm: 75, kategori: 'Peminatan' },
  { id: 'sbj-5', kodeMapel: 'BIO-P', namaMapel: 'Biologi', kkm: 75, kategori: 'Peminatan' },
  { id: 'sbj-6', kodeMapel: 'INF-W', namaMapel: 'Informatika', kkm: 75, kategori: 'Wajib' },
  { id: 'sbj-7', kodeMapel: 'PAI-W', namaMapel: 'Pendidikan Agama & Budi Pekerti', kkm: 78, kategori: 'Wajib' },
  { id: 'sbj-8', kodeMapel: 'SEJ-W', namaMapel: 'Sejarah Indonesia', kkm: 75, kategori: 'Wajib' }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0061234567',
    nama: 'Muhammad Rizky Pratama',
    jenisKelamin: 'L',
    kelasId: 'cls-2', // XI-IPA 1
    status: 'aktif',
    tahunMasuk: 2024,
    namaOrangTua: 'Joko Pratama',
    kontakOrangTua: '081288881234',
    alamat: 'Jl. Melati No. 14, Menteng, Jakarta Pusat',
    barcodeToken: '0061234567'
  },
  {
    id: 'std-2',
    nisn: '0067654321',
    nama: 'Siti Aisyah Azzahra',
    jenisKelamin: 'P',
    kelasId: 'cls-2', // XI-IPA 1
    status: 'aktif',
    tahunMasuk: 2024,
    namaOrangTua: 'Ratna Dewi',
    kontakOrangTua: '081277772345',
    alamat: 'Jl. Kenanga No. 8, Cikini, Jakarta Pusat',
    barcodeToken: '0067654321'
  },
  {
    id: 'std-3',
    nisn: '0063344556',
    nama: 'Kevin Arya Nugraha',
    jenisKelamin: 'L',
    kelasId: 'cls-2', // XI-IPA 1
    status: 'aktif',
    tahunMasuk: 2024,
    namaOrangTua: 'Bambang Nugraha',
    kontakOrangTua: '081344445566',
    alamat: 'Jl. Mawar No. 25, Tebet, Jakarta Selatan',
    barcodeToken: '0063344556'
  },
  {
    id: 'std-4',
    nisn: '0071122334',
    nama: 'Nadia Putri Maharani',
    jenisKelamin: 'P',
    kelasId: 'cls-1', // X-A
    status: 'aktif',
    tahunMasuk: 2025,
    namaOrangTua: 'Sri Wahyuni',
    kontakOrangTua: '081299991122',
    alamat: 'Jl. Anggrek No. 3, Kemayoran, Jakarta Pusat',
    barcodeToken: '0071122334'
  },
  {
    id: 'std-5',
    nisn: '0079988776',
    nama: 'Dimas Aditya Putra',
    jenisKelamin: 'L',
    kelasId: 'cls-1', // X-A
    status: 'aktif',
    tahunMasuk: 2025,
    namaOrangTua: 'Gunawan Prasetyo',
    kontakOrangTua: '081255554321',
    alamat: 'Jl. Flamboyan No. 19, Rawamangun, Jakarta Timur',
    barcodeToken: '0079988776'
  },
  {
    id: 'std-6',
    nisn: '0055566778',
    nama: 'Farhan Maulana',
    jenisKelamin: 'L',
    kelasId: 'cls-4', // XII-MIPA 1
    status: 'aktif',
    tahunMasuk: 2023,
    namaOrangTua: 'H. Mansur',
    kontakOrangTua: '081266667788',
    alamat: 'Jl. Cendrawasih No. 11, Pasar Minggu, Jakarta Selatan',
    barcodeToken: '0055566778'
  },
  // ALUMNI
  {
    id: 'std-7',
    nisn: '0041122990',
    nama: 'Annisa Rahmawati (Alumni)',
    jenisKelamin: 'P',
    kelasId: '',
    status: 'lulus',
    tahunMasuk: 2021,
    tahunLulus: 2024,
    namaOrangTua: 'Ir. Hendro Suparno',
    kontakOrangTua: '081122334455',
    alamat: 'Jl. Salemba Raya No. 40, Jakarta Pusat',
    barcodeToken: '0041122990'
  },
  {
    id: 'std-8',
    nisn: '0038877665',
    nama: 'Bagas Dwi Cahyono (Alumni)',
    jenisKelamin: 'L',
    kelasId: '',
    status: 'lulus',
    tahunMasuk: 2020,
    tahunLulus: 2023,
    namaOrangTua: 'Suryanto',
    kontakOrangTua: '081333445566',
    alamat: 'Jl. Kramat Raya No. 77, Jakarta Pusat',
    barcodeToken: '0038877665'
  }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  // Jadwal Kelas XI-IPA 1
  {
    id: 'sch-1',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-2', // Drs. Budi Santoso
    subjectId: 'sbj-4', // Fisika
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'Lab Fisika'
  },
  {
    id: 'sch-2',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-1', // Dra. Hj. Siti Nurjanah
    subjectId: 'sbj-1', // Matematika
    hari: 'Senin',
    jamMulai: '09:15',
    jamSelesai: '10:45',
    ruangan: 'R.201'
  },
  {
    id: 'sch-3',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-3', // Rina Melati
    subjectId: 'sbj-2', // Bahasa Indonesia
    hari: 'Selasa',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'R.201'
  },
  {
    id: 'sch-4',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-4', // Hendra Kurniawan
    subjectId: 'sbj-3', // Bahasa Inggris
    hari: 'Rabu',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'R.201'
  },
  {
    id: 'sch-5',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-5', // Ahmad Fauzi
    subjectId: 'sbj-6', // Informatika
    hari: 'Kamis',
    jamMulai: '09:15',
    jamSelesai: '11:30',
    ruangan: 'Lab Komputer 1'
  },
  {
    id: 'sch-6',
    kelasId: 'cls-2', // XI-IPA 1
    teacherId: 'tch-6', // Dewi Lestari
    subjectId: 'sbj-5', // Biologi
    hari: 'Jumat',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'Lab Biologi'
  },

  // Jadwal Kelas X-A
  {
    id: 'sch-7',
    kelasId: 'cls-1', // X-A
    teacherId: 'tch-1', // Siti Nurjanah
    subjectId: 'sbj-1', // Matematika
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'R.101'
  },
  {
    id: 'sch-8',
    kelasId: 'cls-1', // X-A
    teacherId: 'tch-3', // Rina Melati
    subjectId: 'sbj-2', // B. Indo
    hari: 'Selasa',
    jamMulai: '09:15',
    jamSelesai: '10:45',
    ruangan: 'R.101'
  },

  // Jadwal Kelas XII-MIPA 1
  {
    id: 'sch-9',
    kelasId: 'cls-4', // XII-MIPA 1
    teacherId: 'tch-2', // Budi Santoso
    subjectId: 'sbj-4', // Fisika
    hari: 'Selasa',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'Lab Fisika'
  },
  {
    id: 'sch-10',
    kelasId: 'cls-4', // XII-MIPA 1
    teacherId: 'tch-4', // Hendra Kurniawan
    subjectId: 'sbj-3', // B. Inggris
    hari: 'Kamis',
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: 'R.301'
  }
];

// Helper get today YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const today = getTodayDateString();

export const INITIAL_DAILY_ATTENDANCE: AttendanceDaily[] = [
  {
    id: 'att-1',
    studentId: 'std-1', // Rizky
    tanggal: today,
    jamMasuk: '06:50',
    jamPulang: '14:30',
    status: 'hadir',
    metode: 'barcode',
    keterangan: 'Tepat waktu gerbang utama'
  },
  {
    id: 'att-2',
    studentId: 'std-2', // Aisyah
    tanggal: today,
    jamMasuk: '07:05',
    jamPulang: '14:30',
    status: 'hadir',
    metode: 'barcode',
    keterangan: 'Tepat waktu'
  },
  {
    id: 'att-3',
    studentId: 'std-3', // Kevin
    tanggal: today,
    jamMasuk: '07:22',
    jamPulang: undefined,
    status: 'terlambat',
    metode: 'barcode',
    keterangan: 'Terlambat 7 menit (kemacetan)'
  },
  {
    id: 'att-4',
    studentId: 'std-4', // Nadia
    tanggal: today,
    jamMasuk: '06:45',
    jamPulang: '14:15',
    status: 'hadir',
    metode: 'barcode'
  },
  {
    id: 'att-5',
    studentId: 'std-5', // Dimas
    tanggal: today,
    jamMasuk: undefined,
    jamPulang: undefined,
    status: 'sakit',
    metode: 'manual',
    keterangan: 'Surat dokter terlampir'
  },
  // Past days for Rizky to show rich percentage
  {
    id: 'att-prev-1',
    studentId: 'std-1',
    tanggal: '2026-11-05',
    jamMasuk: '06:55',
    jamPulang: '14:30',
    status: 'hadir',
    metode: 'barcode'
  },
  {
    id: 'att-prev-2',
    studentId: 'std-1',
    tanggal: '2026-11-04',
    jamMasuk: '06:52',
    jamPulang: '14:35',
    status: 'hadir',
    metode: 'barcode'
  },
  {
    id: 'att-prev-3',
    studentId: 'std-1',
    tanggal: '2026-11-03',
    jamMasuk: '07:18',
    jamPulang: '14:30',
    status: 'terlambat',
    metode: 'barcode'
  },
  {
    id: 'att-prev-4',
    studentId: 'std-1',
    tanggal: '2026-11-02',
    jamMasuk: '06:50',
    jamPulang: '14:30',
    status: 'hadir',
    metode: 'barcode'
  }
];

export const INITIAL_CLASS_ATTENDANCE: AttendanceClassSession[] = [
  {
    id: 'acs-1',
    scheduleId: 'sch-1',
    teacherId: 'tch-2', // Drs. Budi Santoso
    subjectId: 'sbj-4', // Fisika
    kelasId: 'cls-2', // XI-IPA 1
    tanggal: today,
    jam: '07:30 - 09:00',
    materiAjar: 'Dinamika Rotasi dan Momen Inersia Benda Tegar',
    createdAt: new Date().toISOString(),
    records: [
      { studentId: 'std-1', status: 'hadir', catatan: 'Aktif bertanya' },
      { studentId: 'std-2', status: 'hadir', catatan: 'Sangat baik' },
      { studentId: 'std-3', status: 'hadir', catatan: 'Mengikuti KBM' }
    ]
  },
  {
    id: 'acs-2',
    scheduleId: 'sch-3',
    teacherId: 'tch-3', // Rina Melati
    subjectId: 'sbj-2', // Bahasa Indonesia
    kelasId: 'cls-2', // XI-IPA 1
    tanggal: '2026-11-05',
    jam: '07:30 - 09:00',
    materiAjar: 'Analisis Struktur Teks Eksplanasi Fenomena Sosial',
    createdAt: '2026-11-05T08:45:00Z',
    records: [
      { studentId: 'std-1', status: 'hadir' },
      { studentId: 'std-2', status: 'hadir' },
      { studentId: 'std-3', status: 'bolos', catatan: 'Meninggalkan kelas setelah istirahat' }
    ]
  }
];

export const INITIAL_TEACHER_REPORTS: TeacherAbsenceReport[] = [
  {
    id: 'rpt-1',
    scheduleId: 'sch-2',
    studentId: 'std-1',
    studentName: 'Muhammad Rizky Pratama',
    studentNisn: '0061234567',
    kelasId: 'cls-2',
    kelasNama: 'XI-IPA 1',
    teacherId: 'tch-1',
    teacherName: 'Dra. Hj. Siti Nurjanah',
    subjectName: 'Matematika',
    tanggal: today,
    jamKbm: '09:15 - 10:45',
    keterangan: 'Ibu Guru belum hadir di kelas sudah lebih dari 25 menit dan belum ada tugas pengganti yang diberikan.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'menunggu_tindak_lanjut'
  }
];

export const INITIAL_GRADES: StudentGrade[] = [
  // Rizky Pratama (XI-IPA 1)
  {
    id: 'grd-1',
    studentId: 'std-1',
    subjectId: 'sbj-1', // Matematika
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 88,
    tugas2: 90,
    uts: 85,
    uas: 92,
    nilaiRaport: 89,
    predikat: 'A',
    capaianKompetensi: 'Sangat menguasai konsep kalkulus dasar dan matriks.'
  },
  {
    id: 'grd-2',
    studentId: 'std-1',
    subjectId: 'sbj-4', // Fisika
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 85,
    tugas2: 82,
    uts: 80,
    uas: 88,
    nilaiRaport: 84,
    predikat: 'B',
    capaianKompetensi: 'Menunjukkan pemahaman yang baik dalam mekanika fluida.'
  },
  {
    id: 'grd-3',
    studentId: 'std-1',
    subjectId: 'sbj-2', // B. Indonesia
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 92,
    tugas2: 90,
    uts: 88,
    uas: 94,
    nilaiRaport: 91,
    predikat: 'A',
    capaianKompetensi: 'Sangat terampil dalam menyusun karya tulis ilmiah.'
  },
  {
    id: 'grd-4',
    studentId: 'std-1',
    subjectId: 'sbj-3', // B. Inggris
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 86,
    tugas2: 88,
    uts: 84,
    uas: 89,
    nilaiRaport: 87,
    predikat: 'B',
    capaianKompetensi: 'Mampu berdialog dan presentasi berbahasa Inggris dengan lancar.'
  },
  {
    id: 'grd-5',
    studentId: 'std-1',
    subjectId: 'sbj-6', // Informatika
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 95,
    tugas2: 98,
    uts: 92,
    uas: 96,
    nilaiRaport: 95,
    predikat: 'A',
    capaianKompetensi: 'Sangat mahir dalam pemecahan algoritma dan desain web.'
  },

  // Siti Aisyah (XI-IPA 1)
  {
    id: 'grd-6',
    studentId: 'std-2',
    subjectId: 'sbj-1',
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 94,
    tugas2: 92,
    uts: 90,
    uas: 95,
    nilaiRaport: 93,
    predikat: 'A',
    capaianKompetensi: 'Sangat unggul dalam analisis aljabar dan statistika.'
  },
  {
    id: 'grd-7',
    studentId: 'std-2',
    subjectId: 'sbj-4',
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 90,
    tugas2: 91,
    uts: 88,
    uas: 92,
    nilaiRaport: 90,
    predikat: 'A',
    capaianKompetensi: 'Memahami konsep termodinamika secara mendalam.'
  },

  // Kevin Arya (XI-IPA 1)
  {
    id: 'grd-8',
    studentId: 'std-3',
    subjectId: 'sbj-1',
    kelasId: 'cls-2',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    tugas1: 78,
    tugas2: 75,
    uts: 72,
    uas: 79,
    nilaiRaport: 76,
    predikat: 'C',
    capaianKompetensi: 'Cukup memahami konsep dasar kalkulus, perlu peningkatan latihan.'
  },

  // Alumni 1: Annisa Rahmawati (Lulus 2024)
  {
    id: 'grd-alumni-1',
    studentId: 'std-7',
    subjectId: 'sbj-1',
    kelasId: 'cls-4',
    tahunAjaran: '2023/2024',
    semester: 'Genap',
    tugas1: 95,
    tugas2: 96,
    uts: 94,
    uas: 98,
    nilaiRaport: 96,
    predikat: 'A',
    capaianKompetensi: 'Lulusan terbaik bidang Sains dan Matematika.'
  },
  {
    id: 'grd-alumni-2',
    studentId: 'std-7',
    subjectId: 'sbj-4',
    kelasId: 'cls-4',
    tahunAjaran: '2023/2024',
    semester: 'Genap',
    tugas1: 92,
    tugas2: 94,
    uts: 90,
    uas: 95,
    nilaiRaport: 93,
    predikat: 'A',
    capaianKompetensi: 'Penguasaan fisika modern luar biasa.'
  },
  // Alumni 2: Bagas Dwi Cahyono (Lulus 2023)
  {
    id: 'grd-alumni-3',
    studentId: 'std-8',
    subjectId: 'sbj-1',
    kelasId: 'cls-4',
    tahunAjaran: '2022/2023',
    semester: 'Genap',
    tugas1: 88,
    tugas2: 85,
    uts: 84,
    uas: 89,
    nilaiRaport: 87,
    predikat: 'B',
    capaianKompetensi: 'Memuaskan dalam aljabar dan kalkulus.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    judul: 'Pelaksanaan Penilaian Akhir Semester (PAS) Ganjil 2025/2026',
    konten: 'Diberitahukan kepada seluruh peserta didik dan wali murid bahwa pelaksanaan PAS Ganjil akan dimulai pada tanggal 1 Desember 2026. Mohon para siswa menjaga kesehatan dan melunasi administrasi terkait.',
    kategori: 'akademik',
    authorName: 'Bagian Kurikulum',
    targetRole: 'semua',
    tanggal: today,
    isImportant: true
  },
  {
    id: 'anc-2',
    judul: 'Pemberitahuan Jam Masuk & Gerbang Barcode Kios',
    konten: 'Mulai pekan ini, sistem absensi barcode telah diaktifkan penuh di gerbang barat dan timur. Siswa wajib scan sebelum pukul 07.15 WIB. Siswa yang scan setelah pukul 07.15 WIB akan terdata sebagai terlambat otomatis.',
    kategori: 'sekolah',
    authorName: 'Kesiswaan & Tata Tertib',
    targetRole: 'siswa',
    tanggal: today,
    isImportant: true
  },
  {
    id: 'anc-3',
    judul: 'Tugas Proyek Fisika: Pembuatan Video Simulasi Turbin',
    konten: 'Khusus kelas XI-IPA 1: Pengumpulan link video proyek fisika materi Dinamika Rotasi paling lambat hari Jumat pukul 23:59 WIB melalui portal tugas.',
    kategori: 'wali_kelas',
    authorName: 'Drs. Budi Santoso (Guru Fisika)',
    targetRole: 'siswa',
    targetKelasId: 'cls-2',
    tanggal: today,
    isImportant: false
  }
];
