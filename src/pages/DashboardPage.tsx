import React from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bed,
  Stethoscope,
  Receipt
} from 'lucide-react';
import { mockPatients, mockAppointments, mockEmergencyCases, mockDepartments } from '@/data/mockData';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  const todayAppointments = mockAppointments.filter(
    apt => format(apt.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const activeEmergencies = mockEmergencyCases.filter(
    em => em.status !== 'discharged'
  );

  const totalBeds = mockDepartments.reduce((sum, d) => sum + d.bedCount, 0);
  const occupiedBeds = mockDepartments.reduce((sum, d) => sum + d.occupiedBeds, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const stats = [
    {
      title: 'Total Patients',
      value: mockPatients.length,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'primary',
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      color: 'success',
    },
    {
      title: 'Emergency Cases',
      value: activeEmergencies.length,
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'critical',
    },
    {
      title: 'Bed Occupancy',
      value: `${occupancyRate}%`,
      change: '+3%',
      trend: 'up',
      icon: Bed,
      color: 'warning',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; text: string }> = {
      primary: { bg: 'bg-primary/10', icon: 'text-primary', text: 'text-primary' },
      success: { bg: 'bg-success/10', icon: 'text-success', text: 'text-success' },
      critical: { bg: 'bg-critical/10', icon: 'text-critical', text: 'text-critical' },
      warning: { bg: 'bg-warning/10', icon: 'text-warning', text: 'text-warning' },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen">
      <Header 
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user?.name.split(' ')[0]}`}
        subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <Card 
                key={stat.title} 
                className="hover:shadow-card-hover transition-shadow duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${colors.bg}`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-critical'}`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Appointments
              </CardTitle>
              <Link to="/appointments">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {apt.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.department} • {apt.doctorName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{apt.time}</span>
                      </div>
                      <Badge 
                        variant={apt.priority === 'critical' ? 'priority-critical' : apt.priority === 'medium' ? 'priority-medium' : 'priority-normal'}
                        className="mt-1"
                      >
                        {apt.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {todayAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Triage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-critical" />
                Emergency Triage
              </CardTitle>
              <Link to="/emergency">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeEmergencies.map((em) => (
                  <div
                    key={em.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      em.priority === 'critical' 
                        ? 'border-l-critical bg-critical/5' 
                        : em.priority === 'medium'
                        ? 'border-l-warning bg-warning/5'
                        : 'border-l-success bg-success/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{em.patientName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {em.symptoms.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <Badge 
                        variant={em.priority === 'critical' ? 'priority-critical' : em.priority === 'medium' ? 'priority-medium' : 'priority-normal'}
                      >
                        {em.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-muted-foreground">
                        {em.status === 'waiting' ? `Wait: ${em.estimatedWaitTime} min` : em.status}
                      </span>
                      {em.assignedDoctor && (
                        <span className="flex items-center gap-1 text-primary">
                          <Stethoscope className="h-3 w-3" />
                          {em.assignedDoctor}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'New Patient', icon: Users, path: '/patients', color: 'primary' },
                { label: 'Book Appointment', icon: Calendar, path: '/appointments', color: 'success' },
                { label: 'Emergency Case', icon: AlertTriangle, path: '/emergency', color: 'critical' },
                { label: 'Symptom Checker', icon: Activity, path: '/symptom-checker', color: 'warning' },
                { label: 'Create Invoice', icon: Receipt, path: '/billing', color: 'primary' },
                { label: 'View Analytics', icon: TrendingUp, path: '/analytics', color: 'success' },
              ].map((action) => {
                const Icon = action.icon;
                const colors = getColorClasses(action.color);
                
                return (
                  <Link key={action.label} to={action.path}>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex-col gap-3 hover:shadow-card transition-all"
                    >
                      <div className={`p-3 rounded-xl ${colors.bg}`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDepartments.map((dept) => {
                const occupancy = Math.round((dept.occupiedBeds / dept.bedCount) * 100);
                const occupancyColor = occupancy > 80 ? 'critical' : occupancy > 60 ? 'warning' : 'success';
                
                return (
                  <div
                    key={dept.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.head}</p>
                      </div>
                      <Badge variant={occupancyColor === 'critical' ? 'critical' : occupancyColor === 'warning' ? 'warning' : 'success'}>
                        {occupancy}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Beds</span>
                        <span>{dept.occupiedBeds}/{dept.bedCount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            occupancyColor === 'critical' ? 'bg-critical' : 
                            occupancyColor === 'warning' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Staff</span>
                        <span>{dept.staffCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
