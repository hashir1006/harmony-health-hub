import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Clock, 
  Calendar,
  User,
  Stethoscope,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { mockAppointments, mockPatients, mockUsers } from '@/data/mockData';
import { format, addDays, isSameDay } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const doctors = mockUsers.filter(u => u.role === 'doctor');

  const filteredAppointments = appointments.filter(apt =>
    (apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) &&
    isSameDay(apt.date, selectedDate)
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 1));

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const getAppointmentForSlot = (time: string) => {
    return filteredAppointments.find(apt => apt.time === time);
  };

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const patientId = formData.get('patient') as string;
    const doctorId = formData.get('doctor') as string;
    const patient = mockPatients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!patient || !doctor) return;

    const newAppointment: Appointment = {
      id: `apt${appointments.length + 1}`,
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name,
      department: doctor.department || 'General',
      date: new Date(formData.get('date') as string),
      time: formData.get('time') as string,
      duration: parseInt(formData.get('duration') as string) || 30,
      status: 'scheduled',
      type: formData.get('type') as Appointment['type'],
      priority: formData.get('priority') as Appointment['priority'],
      notes: formData.get('notes') as string,
    };

    setAppointments([...appointments, newAppointment]);
    setIsAddDialogOpen(false);
    toast.success('Appointment scheduled successfully!');
  };

  const handleStatusChange = (aptId: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === aptId ? { ...apt, status } : apt)
    );
    toast.success(`Appointment marked as ${status}`);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const variants: Record<string, 'scheduled' | 'completed' | 'cancelled' | 'warning'> = {
      scheduled: 'scheduled',
      completed: 'completed',
      cancelled: 'cancelled',
      'no-show': 'warning',
    };
    return variants[status] || 'scheduled';
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Appointments"
        subtitle={`${filteredAppointments.length} appointments on ${format(selectedDate, 'MMMM d, yyyy')}`}
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment for a patient.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddAppointment} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <Select name="patient" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Doctor *</Label>
                  <Select name="doctor" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      required 
                      defaultValue={format(selectedDate, 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Select name="time" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="routine">Routine Checkup</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select name="priority" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Select name="duration">
                    <SelectTrigger>
                      <SelectValue placeholder="30 minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea name="notes" placeholder="Additional notes..." />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient">
                    Book Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Week Calendar Strip */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const dayAppointments = appointments.filter(apt => isSameDay(apt.date, day));
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`flex-shrink-0 p-4 rounded-xl text-center transition-all min-w-[80px] ${
                      isSelected 
                        ? 'gradient-primary text-primary-foreground shadow-glow' 
                        : isToday
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <p className="text-xs font-medium opacity-80">{format(day, 'EEE')}</p>
                    <p className="text-2xl font-bold mt-1">{format(day, 'd')}</p>
                    <p className="text-xs mt-1 opacity-80">{dayAppointments.length} apt</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time Slots */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Schedule for {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentForSlot(time);
                  
                  return (
                    <div
                      key={time}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        appointment ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/50 hover:bg-secondary'
                      }`}
                    >
                      <div className="w-16 text-center">
                        <span className="text-sm font-medium text-muted-foreground">{time}</span>
                      </div>
                      
                      {appointment ? (
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {appointment.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctorName} • {appointment.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadge(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <Badge 
                              variant={
                                appointment.priority === 'critical' ? 'priority-critical' : 
                                appointment.priority === 'medium' ? 'priority-medium' : 'priority-normal'
                              }
                            >
                              {appointment.priority}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'completed')}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                                  <XCircle className="h-4 w-4 mr-2 text-critical" />
                                  Cancel
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-critical">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-sm text-muted-foreground italic">
                          Available
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Appointments</span>
                  <span className="font-semibold">{filteredAppointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold text-success">
                    {filteredAppointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cancelled</span>
                  <span className="font-semibold text-critical">
                    {filteredAppointments.filter(a => a.status === 'cancelled').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-warning">
                    {filteredAppointments.filter(a => a.status === 'scheduled').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  Doctors on Duty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctors.slice(0, 4).map(doctor => (
                    <div key={doctor.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAppointments
                    .filter(apt => apt.status === 'scheduled')
                    .slice(0, 3)
                    .map(apt => (
                      <div key={apt.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                          {apt.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground">{apt.time} • {apt.duration}min</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
