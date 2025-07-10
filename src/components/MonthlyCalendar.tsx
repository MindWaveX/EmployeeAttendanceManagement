import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import type { Employee, AttendanceRecord } from '../types/attendance';

interface MonthlyCalendarProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
}

export default function MonthlyCalendar({ employees, attendanceRecords }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || '');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Create proper calendar grid: start from Sunday of first week, end on Saturday of last week
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const employee = employees.find(emp => emp.id === selectedEmployee);
  const employeeRecords = attendanceRecords.filter(record => record.employeeId === selectedEmployee);

  const getAttendanceForDay = (day: Date) => {
    return employeeRecords.find(record => isSameDay(new Date(record.date), day));
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'present':
        return 'bg-green-500 text-white';
      case 'absent':
        return 'bg-red-500 text-white';
      case 'late':
        return 'bg-yellow-500 text-white';
      case 'half-day':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900">Monthly Attendance Calendar</h2>
        
        <select
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
        
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
      </div>

      {employee && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={employee.avatar}
              alt={employee.name}
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
              <div className="text-sm text-gray-500">{employee.department} • {employee.position}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-px lg:gap-1 mb-2 lg:mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-1 lg:p-2 text-center text-xs font-medium text-gray-500 uppercase">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px lg:gap-1">
        {calendarDays.map((day: Date) => {
          const attendance = getAttendanceForDay(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`
                relative p-1 lg:p-2 h-8 lg:h-12 border border-gray-200 rounded-sm lg:rounded-lg flex items-center justify-center text-xs lg:text-sm
                ${!isSameMonth(day, currentDate) ? 'text-gray-300 bg-gray-50' : ''}
                ${isWeekend ? 'bg-gray-50' : ''}
                ${isToday ? 'ring-1 lg:ring-2 ring-primary-500' : ''}
                ${attendance ? getStatusColor(attendance.status) : 'hover:bg-gray-50'}
              `}
            >
              <span className={attendance ? 'font-medium' : ''}>{format(day, 'd')}</span>
              
              {attendance && (
                <div className="absolute -top-0.5 lg:-top-1 -right-0.5 lg:-right-1 w-2 h-2 lg:w-3 lg:h-3 rounded-full">
                  <div className="w-full h-full rounded-full border lg:border-2 border-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 lg:mt-6 flex flex-wrap gap-2 lg:gap-4 text-xs lg:text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded mr-1 lg:mr-2"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-yellow-500 rounded mr-1 lg:mr-2"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded mr-1 lg:mr-2"></div>
          <span>Half Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-500 rounded mr-1 lg:mr-2"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gray-100 border border-gray-300 rounded mr-1 lg:mr-2"></div>
          <span>Weekend</span>
        </div>
      </div>
    </div>
  );
} 