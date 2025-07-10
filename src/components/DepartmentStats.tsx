import type { DepartmentStats as DepartmentStatsType } from '../types/attendance';

interface DepartmentStatsProps {
  departments: DepartmentStatsType[];
}

export default function DepartmentStats({ departments }: DepartmentStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Department Attendance</h2>
      
      <div className="space-y-4">
        {departments.map((dept) => (
          <div key={dept.department} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                <div className="text-sm text-gray-600">
                  {dept.presentCount}/{dept.totalEmployees} 
                  <span className="ml-2 font-medium text-gray-900">
                    {dept.attendanceRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dept.attendanceRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {departments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No department data available.</p>
        </div>
      )}
    </div>
  );
} 