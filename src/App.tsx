/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CurrentUser,
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
} from './types';
import { Storage } from './utils/storage';

// Views & Components
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { GateScannerView } from './views/GateScannerView';
import { SiswaDashboard } from './views/SiswaDashboard';
import { OrangTuaDashboard } from './views/OrangTuaDashboard';
import { GuruDashboard } from './views/GuruDashboard';
import { KepalaSekolahDashboard } from './views/KepalaSekolahDashboard';
import { AdminDashboard } from './views/AdminDashboard';

export default function App() {
  // Master persistent state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => Storage.getCurrentUser());
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [selectedReportNav, setSelectedReportNav] = useState<TeacherAbsenceReport | null>(null);

  const [students, setStudents] = useState<Student[]>(() => Storage.getStudents());
  const [classes, setClasses] = useState<SchoolClass[]>(() => Storage.getClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(() => Storage.getTeachers());
  const [headmaster, setHeadmaster] = useState<Headmaster>(() => Storage.getHeadmaster());
  const [subjects, setSubjects] = useState<Subject[]>(() => Storage.getSubjects());
  const [schedules, setSchedules] = useState<Schedule[]>(() => Storage.getSchedules());
  const [dailyAttendances, setDailyAttendances] = useState<AttendanceDaily[]>(() => Storage.getDailyAttendance());
  const [classAttendances, setClassAttendances] = useState<AttendanceClassSession[]>(() => Storage.getClassAttendance());
  const [teacherReports, setTeacherReports] = useState<TeacherAbsenceReport[]>(() => Storage.getTeacherReports());
  const [grades, setGrades] = useState<StudentGrade[]>(() => Storage.getGrades());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => Storage.getAnnouncements());

  // Handle Login
  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    Storage.setCurrentUser(user);
    setIsGateScannerOpen(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    Storage.setCurrentUser(null);
  };

  // Handle Quick Switch Role
  const handleSwitchRole = (role: CurrentUser['role'], id?: string) => {
    setIsGateScannerOpen(false);

    if (role === 'admin') {
      const u: CurrentUser = {
        role: 'admin',
        identifier: 'admin',
        name: 'Administrator SIM Sekolah'
      };
      setCurrentUser(u);
      Storage.setCurrentUser(u);
    } else if (role === 'kepsek') {
      const u: CurrentUser = {
        role: 'kepsek',
        identifier: headmaster.nip,
        name: headmaster.nama,
        headmasterId: headmaster.id
      };
      setCurrentUser(u);
      Storage.setCurrentUser(u);
    } else if (role === 'guru') {
      const targetTeacher = teachers.find((t) => t.id === id) || teachers[0];
      const u: CurrentUser = {
        role: 'guru',
        identifier: targetTeacher.nip,
        name: `${targetTeacher.nama}, ${targetTeacher.gelar}`,
        teacherId: targetTeacher.id
      };
      setCurrentUser(u);
      Storage.setCurrentUser(u);
    } else if (role === 'siswa') {
      const targetStudent = students.find((s) => s.id === id) || students[0];
      const u: CurrentUser = {
        role: 'siswa',
        identifier: targetStudent.nisn,
        name: targetStudent.nama,
        studentId: targetStudent.id
      };
      setCurrentUser(u);
      Storage.setCurrentUser(u);
    } else if (role === 'ortu') {
      const targetStudent = students.find((s) => s.id === id) || students[0];
      const u: CurrentUser = {
        role: 'ortu',
        identifier: targetStudent.nisn,
        name: `${targetStudent.namaOrangTua} (Wali dari ${targetStudent.nama})`,
        studentId: targetStudent.id
      };
      setCurrentUser(u);
      Storage.setCurrentUser(u);
    }
  };

  // Reset demo data
  const handleResetData = () => {
    Storage.resetAllToDefault();
    setStudents(Storage.getStudents());
    setClasses(Storage.getClasses());
    setTeachers(Storage.getTeachers());
    setHeadmaster(Storage.getHeadmaster());
    setSubjects(Storage.getSubjects());
    setSchedules(Storage.getSchedules());
    setDailyAttendances(Storage.getDailyAttendance());
    setClassAttendances(Storage.getClassAttendance());
    setTeacherReports(Storage.getTeacherReports());
    setGrades(Storage.getGrades());
    setAnnouncements(Storage.getAnnouncements());
  };

  // Active student object if logged in as Siswa or Ortu
  const currentStudent = students.find((s) => s.id === currentUser?.studentId) || students[0];
  const currentStudentClass = classes.find((c) => c.id === currentStudent?.kelasId);

  // Active teacher object if logged in as Guru
  const currentTeacher = teachers.find((t) => t.id === currentUser?.teacherId) || teachers[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        teacherReports={teacherReports}
        onLogout={handleLogout}
        onOpenGateScanner={() => setIsGateScannerOpen(true)}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
        onOpenReportModal={(rep) => {
          setSelectedReportNav(rep);
          if (currentUser?.role !== 'kepsek') {
            handleSwitchRole('kepsek');
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1">
        {isGateScannerOpen ? (
          <GateScannerView
            students={students}
            classes={classes}
            dailyAttendances={dailyAttendances}
            onAttendanceUpdate={setDailyAttendances}
            onClose={() => setIsGateScannerOpen(false)}
          />
        ) : !currentUser ? (
          <LoginView
            students={students}
            teachers={teachers}
            headmaster={headmaster}
            onLoginSuccess={handleLoginSuccess}
            onOpenGateScanner={() => setIsGateScannerOpen(true)}
          />
        ) : currentUser.role === 'siswa' ? (
          <SiswaDashboard
            student={currentStudent}
            schoolClass={currentStudentClass}
            schedules={schedules}
            subjects={subjects}
            teachers={teachers}
            dailyAttendances={dailyAttendances}
            classAttendances={classAttendances}
            teacherReports={teacherReports}
            grades={grades}
            announcements={announcements}
            headmaster={headmaster}
            onReportsUpdate={setTeacherReports}
            onOpenGateScanner={() => setIsGateScannerOpen(true)}
          />
        ) : currentUser.role === 'ortu' ? (
          <OrangTuaDashboard
            student={currentStudent}
            schoolClass={currentStudentClass}
            subjects={subjects}
            teachers={teachers}
            dailyAttendances={dailyAttendances}
            classAttendances={classAttendances}
            grades={grades}
            headmaster={headmaster}
          />
        ) : currentUser.role === 'guru' ? (
          <GuruDashboard
            teacher={currentTeacher}
            classes={classes}
            subjects={subjects}
            schedules={schedules}
            students={students}
            classAttendances={classAttendances}
            grades={grades}
            announcements={announcements}
            onClassAttendanceUpdate={setClassAttendances}
            onGradesUpdate={setGrades}
            onAnnouncementsUpdate={setAnnouncements}
          />
        ) : currentUser.role === 'kepsek' ? (
          <KepalaSekolahDashboard
            headmaster={headmaster}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            schedules={schedules}
            classAttendances={classAttendances}
            teacherReports={teacherReports}
            onReportsUpdate={setTeacherReports}
            selectedReportFromNav={selectedReportNav}
          />
        ) : (
          <AdminDashboard
            students={students}
            classes={classes}
            teachers={teachers}
            headmaster={headmaster}
            subjects={subjects}
            schedules={schedules}
            grades={grades}
            classAttendances={classAttendances}
            teacherReports={teacherReports}
            dailyAttendances={dailyAttendances}
            onStudentsUpdate={setStudents}
            onClassesUpdate={setClasses}
            onTeachersUpdate={setTeachers}
            onHeadmasterUpdate={setHeadmaster}
            onSchedulesUpdate={setSchedules}
            onGradesUpdate={setGrades}
          />
        )}
      </main>
    </div>
  );
}
