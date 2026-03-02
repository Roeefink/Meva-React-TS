import styled from "styled-components";
import PatientsList from "../components/PatientsList";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
`;

export default function PatientsPage() {
    return (
        <Container>
            <PatientsList />
        </Container>
    );
}
