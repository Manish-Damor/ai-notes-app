import React, { useState } from 'react';

const AIFeatures = ({ content, apiKey, onGlossary, onGrammar }) => {
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState([]);
  const [insights, setInsights] = useState('');

  const callGroq = async (prompt) => {
    if (!apiKey) return alert('Enter Groq API Key');
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
      throw new Error('Invalid response from Groq API');
    } catch (error) {
      console.error('Groq API error:', error);
      alert('Failed to fetch AI response. Check API key or try again.');
      return null;
    }
  };

  const handleSummarize = async () => {
    const prompt = `Summarize this note in 1-2 lines: ${content}`;
    const res = await callGroq(prompt);
    if (res) setSummary(res);
  };

  const handleTags = async () => {
    const prompt = `Suggest 3-5 tags for this note based on its content: ${content}. Return as comma-separated list.`;
    const res = await callGroq(prompt);
    if (res) setTags(res.split(',').map(tag => tag.trim()));
  };

  const handleGlossary = async () => {
    const prompt = `Extract 5-10 key terms from this text and provide short definitions. Return JSON array: [{"term": "term", "definition": "def"}] ${content}`;
    const res = await callGroq(prompt);
    if (res) {
      try {
        const terms = JSON.parse(res);
        let highlighted = content;
        terms.forEach(({ term, definition }) => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          highlighted = highlighted.replace(regex, `<span class="glossary-term" title="${definition}">${term}</span>`);
        });
        onGlossary(highlighted);
      } catch (e) {
        alert('Failed to parse glossary terms');
      }
    }
  };

  const handleGrammar = async () => {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const prompt = `Find grammar errors in this text. Return JSON array: [{"error": "wrong text", "suggestion": "correct"}] ${plainText}`;
    const res = await callGroq(prompt);
    if (res) {
      try {
        const errors = JSON.parse(res);
        let highlighted = content;
        errors.forEach(({ error, suggestion }) => {
          const regex = new RegExp(`\\b${error}\\b`, 'gi');
          highlighted = highlighted.replace(regex, `<span class="error-term" title="Suggestion: ${suggestion}">${error}</span>`);
        });
        onGrammar(highlighted);
      } catch (e) {
        alert('Failed to parse grammar errors');
      }
    }
  };

  const handleInsights = async () => {
    const prompt = `Provide 3-5 key insights or highlights from this note: ${content}`;
    const res = await callGroq(prompt);
    if (res) setInsights(res);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={handleSummarize} className="p-2 bg-blue-500 text-white rounded">Summarize</button>
        <button onClick={handleTags} className="p-2 bg-blue-500 text-white rounded">Suggest Tags</button>
        <button onClick={handleGlossary} className="p-2 bg-blue-500 text-white rounded">Auto Glossary</button>
        <button onClick={handleGrammar} className="p-2 bg-blue-500 text-white rounded">Grammar Check</button>
        <button onClick={handleInsights} className="p-2 bg-blue-500 text-white rounded">AI Insights</button>
      </div>
      {summary && <p className="mb-2"><strong>Summary:</strong> {summary}</p>}
      {tags.length > 0 && <p className="mb-2"><strong>Tags:</strong> {tags.join(', ')}</p>}
      {insights && <p><strong>Insights:</strong> {insights}</p>}
    </div>
  );
};

export default AIFeatures;