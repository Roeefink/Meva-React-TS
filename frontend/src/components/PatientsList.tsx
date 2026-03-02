import { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../config/Supabase";
import { Users, AlertCircle, Loader2 } from "lucide-react";

export interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  created_at: string;
}

const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  
  h2 {
    margin: 0;
    color: #1a1a1a;
    font-size: 1.5rem;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  
  th, td {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: #f8fafc;
  }
  
  td {
    color: #334155;
    font-size: 0.95rem;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #64748b;
  gap: 16px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .spinner {
    animation: spin 1s linear infinite;
    color: #3b82f6;
  }
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #fef2f2;
  border: 1px solid #f87171;
  border-radius: 8px;
  color: #b91c1c;
  margin-bottom: 24px;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 48px;
  color: #64748b;
  
  p {
    margin-top: 8px;
  }
`;

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error("Authentication required");
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/v1/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data.patients || []);

      } catch (err: any) {
        console.error("Error fetching patients:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <Loader2 size={32} className="spinner" />
          <p>Loading patient records...</p>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Users size={28} color="#3b82f6" />
        <h2>Patient Directory</h2>
      </Header>

      {error && (
        <ErrorState>
          <AlertCircle size={20} />
          {error}
        </ErrorState>
      )}

      {patients.length === 0 && !error ? (
        <EmptyStateContainer>
          <Users size={48} opacity={0.5} />
          <p>No patients found. Add a patient to get started.</p>
        </EmptyStateContainer>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: 500, color: '#0f172a' }}>{patient.name}</td>
                  <td>{patient.age || '—'}</td>
                  <td>{patient.gender || '—'}</td>
                  <td>{patient.phone || '—'}</td>
                  <td>{patient.email || '—'}</td>
                  <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
}
