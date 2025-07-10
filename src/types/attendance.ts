export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
  employeeId: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  notes?: string;
}

export interface TimeSheetEntry {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  overtime?: number;
  project?: string;
  tasks?: string;
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  avgHoursPerDay: number;
  monthlyAttendanceRate: number;
}

export interface DepartmentStats {
  department: string;
  totalEmployees: number;
  presentCount: number;
  attendanceRate: number;
} 