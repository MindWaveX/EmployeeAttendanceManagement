import { useState, useMemo } from 'react';
import { Clock, Calendar, Search } from 'lucide-react';
import type { Employee, TimeSheetEntry } from '../types/attendance';
import { format, parseISO } from 'date-fns';

interface TimesheetViewProps {
  employees: Employee[];
  timesheetEntries: TimeSheetEntry[];
}

export default function TimesheetView({ employees, timesheetEntries }: TimesheetViewProps) {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const employee = employees.find(emp => emp.id === selectedEmployee);
  
  const filteredEntries = useMemo(() => {
    return timesheetEntries.filter(entry => {
      const matchesEmployee = entry.employeeId === selectedEmployee;
      const matchesDate = entry.date === selectedDate;
      const matchesSearch = !searchTerm || 
        entry.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tasks?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesEmployee && matchesDate && matchesSearch;
    });
  }, [timesheetEntries, selectedEmployee, selectedDate, searchTerm]);

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const totalOvertime = filteredEntries.reduce((sum, entry) => sum + (entry.overtime || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <div>
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Employee Timesheet</h2>
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Detailed time tracking and project allocation</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 lg:h-4 lg:w-4" />
              <input
                type="date"
                className="pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full min-w-[140px] sm:min-w-[160px]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 lg:h-4 lg:w-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full min-w-[180px] sm:min-w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Info */}
      {employee && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
            <div className="flex items-center">
              <img
                className="h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                src={employee.avatar}
                alt={employee.name}
              />
              <div className="ml-3 lg:ml-4">
                <h3 className="text-base lg:text-lg font-medium text-gray-900">{employee.name}</h3>
                <p className="text-xs lg:text-sm text-gray-500">{employee.department} • {employee.position}</p>
                <p className="text-xs lg:text-sm text-gray-400">{employee.employeeId}</p>
              </div>
            </div>
            
            <div className="text-left lg:text-right">
              <div className="text-xs lg:text-sm text-gray-500 mb-2">
                Date: {format(parseISO(selectedDate), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-primary-600">{totalHours.toFixed(1)}h</div>
                  <div className="text-xs text-gray-500">Total Hours</div>
                </div>
                {totalOvertime > 0 && (
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-orange-600">{totalOvertime.toFixed(1)}h</div>
                    <div className="text-xs text-gray-500">Overtime</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Break
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.checkIn} - {entry.checkOut}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(entry.date), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.tasks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {entry.totalHours.toFixed(1)}h
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.breakStart && entry.breakEnd ? `${entry.breakStart} - ${entry.breakEnd}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.overtime && entry.overtime > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {entry.overtime.toFixed(1)}h
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No timesheet entries found for the selected date.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredEntries.length > 0 ? (
            <div className="space-y-3 p-3">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {entry.checkIn} - {entry.checkOut}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(parseISO(entry.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {entry.totalHours.toFixed(1)}h
                      </span>
                      {entry.overtime && entry.overtime > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          +{entry.overtime.toFixed(1)}h
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Project:</span>
                      <div className="text-sm font-medium text-gray-900">{entry.project}</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Tasks:</span>
                      <div className="text-sm text-gray-900">{entry.tasks}</div>
                    </div>
                    {entry.breakStart && entry.breakEnd && (
                      <div>
                        <span className="text-xs text-gray-500">Break:</span>
                        <div className="text-sm text-gray-900">{entry.breakStart} - {entry.breakEnd}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No timesheet entries found for the selected date.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 