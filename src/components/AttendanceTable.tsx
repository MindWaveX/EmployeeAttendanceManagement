import { useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import type { Employee, AttendanceRecord } from '../types/attendance';
import { format } from 'date-fns';

interface AttendanceTableProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
}

export default function AttendanceTable({ employees, attendanceRecords }: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredData = useMemo(() => {
    const dateRecords = attendanceRecords.filter(record => record.date === selectedDate);
    
    return employees.map(employee => {
      const record = dateRecords.find(r => r.employeeId === employee.id);
      return {
        ...employee,
        attendance: record || {
          id: '',
          employeeId: employee.id,
          date: selectedDate,
          status: 'absent' as const,
          checkIn: undefined,
          checkOut: undefined,
          totalHours: undefined
        }
      };
    }).filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.attendance.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || item.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, attendanceRecords, selectedDate, searchTerm, statusFilter, departmentFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="status-present">Present</span>;
      case 'absent':
        return <span className="status-absent">Absent</span>;
      case 'late':
        return <span className="status-late">Late</span>;
      case 'half-day':
        return <span className="status-half-day">Half Day</span>;
      default:
        return <span className="status-absent">Unknown</span>;
    }
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Employee Attendance</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full min-w-[180px] sm:min-w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full min-w-[140px] sm:min-w-[160px]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={item.avatar}
                      alt={item.name}
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.department}</div>
                  <div className="text-sm text-gray-500">{item.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.attendance.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.attendance.checkIn || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.attendance.checkOut || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.attendance.totalHours ? `${item.attendance.totalHours.toFixed(1)}h` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="space-y-4 p-4">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={item.avatar}
                    alt={item.name}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.employeeId}</div>
                  </div>
                </div>
                {getStatusBadge(item.attendance.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Department:</span>
                  <div className="font-medium text-gray-900">{item.department}</div>
                  <div className="text-xs text-gray-500">{item.position}</div>
                </div>
                <div>
                  <span className="text-gray-500">Hours:</span>
                  <div className="font-medium text-gray-900">
                    {item.attendance.totalHours ? `${item.attendance.totalHours.toFixed(1)}h` : '-'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Check In:</span>
                  <div className="font-medium text-gray-900">{item.attendance.checkIn || '-'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Check Out:</span>
                  <div className="font-medium text-gray-900">{item.attendance.checkOut || '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 