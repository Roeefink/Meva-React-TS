import { useState } from "react";
import styled from "styled-components";
import { supabase } from "../config/Supabase";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  resize: none;
  font-family: inherit;
  min-height: 100px;
  height: 25vh;
`;

export default function InfoForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Get the current user's session token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error("You must be logged in to add info.");
            }

            // 2. Call the backend API
            const response = await fetch('http://localhost:3001/api/v1/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to add info");
            }

            console.log("Data inserted successfully via API");
            alert("Info added successfully!");
            setTitle("");
            setDescription("");
        } catch (error: any) {
            console.error("Error inserting data:", error);
            alert("Error adding info: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper>
            <StyledForm onSubmit={handleSubmit}>
                <InputGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                        id="title" 
                        type="text" 
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </InputGroup>
                
                <InputGroup>
                    <Label htmlFor="description">Description</Label>
                    <TextArea 
                        id="description" 
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </InputGroup>

                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Info"}
                </Button>
            </StyledForm>
        </FormWrapper>
    )
}