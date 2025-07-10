import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import type { AttendanceStats } from '../types/attendance';

interface StatsCardsProps {
  stats: AttendanceStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Late Today',
      value: stats.lateToday,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
            <div className="flex items-center">
              <div className={`${card.color} p-2 lg:p-3 rounded-lg`}>
                <Icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                <p className={`text-lg lg:text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 