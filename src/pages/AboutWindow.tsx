import styled from "styled-components";

const Content = styled.div`
  padding: 20px;
  color: #222;
  line-height: 1.6;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(36, 143, 201);
  margin-bottom: 16px;
  margin-top: 0;
`;

const Text = styled.p`
  font-size: 1rem;
  margin-bottom: 16px;
  color: #333;
  font-weight: bold;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

export default function AboutWindow() {
  return (
    <Content>
      <Section>
        <Title>About the System</Title>
        <Text>
          Meva Medical is an advanced AI-powered medical search and
          assistance platform designed specifically for hospitals in the
          United States. The system integrates securely with the hospitals
          internal databases to provide fast, accurate, and context-aware
          medical information. By analyzing patient data, clinical records,
          and historical health information, Meva Medical helps clinicians
          access critical details in seconds. Its goal is to streamline
          medical decision-making, enhance workflow efficiency, and support
          healthcare professionals with reliable, data-driven insights.
        </Text>
      </Section>
      <Section>
        <Title>Features</Title>
        <Text>
          • AI-Driven Patient Search Clinicians can ask natural-language
          questions such as "John Doe — what is his blood type, allergies,
          admission date, and history of illness?" and receive precise,
          consolidated results instantly.
        </Text>
        <Text>
          • Real-Time Treatment Suggestions Based on a patient's medical
          history, lab results, and clinical guidelines, the system can
          suggest potential treatment options or highlight considerations
          for further evaluation.
        </Text>
        <Text>
          • Secure Data Integration Connects to the hospital's EHR/EMR
          systems with full compliance to U.S. healthcare standards,
          including HIPAA, to ensure patient data is protected.
        </Text>
        <Text>
          • Comprehensive Patient Profiles Summarizes blood type, allergies,
          admission dates, medications, diagnoses, and past procedures in
          one unified interface.
        </Text>
        <Text>
          • Intelligent History Extraction Automatically pulls relevant past
          conditions or health patterns from long or complex records.
        </Text>
        <Text>
          • Workflow Efficiency Reduces time spent searching through medical
          files, allowing doctors and nurses to focus more on patient care.
        </Text>
        <Text>
          • Scalable & Customizable Can be tailored to match hospital
          protocols, specialty needs, and internal data structures.
        </Text>
      </Section>
    </Content>
  );
}
