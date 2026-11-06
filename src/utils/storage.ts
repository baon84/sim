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
  Announcement,
  CurrentUser
} from '../types';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_HEADMASTER,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULES,
  INITIAL_DAILY_ATTENDANCE,
  INITIAL_CLASS_ATTENDANCE,
  INITIAL_TEACHER_REPORTS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'sim_sekolah_students_v1',
  TEACHERS: 'sim_sekolah_teachers_v1',
  HEADMASTER: 'sim_sekolah_headmaster_v1',
  CLASSES: 'sim_sekolah_classes_v1',
  SUBJECTS: 'sim_sekolah_subjects_v1',
  SCHEDULES: 'sim_sekolah_schedules_v1',
  DAILY_ATTENDANCE: 'sim_sekolah_daily_att_v1',
  CLASS_ATTENDANCE: 'sim_sekolah_class_att_v1',
  TEACHER_REPORTS: 'sim_sekolah_tch_reports_v1',
  GRADES: 'sim_sekolah_grades_v1',
  ANNOUNCEMENTS: 'sim_sekolah_announcements_v1',
  CURRENT_USER: 'sim_sekolah_current_user_v1'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

export const Storage = {
  getStudents: (): Student[] => safeGet(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
  setStudents: (data: Student[]) => safeSet(STORAGE_KEYS.STUDENTS, data),

  getTeachers: (): Teacher[] => safeGet(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS),
  setTeachers: (data: Teacher[]) => safeSet(STORAGE_KEYS.TEACHERS, data),

  getHeadmaster: (): Headmaster => safeGet(STORAGE_KEYS.HEADMASTER, INITIAL_HEADMASTER),
  setHeadmaster: (data: Headmaster) => safeSet(STORAGE_KEYS.HEADMASTER, data),

  getClasses: (): SchoolClass[] => safeGet(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
  setClasses: (data: SchoolClass[]) => safeSet(STORAGE_KEYS.CLASSES, data),

  getSubjects: (): Subject[] => safeGet(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  setSubjects: (data: Subject[]) => safeSet(STORAGE_KEYS.SUBJECTS, data),

  getSchedules: (): Schedule[] => safeGet(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES),
  setSchedules: (data: Schedule[]) => safeSet(STORAGE_KEYS.SCHEDULES, data),

  getDailyAttendance: (): AttendanceDaily[] => safeGet(STORAGE_KEYS.DAILY_ATTENDANCE, INITIAL_DAILY_ATTENDANCE),
  setDailyAttendance: (data: AttendanceDaily[]) => safeSet(STORAGE_KEYS.DAILY_ATTENDANCE, data),

  getClassAttendance: (): AttendanceClassSession[] => safeGet(STORAGE_KEYS.CLASS_ATTENDANCE, INITIAL_CLASS_ATTENDANCE),
  setClassAttendance: (data: AttendanceClassSession[]) => safeSet(STORAGE_KEYS.CLASS_ATTENDANCE, data),

  getTeacherReports: (): TeacherAbsenceReport[] => safeGet(STORAGE_KEYS.TEACHER_REPORTS, INITIAL_TEACHER_REPORTS),
  setTeacherReports: (data: TeacherAbsenceReport[]) => safeSet(STORAGE_KEYS.TEACHER_REPORTS, data),

  getGrades: (): StudentGrade[] => safeGet(STORAGE_KEYS.GRADES, INITIAL_GRADES),
  setGrades: (data: StudentGrade[]) => safeSet(STORAGE_KEYS.GRADES, data),

  getAnnouncements: (): Announcement[] => safeGet(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  setAnnouncements: (data: Announcement[]) => safeSet(STORAGE_KEYS.ANNOUNCEMENTS, data),

  getCurrentUser: (): CurrentUser | null => safeGet(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: CurrentUser | null) => safeSet(STORAGE_KEYS.CURRENT_USER, user),

  resetAllToDefault: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
};
