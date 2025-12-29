import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Droplets,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { mockPatients } from '@/data/mockData';
import { format } from 'date-fns';
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
import { toast } from 'sonner';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPatient = {
      id: `p${patients.length + 1}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      dateOfBirth: new Date(formData.get('dob') as string),
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      bloodGroup: formData.get('bloodGroup') as string,
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      medicalHistory: [],
      allergies: (formData.get('allergies') as string).split(',').map(a => a.trim()).filter(Boolean),
      insuranceId: formData.get('insuranceId') as string,
      createdAt: new Date(),
    };

    setPatients([...patients, newPatient]);
    setIsAddDialogOpen(false);
    toast.success('Patient registered successfully!');
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Patient Management"
        subtitle={`${patients.length} patients registered`}
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    Enter the patient's information to create a new record.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" name="phone" required placeholder="+1-555-1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" name="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select name="gender" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group *</Label>
                      <Select name="bloodGroup" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input id="address" name="address" required placeholder="123 Main St, City, State ZIP" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                      <Input id="emergencyContact" name="emergencyContact" required placeholder="+1-555-5678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceId">Insurance ID</Label>
                      <Input id="insuranceId" name="insuranceId" placeholder="INS-XXXX-XXX" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="allergies">Allergies (comma separated)</Label>
                      <Input id="allergies" name="allergies" placeholder="Penicillin, Shellfish" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gradient">
                      Register Patient
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient, index) => (
            <Card 
              key={patient.id}
              className="hover:shadow-card-hover transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} • {
                          Math.floor((new Date().getTime() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                        } years
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedPatient(patient);
                        setIsViewDialogOpen(true);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Medical Records
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-critical">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(patient.dateOfBirth, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span>Blood Group: {patient.bloodGroup}</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map(allergy => (
                        <Badge key={allergy} variant="warning" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No patients found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}

        {/* View Patient Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            
            {selectedPatient && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-primary-foreground text-xl font-semibold">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                    <p className="text-muted-foreground">
                      Patient ID: {selectedPatient.id} • Registered {format(selectedPatient.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <p className="font-medium">{format(selectedPatient.dateOfBirth, 'MMMM d, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="font-medium capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Blood Group</Label>
                    <p className="font-medium">{selectedPatient.bloodGroup}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Insurance ID</Label>
                    <p className="font-medium">{selectedPatient.insuranceId || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Emergency Contact</Label>
                    <p className="font-medium">{selectedPatient.emergencyContact}</p>
                  </div>
                </div>

                {selectedPatient.allergies.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPatient.allergies.map(allergy => (
                        <Badge key={allergy} variant="warning">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Medical Records
                  </Button>
                  <Button variant="gradient" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
