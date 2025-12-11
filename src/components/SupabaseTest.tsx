import { useState } from "react";
import { supabaseService } from "@/services/supabaseService";

interface TestData {
  id: string;
  message: string;
  timestamp: string;
}

export function SupabaseTest() {
  const [status, setStatus] = useState<string>("");
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing connection...");

    try {
      // Test 1: Write data
      setStatus("✏️ Writing test data...");
      const newEntry = {
        message: "Supabase is working!",
        timestamp: new Date().toISOString(),
      };
      
      const { data: createdData, error: createError } = await supabaseService.create<TestData>("test", newEntry as any);
      
      if (createError) throw new Error(createError.message);
      
      setStatus(`✅ Write successful! Doc ID: ${createdData?.id}`);

      // Test 2: Read data
      setStatus("📖 Reading data...");
      const { data: fetchedData, error: readError } = await supabaseService.getAll<TestData>("test");
      
      if (readError) throw new Error(readError.message);

      setData(fetchedData || []);
      setStatus(`✅ Read successful! Found ${fetchedData?.length || 0} documents`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error("Supabase test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearTestData = async () => {
    setLoading(true);
    try {
        if (data.length === 0) return;
      for (const item of data) {
         await supabaseService.delete("test", item.id);
      }
      setData([]);
      setStatus("🗑️ Test data cleared");
    } catch (error: any) {
      setStatus(`❌ Error clearing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>⚡ Supabase Connection Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Testing..." : "Test Connection"}
        </button>

        <button
          onClick={clearTestData}
          disabled={loading || data.length === 0}
          style={{
            padding: "10px 20px",
            cursor: loading || data.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Clear Test Data
        </button>
      </div>

      {status && (
        <div
          style={{
            padding: "10px",
            backgroundColor: status.includes("❌") ? "#ffebee" : "#e8f5e9",
            border: "1px solid",
            borderColor: status.includes("❌") ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {status}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3>📦 Test Data ({data.length} items):</h3>
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                <strong>ID:</strong> {item.id}
                <br />
                <strong>Message:</strong> {item.message}
                <br />
                <strong>Time:</strong>{" "}
                {new Date(item.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
