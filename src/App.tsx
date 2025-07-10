import { useState } from 'react'
import { Calendar, Users, Building, Clock } from 'lucide-react'
import StatsCards from './components/StatsCards'
import AttendanceTable from './components/AttendanceTable'
import DepartmentStats from './components/DepartmentStats'
import MonthlyCalendar from './components/MonthlyCalendar'
import TimesheetView from './components/TimesheetView'
import { employees, attendanceRecords, attendanceStats, departmentStats, timesheetEntries, dataDateRange } from './data/mockData'

type TabType = 'attendance' | 'calendar' | 'timesheet' | 'reports'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('attendance')

  const tabs = [
    { id: 'attendance' as TabType, name: 'Attendance', icon: Users },
    { id: 'calendar' as TabType, name: 'Calendar', icon: Calendar },
    { id: 'timesheet' as TabType, name: 'Timesheet', icon: Clock },
    { id: 'reports' as TabType, name: 'Reports', icon: Building },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <div className="space-y-8">
            <StatsCards stats={attendanceStats} />
            <AttendanceTable employees={employees} attendanceRecords={attendanceRecords} />
          </div>
        )
      case 'calendar':
        return (
          <div className="space-y-8">
            <MonthlyCalendar employees={employees} attendanceRecords={attendanceRecords} />
          </div>
        )
      case 'timesheet':
        return (
          <div className="space-y-8">
            <TimesheetView employees={employees} timesheetEntries={timesheetEntries} />
          </div>
        )
      case 'reports':
        return (
          <div className="space-y-8">
            <StatsCards stats={attendanceStats} />
            <DepartmentStats departments={departmentStats} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 lg:h-8 lg:w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">HR Dashboard</h1>
                <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Employee Attendance Management</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-2 lg:px-3 py-3 lg:py-4 text-xs lg:text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.charAt(0)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 lg:mt-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
            <p className="text-sm text-gray-500 text-center lg:text-left">
              Employee Attendance Management
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6 text-xs lg:text-sm text-gray-500">
              <span className="text-center">
                {employees.length} Employees • {attendanceStats.monthlyAttendanceRate}% Rate
              </span>
              <span className="hidden lg:inline text-center">
                Data: {dataDateRange.startDate ? dataDateRange.startDate.toLocaleDateString() : ''} - {dataDateRange.endDate ? dataDateRange.endDate.toLocaleDateString() : ''} ({dataDateRange.totalDays} weekdays)
              </span>
              <span className="lg:hidden text-center">
                {dataDateRange.totalDays} weekdays of data
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
