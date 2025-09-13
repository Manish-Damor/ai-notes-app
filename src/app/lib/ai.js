export async function analyzeNoteAI(text) {
  if (!text || text.length < 5) return null;
  try {
    const apiKey = localStorage.getItem("AI_API_KEY") || "";
    if (!apiKey) {
      alert("Set AI_API_KEY in localStorage");
      return null;
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Summarize this:\n${text}` }],
      }),
    });

    const j = await resp.json();
    return { summary: j.choices?.[0]?.message?.content || "" };
  } catch {
    return null;
  }
}
