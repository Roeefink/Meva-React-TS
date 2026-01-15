import styled from "styled-components";

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
`;

export default function ContactUsPage() {
    return (
        <PageContainer>
            <h1>Contact Us</h1>
        </PageContainer>
    );
}