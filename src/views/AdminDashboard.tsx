import React, { useState } from 'react';
import {
  Student,
  SchoolClass,
  Teacher,
  Headmaster,
  Subject,
  Schedule,
  StudentGrade,
  AttendanceClassSession,
  TeacherAbsenceReport,
  AttendanceDaily
} from '../types';
import { Storage } from '../utils/storage';
import { StudentIdCardModal } from '../components/StudentIdCardModal';
import { PrintRaportModal } from '../components/PrintRaportModal';
import {
  Shield,
  Users,
  School,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  UserCheck,
  GraduationCap,
  Printer,
  Plus,
  Search,
  Filter,
  Check,
  Edit,
  Trash2,
  ArrowRight,
  ScanLine,
  UserPlus,
  RefreshCw,
  FolderArchive
} from 'lucide-react';

interface Props {
  students: Student[];
  classes: SchoolClass[];
  teachers: Teacher[];
  headmaster: Headmaster;
  subjects: Subject[];
  schedules: Schedule[];
  grades: StudentGrade[];
  classAttendances: AttendanceClassSession[];
  teacherReports: TeacherAbsenceReport[];
  dailyAttendances: AttendanceDaily[];
  onStudentsUpdate: (s: Student[]) => void;
  onClassesUpdate: (c: SchoolClass[]) => void;
  onTeachersUpdate: (t: Teacher[]) => void;
  onHeadmasterUpdate: (h: Headmaster) => void;
  onSchedulesUpdate: (sch: Schedule[]) => void;
  onGradesUpdate: (g: StudentGrade[]) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  students,
  classes,
  teachers,
  headmaster,
  subjects,
  schedules,
  grades,
  classAttendances,
  teacherReports,
  dailyAttendances,
  onStudentsUpdate,
  onClassesUpdate,
  onTeachersUpdate,
  onHeadmasterUpdate,
  onSchedulesUpdate,
  onGradesUpdate
}) => {
  const [activeTab, setActiveTab] = useState<
    'siswa' | 'kelas' | 'guru' | 'jadwal' | 'rekap_nilai' | 'kenaikan_kelas' | 'alumni' | 'kehadiran_guru'
  >('siswa');

  // Modals
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [selectedStudentForRaport, setSelectedStudentForRaport] = useState<Student | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // 1. DATA SISWA STATE & FORM
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    nama: '',
    jenisKelamin: 'L' as 'L' | 'P',
    kelasId: classes[0]?.id || '',
    namaOrangTua: '',
    kontakOrangTua: '',
    alamat: ''
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.nisn.trim() || !newStudent.nama.trim()) return;

    const student: Student = {
      id: `std-${Date.now()}`,
      nisn: newStudent.nisn.trim(),
      nama: newStudent.nama.trim(),
      jenisKelamin: newStudent.jenisKelamin,
      kelasId: newStudent.kelasId,
      status: 'aktif',
      tahunMasuk: new Date().getFullYear(),
      namaOrangTua: newStudent.namaOrangTua.trim() || 'Orang Tua Murid',
      kontakOrangTua: newStudent.kontakOrangTua.trim() || '-',
      alamat: newStudent.alamat.trim() || 'Jakarta',
      barcodeToken: newStudent.nisn.trim()
    };

    const updated = [student, ...students];
    Storage.setStudents(updated);
    onStudentsUpdate(updated);

    setShowAddStudentModal(false);
    setNewStudent({
      nisn: '',
      nama: '',
      jenisKelamin: 'L',
      kelasId: classes[0]?.id || '',
      namaOrangTua: '',
      kontakOrangTua: '',
      alamat: ''
    });
  };

  // 2. DATA KELAS STATE & FORM
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    namaKelas: '',
    tingkat: 'X' as 'X' | 'XI' | 'XII',
    jurusan: 'IPA' as 'IPA' | 'IPS' | 'Umum' | 'Bahasa',
    waliKelasId: teachers[0]?.id || '',
    ruangan: ''
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.namaKelas.trim()) return;

    const c: SchoolClass = {
      id: `cls-${Date.now()}`,
      namaKelas: newClass.namaKelas.trim(),
      tingkat: newClass.tingkat,
      jurusan: newClass.jurusan,
      waliKelasId: newClass.waliKelasId,
      tahunAjaran: '2025/2026',
      ruangan: newClass.ruangan.trim() || 'Gedung Utama'
    };

    const updated = [...classes, c];
    Storage.setClasses(updated);
    onClassesUpdate(updated);
    setShowAddClassModal(false);
    setNewClass({
      namaKelas: '',
      tingkat: 'X',
      jurusan: 'IPA',
      waliKelasId: teachers[0]?.id || '',
      ruangan: ''
    });
  };

  // 3. DATA GURU & KEPSEK FORM
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    nip: '',
    nama: '',
    gelar: 'S.Pd',
    mataPelajaranUtama: 'Matematika',
    telepon: '',
    email: '',
    jabatan: 'guru_mapel' as 'guru_mapel' | 'wali_kelas'
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.nip.trim() || !newTeacher.nama.trim()) return;

    const t: Teacher = {
      id: `tch-${Date.now()}`,
      nip: newTeacher.nip.trim(),
      nama: newTeacher.nama.trim(),
      gelar: newTeacher.gelar.trim(),
      mataPelajaranUtama: newTeacher.mataPelajaranUtama.trim(),
      telepon: newTeacher.telepon.trim() || '0812000000',
      email: newTeacher.email.trim() || `${newTeacher.nip}@sman1nusantara.sch.id`,
      jabatan: newTeacher.jabatan
    };

    const updated = [...teachers, t];
    Storage.setTeachers(updated);
    onTeachersUpdate(updated);
    setShowAddTeacherModal(false);
  };

  // 4. JADWAL PELAJARAN FORM
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    kelasId: classes[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    hari: 'Senin' as Schedule['hari'],
    jamMulai: '07:30',
    jamSelesai: '09:00',
    ruangan: ''
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    const sch: Schedule = {
      id: `sch-${Date.now()}`,
      kelasId: newSchedule.kelasId,
      teacherId: newSchedule.teacherId,
      subjectId: newSchedule.subjectId,
      hari: newSchedule.hari,
      jamMulai: newSchedule.jamMulai,
      jamSelesai: newSchedule.jamSelesai,
      ruangan: newSchedule.ruangan || 'Ruang Kelas'
    };

    const updated = [...schedules, sch];
    Storage.setSchedules(updated);
    onSchedulesUpdate(updated);
    setShowAddScheduleModal(false);
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Hapus jadwal pelajaran ini?')) {
      const updated = schedules.filter((s) => s.id !== id);
      Storage.setSchedules(updated);
      onSchedulesUpdate(updated);
    }
  };

  // 5. REKAP NILAI SISWA & PENCARIAN ALUMNI
  const [rekapSearch, setRekapSearch] = useState('');
  const [rekapTahun, setRekapTahun] = useState('Semua');
  const [rekapSemester, setRekapSemester] = useState<'Semua' | 'Ganjil' | 'Genap'>('Semua');

  // Filter students (including alumni!)
  const filteredStudentsForGrades = students.filter((s) => {
    const matchName =
      s.nama.toLowerCase().includes(rekapSearch.toLowerCase()) ||
      s.nisn.includes(rekapSearch);
    const matchTahun =
      rekapTahun === 'Semua' ||
      s.tahunMasuk.toString() === rekapTahun ||
      (s.tahunLulus && s.tahunLulus.toString() === rekapTahun);
    return matchName && matchTahun;
  });

  // 6. KENAIKAN KELAS (Pindah Tingkat)
  const [promotionSourceClass, setPromotionSourceClass] = useState(classes[0]?.id || '');
  const [promotionTargetClass, setPromotionTargetClass] = useState(classes[1]?.id || '');
  const [selectedForPromotion, setSelectedForPromotion] = useState<string[]>([]);
  const [promotionSuccessMsg, setPromotionSuccessMsg] = useState('');

  const sourceStudents = students.filter((s) => s.kelasId === promotionSourceClass && s.status === 'aktif');

  const toggleSelectAllPromotion = () => {
    if (selectedForPromotion.length === sourceStudents.length) {
      setSelectedForPromotion([]);
    } else {
      setSelectedForPromotion(sourceStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudentPromotion = (id: string) => {
    setSelectedForPromotion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecutePromotion = () => {
    if (selectedForPromotion.length === 0 || !promotionTargetClass) return;

    const target = classes.find((c) => c.id === promotionTargetClass);

    const updated = students.map((s) => {
      if (selectedForPromotion.includes(s.id)) {
        return {
          ...s,
          kelasId: promotionTargetClass
        };
      }
      return s;
    });

    Storage.setStudents(updated);
    onStudentsUpdate(updated);

    setPromotionSuccessMsg(
      `Berhasil menaikkan / memindahkan ${selectedForPromotion.length} siswa ke Kelas ${target?.namaKelas}!`
    );
    setSelectedForPromotion([]);
    setTimeout(() => setPromotionSuccessMsg(''), 5000);
  };

  // 7. ALUMNI (Kelulusan Tingkat Akhir)
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear());
  const [alumniSuccessMsg, setAlumniSuccessMsg] = useState('');

  const activeStudentsTingkatAkhir = students.filter(
    (s) => s.status === 'aktif' && classes.find((c) => c.id === s.kelasId)?.tingkat === 'XII'
  );

  const handleGraduateStudent = (studentId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'lulus' as const,
          kelasId: '',
          tahunLulus: Number(graduationYear)
        };
      }
      return s;
    });

    Storage.setStudents(updated);
    onStudentsUpdate(updated);

    setAlumniSuccessMsg('Siswa berhasil diluluskan dan diarsipkan ke dalam Buku Induk Alumni!');
    setTimeout(() => setAlumniSuccessMsg(''), 4000);
  };

  const alumniList = students.filter((s) => s.status === 'lulus');

  // 8. KEHADIRAN GURU
  const teacherAttendanceStats = teachers.map((teacher) => {
    const teacherSchedules = schedules.filter((s) => s.teacherId === teacher.id);
    const journals = classAttendances.filter((ca) => ca.teacherId === teacher.id);
    const reports = teacherReports.filter((r) => r.teacherId === teacher.id);

    const baseSessions = teacherSchedules.length * 4 || 1;
    const filled = Math.min(journals.length * 3 + 1, baseSessions);
    const rate = Math.max(70, Math.min(100, Math.round((filled / baseSessions) * 100) - reports.length * 8));

    return {
      teacher,
      schedulesCount: teacherSchedules.length,
      journalsCount: journals.length,
      unattendedCount: reports.length,
      rate
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-purple-300 font-extrabold text-2xl shadow-inner">
              <Shield className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-400 text-slate-950 uppercase">
                  Pusat Administrasi & Kontrol
                </span>
                <span className="text-xs font-semibold text-purple-200">
                  Tahun Ajaran 2025/2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Panel Kontrol SIM Sekolah
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola Siswa, Kelas, Guru, Jadwal, Kenaikan Tingkat, Alumni & Rekap Nilai Raport
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 text-center">
              <span className="text-slate-300 block text-[10px] uppercase">Total Siswa Aktif</span>
              <strong className="text-lg font-mono font-bold text-white">
                {students.filter(s => s.status === 'aktif').length}
              </strong>
            </div>

            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 text-center">
              <span className="text-slate-300 block text-[10px] uppercase">Alumni Terdata</span>
              <strong className="text-lg font-mono font-bold text-purple-300">
                {alumniList.length}
              </strong>
            </div>

            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 text-center">
              <span className="text-slate-300 block text-[10px] uppercase">Tenaga Pendidik</span>
              <strong className="text-lg font-mono font-bold text-emerald-400">
                {teachers.length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('siswa')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'siswa'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Siswa</span>
        </button>

        <button
          onClick={() => setActiveTab('kelas')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'kelas'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Data Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('guru')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'guru'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Data Guru & Kepsek</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'jadwal'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Pelajaran</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap_nilai')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'rekap_nilai'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Rekap Nilai & Cetak Raport</span>
        </button>

        <button
          onClick={() => setActiveTab('kenaikan_kelas')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'kenaikan_kelas'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Kenaikan Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'alumni'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Alumni</span>
        </button>

        <button
          onClick={() => setActiveTab('kehadiran_guru')}
          className={`pb-3 px-3 transition cursor-pointer border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'kehadiran_guru'
              ? 'border-purple-600 text-purple-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Kehadiran Guru di Kelas</span>
        </button>
      </div>

      {/* Tab 1: Data Siswa */}
      {activeTab === 'siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Master Data Peserta Didik
              </h3>
              <p className="text-xs text-slate-500">
                Data siswa aktif, informasi orang tua, dan cetak kartu barcode absensi
              </p>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            >
              <option value="">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.namaKelas}
                </option>
              ))}
            </select>
          </div>

          {/* Students table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">L/P</th>
                  <th className="p-3">Orang Tua / Wali</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Kartu Barcode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter((s) => {
                    const matchName = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nisn.includes(searchQuery);
                    const matchCls = !filterClass || s.kelasId === filterClass;
                    return matchName && matchCls && s.status === 'aktif';
                  })
                  .map((st, idx) => {
                    const cls = classes.find((c) => c.id === st.kelasId);

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-mono font-semibold text-slate-700">{st.nisn}</td>
                        <td className="p-3">
                          <strong className="text-slate-900 block">{st.nama}</strong>
                          <span className="text-[10px] text-slate-400">Masuk: {st.tahunMasuk}</span>
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          {cls?.namaKelas || '-'}
                        </td>
                        <td className="p-3 font-mono">{st.jenisKelamin}</td>
                        <td className="p-3">
                          <span className="block text-slate-800 font-medium">{st.namaOrangTua}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{st.kontakOrangTua}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {st.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedStudentForCard(st)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 mx-auto"
                            title="Cetak Kartu Barcode"
                          >
                            <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lihat Kartu</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Data Kelas */}
      {activeTab === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Master Data Kelas & Rombel
              </h3>
              <p className="text-xs text-slate-500">
                Daftar rombongan belajar, tingkat pendidikan, dan wali kelas pengampu
              </p>
            </div>
            <button
              onClick={() => setShowAddClassModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map((cls) => {
              const wali = teachers.find((t) => t.id === cls.waliKelasId);
              const studentCount = students.filter((s) => s.kelasId === cls.id && s.status === 'aktif').length;

              return (
                <div key={cls.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      Kelas {cls.namaKelas}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                      Tingkat {cls.tingkat}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <p><strong>Jurusan:</strong> {cls.jurusan}</p>
                    <p><strong>Ruangan:</strong> {cls.ruangan}</p>
                    <p><strong>Wali Kelas:</strong> {wali ? `${wali.nama}, ${wali.gelar}` : '-'}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-500">Total Siswa:</span>
                    <strong className="text-slate-900">{studentCount} Peserta Didik</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Data Guru & Kepala Sekolah */}
      {activeTab === 'guru' && (
        <div className="space-y-6">
          {/* Kepala Sekolah Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900">
                <Award className="w-5 h-5 text-amber-600" />
                <h4 className="font-extrabold text-sm uppercase tracking-wider">
                  Data Kepala Sekolah Aktif
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                Pimpinan Institusi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Lengkap</span>
                <strong className="text-slate-900 text-sm">{headmaster.nama}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">NIP</span>
                <span className="font-mono font-bold text-slate-700">{headmaster.nip}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Periode Jabatan</span>
                <span className="text-slate-700">{headmaster.periode}</span>
              </div>
            </div>
          </div>

          {/* Teachers Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Master Data Tenaga Pendidik (Guru)
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar guru pengampu mata pelajaran dan wali kelas
                </p>
              </div>

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Guru Baru</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-8 text-center">No</th>
                    <th className="p-3">NIP</th>
                    <th className="p-3">Nama Guru & Gelar</th>
                    <th className="p-3">Mata Pelajaran Utama</th>
                    <th className="p-3">Kontak & Email</th>
                    <th className="p-3">Jabatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-mono font-semibold text-slate-700">{t.nip}</td>
                      <td className="p-3 font-bold text-slate-900">{t.nama}, {t.gelar}</td>
                      <td className="p-3 text-slate-700 font-medium">{t.mataPelajaranUtama}</td>
                      <td className="p-3">
                        <span className="block text-slate-800">{t.telepon}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.email}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {t.jabatan === 'wali_kelas' ? 'Wali Kelas' : 'Guru Mapel'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Input Jadwal Pelajaran */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Alokasi Jadwal Pelajaran KBM
              </h3>
              <p className="text-xs text-slate-500">
                Atur jadwal pelajaran, guru pengampu, kelas, hari, dan jam. (Otomatis memfilter mapel di portal guru)
              </p>
            </div>

            <button
              onClick={() => setShowAddScheduleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Input Jadwal Baru</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Hari</th>
                  <th className="p-3">Jam KBM</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Guru Pengampu</th>
                  <th className="p-3">Ruangan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sch) => {
                  const cls = classes.find((c) => c.id === sch.kelasId);
                  const tch = teachers.find((t) => t.id === sch.teacherId);
                  const sbj = subjects.find((s) => s.id === sch.subjectId);

                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900">{sch.hari}</td>
                      <td className="p-3 font-mono font-semibold text-purple-700">{sch.jamMulai} - {sch.jamSelesai}</td>
                      <td className="p-3 font-medium text-slate-800">Kelas {cls?.namaKelas}</td>
                      <td className="p-3 font-semibold text-slate-900">{sbj?.namaMapel}</td>
                      <td className="p-3 text-slate-700">{tch?.nama}, {tch?.gelar}</td>
                      <td className="p-3 text-slate-500">{sch.ruangan || cls?.ruangan}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteSchedule(sch.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Rekap Nilai Siswa & Cetak Raport (Searchable by Name, Year, including ALUMNI) */}
      {activeTab === 'rekap_nilai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Rekapitulasi Nilai Siswa & Cetak Raport (Arsip Permanen)
            </h3>
            <p className="text-xs text-slate-500">
              Pencarian nilai peserta didik aktif maupun <strong>Alumni yang telah lulus</strong>. Raport dapat dicetak langsung atau disimpan PDF.
            </p>
          </div>

          {/* Search Filters as requested: "nilai bisa dicari sesuai nama siswa, tahun, walaupun sudah alumni tapi nilainya bisa dicari" */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Cari Nama Siswa / NISN:</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama atau NISN siswa/alumni..."
                  value={rekapSearch}
                  onChange={(e) => setRekapSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Tahun Kelulusan / Angkatan:</label>
              <select
                value={rekapTahun}
                onChange={(e) => setRekapTahun(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Semua">Semua Tahun</option>
                <option value="2026">2026 (Aktif)</option>
                <option value="2025">2025 (Aktif)</option>
                <option value="2024">2024 (Alumni Lulus 2024)</option>
                <option value="2023">2023 (Alumni Lulus 2023)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Semester:</label>
              <select
                value={rekapSemester}
                onChange={(e) => setRekapSemester(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Semua">Semua Semester</option>
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          {/* Results table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Nama Siswa / Alumni</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Kelas / Tahun</th>
                  <th className="p-3">Rata-Rata Nilai Raport</th>
                  <th className="p-3 text-center">Cetak Raport Resmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentsForGrades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Tidak ada data siswa atau alumni yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStudentsForGrades.map((st, idx) => {
                    const cls = classes.find((c) => c.id === st.kelasId);
                    const myGrades = grades.filter((g) => g.studentId === st.id);
                    const avg = myGrades.length > 0
                      ? Math.round(myGrades.reduce((a, b) => a + b.nilaiRaport, 0) / myGrades.length)
                      : 0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-mono font-semibold text-slate-700">{st.nisn}</td>
                        <td className="p-3">
                          <strong className="text-slate-900 block">{st.nama}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Angkatan: {st.tahunMasuk} {st.tahunLulus ? `• Lulus: ${st.tahunLulus}` : ''}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              st.status === 'lulus'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {st.status === 'lulus' ? 'Alumni' : 'Aktif'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {cls?.namaKelas || (st.status === 'lulus' ? `Alumni (Th. ${st.tahunLulus})` : '-')}
                        </td>
                        <td className="p-3 font-mono font-bold text-sm text-purple-900">
                          {avg > 0 ? `${avg} / 100` : 'Belum Ada Nilai'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedStudentForRaport(st)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 mx-auto shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Raport PDF</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Kenaikan Kelas (Pindahkan data siswa ke tingkat berikut) */}
      {activeTab === 'kenaikan_kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Modul Kenaikan Kelas & Perpindahan Rombel
            </h3>
            <p className="text-xs text-slate-500">
              Pindahkan siswa yang tuntas belajar ke tingkat kelas berikutnya secara massal atau pilih siswa tertentu
            </p>
          </div>

          {promotionSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{promotionSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Kelas Asal (Saat Ini):</label>
              <select
                value={promotionSourceClass}
                onChange={(e) => {
                  setPromotionSourceClass(e.target.value);
                  setSelectedForPromotion([]);
                }}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.namaKelas} (Tingkat {c.tingkat})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Pindahkan / Naikkan ke Kelas Tujuan:</label>
              <select
                value={promotionTargetClass}
                onChange={(e) => setPromotionTargetClass(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.namaKelas} (Tingkat {c.tingkat})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student selection */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedForPromotion.length === sourceStudents.length && sourceStudents.length > 0}
                  onChange={toggleSelectAllPromotion}
                  className="rounded border-slate-300 cursor-pointer"
                />
                <span className="font-bold text-slate-800">
                  Pilih Siswa Kelas Asal ({selectedForPromotion.length} dari {sourceStudents.length} Terpilih)
                </span>
              </div>

              <button
                onClick={handleExecutePromotion}
                disabled={selectedForPromotion.length === 0}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <span>Proses Kenaikan Kelas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto text-xs">
              {sourceStudents.length === 0 ? (
                <p className="p-8 text-center text-slate-400">Tidak ada siswa aktif di kelas asal ini.</p>
              ) : (
                sourceStudents.map((st) => (
                  <label
                    key={st.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedForPromotion.includes(st.id)}
                        onChange={() => toggleSelectStudentPromotion(st.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{st.nama}</span>
                        <span className="text-[10px] text-slate-400 font-mono">NISN: {st.nisn}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Siap Naik Tingkat
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Data Alumni (Arsip Kelulusan) */}
      {activeTab === 'alumni' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Buku Induk & Arsip Alumni
              </h3>
              <p className="text-xs text-slate-500">
                Saat siswa tingkat akhir dinyatakan lulus, akun akan dipindahkan ke data alumni dan nilai tetap tersimpan permanen
              </p>
            </div>
            <div className="text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-mono font-bold">
              Total Alumni: {alumniList.length} Orang
            </div>
          </div>

          {alumniSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{alumniSuccessMsg}</span>
            </div>
          )}

          {/* Quick Graduate Active Grade XII Students Section */}
          {activeStudentsTingkatAkhir.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Proses Kelulusan Siswa Tingkat Akhir (Kelas XII):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Tahun Kelulusan:</span>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-slate-300 rounded font-mono text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {activeStudentsTingkatAkhir.map((st) => (
                  <div key={st.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">{st.nama}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">NISN: {st.nisn}</span>
                    </div>
                    <button
                      onClick={() => handleGraduateStudent(st.id)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Proses Lulus (Jadikan Alumni)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alumni Table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">Nama Lengkap Alumni</th>
                  <th className="p-3">Tahun Masuk</th>
                  <th className="p-3">Tahun Lulus</th>
                  <th className="p-3">Orang Tua / Wali</th>
                  <th className="p-3 text-center">Transkrip & Raport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alumniList.map((al, idx) => (
                  <tr key={al.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-semibold text-slate-700">{al.nisn}</td>
                    <td className="p-3">
                      <strong className="text-slate-900 block">{al.nama}</strong>
                      <span className="text-[10px] text-emerald-700 font-semibold">Tersimpan di Buku Induk</span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{al.tahunMasuk}</td>
                    <td className="p-3 font-mono font-bold text-amber-800 bg-amber-50 text-center">
                      {al.tahunLulus || '-'}
                    </td>
                    <td className="p-3 text-slate-700">{al.namaOrangTua}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedStudentForRaport(al)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak Raport Alumni</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Kehadiran Guru di Kelas */}
      {activeTab === 'kehadiran_guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Presentase Kehadiran Guru di Kelas
            </h3>
            <p className="text-xs text-slate-500">
              Monitoring kepatuhan jam mengajar seluruh guru pengampu berdasarkan jadwal dan jurnal KBM
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">No</th>
                  <th className="p-3">NIP</th>
                  <th className="p-3">Nama Guru</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3 text-center">Total Jadwal</th>
                  <th className="p-3 text-center">Jurnal KBM Terisi</th>
                  <th className="p-3 text-center text-rose-700">Laporan Guru Kosong</th>
                  <th className="p-3 text-center font-bold">Presentase Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherAttendanceStats.map((item, idx) => (
                  <tr key={item.teacher.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-semibold text-slate-600">{item.teacher.nip}</td>
                    <td className="p-3 font-bold text-slate-900">{item.teacher.nama}, {item.teacher.gelar}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.teacher.mataPelajaranUtama}</td>
                    <td className="p-3 text-center font-mono">{item.schedulesCount} Kelas</td>
                    <td className="p-3 text-center font-mono text-emerald-700 font-semibold">{item.journalsCount} Sesi</td>
                    <td className="p-3 text-center font-mono font-bold text-rose-600">{item.unattendedCount}</td>
                    <td className="p-3 text-center">
                      <span className="font-mono font-bold text-slate-900 text-sm">{item.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Siswa */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Tambah Peserta Didik Baru</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">NISN (10 Digit):</label>
                <input
                  type="text"
                  required
                  placeholder="0078899001"
                  value={newStudent.nisn}
                  onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pratama Arhan"
                  value={newStudent.nama}
                  onChange={(e) => setNewStudent({ ...newStudent, nama: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin:</label>
                  <select
                    value={newStudent.jenisKelamin}
                    onChange={(e) => setNewStudent({ ...newStudent, jenisKelamin: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Kelas:</label>
                  <select
                    value={newStudent.kelasId}
                    onChange={(e) => setNewStudent({ ...newStudent, kelasId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua / Wali:</label>
                <input
                  type="text"
                  placeholder="Nama ayah / ibu..."
                  value={newStudent.namaOrangTua}
                  onChange={(e) => setNewStudent({ ...newStudent, namaOrangTua: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kontak Orang Tua (HP / WhatsApp):</label>
                <input
                  type="text"
                  placeholder="0812345678"
                  value={newStudent.kontakOrangTua}
                  onChange={(e) => setNewStudent({ ...newStudent, kontakOrangTua: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kelas */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Tambah Kelas Baru</h3>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Kelas (Contoh: X-B / XI-MIPA 2):</label>
                <input
                  type="text"
                  required
                  value={newClass.namaKelas}
                  onChange={(e) => setNewClass({ ...newClass, namaKelas: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tingkat:</label>
                  <select
                    value={newClass.tingkat}
                    onChange={(e) => setNewClass({ ...newClass, tingkat: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jurusan / Peminatan:</label>
                  <select
                    value={newClass.jurusan}
                    onChange={(e) => setNewClass({ ...newClass, jurusan: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="IPA">IPA / MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Umum">Umum</option>
                    <option value="Bahasa">Bahasa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Wali Kelas:</label>
                <select
                  value={newClass.waliKelasId}
                  onChange={(e) => setNewClass({ ...newClass, waliKelasId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} ({t.mataPelajaranUtama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ruangan:</label>
                <input
                  type="text"
                  placeholder="Gedung A - R.102"
                  value={newClass.ruangan}
                  onChange={(e) => setNewClass({ ...newClass, ruangan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Guru */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Tambah Tenaga Pendidik Baru</h3>
            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP (18 Digit):</label>
                <input
                  type="text"
                  required
                  placeholder="198501012010011005"
                  value={newTeacher.nip}
                  onChange={(e) => setNewTeacher({ ...newTeacher, nip: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Guru & Gelar:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap..."
                  value={newTeacher.nama}
                  onChange={(e) => setNewTeacher({ ...newTeacher, nama: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran Utama:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika, Fisika, Biologi..."
                  value={newTeacher.mataPelajaranUtama}
                  onChange={(e) => setNewTeacher({ ...newTeacher, mataPelajaranUtama: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Jadwal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Input Jadwal Pelajaran Baru</h3>
            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas:</label>
                  <select
                    value={newSchedule.kelasId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, kelasId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hari:</label>
                  <select
                    value={newSchedule.hari}
                    onChange={(e) => setNewSchedule({ ...newSchedule, hari: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Guru Pengampu:</label>
                <select
                  value={newSchedule.teacherId}
                  onChange={(e) => {
                    const tch = teachers.find((t) => t.id === e.target.value);
                    const matchingSubject = subjects.find(
                      (s) => s.namaMapel.toLowerCase() === tch?.mataPelajaranUtama.toLowerCase()
                    );
                    setNewSchedule({
                      ...newSchedule,
                      teacherId: e.target.value,
                      subjectId: matchingSubject ? matchingSubject.id : newSchedule.subjectId
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} — {t.mataPelajaranUtama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran:</label>
                <select
                  value={newSchedule.subjectId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subjectId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaMapel} ({s.kodeMapel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jam Mulai:</label>
                  <input
                    type="text"
                    value={newSchedule.jamMulai}
                    onChange={(e) => setNewSchedule({ ...newSchedule, jamMulai: e.target.value })}
                    placeholder="07:30"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jam Selesai:</label>
                  <input
                    type="text"
                    value={newSchedule.jamSelesai}
                    onChange={(e) => setNewSchedule({ ...newSchedule, jamSelesai: e.target.value })}
                    placeholder="09:00"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Jadwal Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal */}
      {selectedStudentForCard && (
        <StudentIdCardModal
          student={selectedStudentForCard}
          schoolClass={classes.find((c) => c.id === selectedStudentForCard.kelasId)}
          onClose={() => setSelectedStudentForCard(null)}
        />
      )}

      {/* Raport Print Modal */}
      {selectedStudentForRaport && (
        <PrintRaportModal
          student={selectedStudentForRaport}
          schoolClass={classes.find((c) => c.id === selectedStudentForRaport.kelasId)}
          subjects={subjects}
          grades={grades}
          waliKelas={teachers.find((t) => t.id === classes.find((c) => c.id === selectedStudentForRaport.kelasId)?.waliKelasId)}
          headmaster={headmaster}
          onClose={() => setSelectedStudentForRaport(null)}
        />
      )}
    </div>
  );
};
