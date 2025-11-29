import { useNavigate } from "react-router-dom";

export default function AboutWindow() {
  const navigate = useNavigate();
  return (
    <div>
      <h3
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/chat");
        }}
      >
        Return to Chat
      </h3>
    </div>
  );
}
