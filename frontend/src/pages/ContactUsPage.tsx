import { useState } from "react";
import styled from "styled-components";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const PageContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideUp 0.6s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #248fc9;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(120deg, #248fc9, #6dd5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e1e4e8;
  background: #f9fafb;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #248fc9;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(36, 143, 201, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e1e4e8;
  background: #f9fafb;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #248fc9;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(36, 143, 201, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #248fc9 0%, #1a6b96 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(36, 143, 201, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(36, 143, 201, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' }>`
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  background-color: ${({ type }) => type === 'success' ? '#def7ec' : '#fde8e8'};
  color: ${({ type }) => type === 'success' ? '#03543f' : '#9b1c1c'};
  border: 1px solid ${({ type }) => type === 'success' ? '#84e1bc' : '#f8b4b4'};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function ContactUsPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch('http://localhost:3001/api/v1/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to submit feedback');

            setStatus({ type: 'success', text: 'Thank you! Your feedback has been sent.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <FormCard>
                <Title>Get in Touch</Title>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>Name</Label>
                        <Input 
                            type="text" 
                            placeholder="Your Name" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Message</Label>
                        <TextArea 
                            placeholder="How can we help you?" 
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </InputGroup>

                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Sending...' : (
                            <>Send Feedback <Send size={18} /></>
                        )}
                    </Button>

                    {status && (
                        <StatusMessage type={status.type}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {status.text}
                        </StatusMessage>
                    )}
                </form>
            </FormCard>
        </PageContainer>
    );
}