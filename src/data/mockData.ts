import { 
  User, 
  Patient, 
  Appointment, 
  EmergencyCase, 
  Invoice, 
  Department,
  AnalyticsData,
  MedicalRecord,
  Prescription
} from '@/types';

// Mock Users with different roles
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'admin',
    department: 'Administration',
    phone: '+1-555-0101',
    createdAt: new Date('2020-01-15'),
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    phone: '+1-555-0102',
    createdAt: new Date('2019-06-20'),
  },
  {
    id: '3',
    name: 'Dr. Emily Williams',
    email: 'emily.williams@hospital.com',
    role: 'doctor',
    department: 'Neurology',
    specialization: 'Neurological Surgery',
    phone: '+1-555-0103',
    createdAt: new Date('2021-03-10'),
  },
  {
    id: '4',
    name: 'Nurse Patricia Brown',
    email: 'patricia.brown@hospital.com',
    role: 'nurse',
    department: 'Emergency',
    phone: '+1-555-0104',
    createdAt: new Date('2018-09-05'),
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.wilson@hospital.com',
    role: 'receptionist',
    department: 'Front Desk',
    phone: '+1-555-0105',
    createdAt: new Date('2022-01-20'),
  },
  {
    id: '6',
    name: 'Dr. Robert Martinez',
    email: 'robert.martinez@hospital.com',
    role: 'doctor',
    department: 'Orthopedics',
    specialization: 'Sports Medicine',
    phone: '+1-555-0106',
    createdAt: new Date('2020-08-15'),
  },
];

// Sample prescriptions
const samplePrescriptions: Prescription[] = [
  {
    id: 'rx1',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: '30 days',
    instructions: 'Take in the morning with water',
  },
  {
    id: 'rx2',
    medication: 'Metformin 500mg',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    duration: '60 days',
    instructions: 'Take with meals',
  },
];

// Sample medical records
const sampleMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr1',
    patientId: 'p1',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: new Date('2024-01-15'),
    diagnosis: 'Hypertension Stage 1',
    symptoms: ['Headaches', 'Dizziness', 'Fatigue'],
    prescription: samplePrescriptions,
    notes: 'Patient advised to reduce sodium intake and increase physical activity.',
    attachments: [],
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+1-555-1001',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: '+1-555-1002',
    medicalHistory: sampleMedicalRecords,
    allergies: ['Penicillin', 'Shellfish'],
    insuranceId: 'INS-2024-001',
    createdAt: new Date('2023-06-10'),
  },
  {
    id: 'p2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-1003',
    dateOfBirth: new Date('1990-07-22'),
    gender: 'female',
    bloodGroup: 'A+',
    address: '456 Maple Avenue, Springfield, IL 62702',
    emergencyContact: '+1-555-1004',
    medicalHistory: [],
    allergies: [],
    insuranceId: 'INS-2024-002',
    createdAt: new Date('2023-08-15'),
  },
  {
    id: 'p3',
    name: 'Robert Thompson',
    email: 'robert.thompson@email.com',
    phone: '+1-555-1005',
    dateOfBirth: new Date('1978-11-08'),
    gender: 'male',
    bloodGroup: 'B-',
    address: '789 Pine Road, Springfield, IL 62703',
    emergencyContact: '+1-555-1006',
    medicalHistory: [],
    allergies: ['Latex', 'Aspirin'],
    insuranceId: 'INS-2024-003',
    createdAt: new Date('2023-09-20'),
  },
  {
    id: 'p4',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '+1-555-1007',
    dateOfBirth: new Date('1995-05-30'),
    gender: 'female',
    bloodGroup: 'AB+',
    address: '321 Cedar Lane, Springfield, IL 62704',
    emergencyContact: '+1-555-1008',
    medicalHistory: [],
    allergies: [],
    insuranceId: 'INS-2024-004',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'p5',
    name: 'William Davis',
    email: 'william.davis@email.com',
    phone: '+1-555-1009',
    dateOfBirth: new Date('1962-09-14'),
    gender: 'male',
    bloodGroup: 'O-',
    address: '654 Birch Street, Springfield, IL 62705',
    emergencyContact: '+1-555-1010',
    medicalHistory: [],
    allergies: ['Sulfa drugs'],
    insuranceId: 'INS-2024-005',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'p1',
    patientName: 'John Anderson',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    department: 'Cardiology',
    date: new Date(),
    time: '09:00',
    duration: 30,
    status: 'scheduled',
    type: 'consultation',
    priority: 'normal',
    notes: 'Follow-up for hypertension',
  },
  {
    id: 'apt2',
    patientId: 'p2',
    patientName: 'Maria Garcia',
    doctorId: '3',
    doctorName: 'Dr. Emily Williams',
    department: 'Neurology',
    date: new Date(),
    time: '10:30',
    duration: 45,
    status: 'scheduled',
    type: 'consultation',
    priority: 'medium',
    notes: 'Recurring headaches assessment',
  },
  {
    id: 'apt3',
    patientId: 'p3',
    patientName: 'Robert Thompson',
    doctorId: '6',
    doctorName: 'Dr. Robert Martinez',
    department: 'Orthopedics',
    date: new Date(),
    time: '11:00',
    duration: 30,
    status: 'scheduled',
    type: 'follow-up',
    priority: 'normal',
  },
  {
    id: 'apt4',
    patientId: 'p4',
    patientName: 'Jennifer Lee',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    department: 'Cardiology',
    date: new Date(),
    time: '14:00',
    duration: 30,
    status: 'scheduled',
    type: 'routine',
    priority: 'normal',
  },
  {
    id: 'apt5',
    patientId: 'p5',
    patientName: 'William Davis',
    doctorId: '3',
    doctorName: 'Dr. Emily Williams',
    department: 'Neurology',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '09:30',
    duration: 60,
    status: 'scheduled',
    type: 'consultation',
    priority: 'critical',
    notes: 'Urgent: suspected stroke symptoms',
  },
];

// Mock Emergency Cases
export const mockEmergencyCases: EmergencyCase[] = [
  {
    id: 'em1',
    patientId: 'p1',
    patientName: 'John Anderson',
    arrivalTime: new Date(Date.now() - 3600000), // 1 hour ago
    symptoms: ['Chest pain', 'Shortness of breath', 'Sweating'],
    vitalSigns: {
      bloodPressure: '160/100',
      heartRate: 110,
      temperature: 37.2,
      oxygenLevel: 94,
      respiratoryRate: 22,
    },
    priority: 'critical',
    status: 'in-treatment',
    assignedDoctor: 'Dr. Michael Chen',
    notes: 'Possible myocardial infarction. ECG ordered.',
    estimatedWaitTime: 0,
  },
  {
    id: 'em2',
    patientId: 'p3',
    patientName: 'Robert Thompson',
    arrivalTime: new Date(Date.now() - 1800000), // 30 min ago
    symptoms: ['Severe headache', 'Nausea', 'Sensitivity to light'],
    vitalSigns: {
      bloodPressure: '130/85',
      heartRate: 78,
      temperature: 37.8,
      oxygenLevel: 98,
      respiratoryRate: 16,
    },
    priority: 'medium',
    status: 'waiting',
    notes: 'Migraine with possible complications. CT scan may be needed.',
    estimatedWaitTime: 25,
  },
  {
    id: 'em3',
    patientId: 'p4',
    patientName: 'Jennifer Lee',
    arrivalTime: new Date(Date.now() - 900000), // 15 min ago
    symptoms: ['Ankle sprain', 'Swelling', 'Difficulty walking'],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.8,
      oxygenLevel: 99,
      respiratoryRate: 14,
    },
    priority: 'normal',
    status: 'waiting',
    notes: 'Sports injury. X-ray recommended.',
    estimatedWaitTime: 45,
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    patientId: 'p1',
    patientName: 'John Anderson',
    items: [
      { id: 'item1', description: 'Cardiology Consultation', quantity: 1, unitPrice: 150, total: 150, category: 'consultation' },
      { id: 'item2', description: 'ECG Test', quantity: 1, unitPrice: 75, total: 75, category: 'procedure' },
      { id: 'item3', description: 'Lisinopril 10mg (30 tablets)', quantity: 1, unitPrice: 25, total: 25, category: 'medication' },
    ],
    subtotal: 250,
    tax: 25,
    discount: 0,
    total: 275,
    status: 'pending',
    dueDate: new Date(Date.now() + 2592000000), // 30 days from now
    createdAt: new Date(),
  },
  {
    id: 'inv2',
    patientId: 'p2',
    patientName: 'Maria Garcia',
    items: [
      { id: 'item4', description: 'Neurology Consultation', quantity: 1, unitPrice: 200, total: 200, category: 'consultation' },
      { id: 'item5', description: 'MRI Scan', quantity: 1, unitPrice: 500, total: 500, category: 'procedure' },
    ],
    subtotal: 700,
    tax: 70,
    discount: 50,
    total: 720,
    status: 'paid',
    dueDate: new Date(Date.now() - 604800000), // 7 days ago
    paidDate: new Date(Date.now() - 259200000), // 3 days ago
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 1209600000), // 14 days ago
  },
  {
    id: 'inv3',
    patientId: 'p3',
    patientName: 'Robert Thompson',
    items: [
      { id: 'item6', description: 'Orthopedic Consultation', quantity: 1, unitPrice: 175, total: 175, category: 'consultation' },
      { id: 'item7', description: 'X-Ray (Knee)', quantity: 2, unitPrice: 50, total: 100, category: 'procedure' },
      { id: 'item8', description: 'Physical Therapy Session', quantity: 3, unitPrice: 80, total: 240, category: 'procedure' },
    ],
    subtotal: 515,
    tax: 51.5,
    discount: 0,
    total: 566.5,
    status: 'overdue',
    dueDate: new Date(Date.now() - 1209600000), // 14 days ago
    createdAt: new Date(Date.now() - 2419200000), // 28 days ago
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  { id: 'dept1', name: 'Emergency', head: 'Dr. Sarah Johnson', staffCount: 45, bedCount: 30, occupiedBeds: 24, location: 'Building A, Ground Floor' },
  { id: 'dept2', name: 'Cardiology', head: 'Dr. Michael Chen', staffCount: 28, bedCount: 40, occupiedBeds: 32, location: 'Building B, 2nd Floor' },
  { id: 'dept3', name: 'Neurology', head: 'Dr. Emily Williams', staffCount: 22, bedCount: 25, occupiedBeds: 18, location: 'Building B, 3rd Floor' },
  { id: 'dept4', name: 'Orthopedics', head: 'Dr. Robert Martinez', staffCount: 20, bedCount: 35, occupiedBeds: 28, location: 'Building C, 1st Floor' },
  { id: 'dept5', name: 'Pediatrics', head: 'Dr. Amanda Foster', staffCount: 32, bedCount: 50, occupiedBeds: 38, location: 'Building D, 1st Floor' },
  { id: 'dept6', name: 'ICU', head: 'Dr. James Harper', staffCount: 40, bedCount: 20, occupiedBeds: 18, location: 'Building A, 4th Floor' },
];

// Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
  dailyPatients: [
    { date: '2024-01-01', count: 145 },
    { date: '2024-01-02', count: 132 },
    { date: '2024-01-03', count: 168 },
    { date: '2024-01-04', count: 155 },
    { date: '2024-01-05', count: 142 },
    { date: '2024-01-06', count: 89 },
    { date: '2024-01-07', count: 76 },
    { date: '2024-01-08', count: 158 },
    { date: '2024-01-09', count: 172 },
    { date: '2024-01-10', count: 165 },
    { date: '2024-01-11', count: 148 },
    { date: '2024-01-12', count: 139 },
    { date: '2024-01-13', count: 95 },
    { date: '2024-01-14', count: 82 },
  ],
  bedOccupancy: [
    { department: 'Emergency', occupied: 24, total: 30 },
    { department: 'Cardiology', occupied: 32, total: 40 },
    { department: 'Neurology', occupied: 18, total: 25 },
    { department: 'Orthopedics', occupied: 28, total: 35 },
    { department: 'Pediatrics', occupied: 38, total: 50 },
    { department: 'ICU', occupied: 18, total: 20 },
  ],
  doctorWorkload: [
    { doctor: 'Dr. Chen', appointments: 28, consultations: 24 },
    { doctor: 'Dr. Williams', appointments: 22, consultations: 20 },
    { doctor: 'Dr. Martinez', appointments: 25, consultations: 22 },
    { doctor: 'Dr. Foster', appointments: 30, consultations: 28 },
    { doctor: 'Dr. Harper', appointments: 18, consultations: 15 },
  ],
  emergencyTrends: [
    { date: '2024-01-08', critical: 5, medium: 12, normal: 28 },
    { date: '2024-01-09', critical: 3, medium: 15, normal: 32 },
    { date: '2024-01-10', critical: 7, medium: 10, normal: 25 },
    { date: '2024-01-11', critical: 4, medium: 14, normal: 30 },
    { date: '2024-01-12', critical: 6, medium: 11, normal: 27 },
    { date: '2024-01-13', critical: 2, medium: 8, normal: 18 },
    { date: '2024-01-14', critical: 3, medium: 9, normal: 20 },
  ],
  revenueData: [
    { month: 'Aug', revenue: 485000, expenses: 320000 },
    { month: 'Sep', revenue: 520000, expenses: 340000 },
    { month: 'Oct', revenue: 498000, expenses: 335000 },
    { month: 'Nov', revenue: 545000, expenses: 355000 },
    { month: 'Dec', revenue: 580000, expenses: 370000 },
    { month: 'Jan', revenue: 525000, expenses: 345000 },
  ],
};

// Symptom categories for AI checker
export const symptomCategories = [
  {
    category: 'Cardiovascular',
    symptoms: ['Chest pain', 'Heart palpitations', 'Shortness of breath', 'Swelling in legs', 'Dizziness'],
    department: 'Cardiology',
  },
  {
    category: 'Neurological',
    symptoms: ['Severe headache', 'Numbness', 'Vision changes', 'Confusion', 'Seizures', 'Memory loss'],
    department: 'Neurology',
  },
  {
    category: 'Respiratory',
    symptoms: ['Difficulty breathing', 'Persistent cough', 'Wheezing', 'Coughing blood', 'Chest tightness'],
    department: 'Pulmonology',
  },
  {
    category: 'Musculoskeletal',
    symptoms: ['Joint pain', 'Back pain', 'Muscle weakness', 'Fracture', 'Sports injury', 'Limited mobility'],
    department: 'Orthopedics',
  },
  {
    category: 'Gastrointestinal',
    symptoms: ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Blood in stool', 'Difficulty swallowing'],
    department: 'Gastroenterology',
  },
  {
    category: 'General',
    symptoms: ['Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'General weakness'],
    department: 'Internal Medicine',
  },
];
