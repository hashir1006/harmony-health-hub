import React from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clipboard,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments, mockPatients } from '@/data/mockData';
import { format, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';

export default function DoctorDashboardPage() {
  const { user } = useAuth();

  const todayAppointments = mockAppointments.filter(
    apt => apt.doctorId === user?.id || apt.doctorName === user?.name
  ).filter(apt => isSameDay(apt.date, new Date()));

  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  const pendingToday = todayAppointments.filter(apt => apt.status === 'scheduled').length;

  const criticalCases = todayAppointments.filter(apt => apt.priority === 'critical');

  const stats = [
    { 
      label: "Today's Appointments", 
      value: todayAppointments.length, 
      icon: Calendar, 
      color: 'primary' 
    },
    { 
      label: 'Completed', 
      value: completedToday, 
      icon: CheckCircle, 
      color: 'success' 
    },
    { 
      label: 'Pending', 
      value: pendingToday, 
      icon: Clock, 
      color: 'warning' 
    },
    { 
      label: 'Critical Cases', 
      value: criticalCases.length, 
      icon: AlertTriangle, 
      color: 'critical' 
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      critical: 'bg-critical/10 text-critical',
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Doctor Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <Link to="/appointments">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold">{apt.time}</p>
                          <p className="text-xs text-muted-foreground">{apt.duration} min</p>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div>
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground capitalize">{apt.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={apt.priority === 'critical' ? 'priority-critical' : apt.priority === 'medium' ? 'priority-medium' : 'priority-normal'}
                        >
                          {apt.priority}
                        </Badge>
                        <Badge variant={apt.status === 'completed' ? 'completed' : 'scheduled'}>
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/patients" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Patients</p>
                    <p className="text-xs text-muted-foreground">Access patient records</p>
                  </div>
                </Button>
              </Link>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <FileText className="h-5 w-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Add Diagnosis</p>
                  <p className="text-xs text-muted-foreground">Create medical record</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clipboard className="h-5 w-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Write Prescription</p>
                  <p className="text-xs text-muted-foreground">Prescribe medication</p>
                </div>
              </Button>

              <Link to="/emergency" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                  <div className="p-2 rounded-lg bg-critical/10">
                    <AlertTriangle className="h-5 w-5 text-critical" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Emergency Cases</p>
                    <p className="text-xs text-muted-foreground">View triage queue</p>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Patients
            </CardTitle>
            <Link to="/patients">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockPatients.slice(0, 4).map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground font-semibold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.bloodGroup}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      Records
                    </Button>
                    <Button size="sm" variant="default" className="flex-1 text-xs">
                      Diagnose
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              This Week's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-3xl font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">Patients Seen</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-3xl font-bold text-success">24</p>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-3xl font-bold text-warning">15</p>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <p className="text-3xl font-bold text-critical">3</p>
                <p className="text-sm text-muted-foreground">Emergency Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
