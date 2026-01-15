import styled from "styled-components";

import InfoForm from "../components/InfoForm";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
`;

export default function AddInfoPage() {
  return (
    <Container>
      <InfoForm />
    </Container>
  );
}
