export async function testApiConnection() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
      const data = await res.json();
      console.log("✅ Backend connection successful:", data);
    } catch (err) {
      console.error("❌ Backend connection failed:", err);
    }
  }
  