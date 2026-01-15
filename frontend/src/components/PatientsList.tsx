import { useState, useEffect } from "react";
import { supabaseService } from "@/services/supabaseService";
import type { Patient } from "@/types";

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabaseService.getAll<Patient>("patients");
      if (error) {
          console.error("Failed to load patients:", error);
      } else {
          setPatients(data || []);
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabaseService.delete("patients", id);
      if (error) {
            console.error("Failed to delete patient:", error);
            return;
      }
      setPatients(patients.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.name} - {patient.email}
            <button onClick={() => handleDelete(patient.id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
