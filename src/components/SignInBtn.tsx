import styled from "styled-components";

interface SignInBtnProps {
  onClick: () => void;
  isLoading: boolean;
}

const StyledButton = styled.button`
  width: 100%;
  background-color: rgb(35, 143, 201); /* Change button color here */
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;

  &:hover:not(:disabled) {
    background-color: #4338ca; /* Darker on hover */
  }

  &:focus {
    box-shadow: 0 0 0 2px white, 0 0 0 4px #4f46e5; /* Focus ring */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-bottom-color: white;
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function SignInBtn({ onClick, isLoading }: SignInBtnProps) {
  return (
    <StyledButton type="button" onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          Signing in...
        </LoadingContainer>
      ) : (
        "Sign In"
      )}
    </StyledButton>
  );
}
