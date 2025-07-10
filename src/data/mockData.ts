import type { Employee, AttendanceRecord, TimeSheetEntry, AttendanceStats, DepartmentStats } from '../types/attendance';
import { format, subDays, startOfDay } from 'date-fns';

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const positions = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
  Design: ['UI/UX Designer', 'Product Designer', 'Design Lead', 'Visual Designer'],
  Marketing: ['Marketing Manager', 'Content Creator', 'SEO Specialist', 'Digital Marketer'],
  Sales: ['Sales Executive', 'Account Manager', 'Sales Lead', 'Business Development'],
  HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'People Operations'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Controller'],
  Operations: ['Operations Manager', 'Project Manager', 'Operations Coordinator']
};

const firstNames = [
  'Alex', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'James', 'Jennifer',
  'John', 'Amanda', 'Christopher', 'Melissa', 'Daniel', 'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Lisa',
  'Mark', 'Amy', 'Donald', 'Angela', 'Steven', 'Helen', 'Paul', 'Anna', 'Andrew', 'Brenda',
  'Joshua', 'Emma', 'Kenneth', 'Olivia', 'Kevin', 'Cynthia', 'Brian', 'Marie', 'George', 'Janet'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

// Generate employees
export const employees: Employee[] = Array.from({ length: 40 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const department = departments[index % departments.length];
  const positions_for_dept = positions[department as keyof typeof positions];
  const position = positions_for_dept[index % positions_for_dept.length];
  
  return {
    id: `emp-${index + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    department,
    position,
    employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`
  };
});

// Generate attendance records for the last 3 months of weekdays
const currentDate = startOfDay(new Date());

// Function to get all weekdays for the last N days
const getAllWeekdays = (daysBack: number): Date[] => {
  const weekdays: Date[] = [];
  
  // Start from N days ago and go to today
  for (let i = daysBack; i >= 0; i--) {
    const date = subDays(currentDate, i);
    const dayOfWeek = date.getDay();
    
    // Skip Saturday (6) and Sunday (0) - only include Monday(1) to Friday(5)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays.push(date);
    }
  }
  
  return weekdays;
};

// Generate 90 days back to ensure we have 3+ months of weekday data
const allWeekdays = getAllWeekdays(90);

// Export the date range for UI display
export const dataDateRange = {
  startDate: allWeekdays[0],
  endDate: allWeekdays[allWeekdays.length - 1],
  totalDays: allWeekdays.length
};

export const attendanceRecords: AttendanceRecord[] = [];

employees.forEach(employee => {
  allWeekdays.forEach((day: Date) => {
    
    // Generate random attendance status with realistic probabilities
    const random = Math.random();
    let status: 'present' | 'absent' | 'late' | 'half-day';
    let checkIn: string | undefined;
    let checkOut: string | undefined;
    let totalHours: number | undefined;
    
    if (random < 0.85) { // 85% present
      status = 'present';
      const checkInHour = 8 + Math.random() * 2; // 8-10 AM
      const checkOutHour = 17 + Math.random() * 2; // 5-7 PM
      checkIn = `${Math.floor(checkInHour).toString().padStart(2, '0')}:${Math.floor((checkInHour % 1) * 60).toString().padStart(2, '0')}`;
      checkOut = `${Math.floor(checkOutHour).toString().padStart(2, '0')}:${Math.floor((checkOutHour % 1) * 60).toString().padStart(2, '0')}`;
      totalHours = checkOutHour - checkInHour;
    } else if (random < 0.92) { // 7% late
      status = 'late';
      const checkInHour = 9.5 + Math.random() * 1.5; // 9:30-11 AM
      const checkOutHour = 17 + Math.random() * 2;
      checkIn = `${Math.floor(checkInHour).toString().padStart(2, '0')}:${Math.floor((checkInHour % 1) * 60).toString().padStart(2, '0')}`;
      checkOut = `${Math.floor(checkOutHour).toString().padStart(2, '0')}:${Math.floor((checkOutHour % 1) * 60).toString().padStart(2, '0')}`;
      totalHours = checkOutHour - checkInHour;
    } else if (random < 0.97) { // 5% half-day
      status = 'half-day';
      const checkInHour = 8 + Math.random() * 2;
      const checkOutHour = 13 + Math.random(); // Leave around 1-2 PM
      checkIn = `${Math.floor(checkInHour).toString().padStart(2, '0')}:${Math.floor((checkInHour % 1) * 60).toString().padStart(2, '0')}`;
      checkOut = `${Math.floor(checkOutHour).toString().padStart(2, '0')}:${Math.floor((checkOutHour % 1) * 60).toString().padStart(2, '0')}`;
      totalHours = checkOutHour - checkInHour;
    } else { // 3% absent
      status = 'absent';
    }
    
    attendanceRecords.push({
      id: `attendance-${employee.id}-${format(day, 'yyyy-MM-dd')}`,
      employeeId: employee.id,
      date: format(day, 'yyyy-MM-dd'),
      status,
      checkIn,
      checkOut,
      totalHours,
      notes: status === 'absent' ? (Math.random() > 0.5 ? 'Sick leave' : 'Personal leave') : undefined
    });
  });
});

// Generate timesheet entries for present days
export const timesheetEntries: TimeSheetEntry[] = attendanceRecords
  .filter(record => record.status === 'present' || record.status === 'late')
  .map(record => {
    const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Maintenance', 'Bug Fixes'];
    const tasks = ['Development', 'Testing', 'Code Review', 'Documentation', 'Meetings'];
    
    return {
      id: `timesheet-${record.id}`,
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn!,
      checkOut: record.checkOut!,
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: record.totalHours!,
      overtime: record.totalHours! > 8 ? record.totalHours! - 8 : 0,
      project: projects[Math.floor(Math.random() * projects.length)],
      tasks: tasks[Math.floor(Math.random() * tasks.length)]
    };
  });

// Calculate today's stats
const today = format(currentDate, 'yyyy-MM-dd');
const todayRecords = attendanceRecords.filter(record => record.date === today);

export const attendanceStats: AttendanceStats = {
  totalEmployees: employees.length,
  presentToday: todayRecords.filter(r => r.status === 'present' || r.status === 'late').length,
  absentToday: todayRecords.filter(r => r.status === 'absent').length,
  lateToday: todayRecords.filter(r => r.status === 'late').length,
  avgHoursPerDay: 8.2,
  monthlyAttendanceRate: 89.5
};

// Calculate department stats
export const departmentStats: DepartmentStats[] = departments.map(dept => {
  const deptEmployees = employees.filter(emp => emp.department === dept);
  const deptTodayRecords = todayRecords.filter(record => 
    deptEmployees.some(emp => emp.id === record.employeeId)
  );
  const presentCount = deptTodayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  
  return {
    department: dept,
    totalEmployees: deptEmployees.length,
    presentCount,
    attendanceRate: deptEmployees.length > 0 ? (presentCount / deptEmployees.length) * 100 : 0
  };
}); 