export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "Sign in required" });
    const token = auth.slice(7);
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!supabaseUrl || !anonKey || !geminiKey) return res.status(500).json({ error: "Missing Vercel environment variables" });
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } });
    if (!userRes.ok) return res.status(401).json({ error: "Your session expired. Sign in again." });
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    const contents = messages.map(m => ({ role: m.role === "model" ? "model" : "user", parts: Array.isArray(m.parts) ? m.parts.map(p => ({text:String(p.text||"").slice(0,12000)})) : [{text:String(m.content||"").slice(0,12000)}] }));
    if (!contents.length) return res.status(400).json({ error: "Message required" });
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 1200, temperature: 0.7 } })
    });
    const result = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: result.error?.message || "Gemini request failed" });
    const reply = result.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("") || "I couldn't generate a response.";
    return res.status(200).json({ reply });
  } catch (err) { return res.status(500).json({ error: err?.message || "Server error" }); }
}