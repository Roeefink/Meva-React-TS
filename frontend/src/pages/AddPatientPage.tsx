import styled from "styled-components";

import AddPatient from "../components/AddPatient";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
`;

export default function AddPatientPage() {
    return (
        <Container>
            <AddPatient />
        </Container>
    );
}