// User roles in the hospital system
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
  phone?: string;
  createdAt: Date;
}

// Patient interface with medical history
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalHistory: MedicalRecord[];
  allergies: string[];
  insuranceId?: string;
  createdAt: Date;
}

// Medical record for patient history
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  diagnosis: string;
  symptoms: string[];
  prescription: Prescription[];
  notes: string;
  attachments: string[];
}

// Prescription details
export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  notes?: string;
  priority: 'normal' | 'medium' | 'critical';
}

// Emergency triage case
export interface EmergencyCase {
  id: string;
  patientId: string;
  patientName: string;
  arrivalTime: Date;
  symptoms: string[];
  vitalSigns: VitalSigns;
  priority: 'critical' | 'medium' | 'normal';
  status: 'waiting' | 'in-treatment' | 'admitted' | 'discharged';
  assignedDoctor?: string;
  notes: string;
  estimatedWaitTime?: number; // in minutes
}

// Vital signs for emergency triage
export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenLevel: number;
  respiratoryRate: number;
}

// Billing invoice
export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  items: BillingItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  createdAt: Date;
}

// Individual billing item
export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'consultation' | 'procedure' | 'medication' | 'lab' | 'room' | 'other';
}

// Department in the hospital
export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  bedCount: number;
  occupiedBeds: number;
  location: string;
}

// Analytics data structure
export interface AnalyticsData {
  dailyPatients: { date: string; count: number }[];
  bedOccupancy: { department: string; occupied: number; total: number }[];
  doctorWorkload: { doctor: string; appointments: number; consultations: number }[];
  emergencyTrends: { date: string; critical: number; medium: number; normal: number }[];
  revenueData: { month: string; revenue: number; expenses: number }[];
}

// Symptom for AI checker
export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  category: string;
}

// AI symptom analysis result
export interface SymptomAnalysis {
  suggestedDepartment: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  shouldSeekImmediate: boolean;
}
