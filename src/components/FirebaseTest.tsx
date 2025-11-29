import { useState } from "react";
import { db } from "@/config/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface TestData {
  id: string;
  message: string;
  timestamp: Date;
}

export function FirebaseTest() {
  const [status, setStatus] = useState<string>("");
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing connection...");

    try {
      // Test 1: Write data
      setStatus("✏️ Writing test data...");
      const docRef = await addDoc(collection(db, "test"), {
        message: "Firebase is working!",
        timestamp: new Date(),
        testNumber: Math.random(),
      });
      setStatus(`✅ Write successful! Doc ID: ${docRef.id}`);

      // Test 2: Read data
      setStatus("📖 Reading data...");
      const querySnapshot = await getDocs(collection(db, "test"));
      const fetchedData: TestData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        } as TestData);
      });
      setData(fetchedData);
      setStatus(`✅ Read successful! Found ${fetchedData.length} documents`);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error("Firebase test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearTestData = async () => {
    setLoading(true);
    try {
      for (const item of data) {
        await deleteDoc(doc(db, "test", item.id));
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
      <h2>🔥 Firebase Connection Test</h2>

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
