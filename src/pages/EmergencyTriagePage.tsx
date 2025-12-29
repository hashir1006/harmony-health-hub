import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  Heart, 
  Thermometer,
  Activity,
  User,
  Stethoscope,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { mockEmergencyCases, mockUsers, mockPatients } from '@/data/mockData';
import { format, formatDistanceToNow } from 'date-fns';
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
import { EmergencyCase } from '@/types';

export default function EmergencyTriagePage() {
  const [cases, setCases] = useState<EmergencyCase[]>(mockEmergencyCases);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const doctors = mockUsers.filter(u => u.role === 'doctor');

  const filteredCases = cases.filter(c => 
    selectedPriority === 'all' || c.priority === selectedPriority
  );

  const criticalCases = cases.filter(c => c.priority === 'critical' && c.status !== 'discharged');
  const mediumCases = cases.filter(c => c.priority === 'medium' && c.status !== 'discharged');
  const normalCases = cases.filter(c => c.priority === 'normal' && c.status !== 'discharged');

  const handleAddCase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const patientId = formData.get('patient') as string;
    const patient = mockPatients.find(p => p.id === patientId);
    
    if (!patient) return;

    const symptoms = (formData.get('symptoms') as string).split(',').map(s => s.trim()).filter(Boolean);
    
    // AI-based priority calculation
    const criticalSymptoms = ['chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding', 'stroke'];
    const mediumSymptoms = ['high fever', 'fracture', 'severe pain', 'vomiting blood'];
    
    let priority: EmergencyCase['priority'] = 'normal';
    const symptomsLower = symptoms.map(s => s.toLowerCase());
    
    if (symptomsLower.some(s => criticalSymptoms.some(cs => s.includes(cs)))) {
      priority = 'critical';
    } else if (symptomsLower.some(s => mediumSymptoms.some(ms => s.includes(ms)))) {
      priority = 'medium';
    }

    const newCase: EmergencyCase = {
      id: `em${cases.length + 1}`,
      patientId,
      patientName: patient.name,
      arrivalTime: new Date(),
      symptoms,
      vitalSigns: {
        bloodPressure: formData.get('bloodPressure') as string,
        heartRate: parseInt(formData.get('heartRate') as string) || 80,
        temperature: parseFloat(formData.get('temperature') as string) || 37,
        oxygenLevel: parseInt(formData.get('oxygenLevel') as string) || 98,
        respiratoryRate: parseInt(formData.get('respiratoryRate') as string) || 16,
      },
      priority,
      status: 'waiting',
      notes: formData.get('notes') as string,
      estimatedWaitTime: priority === 'critical' ? 0 : priority === 'medium' ? 15 : 30,
    };

    setCases([newCase, ...cases]);
    setIsAddDialogOpen(false);
    toast.success(`Emergency case registered with ${priority.toUpperCase()} priority!`);
  };

  const handleStatusChange = (caseId: string, status: EmergencyCase['status']) => {
    setCases(prev => 
      prev.map(c => c.id === caseId ? { ...c, status } : c)
    );
    toast.success(`Case status updated to ${status}`);
  };

  const handleAssignDoctor = (caseId: string, doctorName: string) => {
    setCases(prev => 
      prev.map(c => c.id === caseId ? { ...c, assignedDoctor: doctorName, status: 'in-treatment' } : c)
    );
    toast.success(`Doctor ${doctorName} assigned to case`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-critical text-critical-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-treatment': return 'scheduled';
      case 'admitted': return 'warning';
      case 'discharged': return 'completed';
      default: return 'pending';
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Emergency Triage"
        subtitle={`${cases.filter(c => c.status !== 'discharged').length} active cases`}
      />

      <div className="p-6 space-y-6">
        {/* Priority Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-critical bg-critical/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Priority</p>
                  <p className="text-3xl font-bold text-critical">{criticalCases.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Immediate attention required</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-critical/20 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-critical animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medium Priority</p>
                  <p className="text-3xl font-bold text-warning">{mediumCases.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. wait: 15-30 min</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-warning/20 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Normal Priority</p>
                  <p className="text-3xl font-bold text-success">{normalCases.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. wait: 30-60 min</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {['all', 'critical', 'medium', 'normal'].map((priority) => (
              <Button
                key={priority}
                variant={selectedPriority === priority ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority(priority)}
                className="capitalize"
              >
                {priority}
              </Button>
            ))}
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="critical" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Emergency Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-critical" />
                  Register Emergency Case
                </DialogTitle>
                <DialogDescription>
                  Enter patient information and symptoms. Priority will be auto-calculated.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddCase} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <Select name="patient" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or search patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} - {patient.bloodGroup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Symptoms (comma separated) *</Label>
                  <Textarea 
                    name="symptoms" 
                    required 
                    placeholder="Chest pain, Shortness of breath, Dizziness..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Priority will be auto-calculated based on symptoms
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Pressure *</Label>
                    <Input name="bloodPressure" required placeholder="120/80" />
                  </div>
                  <div className="space-y-2">
                    <Label>Heart Rate (bpm) *</Label>
                    <Input name="heartRate" type="number" required placeholder="80" />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature (°C) *</Label>
                    <Input name="temperature" type="number" step="0.1" required placeholder="37.0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Oxygen Level (%) *</Label>
                    <Input name="oxygenLevel" type="number" required placeholder="98" />
                  </div>
                  <div className="space-y-2">
                    <Label>Respiratory Rate *</Label>
                    <Input name="respiratoryRate" type="number" required placeholder="16" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea name="notes" placeholder="Any additional observations..." />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="critical">
                    Register Emergency
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.map((emCase, index) => (
            <Card 
              key={emCase.id}
              className={`overflow-hidden animate-fade-in border-l-4 ${
                emCase.priority === 'critical' ? 'border-l-critical' :
                emCase.priority === 'medium' ? 'border-l-warning' : 'border-l-success'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold ${getPriorityColor(emCase.priority)}`}>
                      {emCase.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{emCase.patientName}</h3>
                        <Badge variant={emCase.priority === 'critical' ? 'priority-critical' : emCase.priority === 'medium' ? 'priority-medium' : 'priority-normal'}>
                          {emCase.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(emCase.status)}>
                          {emCase.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Arrived {formatDistanceToNow(emCase.arrivalTime, { addSuffix: true })} • {format(emCase.arrivalTime, 'HH:mm')}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {emCase.symptoms.map((symptom, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-secondary/50 rounded-lg p-4">
                    <div className="text-center">
                      <Heart className="h-4 w-4 mx-auto text-critical mb-1" />
                      <p className="text-xs text-muted-foreground">BP</p>
                      <p className="font-semibold text-sm">{emCase.vitalSigns.bloodPressure}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="h-4 w-4 mx-auto text-primary mb-1" />
                      <p className="text-xs text-muted-foreground">HR</p>
                      <p className="font-semibold text-sm">{emCase.vitalSigns.heartRate} bpm</p>
                    </div>
                    <div className="text-center">
                      <Thermometer className="h-4 w-4 mx-auto text-warning mb-1" />
                      <p className="text-xs text-muted-foreground">Temp</p>
                      <p className="font-semibold text-sm">{emCase.vitalSigns.temperature}°C</p>
                    </div>
                    <div className="text-center">
                      <Activity className="h-4 w-4 mx-auto text-success mb-1" />
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="font-semibold text-sm">{emCase.vitalSigns.oxygenLevel}%</p>
                    </div>
                    <div className="text-center">
                      <Activity className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">RR</p>
                      <p className="font-semibold text-sm">{emCase.vitalSigns.respiratoryRate}/min</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {emCase.assignedDoctor ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium">{emCase.assignedDoctor}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select onValueChange={(value) => handleAssignDoctor(emCase.id, value)}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Assign Doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name} - {doctor.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {emCase.estimatedWaitTime !== undefined && emCase.status === 'waiting' && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Est. wait: {emCase.estimatedWaitTime} min
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {emCase.status === 'waiting' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(emCase.id, 'in-treatment')}
                      >
                        Start Treatment
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                    {emCase.status === 'in-treatment' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(emCase.id, 'admitted')}
                        >
                          Admit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => handleStatusChange(emCase.id, 'discharged')}
                        >
                          Discharge
                        </Button>
                      </>
                    )}
                    {emCase.status === 'admitted' && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleStatusChange(emCase.id, 'discharged')}
                      >
                        Discharge
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCases.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No emergency cases</h3>
                <p className="text-muted-foreground">
                  {selectedPriority === 'all' 
                    ? 'No active emergency cases at the moment'
                    : `No ${selectedPriority} priority cases`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
