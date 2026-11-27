import { useState, useRef } from "react";
import Message from "./message.jsx";

export default function Chat() {

  const [messages, setMessages] = useState([
    { from: "ai", text: "Upload code, logs, or images for cybersecurity analysis." }
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  async function handleSend() {
    const text = input.trim();

    if (!text && !file) return;

    const history = messages
      .filter((msg) => msg.text)
      .slice(-8)
      .map((msg) => ({
        role: msg.from === "user" ? "user" : "assistant",
        text: msg.text
      }));

    const userMsg = {
      from: "user",
      text: text || "📎 File uploaded",
      fileName: file?.name
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://fixorabe.onrender.com").replace(/\/$/, "");
      let res;

      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("history", JSON.stringify(history));

        res = await fetch(`${API_BASE_URL}/ask`, {
          method: "POST",
          body: form
        });
      } else {
        res = await fetch(`${API_BASE_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, history })
        });
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { from: "ai", text: data.answer || data.error || "No answer returned." }
      ]);

    } catch {

      setMessages(prev => [
        ...prev,
        { from: "ai", text: "❌ Server error. Try again." }
      ]);

    } finally {

      setLoading(false);
      setFile(null);
    }
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="chat-container">

      <div className="messages">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}

        {loading && (
          <Message from="ai" text="🔍 Analyzing security..." />
        )}
      </div>

      <div
        className="input-bar drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          placeholder="Paste code or describe issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button onClick={() => fileInputRef.current.click()}>📄</button>
        <button onClick={() => imageInputRef.current.click()}>🖼</button>
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "SEND"}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />

        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="file-preview">
          📎 {file.name}
        </div>
      )}
    </div>
  );
}
