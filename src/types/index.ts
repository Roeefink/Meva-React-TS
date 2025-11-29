export interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt?: Date;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: Date;
}

// Add more types as needed for your medical app